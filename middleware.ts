import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Replace 'session' with the exact cookie name set during login (e.g., 'roblox_session', 'token')
  const sessionToken = request.cookies.get('session')?.value 
    || request.cookies.get('roblox_token')?.value
    || request.cookies.get('auth_token')?.value;

  const { pathname } = request.nextUrl;

  // If trying to access dashboard without a valid session cookie
  if (pathname.startsWith('/applications/dashboard') && !sessionToken) {
    const loginUrl = new URL('/applications', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/applications/dashboard/:path*'],
};
