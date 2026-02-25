// ================================================================
// SUPABASE SERVER CLIENT
// ================================================================
// Server Component, Server Action ve Route Handler'larda kullanmak için.
// cookies() ile cookie yönetimi yapılır.
// ================================================================

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // setAll, Server Component'ten çağrıldığında hata verebilir.
                        // Proxy zaten session'ı yenilediği için bu göz ardı edilebilir.
                    }
                },
            },
        }
    )
}
