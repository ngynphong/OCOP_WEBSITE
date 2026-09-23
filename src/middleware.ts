import { NextResponse, type NextRequest } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/ocop/api/v1';
const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type SessionVerification = {
  status: number;
  roles: string[];
};

type RefreshedSession = {
  accessToken: string;
  refreshToken?: string;
};

const normalizeRoles = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((role): role is string => typeof role === 'string')
    .map((role) =>
      role
        .trim()
        .toUpperCase()
        .replace(/^ROLE_/, ''),
    )
    .filter(Boolean);
};

const verifySession = async (accessToken: string): Promise<SessionVerification> => {
  try {
    const response = await fetch(`${API_URL}/auth/introspect`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: 'no-store',
    });

    if (!response.ok) {
      return { status: response.status, roles: [] };
    }

    const payload = await response.json();
    return {
      status: response.status,
      roles: normalizeRoles(payload?.data?.roles),
    };
  } catch (error) {
    console.error('[MW-AUTH-ERROR] Failed to verify session:', error);
    return { status: 0, roles: [] };
  }
};

const refreshSession = async (refreshToken: string): Promise<RefreshedSession | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      cache: 'no-store',
    });

    if (!response.ok) return null;

    const payload = await response.json();
    const accessToken = payload?.data?.accessToken;
    if (typeof accessToken !== 'string' || !accessToken) return null;

    return {
      accessToken,
      refreshToken:
        typeof payload?.data?.refreshToken === 'string' ? payload.data.refreshToken : undefined,
    };
  } catch (error) {
    console.error('[MW-AUTH-ERROR] Failed to refresh session:', error);
    return null;
  }
};

const clearAuthCookies = (response: NextResponse) => {
  response.cookies.delete('access_token');
  response.cookies.delete('refresh_token');
  response.cookies.delete('user_roles');
};

const setAuthCookies = (
  response: NextResponse,
  request: NextRequest,
  session: RefreshedSession,
  roles: string[],
) => {
  const options = {
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax' as const,
    secure: request.nextUrl.protocol === 'https:',
  };

  response.cookies.set('access_token', session.accessToken, options);
  if (session.refreshToken) {
    response.cookies.set('refresh_token', session.refreshToken, options);
  }
  response.cookies.set('user_roles', JSON.stringify(roles), options);
};

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/dang-nhap', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  let activeAccessToken = accessToken;
  let refreshedSession: RefreshedSession | null = null;
  let verification = activeAccessToken
    ? await verifySession(activeAccessToken)
    : { status: 401, roles: [] };

  if (verification.status === 401 && refreshToken) {
    refreshedSession = await refreshSession(refreshToken);
    if (refreshedSession) {
      activeAccessToken = refreshedSession.accessToken;
      verification = await verifySession(activeAccessToken);
    }
  }

  if (verification.status === 0) {
    const unavailableUrl = new URL('/', request.url);
    unavailableUrl.searchParams.set('error', 'auth_unavailable');
    return NextResponse.redirect(unavailableUrl);
  }

  if (verification.status !== 200 && ![401, 403].includes(verification.status)) {
    console.error(
      `[MW-AUTH-ERROR] Auth service returned unexpected status ${verification.status} for ${pathname}`,
    );
    const unavailableUrl = new URL('/', request.url);
    unavailableUrl.searchParams.set('error', 'auth_unavailable');
    return NextResponse.redirect(unavailableUrl);
  }

  if (verification.status !== 200) {
    console.warn(
      `[MW-AUTH-BLOCK] Invalid or expired session for admin route: ${pathname} | Status: ${verification.status}`,
    );
    const loginUrl = new URL('/dang-nhap', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  const roles = verification.roles;

  if (!roles.some((role) => ADMIN_ROLES.has(role))) {
    console.warn(`[MW-AUTH-BLOCK] Unauthorized access attempt to admin route: ${pathname}`);
    const unauthorizedUrl = new URL('/', request.url);
    unauthorizedUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(unauthorizedUrl);
  }

  const response = NextResponse.next();
  if (refreshedSession) {
    setAuthCookies(response, request, refreshedSession, roles);
  } else {
    response.cookies.set('user_roles', JSON.stringify(roles), {
      maxAge: AUTH_COOKIE_MAX_AGE,
      path: '/',
      sameSite: 'lax',
      secure: request.nextUrl.protocol === 'https:',
    });
  }
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
