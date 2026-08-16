import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value; // Replace 'auth_token' with your actual auth cookie name
  const { pathname } = request.nextUrl;

  // If trying to access protected dashboard routes without a session token
  if (pathname.startsWith('/applications/dashboard') && !token) {
    const loginUrl = new URL('/applications', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/applications/dashboard/:path*'],
};
