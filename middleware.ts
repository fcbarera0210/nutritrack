import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  const pathname = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const isPublicPath = pathname === '/login' || pathname === '/register';
  const isApiPath = pathname.startsWith('/api');
  
  // Allow API routes and public paths
  if (isPublicPath || isApiPath) {
    return NextResponse.next();
  }

  // Redirect to login if no session
  if (!session) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
