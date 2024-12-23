import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    // don't redirect any auth shit like login/signup/selectrole
    !request.nextUrl.pathname.startsWith('/auth') &&
    !request.nextUrl.pathname.startsWith('/selectrole') &&
    // don't redirect next.js internal shit
    !request.nextUrl.pathname.startsWith('/_next') &&
    // don't redirect api shit
    !request.nextUrl.pathname.startsWith('/api') &&
    // don't redirect root
    request.nextUrl.pathname !== '/'
  ) {
    const url = request.nextUrl.clone()
    // redir to selectrole if not logged in
    url.pathname = '/selectrole'
    return NextResponse.redirect(url)
  }

  // if user is authenticated and trying to access auth pages, redirect to dashboard
  if (
    user && 
    (request.nextUrl.pathname.startsWith('/auth') || 
     request.nextUrl.pathname === '/selectrole')
  ) {
    const { data: userData } = await supabase
      .from('user')
      .select('userType')
      .eq('email', user.email)
      .single()

    // redir based on user type
    const url = request.nextUrl.clone()
    if (userData?.userType === 'Professor') {
      url.pathname = '/professor'
    } else if (userData?.userType === 'Student') {
      url.pathname = '/student'
    } else {
      // invalid user type go root
      url.pathname = '/'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // matcher works so don't run on these paths (static files, images, favicon, etc.)
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
} 