import { NextRequest, NextResponse } from 'next/server';
import { signedClientIp } from '@/lib/proxy-client-ip';
import {
  ACCESS_COOKIE,
  API_URL,
  REFRESH_COOKIE,
  clearSessionCookies,
  refreshUpstream,
  setSessionCookies,
} from '@/lib/web-session';

const sessionIssuers = new Set([
  '/auth/login',
  '/auth/verify-email',
  '/auth/simple-verify',
  '/auth/verify-2fa',
  '/auth/outbound/authentication',
  '/auth/refresh-token',
]);
const noStore = { 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff' };

function error(status: number, message: string) {
  return NextResponse.json({ code: status, message }, { status, headers: noStore });
}

function trustedOrigin(request: NextRequest) {
  // The ingress must preserve the browser-facing Host. OCOP_WEB_ORIGIN can pin a canonical origin.
  const host = request.headers.get('host') || request.nextUrl.host;
  const protocol = process.env.NODE_ENV === 'production' ? 'https:' : request.nextUrl.protocol;
  return process.env.OCOP_WEB_ORIGIN || `${protocol}//${host}`;
}

function relay(upstream: Response, refreshAvailable = false) {
  const headers = new Headers(noStore);
  const contentType = upstream.headers.get('content-type') || '';
  if (/^application\/(?:[\w.+-]+\+)?json(?:;|$)/i.test(contentType)) {
    headers.set('Content-Type', contentType);
  } else {
    headers.set('Content-Type', 'application/octet-stream');
    headers.set('Content-Disposition', 'attachment');
  }
  if (refreshAvailable && upstream.status === 401) headers.set('X-OCOP-Refresh', '1');
  return new NextResponse(upstream.body, { status: upstream.status, headers });
}

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const reads = request.method === 'GET' || request.method === 'HEAD';
  const site = request.headers.get('sec-fetch-site');
  if (
    request.headers.get('x-ocop-request') !== '1' ||
    (site && site !== 'same-origin') ||
    (!reads && request.headers.get('origin') !== trustedOrigin(request))
  ) {
    return error(403, 'Nguồn yêu cầu không hợp lệ');
  }

  const { path } = await context.params;
  if (
    path.some(
      (segment) =>
        !segment || segment === '.' || segment === '..' || /[%\\/:;?#\u0000-\u001f]/.test(segment),
    ) ||
    ['internal', 'webhooks', 'actuator', 'v3', 'swagger-ui', 'swagger-ui.html'].includes(path[0])
  ) {
    return error(404, 'Không tìm thấy API');
  }

  const endpoint = '/' + path.map(encodeURIComponent).join('/');
  const issuer = sessionIssuers.has(endpoint);
  const refresh = endpoint === '/auth/refresh-token';
  const logout = endpoint === '/auth/logout';
  if ((issuer || logout) && request.method !== 'POST')
    return error(405, 'Phương thức không hợp lệ');

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  try {
    const headers = new Headers();
    for (const name of ['accept', 'content-type', 'x-session-id', 'x-timezone']) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const clientIp = signedClientIp(request.headers);
    if (clientIp) headers.set('X-OCOP-Signed-Client-IP', clientIp);
    if (accessToken && !issuer) headers.set('Authorization', `Bearer ${accessToken}`);

    const forward = (body: BodyInit | null = request.body) =>
      fetch(`${API_URL}${endpoint}${request.nextUrl.search}`, {
        method: request.method,
        headers,
        body: reads ? null : body,
        cache: 'no-store',
        redirect: 'error',
        signal: AbortSignal.timeout(30000),
        ...(!reads && body instanceof ReadableStream ? { duplex: 'half' } : {}),
      });

    if (logout) {
      headers.set('Content-Type', 'application/json');
      const body = JSON.stringify({ refreshToken });
      let upstream = accessToken ? await forward(body) : null;
      if ((!upstream || upstream.status === 401) && refreshToken) {
        const renewed = await refreshUpstream(refreshToken);
        if (!renewed.ok && renewed.status !== 401) return relay(renewed);
        if (renewed.ok) {
          const { data } = await renewed.json();
          if (!data?.accessToken) return error(502, 'Không thể xác minh phiên');
          headers.set('Authorization', `Bearer ${data.accessToken}`);
          upstream = await forward(
            JSON.stringify({ refreshToken: data.refreshToken || refreshToken }),
          );
          if (upstream.status === 401) return relay(upstream);
        }
      }
      if (upstream && !upstream.ok && upstream.status !== 401) return relay(upstream);
      const response = NextResponse.json({ code: 1000, data: null }, { headers: noStore });
      clearSessionCookies(response);
      return response;
    }

    if (refresh && !refreshToken) return error(401, 'Phiên đăng nhập đã hết hạn');
    const upstream =
      refresh && refreshToken ? await refreshUpstream(refreshToken) : await forward();
    if (!issuer) return relay(upstream, Boolean(refreshToken));
    // Never pass an authentication response through unchanged, even on error.
    const payload = await upstream.json();
    const data = payload?.data;
    const authenticated =
      upstream.ok &&
      payload.code === 1000 &&
      typeof data?.accessToken === 'string' &&
      Boolean(data.accessToken) &&
      (refresh || (typeof data.refreshToken === 'string' && Boolean(data.refreshToken)));
    if (upstream.ok && payload.code === 1000 && !authenticated && data?.requireOtp !== true) {
      return error(502, 'Phản hồi xác thực không hợp lệ');
    }
    const response = NextResponse.json(
      {
        code: payload.code,
        message: payload.message,
        data: {
          authenticated,
          requireOtp: data?.requireOtp === true,
          roles: authenticated ? data.roles : [],
        },
      },
      { status: upstream.status, headers: noStore },
    );
    if (authenticated) setSessionCookies(response, data.accessToken, data.refreshToken);
    if (refresh && upstream.status === 401) clearSessionCookies(response);
    return response;
  } catch {
    return error(502, 'Không thể kết nối đến máy chủ');
  }
}

export {
  handle as GET,
  handle as HEAD,
  handle as POST,
  handle as PUT,
  handle as PATCH,
  handle as DELETE,
};
