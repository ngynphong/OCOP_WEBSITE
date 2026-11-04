import { NextResponse } from 'next/server';

export const API_URL = (
  process.env.OCOP_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:8080/ocop/api/v1'
).replace(/\/+$/, '');

const secure = process.env.NODE_ENV === 'production';
const prefix = secure ? '__Host-' : '';
export const ACCESS_COOKIE = `${prefix}ocop_access`;
export const REFRESH_COOKIE = `${prefix}ocop_refresh`;
const cookieOptions = { httpOnly: true, secure, sameSite: 'lax' as const, path: '/' };

export function setSessionCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken?: string,
) {
  const options = { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 };
  response.cookies.set(ACCESS_COOKIE, accessToken, options);
  if (refreshToken) response.cookies.set(REFRESH_COOKIE, refreshToken, options);
}

export function clearSessionCookies(response: NextResponse) {
  for (const name of [ACCESS_COOKIE, REFRESH_COOKIE]) {
    response.cookies.set(name, '', { ...cookieOptions, maxAge: 0 });
  }
}

export function refreshUpstream(refreshToken: string) {
  return fetch(`${API_URL}/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
    cache: 'no-store',
    redirect: 'error',
    signal: AbortSignal.timeout(15000),
  });
}
