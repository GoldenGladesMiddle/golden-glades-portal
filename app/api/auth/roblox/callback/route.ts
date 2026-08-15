import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goldengladesms.org';
  const clientId = process.env.NEXT_PUBLIC_ROBLOX_CLIENT_ID;
  const clientSecret = process.env.ROBLOX_CLIENT_SECRET;
  const groupId = process.env.NEXT_PUBLIC_ROBLOX_GROUP_ID;

  if (error) {
    console.error('Roblox OAuth Error:', error);
    return NextResponse.redirect(`${appUrl}/?error=${error}`);
  }

  if (!code) {
    return NextResponse.redirect(`${appUrl}/?error=missing_code`);
  }

  try {
    const redirectUri = `${appUrl}/api/auth/roblox/callback`;

    // 1. Exchange OAuth code for access token
    const tokenResponse = await fetch('https://apis.roblox.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Token Exchange Failed:', tokens);
      return NextResponse.redirect(`${appUrl}/?error=token_failed`);
    }

    // 2. Fetch Roblox User Info
    const userResponse = await fetch('https://apis.roblox.com/oauth/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const robloxUser = await userResponse.json();

    // 3. Fetch User Group Rank
    let rank = 0;
    if (groupId && robloxUser.sub) {
      const groupRankResponse = await fetch(
        `https://groups.roblox.com/v2/users/${robloxUser.sub}/groups/roles`
      );
      if (groupRankResponse.ok) {
        const groupData = await groupRankResponse.json();
        const userGroup = groupData.data?.find(
          (g: any) => g.group.id.toString() === groupId.toString()
        );
        if (userGroup) {
          rank = userGroup.role.rank;
        }
      }
    }

    // 4. Check role and redirect
    const isStaff = rank >= 100; // Adjust threshold based on group roles

    if (!isStaff) {
      return NextResponse.redirect(`${appUrl}/StudentPortal`, 302);
    } else {
      return NextResponse.redirect(`${appUrl}/StaffPortal`, 302);
    }
  } catch (err) {
    console.error('OAuth Callback Exception:', err);
    return NextResponse.redirect(`${appUrl}/?error=server_error`);
  }
}
