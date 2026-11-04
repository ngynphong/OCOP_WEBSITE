import { afterEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/ocop/[...path]/route';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/lib/web-session';

const origin = 'http://localhost:3000';
const context = (path: string) => ({ params: Promise.resolve({ path: path.split('/') }) });
function post(path: string, headers: HeadersInit = {}) {
  return new NextRequest(`${origin}/api/ocop/${path}`, {
    method: 'POST',
    headers: { origin, 'X-OCOP-Request': '1', ...headers },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe('browser session API', () => {
  it('signs only the validated ingress IP and drops a caller-supplied signature', async () => {
    vi.stubEnv('OCOP_PROXY_IP_SECRET', 'fixture-secret-for-ip-verification-only');
    const upstream = vi
      .fn()
      .mockImplementation(() => Promise.resolve(Response.json({ code: 1000 })));
    vi.stubGlobal('fetch', upstream);
    const headers = {
      'X-OCOP-Request': '1',
      'X-OCOP-Signed-Client-IP': 'forged',
      'X-Forwarded-For': '203.0.113.9',
    };
    await GET(new NextRequest(`${origin}/api/ocop/cart`, { headers }), context('cart'));
    expect(upstream.mock.calls[0][1].headers.has('X-OCOP-Signed-Client-IP')).toBe(false);
    await GET(
      new NextRequest(`${origin}/api/ocop/cart`, {
        headers: { ...headers, 'X-OCOP-Ingress-IP': '198.51.100.2' },
      }),
      context('cart'),
    );
    const upstreamHeaders = upstream.mock.calls[1][1].headers as Headers;
    expect(upstreamHeaders.get('X-OCOP-Signed-Client-IP')).toMatch(
      /^\d+;198\.51\.100\.2;[a-f0-9]{64}$/,
    );
    expect(upstreamHeaders.has('X-Forwarded-For')).toBe(false);
  });
  it('rejects cross-origin mutations and requests missing the CSRF guard before contacting Spring', async () => {
    const upstream = vi.fn();
    vi.stubGlobal('fetch', upstream);
    for (const endpoint of ['auth/login', 'auth/refresh-token', 'auth/logout', 'cart/items']) {
      expect(
        (await POST(post(endpoint, { origin: 'http://other.localhost:3000' }), context(endpoint)))
          .status,
      ).toBe(403);
      expect((await POST(post(endpoint, { 'X-OCOP-Request': '' }), context(endpoint))).status).toBe(
        403,
      );
    }
    expect(upstream).not.toHaveBeenCalled();
  });

  it('keeps both tokens out of the login JSON and sets HttpOnly cookies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        Response.json({
          code: 1000,
          data: { accessToken: 'jwt-private', refreshToken: 'refresh-private', roles: ['USER'] },
        }),
      ),
    );
    const response = await POST(post('auth/login'), context('auth/login'));
    expect(await response.json()).toEqual({
      code: 1000,
      data: { authenticated: true, requireOtp: false, roles: ['USER'] },
    });
    expect(response.cookies.get(ACCESS_COOKIE)).toMatchObject({
      value: 'jwt-private',
      httpOnly: true,
      sameSite: 'lax',
    });
    expect(response.cookies.get(REFRESH_COOKIE)).toMatchObject({
      value: 'refresh-private',
      httpOnly: true,
    });
    expect(response.headers.get('cache-control')).toContain('no-store');
  });

  it('does not issue a session when login still requires a second factor', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(Response.json({ code: 1000, data: { requireOtp: true } })),
    );
    const response = await POST(post('auth/login'), context('auth/login'));
    expect((await response.json()).data).toMatchObject({ requireOtp: true, authenticated: false });
    expect(response.headers.has('set-cookie')).toBe(false);
  });

  it('uses only the cookie to refresh and clears cookies when Spring rejects it', async () => {
    const upstream = vi.fn().mockResolvedValue(Response.json({ code: 1028 }, { status: 401 }));
    vi.stubGlobal('fetch', upstream);
    const response = await POST(
      post('auth/refresh-token', {
        cookie: `${REFRESH_COOKIE}=server-session`,
      }),
      context('auth/refresh-token'),
    );
    expect(upstream).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/refresh-token$/),
      expect.objectContaining({
        body: JSON.stringify({ refreshToken: 'server-session' }),
      }),
    );
    expect(response.status).toBe(401);
    expect(response.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
  });

  it('forwards only the server cookie as bearer and never forwards upstream Set-Cookie', async () => {
    const upstream = vi.fn().mockResolvedValue(
      Response.json(
        { code: 1000 },
        {
          headers: { 'Set-Cookie': 'unexpected=1' },
        },
      ),
    );
    vi.stubGlobal('fetch', upstream);
    const response = await GET(
      new NextRequest(`${origin}/api/ocop/cart`, {
        headers: {
          'X-OCOP-Request': '1',
          authorization: 'Bearer supplied-by-browser',
          cookie: `${ACCESS_COOKIE}=server-jwt`,
        },
      }),
      context('cart'),
    );
    const headers = upstream.mock.calls[0][1].headers as Headers;
    expect(headers.get('authorization')).toBe('Bearer server-jwt');
    expect(headers.has('cookie')).toBe(false);
    expect(response.headers.has('set-cookie')).toBe(false);
  });

  it('revokes an expired-access session via refresh before deleting both cookies', async () => {
    const upstream = vi
      .fn()
      .mockResolvedValueOnce(Response.json({ code: 1009 }, { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({ data: { accessToken: 'fresh-jwt', refreshToken: 'session' } }),
      )
      .mockResolvedValueOnce(Response.json({ code: 1000 }));
    vi.stubGlobal('fetch', upstream);
    const response = await POST(
      post('auth/logout', {
        cookie: `${ACCESS_COOKIE}=expired; ${REFRESH_COOKIE}=session`,
      }),
      context('auth/logout'),
    );
    expect(upstream.mock.calls[2][1].headers.get('authorization')).toBe('Bearer fresh-jwt');
    expect(response.cookies.get(ACCESS_COOKIE)?.maxAge).toBe(0);
    expect(response.cookies.get(REFRESH_COOKIE)?.maxAge).toBe(0);
  });
});
