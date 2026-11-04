import { NextResponse, type NextRequest } from 'next/server';

import { ACCESS_COOKIE, API_URL, REFRESH_COOKIE, clearSessionCookies } from '@/lib/web-session';

const ADMIN_ROLES = new Set(['ADMIN', 'SUPER_ADMIN']);

type SessionVerification = {
  status: number;
  roles: string[];
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
      redirect: 'error',
      signal: AbortSignal.timeout(10000),
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

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    const loginUrl = new URL('/dang-nhap', request.url);
    loginUrl.searchParams.set('redirect', `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const verification = accessToken ? await verifySession(accessToken) : { status: 401, roles: [] };

  if (verification.status === 401 && refreshToken) {
    const resumeUrl = new URL('/phien-dang-nhap', request.url);
    resumeUrl.searchParams.set('redirect', pathname + search);
    return NextResponse.redirect(resumeUrl, { headers: { 'Cache-Control': 'private, no-store' } });
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
    clearSessionCookies(response);
    return response;
  }

  const roles = verification.roles;

  if (!roles.some((role) => ADMIN_ROLES.has(role))) {
    console.warn(`[MW-AUTH-BLOCK] Unauthorized access attempt to admin route: ${pathname}`);
    const unauthorizedUrl = new URL('/', request.url);
    unauthorizedUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
