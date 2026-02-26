'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAkademisyen(userId: string, email: string) {
    // 0. Önce Auth'daki gerçek kullanıcı ID'sini bul
    //    (allowed_users.id ≠ auth.users.id — farklı UUID'ler)
    const supabase = await createClient() // CreateClient for RLS/Session check if needed, but we use admin here

    // 1. akademisyenler tablosundan sil (Profil)
    const { error: profileError } = await supabaseAdmin
        .from('akademisyenler')
        .delete()
        .eq('email', email)

    if (profileError) {
        console.error('akademisyenler silme hatası:', profileError)
        return { success: false, error: 'Profil kaydı silinemedi.' }
    }

    // 2. allowed_users tablosundan sil
    const { error: allowedError } = await supabaseAdmin
        .from('allowed_users')
        .delete()
        .eq('email', email)

    if (allowedError) {
        console.error('allowed_users silme hatası:', allowedError)
        return { success: false, error: 'İzin kaydı silinemedi.' }
    }

    // 3. Supabase Auth'dan sil
    let authUserId: string | null = null
    const { data: authList, error: listError } = await supabaseAdmin.auth.admin.listUsers() as any

    if (!listError && authList?.users) {
        const authUser = (authList.users as any[]).find(
            (u: any) => u.email?.toLowerCase() === email.toLowerCase()
        )
        if (authUser) {
            authUserId = authUser.id
        }
    }

    if (authUserId) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId)
        if (authError) {
            console.error('Auth silme hatası:', authError)
            return { success: false, error: 'Kullanıcı auth sisteminden silinemedi.' }
        }
    }

    revalidatePath('/admin/akademisyen-yonetimi')
    revalidatePath('/hakkimizda')
    return { success: true }
}

export async function updateAkademisyenProfile(id: string, formData: FormData) {
    const supabase = await createClient()

    const ad_soyad = formData.get('ad_soyad') as string
    const unvan = formData.get('unvan') as string
    const rol_etiketi = formData.get('rol_etiketi') as string
    const biyografi = formData.get('biyografi') as string
    const uzmanlik_alanlari_raw = formData.get('uzmanlik_alanlari') as string
    const aktif_arastirmaci = formData.get('aktif_arastirmaci') === 'on'
    const yayin_sayisi = parseInt(formData.get('yayin_sayisi') as string) || 0
    const h_indeks = parseInt(formData.get('h_indeks') as string) || 0
    const proje_sayisi = parseInt(formData.get('proje_sayisi') as string) || 0

    const uzmanlik_alanlari = uzmanlik_alanlari_raw
        ? uzmanlik_alanlari_raw.split(',').map(s => s.trim()).filter(Boolean)
        : []

    const { error } = await supabase
        .from('akademisyenler')
        .update({
            ad_soyad,
            unvan,
            rol_etiketi,
            biyografi,
            uzmanlik_alanlari,
            aktif_arastirmaci,
            yayin_sayisi,
            h_indeks,
            proje_sayisi
        })
        .eq('id', id)

    if (error) {
        console.error('Profil güncelleme hatası:', error)
        return { error: 'Profil güncellenirken bir hata oluştu.' }
    }

    revalidatePath('/admin/akademisyenler')
    revalidatePath('/admin/akademisyen-yonetimi')
    revalidatePath('/hakkimizda')
    revalidatePath(`/hakkimizda/${id}`)

    return { success: 'Profil başarıyla güncellendi.' }
}
