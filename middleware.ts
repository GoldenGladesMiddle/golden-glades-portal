import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Read the actual cookie set by your auth flow
  const isLoggedIn = request.cookies.get('admin_logged_in')?.value;
  const { pathname } = request.nextUrl;

  // Protect /applications/dashboard and subroutes
  if (pathname.startsWith('/applications/dashboard') && isLoggedIn !== 'true') {
    const loginUrl = new URL('/applications', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/applications/dashboard/:path*'],
};
