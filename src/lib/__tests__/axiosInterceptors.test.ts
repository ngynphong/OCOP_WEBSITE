import axios, { AxiosHeaders } from 'axios';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { axiosClient, refreshWebSession } from '../axios';
import { AppError } from '@/utils/error';

describe('axiosClient Interceptors', () => {
  const store: Record<string, string> = {};

  beforeEach(() => {
    vi.clearAllMocks();
    Object.keys(store).forEach((key) => delete store[key]);

    // Mock window & localStorage in test environment
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).window = global;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).localStorage = {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, val: string) => {
        store[key] = val;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
    };
  });

  it('serializes web refreshes using the browser lock when available', async () => {
    const request = vi.fn(async (_name: string, callback: () => Promise<void>) => callback());
    vi.stubGlobal('navigator', { locks: { request } });
    const post = vi
      .spyOn(axios, 'post')
      .mockResolvedValue({ data: { data: { authenticated: true } } });
    try {
      await Promise.all([refreshWebSession(), refreshWebSession()]);
      expect(request).toHaveBeenCalledTimes(1);
      expect(request).toHaveBeenCalledWith('ocop-session-refresh', expect.any(Function));
      expect(post).toHaveBeenCalledTimes(1);
    } finally {
      post.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  it('does not submit a single-use refresh token without cross-tab locking', async () => {
    vi.stubGlobal('navigator', {});
    const post = vi.spyOn(axios, 'post');
    try {
      await expect(refreshWebSession()).rejects.toThrow('không hỗ trợ');
      expect(post).not.toHaveBeenCalled();
    } finally {
      post.mockRestore();
      vi.unstubAllGlobals();
    }
  });

  describe('Request Interceptor', () => {
    it('ignores legacy bearer tokens and sends the CSRF guard header', async () => {
      store['access_token'] = 'test-mock-jwt-token';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestInterceptor = (axiosClient.interceptors.request as any).handlers[0].fulfilled;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = { headers: new AxiosHeaders() };
      const modifiedConfig = await requestInterceptor(config);

      expect(modifiedConfig.headers.get('Authorization')).toBeUndefined();
      expect(modifiedConfig.headers.get('X-OCOP-Request')).toBe('1');
    });

    it('attaches X-Session-Id when user is not authenticated', async () => {
      // No token in storage
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestInterceptor = (axiosClient.interceptors.request as any).handlers[0].fulfilled;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = { headers: new AxiosHeaders() };
      const modifiedConfig = await requestInterceptor(config);

      expect(modifiedConfig.headers.Authorization).toBeUndefined();
      expect(modifiedConfig.headers.get('X-Session-Id')).toBeDefined();
    });

    it('handles X-Silent-Loading header properly without leaking it', async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const requestInterceptor = (axiosClient.interceptors.request as any).handlers[0].fulfilled;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const config: any = { headers: new AxiosHeaders({ 'X-Silent-Loading': 'true' }) };
      const modifiedConfig = await requestInterceptor(config);

      expect(modifiedConfig._isSilent).toBe(true);
      expect(modifiedConfig.headers['X-Silent-Loading']).toBeUndefined();
      const retriedConfig = await requestInterceptor(modifiedConfig);
      expect(retriedConfig._isSilent).toBe(true);
    });
  });

  describe('Response Interceptor', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseInterceptor = (axiosClient.interceptors.response as any).handlers[0].fulfilled;

    it('unwraps data when response code is standard 1000 (Success)', async () => {
      const response = {
        data: {
          code: 1000,
          data: { id: 1, name: 'Sản phẩm OCOP' },
        },
        config: {},
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = await responseInterceptor(response as any);
      expect(result).toEqual(response.data);
    });

    it('rejects with AxiosError when API response code is non-1000 business error', async () => {
      const response = {
        data: {
          code: 1001,
          message: 'Tài khoản không tồn tại',
        },
        config: {},
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(responseInterceptor(response as any)).rejects.toThrow('Tài khoản không tồn tại');
    });
  });

  describe('Response Error Interceptor', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorInterceptor = (axiosClient.interceptors.response as any).handlers[0].rejected;

    it('waits for a user action before renewing on the admin recovery page', async () => {
      vi.stubGlobal('location', { pathname: '/phien-dang-nhap' });
      const post = vi.spyOn(axios, 'post');
      try {
        await expect(
          errorInterceptor({
            config: { url: '/auth/introspect' },
            response: { status: 401, data: { code: 1009 }, headers: { 'x-ocop-refresh': '1' } },
          }),
        ).rejects.toBeInstanceOf(AppError);
        expect(post).not.toHaveBeenCalled();
      } finally {
        post.mockRestore();
        vi.unstubAllGlobals();
      }
    });

    it('transforms network or unreachable server error into AppError with status 503', async () => {
      const networkError = {
        config: {},
        response: undefined, // Network error has no HTTP response
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await expect(errorInterceptor(networkError as any)).rejects.toBeInstanceOf(AppError);
    });
  });
});
