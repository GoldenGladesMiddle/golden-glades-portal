import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=missing_code', request.url));
  }

  try {
    // 1. Exchange OAuth code for access token
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
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/roblox/callback`,
      }),
    });

    const tokens = await tokenResponse.json();
    if (!tokenResponse.ok) throw new Error(tokens.error_description || 'Failed token exchange');

    // 2. Fetch User Info from Roblox
    const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const robloxUser = await userResponse.json();

    // 3. Fetch Group Rank to determine role (Group ID: 8284465)
    const groupId = '8284465';
    const groupRankResponse = await fetch(
      `https://groups.roblox.com/v2/users/${robloxUser.sub}/groups/roles`
    );
    const groupData = await groupRankResponse.json();
    
    const userGroup = groupData.data?.find((g: any) => g.group.id.toString() === groupId);
    const rank = userGroup ? userGroup.role.rank : 0; // Default to 0 if not in group

    // 4. Store user session (e.g., in secure HTTP-only cookies)
    // await createSession({ userId: robloxUser.sub, username: robloxUser.preferred_username, rank });

    // 5. Redirect based on role (Ranks 1-10 or default members -> StudentPortal)
    const isStaff = rank >= 100; // Adjust rank threshold for your staff/admin roles

    if (!isStaff) {
      return NextResponse.redirect(new URL('/StudentPortal', request.url));
    } else {
      return NextResponse.redirect(new URL('/StaffPortal', request.url));
    }

  } catch (error) {
    console.error('Roblox OAuth Error:', error);
    return NextResponse.redirect(new URL('/login?error=auth_failed', request.url));
  }
}
