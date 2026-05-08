import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Public routes — always accessible
  const publicRoutes = ['/', '/login', '/unauthorized', '/share']
  const isPublic = publicRoutes.some(r => pathname === r || pathname.startsWith('/share/'))
  if (isPublic) return supabaseResponse

  // Not logged in — redirect to login
  if (!user) {
    return NextResponse.redirect(new URL(`/login?next=${pathname}`, request.url))
  }

  // Check if user is admin — admins can access everything
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'admin' || profile?.role === 'co-admin') {
    return supabaseResponse
  }

  // For non-admins check page_access table
  const { data: access } = await supabase
    .from('page_access')
    .select('page, permission')
    .eq('user_id', user.id)
    .eq('page', pathname)
    .single()

  if (!access) {
    return NextResponse.redirect(new URL('/unauthorized', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/documents/:path*',
    '/ncr/:path*',
    '/upload/:path*',
    '/about/:path*',
  ],
}