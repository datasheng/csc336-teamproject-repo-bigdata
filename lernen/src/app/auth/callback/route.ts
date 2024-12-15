import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get('code');
    const token_hash = requestUrl.searchParams.get('token_hash');
    const type = requestUrl.searchParams.get('type');
    const next = requestUrl.searchParams.get('next') || '/';

    const supabase = await createClient();

    if (token_hash) {
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: type as any,
        });
        
        if (error) {
            return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
        }

        return NextResponse.redirect(new URL(next, request.url));
    }

    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        
        if (error) {
            console.error('Auth error:', error);
            return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
        }

        return NextResponse.redirect(new URL(next, request.url));
    }

    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url));
}