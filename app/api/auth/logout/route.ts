import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });

  // Clear session cookies by setting maxAge to 0
  response.cookies.set('session', '', { maxAge: 0, path: '/' });
  response.cookies.set('roblox_token', '', { maxAge: 0, path: '/' });
  response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });

  return response;
}
