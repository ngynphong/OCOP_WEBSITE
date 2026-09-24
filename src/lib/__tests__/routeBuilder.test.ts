import { describe, it, expect } from 'vitest';
import { buildRoute } from '../routeBuilder';

describe('buildRoute', () => {
  it('concatenates base url with segments', () => {
    const result = buildRoute('/api/v1/products', 123, 'variants');
    expect(result).toBe('/api/v1/products/123/variants');
  });

  it('filters out undefined, null, and empty string segments', () => {
    const result = buildRoute('/api/v1/orders', null, undefined, '', 456);
    expect(result).toBe('/api/v1/orders/456');
  });

  it('normalizes multiple consecutive slashes into a single slash', () => {
    const result = buildRoute('/api/v1/admin//supply-chain///lots/', 'verify');
    expect(result).toBe('/api/v1/admin/supply-chain/lots/verify');
  });

  it('works with single base argument', () => {
    const result = buildRoute('/api/v1/auth/login');
    expect(result).toBe('/api/v1/auth/login');
  });
});
