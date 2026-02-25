// ================================================================
// SUPABASE PROXY (SESSION REFRESH + ROUTE PROTECTION)
// ================================================================
// Bu dosya proxy.ts tarafından import edilir.
// Her request'te:
// 1. Auth token'ı yeniler (getClaims ile)
// 2. Korunan rotalarda oturum ve rol kontrolü yapar
// 3. Yetkisiz kullanıcıları doğru login sayfasına yönlendirir
// ================================================================

import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // getUser() sunucu taraflı oturum kontrolü yapar.
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    const isAdminRoute = pathname.startsWith('/admin')
    const isAkademisyenRoute = pathname.startsWith('/akademisyen')
    const isAuthRoute = pathname.startsWith('/auth')

    // ── Korunan rotalarda oturum kontrolü ──────────────────────────
    if (!user && (isAdminRoute || isAkademisyenRoute)) {
        const url = request.nextUrl.clone()
        // Rolü bilinmiyor, hangi panele gidilmeye çalışıldığına göre login yönlendir
        url.pathname = isAdminRoute ? '/auth/admin-login' : '/auth/akademisyen-login'
        url.searchParams.set('redirect', pathname)
        return NextResponse.redirect(url)
    }

    // ── Giriş yapmış kullanıcıda rol kontrolü ──────────────────────
    if (user && (isAdminRoute || isAkademisyenRoute)) {
        const { data: allowedUser } = await supabase
            .from('allowed_users')
            .select('role')
            .eq('email', user.email)
            .single()

        if (!allowedUser) {
            await supabase.auth.signOut()
            const url = request.nextUrl.clone()
            url.pathname = '/auth/admin-login'
            url.searchParams.set('error', 'unauthorized')
            return NextResponse.redirect(url)
        }

        // Admin sayfasına admin olmayan erişemez
        if (isAdminRoute && allowedUser.role !== 'admin') {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/akademisyen-login'
            url.searchParams.set('error', 'rol_uyusmazligi')
            return NextResponse.redirect(url)
        }

        // Akademisyen sayfasına admin erişemez
        if (isAkademisyenRoute && allowedUser.role !== 'akademisyen') {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/admin-login'
            url.searchParams.set('error', 'rol_uyusmazligi')
            return NextResponse.redirect(url)
        }
    }

    // ── Giriş yapmış kullanıcı auth sayfasına gelirse, paneline yönlendir ──
    if (user && isAuthRoute) {
        const { data: allowedUser } = await supabase
            .from('allowed_users')
            .select('role')
            .eq('email', user.email)
            .single()

        if (allowedUser) {
            const url = request.nextUrl.clone()
            url.pathname = allowedUser.role === 'admin' ? '/admin' : '/akademisyen'
            return NextResponse.redirect(url)
        }
    }

    return supabaseResponse
}
