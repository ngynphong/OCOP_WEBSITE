import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';

describe('proxy (Admin Route Protection)', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('allows non-admin public routes to pass through without authentication', async () => {
    const req = new NextRequest('http://localhost:3000/products/dac-san-ocop');
    const res = await proxy(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('redirects unauthenticated users trying to access /admin to login page with redirect param', async () => {
    const req = new NextRequest('http://localhost:3000/admin/products?page=2');
    const res = await proxy(req);

    expect(res.status).toBe(307); // NextResponse.redirect
    const location = res.headers.get('location');
    expect(location).toContain('/dang-nhap');
    expect(location).toContain('redirect=%2Fadmin%2Fproducts%3Fpage%3D2');
  });

  it('redirects to login and clears cookies when access token is invalid and no refresh token exists', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    });

    const req = new NextRequest('http://localhost:3000/admin/orders', {
      headers: {
        cookie: 'ocop_access=invalid_token',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/dang-nhap');

    // Verify auth cookies are cleared (Set-Cookie headers delete the cookies)
    const setCookie = res.headers.get('set-cookie');
    expect(setCookie).toBeDefined();
    expect(setCookie).toContain('ocop_access=;');
  });

  it('allows access to /admin when user has valid token and ADMIN role', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          roles: ['ROLE_ADMIN'],
        },
      }),
    });

    const req = new NextRequest('http://localhost:3000/admin/dashboard', {
      headers: {
        cookie: 'ocop_access=valid_admin_token',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();

    expect(res.headers.get('set-cookie')).toBeNull();
  });

  it('allows access to /admin when user has SUPER_ADMIN role without ROLE_ prefix', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          roles: ['SUPER_ADMIN'],
        },
      }),
    });

    const req = new NextRequest('http://localhost:3000/admin/users', {
      headers: {
        cookie: 'ocop_access=valid_super_token',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(200);
    expect(res.headers.get('location')).toBeNull();
  });

  it('rejects authenticated users who do not possess ADMIN or SUPER_ADMIN roles', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        data: {
          roles: ['ROLE_USER', 'ROLE_SELLER'],
        },
      }),
    });

    const req = new NextRequest('http://localhost:3000/admin/settings', {
      headers: {
        cookie: 'ocop_access=customer_token',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/?error=unauthorized');
  });

  it('redirects an expired admin session without refreshing or changing cookies on GET', async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 401 });
    const req = new NextRequest('http://localhost:3000/admin/supply-chain/lots', {
      headers: {
        cookie: 'ocop_access=expired_token; ocop_refresh=valid_refresh_token',
        'sec-fetch-site': 'cross-site',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toContain('/phien-dang-nhap?redirect=');
    expect(res.headers.get('set-cookie')).toBeNull();
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/introspect$/),
      expect.anything(),
    );
  });

  it('redirects to auth_unavailable when auth service is unreachable', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const req = new NextRequest('http://localhost:3000/admin/dashboard', {
      headers: {
        cookie: 'ocop_access=some_token',
      },
    });

    const res = await proxy(req);
    expect(res.status).toBe(307);
    const location = res.headers.get('location');
    expect(location).toContain('/?error=auth_unavailable');
  });
});
