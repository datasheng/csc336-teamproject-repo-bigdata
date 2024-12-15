import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/'

  if (!token_hash || !type) {
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

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