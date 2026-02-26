import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth-token')
  const { pathname } = request.nextUrl

  // Protected routes
  const isDashboardRoute = pathname.startsWith('/dashboard') || 
                           pathname.startsWith('/accounts') || 
                           pathname.startsWith('/transactions') || 
                           pathname.startsWith('/budgets') || 
                           pathname.startsWith('/goals') || 
                           pathname.startsWith('/settings')

  // Auth routes
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register')

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/accounts/:path*',
    '/transactions/:path*',
    '/budgets/:path*',
    '/goals/:path*',
    '/settings/:path*',
    '/login',
    '/register',
  ],
}
