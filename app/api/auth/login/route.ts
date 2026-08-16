import { NextResponse } from 'next/server';
import { ADMIN_USERS } from '@/lib/adminUsers';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: 'Please provide both username and password.' },
        { status: 400 }
      );
    }

    // Match against local config array
    const user = ADMIN_USERS.find(
      (u) => u.username === username.trim() && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Invalid admin username or password.' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ 
      success: true, 
      redirectUrl: '/applications/dashboard' 
    });
    
    // Set a lightweight session cookie
    response.cookies.set('admin_logged_in', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
