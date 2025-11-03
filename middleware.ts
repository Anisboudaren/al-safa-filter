import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Check if the request is for admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Skip authentication check for login and reset-password pages
    if (req.nextUrl.pathname.includes('/login') || req.nextUrl.pathname.includes('/reset-password')) {
      return NextResponse.next()
    }

    // Check for Supabase authentication cookies
    // Supabase stores auth info in cookies with names like "sb-<project-ref>-auth-token"
    const hasAuthCookie = req.cookies.getAll().some(cookie => 
      cookie.name.includes('sb-') && cookie.name.includes('-auth-token')
    )
    
    // If no authentication cookie found, redirect to home page
    if (!hasAuthCookie) {
      return NextResponse.redirect(new URL('/home', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
