import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import { createAuthToken, setAuthCookie } from '@/lib/auth';
import User from '@/models/User';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 11000
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Enter your account details.' }, { status: 400 });
    }

    const { name, email, password } = body as Record<string, unknown>;
    const cleanName = typeof name === 'string' ? name.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!cleanName || cleanName.length > 80) {
      return NextResponse.json(
        { error: 'Name must be between 1 and 80 characters.' },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanEmail.length > 254) {
      return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    }
    if (typeof password !== 'string' || password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 },
      );
    }

    await connectToDatabase();
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash,
    });
    const response = NextResponse.json(
      { user: { id: String(user._id), name: user.name, email: user.email } },
      { status: 201 },
    );
    setAuthCookie(response, createAuthToken(String(user._id)));
    return response;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      return NextResponse.json(
        { error: 'An account with that email already exists.' },
        { status: 409 },
      );
    }
    console.error('POST /api/auth/signup failed:', error);
    return NextResponse.json(
      { error: 'Unable to create your account. Please try again.' },
      { status: 500 },
    );
  }
}
