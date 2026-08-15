import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  // Catch Roblox OAuth errors
  if (error) {
    console.error('Roblox OAuth error param:', error);
    return NextResponse.redirect(new URL('/?error=' + error, request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // 1. Exchange Token
    const tokenRes = await fetch('https://apis.roblox.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.ROBLOX_CLIENT_ID}:${process.env.ROBLOX_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${baseUrl}/api/auth/roblox/callback`,
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error('Token Exchange Failed:', tokens);
      return NextResponse.redirect(new URL('/?error=token_failed', request.url));
    }

    // 2. Perform Redirect to Student Portal
    return NextResponse.redirect(new URL('/StudentPortal', request.url));
  } catch (err) {
    console.error('Callback error:', err);
    return NextResponse.redirect(new URL('/?error=server_error', request.url));
  }
}
