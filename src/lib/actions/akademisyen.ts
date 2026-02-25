'use server'

import { supabaseAdmin } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function deleteAkademisyen(userId: string, email: string) {
    // 0. Önce Auth'daki gerçek kullanıcı ID'sini bul
    //    (allowed_users.id ≠ auth.users.id — farklı UUID'ler)
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

    // 1. allowed_users tablosundan sil
    const { error: allowedError } = await supabaseAdmin
        .from('allowed_users')
        .delete()
        .eq('email', email)

    if (allowedError) {
        console.error('allowed_users silme hatası:', allowedError)
        return { success: false, error: 'İzin kaydı silinemedi.' }
    }

    // 2. Supabase Auth'dan sil (gerçek Auth UID ile)
    if (authUserId) {
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(authUserId)

        if (authError) {
            console.error('Auth silme hatası:', authError)
            return { success: false, error: 'Kullanıcı auth sisteminden silinemedi.' }
        }
    }
    // authUserId bulunamazsa kullanıcı henüz kayıt olmamış demektir — sadece allowed_users'dan silmek yeterli

    revalidatePath('/admin/akademisyen-yonetimi')
    revalidatePath('/hakkimizda')
    return { success: true }
}
