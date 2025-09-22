import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Check if the request is for admin routes
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Skip authentication check for login and reset-password pages
    if (req.nextUrl.pathname.includes('/login') || req.nextUrl.pathname.includes('/reset-password')) {
      return NextResponse.next()
    }

    // For other admin routes, we'll handle authentication in the component
    // This is a simple approach - in production you might want to use cookies or JWT
    return NextResponse.next()
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
