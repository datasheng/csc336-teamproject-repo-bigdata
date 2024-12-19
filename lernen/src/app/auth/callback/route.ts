import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'
    const code = searchParams.get('code')

    const supabase = await createClient()

    // email verification flow
    if (token_hash && type === 'signup') {
        console.log('Processing signup verification...')
        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        
        if (error) {
            console.error('Verification error:', error)
            return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
        }

        // works go confrim
        return NextResponse.redirect(new URL('/auth/confirm', request.url))
    }

    // oauth
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(new URL(next, request.url))
        }
    }

    // if here ruh roh
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}