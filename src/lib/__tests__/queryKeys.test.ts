import { describe, it, expect } from 'vitest';
import { queryKeys } from '../queryKeys';

describe('queryKeys', () => {
  it('generates consistent product query keys', () => {
    expect(queryKeys.products.all).toEqual(['products']);
    expect(queryKeys.products.detail(123)).toEqual(['product-detail', 123]);
    expect(queryKeys.products.lots(5, 0, 10)).toEqual(['public-product-lots', 5, 0, 10]);
    expect(queryKeys.products.lotByCode('LOT-ABC-123')).toEqual([
      'supply-chain-lot-public',
      'LOT-ABC-123',
    ]);
  });

  it('generates consistent supply chain query keys', () => {
    expect(queryKeys.supplyChain.adminLotDetail(42)).toEqual(['admin_lot_detail', 42]);
    expect(queryKeys.supplyChain.facilities({ page: 1 })).toEqual(['facilities', { page: 1 }]);
  });

  it('generates consistent location query keys', () => {
    expect(queryKeys.locations.provinces('NORTH')).toEqual(['location-provinces', 'NORTH']);
    expect(queryKeys.locations.allWards34(10)).toEqual(['location-all-wards-34', 10]);
  });
});
