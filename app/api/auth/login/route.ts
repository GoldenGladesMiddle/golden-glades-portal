import { NextResponse } from 'next/server';
import { ADMIN_USERS } from '@/lib/adminUsers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // Check if the user exists in your file array
    const user = ADMIN_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid admin username or password.' },
        { status: 401 }
      );
    }

    // Set cookie and send success
    const response = NextResponse.json({ success: true, redirectUrl: '/applications/dashboard' });
    
    response.cookies.set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
