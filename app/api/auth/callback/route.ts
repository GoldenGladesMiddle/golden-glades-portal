import { NextResponse } from 'next/server';
import { db } from '@/lib/db'; // Your database client

export async function GET(request: Request) {
  // 1. Fetch basic user details from Roblox OAuth
  const robloxUser = await getRobloxUserFromOAuth(request);

  if (!robloxUser) {
    return NextResponse.redirect(new URL('/login?error=Unauthorized', request.url));
  }

  // 2. Check if the user exists in your Staff/Admin database table
  const staffRecord = await db.staffMember.findUnique({
    where: { robloxUserId: String(robloxUser.id) },
  });

  // 3. Conditional Routing based on Database Match
  if (staffRecord && staffRecord.isActive) {
    // Optionally handle distinct staff roles
    if (staffRecord.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/careers/admin', request.url));
    }
    return NextResponse.redirect(new URL('/staff/dashboard', request.url));
  }

  // 4. Default Fallback: Non-staff users get sent straight to the Student Portal
  return NextResponse.redirect(new URL('/student/portal', request.url));
}
