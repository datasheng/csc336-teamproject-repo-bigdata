import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const next = requestUrl.searchParams.get('next') || '/';
    const type = requestUrl.searchParams.get('type');

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('Auth error:', error);
            return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
        }

        // if signup confirm ? redirect to confirm page
        if (type === 'signup') {
            return NextResponse.redirect(new URL('/auth/confirm', request.url));
        }

        // other types recovery, invite, etc
        return NextResponse.redirect(new URL(next, request.url));
    }

    // no code = error page
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}