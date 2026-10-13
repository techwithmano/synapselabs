import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { createAuthToken, setAuthCookie } from '@/lib/auth';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Enter your email and password.' }, { status: 400 });
    }

    const { email, password } = body as Record<string, unknown>;
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';
    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) ||
      typeof password !== 'string' ||
      !password ||
      password.length > 128
    ) {
      return NextResponse.json(
        { error: 'Enter a valid email and password.' },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const user = await User.findOne({ email: cleanEmail }).select(
      '_id name email passwordHash',
    );
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return NextResponse.json(
        { error: 'Email or password is incorrect.' },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      user: { id: String(user._id), name: user.name, email: user.email },
    });
    setAuthCookie(response, createAuthToken(String(user._id)));
    return response;
  } catch (error) {
    const errorName = error instanceof Error ? error.name : 'UnknownError';
    console.error(`POST /api/auth/login failed (${errorName}).`);
    return NextResponse.json(
      { error: 'Unable to sign in. Please try again.' },
      { status: 500 },
    );
  }
}
