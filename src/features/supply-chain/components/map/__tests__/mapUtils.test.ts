import { describe, it, expect, vi } from 'vitest';

vi.mock('leaflet', () => ({
  default: {
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));

import { computePolygonArea } from '../mapUtils';

describe('computePolygonArea', () => {
  it('returns 0 for empty, null, or fewer than 3 coordinates', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(computePolygonArea(null as any)).toBe(0);
    expect(computePolygonArea([])).toBe(0);
    expect(computePolygonArea([{ lat: 10, lng: 106 }])).toBe(0);
    expect(
      computePolygonArea([
        { lat: 10, lng: 106 },
        { lat: 11, lng: 106 },
      ]),
    ).toBe(0);
  });

  it('computes a positive non-zero area for a valid polygon in Vietnam', () => {
    // A small parcel in Dalat / Lam Dong
    const coordinates = [
      { lat: 11.9404, lng: 108.4583 },
      { lat: 11.9404, lng: 108.4683 },
      { lat: 11.9504, lng: 108.4683 },
      { lat: 11.9504, lng: 108.4583 },
    ];
    const area = computePolygonArea(coordinates);
    expect(area).toBeGreaterThan(0);
    // Area of approx 1.1km x 1.1km box should be ~1.2 million m² (within reasonable range)
    expect(area).toBeGreaterThan(500000);
    expect(area).toBeLessThan(2000000);
  });
});
