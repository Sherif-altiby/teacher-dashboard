import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server' // Note: Use next/server for consistency

export function middleware(request: NextRequest) {
  const token = request.cookies.get('refreshToken')?.value 
  const { pathname } = request.nextUrl

  // 1. If the user is already on the login page, don't redirect (prevent infinite loop)
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // 2. If no token exists, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// 3. The Config: Run on everything EXCEPT specific folders/files
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (route handlers) -> Optional: remove if you want to protect API too
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|images|logo.png).*)',
  ],
}