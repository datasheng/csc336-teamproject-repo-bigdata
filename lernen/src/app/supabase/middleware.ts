import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    // If accessing professor routes, verify userType
    if (req.nextUrl.pathname.startsWith('/professor')) {
        const { data: userData } = await supabase
            .from('user')
            .select('userType')
            .eq('email', session.user.email)
            .single()

        if (!userData?.userType) {
            return NextResponse.redirect(new URL('/student/dashboard', req.url))
        }
    }

    // If accessing student routes, verify userType
    if (req.nextUrl.pathname.startsWith('/student')) {
        const { data: userData } = await supabase
            .from('user')
            .select('userType')
            .eq('email', session.user.email)
            .single()

        if (userData?.userType) {
            return NextResponse.redirect(new URL('/professor', req.url))
        }
    }

    return res
}

export const config = {
    matcher: ['/professor/:path*', '/student/:path*']
}