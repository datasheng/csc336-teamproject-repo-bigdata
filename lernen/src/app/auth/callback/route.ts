import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const type = requestUrl.searchParams.get('type');

    if (!code) {
        return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
    }

    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
    }

    // Explicitly handle each type
    switch (type) {
        case 'recovery':
            return NextResponse.redirect(new URL('/auth/resetpassword', request.url))
        case 'signup':
            return NextResponse.redirect(new URL('/auth/emailconfirm', request.url))
        default:
            return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
    }
}