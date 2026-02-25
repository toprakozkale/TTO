// ================================================================
// NEXT.JS MIDDLEWARE (Route Protection + Session Refresh)
// ================================================================
// Bu dosya proje kök dizininde middleware.ts olarak bulunmalıdır.
// updateSession fonksiyonunu çağırarak session yenileme ve
// rota korumasını sağlar.
// ================================================================

import { type NextRequest } from 'next/server'
import { updateSession } from './src/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        /*
         * Aşağıdaki yollar HARİÇ tüm request'lerde çalışır:
         * - _next/static (statik dosyalar)
         * - _next/image (resim optimizasyonu)
         * - favicon.ico (favicon)
         * - Resim dosyaları (.svg, .png, .jpg, .jpeg, .gif, .webp)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
