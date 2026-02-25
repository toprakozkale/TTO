// ================================================================
// SUPABASE BROWSER CLIENT
// ================================================================
// Client Component'lerde (use client) kullanmak için.
// createBrowserClient otomatik olarak cookie yönetimini halleder.
// ================================================================

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
