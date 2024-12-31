import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl

  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register']
  const isPublicPath = publicPaths.includes(pathname)

  // If not authenticated and trying to access protected route
  if (!authToken && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If authenticated and trying to access login/register
  if (authToken && isPublicPath) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  // Redirect root to home for authenticated users
  if (authToken && pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url))
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
     * - static (public static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|static).*)',
  ],
} 