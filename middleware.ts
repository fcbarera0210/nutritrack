import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  try {
    const session = request.cookies.get('session');
    const pathname = request.nextUrl.pathname;

    const isPublicPath = pathname === '/login' || pathname === '/register';
    const isApiPath = pathname.startsWith('/api');

    if (isPublicPath || isApiPath) {
      return NextResponse.next();
    }

    if (!session) {
      const url = new URL('/login', request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch {
    // En caso de cualquier error en Edge, no bloquear la navegación
    return NextResponse.next();
  }
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
