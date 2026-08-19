import { NextResponse } from 'next/server';
import staffData from '@/data/staff.json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect(new URL('/login?error=MissingCode', request.url));
    }

    // 1. Exchange OAuth code for Roblox access token
    const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
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
        redirect_uri: process.env.ROBLOX_REDIRECT_URI || '',
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Roblox OAuth Token Error:', tokenData);
      return NextResponse.redirect(new URL('/login?error=TokenExchangeFailed', request.url));
    }

    // 2. Fetch basic user info using the access token
    const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const robloxUser = await userResponse.json();

    if (!userResponse.ok || !robloxUser.sub) {
      console.error('Roblox UserInfo Error:', robloxUser);
      return NextResponse.redirect(new URL('/login?error=FailedToFetchUser', request.url));
    }

    // robloxUser.sub contains the Roblox User ID
    const robloxUserId = String(robloxUser.sub);

    // 3. Search data/staff.json for this Roblox User ID
    const staffRecord = staffData.find(
      (member) => member.robloxUserId === robloxUserId
    );

    // 4. Route user based on staff record match
    if (staffRecord) {
      if (staffRecord.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/careers/admin', request.url));
      }
      return NextResponse.redirect(new URL('/careers', request.url));
    }

    // 5. Fallback: Users not in staff.json go to the Student Portal
    return NextResponse.redirect(new URL('/student', request.url));

  } catch (error) {
    console.error('OAuth Callback Internal Error:', error);
    return NextResponse.redirect(new URL('/login?error=ServerError', request.url));
  }
}
