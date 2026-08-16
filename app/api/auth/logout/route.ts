import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true, message: 'Logged out' });

  // Expire all active authentication cookies
  response.cookies.set('admin_logged_in', '', { maxAge: 0, path: '/' });
  response.cookies.set('roblox_username', '', { maxAge: 0, path: '/' });
  response.cookies.set('user_role', '', { maxAge: 0, path: '/' });

  return response;
}
