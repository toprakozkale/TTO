// ================================================================
// AUTH SERVER ACTIONS
// ================================================================
// Sign Up, Sign In ve Sign Out işlemlerini server-side yürütür.
// Rol bilgisi her zaman allowed_users tablosundan okunur.
// ================================================================

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

// ── Sign Up ─────────────────────────────────────────────────────
// Kayıt olmadan önce email'in allowed_users tablosunda olup
// olmadığını kontrol eder. Yoksa reddeder.
export async function signUp(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'E-posta ve şifre alanları zorunludur.' }
    }

    if (password.length < 6) {
        return { error: 'Şifre en az 6 karakter olmalıdır.' }
    }

    // Email'in allowed_users tablosunda olup olmadığını RPC ile kontrol et.
    // SECURITY DEFINER fonksiyon RLS'i bypass eder, anonim kullanıcılar çağırabilir.
    const { data: isAllowed, error: lookupError } = await supabase
        .rpc('is_email_allowed', { check_email: email })

    if (lookupError || !isAllowed) {
        return {
            error: 'Bu e-posta adresi sisteme kayıt olmak için yetkilendirilmemiş. Lütfen yönetici ile iletişime geçin.',
        }
    }

    // Supabase Auth ile hesap oluştur
    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
    })

    if (signUpError) {
        return { error: signUpError.message }
    }

    return {
        success: 'Hesabınız oluşturuldu. Lütfen e-posta adresinize gönderilen doğrulama linkine tıklayın.',
    }
}

// ── Sign In ─────────────────────────────────────────────────────
// Giriş yapar, ardından allowed_users tablosundan rol bilgisini
// çekerek kullanıcıyı uygun panele yönlendirir.
// role_check parametresi hangi login sayfasından geldiğini belirtir.
export async function signIn(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const roleCheck = formData.get('role_check') as string | null

    if (!email || !password) {
        return { error: 'E-posta ve şifre alanları zorunludur.' }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    if (signInError) {
        return { error: 'E-posta veya şifre hatalı.' }
    }

    // Kullanıcının rolünü allowed_users tablosundan çek
    const { data: allowedUser } = await supabase
        .from('allowed_users')
        .select('role')
        .eq('email', email)
        .single()

    if (!allowedUser) {
        await supabase.auth.signOut()
        return { error: 'Bu hesap sisteme erişim yetkisine sahip değil.' }
    }

    // Hangi login sayfasından gelindiyse, rol eşleşmeli
    if (roleCheck && allowedUser.role !== roleCheck) {
        await supabase.auth.signOut()
        const rolAdi = roleCheck === 'admin' ? 'admin' : 'akademisyen'
        return { error: `Bu hesap ${rolAdi} yetkisine sahip değil.` }
    }

    // Başarılı giriş — role göre yönlendir
    revalidatePath('/', 'layout')

    const redirectTo = allowedUser.role === 'admin' ? '/admin' : '/akademisyen'
    redirect(redirectTo)
}

// ── Sign Out ────────────────────────────────────────────────────
export async function signOut() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

// ── Add Akademisyen ─────────────────────────────────────────────
// Admin panelinden yeni akademisyen ekler.
// allowed_users tablosuna email, name ve role='akademisyen' insert eder.
export async function addAkademisyen(formData: FormData) {
    const supabase = await createClient()

    const email = (formData.get('email') as string)?.trim().toLowerCase()
    const title = formData.get('title') as string
    const firstName = (formData.get('name') as string)?.trim()

    if (!email || !firstName) {
        return { error: 'E-posta ve isim alanları zorunludur.' }
    }

    // Unvan + isim birleştir
    const fullName = title ? `${title} ${firstName}` : firstName

    // Email zaten kayıtlı mı?
    const { data: existing } = await supabase
        .from('allowed_users')
        .select('id')
        .eq('email', email)
        .maybeSingle()

    if (existing) {
        return { error: 'Bu e-posta adresi zaten kayıtlı.' }
    }

    const { error: insertError } = await supabase
        .from('allowed_users')
        .insert({ email, name: fullName, role: 'akademisyen' })

    if (insertError) {
        return { error: 'Akademisyen eklenirken bir hata oluştu.' }
    }

    revalidatePath('/admin/akademisyen-yonetimi')
    revalidatePath('/hakkimizda')
    return { success: `${fullName} başarıyla sisteme eklendi.` }
}

