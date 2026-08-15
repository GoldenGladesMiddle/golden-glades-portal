import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID!;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/roblox`;
  
  const robloxAuthUrl = new URL('https://apis.roblox.com/oauth/v1/authorize');
  robloxAuthUrl.searchParams.append('client_id', clientId);
  robloxAuthUrl.searchParams.append('redirect_uri', redirectUri);
  robloxAuthUrl.searchParams.append('response_type', 'code');
  robloxAuthUrl.searchParams.append('scope', 'openid profile');

  return NextResponse.redirect(robloxAuthUrl.toString());
}