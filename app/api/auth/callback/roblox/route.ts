import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=no_code`);
  }

  try {
    // 1. Exchange Code for Access Token
    const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID!,
        client_secret: process.env.ROBLOX_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback/roblox`,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=token_failed`);
    }

    // 2. Fetch Roblox User Profile
    const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();
    const robloxUserId = userData.sub;

    // 3. Query Group Rank for Golden Glades Middle (Group ID: 8284465)
    const groupId = process.env.NEXT_PUBLIC_ROBLOX_GROUP_ID!;
    const groupResponse = await fetch(`https://groups.roblox.com/v2/users/${robloxUserId}/groups/roles`);
    const groupData = await groupResponse.json();

    const userGroup = groupData.data?.find((g: any) => g.group.id === parseInt(groupId));
    const rank = userGroup ? userGroup.role.rank : 0;

    // 4. Determine Site Role Based on Custom Rank Ranges
    let role = 'guest';
    
    if (rank >= 140 && rank <= 255) {
      role = 'admin';
    } else if (rank >= 64 && rank <= 131) {
      role = 'staff';
    } else if (rank >= 10 && rank <= 52) {
      role = 'student';
    }

    // 5. Redirect User with Session Cookies Set
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}`);
    response.cookies.set('user_role', role, { path: '/' });
    response.cookies.set('roblox_username', userData.preferred_username || userData.name || 'User', { path: '/' });

    return response;
  } catch (error) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}?error=server_error`);
  }
}