import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { AUTH_COOKIE_NAME, clearAuthCookie, getUserIdFromToken } from '@/lib/auth';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const userId = getUserIdFromToken(request.cookies.get(AUTH_COOKIE_NAME)?.value);
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    await connectToDatabase();
    const user = await User.findById(userId).select('_id name email').lean();
    if (!user) {
      const response = NextResponse.json({ user: null });
      clearAuthCookie(response);
      return response;
    }

    return NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email },
    });
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`GET /api/auth/me failed (${errorName}).`);
    return NextResponse.json(
      { error: 'Unable to load your account.' },
      { status: 500 },
    );
  }
}
