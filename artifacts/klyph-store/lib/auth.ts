import type { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export const AUTH_COOKIE_NAME = 'token';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured on the server.');
  }
  return secret;
}

export function createAuthToken(userId: string): string {
  return jwt.sign({ sub: userId }, getJwtSecret(), {
    algorithm: 'HS256',
    expiresIn: SESSION_MAX_AGE_SECONDS,
  });
}

export function verifyAuthToken(token: string): { userId: string } | null {
  const secret = getJwtSecret();
  try {
    const payload = jwt.verify(token, secret, { algorithms: ['HS256'] });
    if (typeof payload === 'string' || typeof payload.sub !== 'string') {
      return null;
    }
    return { userId: payload.sub };
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export function getUserIdFromToken(token: string | undefined): string | null {
  if (!token) return null;
  return verifyAuthToken(token)?.userId ?? null;
}
