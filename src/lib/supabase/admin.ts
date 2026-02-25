// ================================================================
// SUPABASE ADMIN CLIENT (SERVICE ROLE)
// ================================================================
// SADECE server-side'da kullanılmalı (Server Action, API Route).
// service_role key RLS'i bypass eder — client'a asla expose etme.
// ================================================================

import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)
