import { describe, it, expect } from 'vitest';
import { getCodeStatus } from '../components/trace/traceStatusUtils';
import { ISupplyChainLot } from '../types/supplyChainTypes';
import { TraceQrInfo } from '@/features/products/types/productTypes';

describe('getCodeStatus', () => {
  const baseLot: Partial<ISupplyChainLot> = {
    id: 1,
    lotCode: 'LOT-2026-001',
    status: 'ACTIVE',
    verificationStatus: 'VERIFIED',
    quantity: 100,
  };

  it('returns RECALLED status info when lot is recalled', () => {
    const lot = { ...baseLot, status: 'RECALLED' } as ISupplyChainLot;
    const status = getCodeStatus(lot);

    expect(status.label).toBe('Cảnh báo thu hồi');
    expect(status.color).toBe('text-red-700');
  });

  it('returns SUSPENDED status info when lot is suspended', () => {
    const lot = { ...baseLot, status: 'SUSPENDED' } as ISupplyChainLot;
    const status = getCodeStatus(lot);

    expect(status.label).toBe('Tạm ngưng lưu hành');
    expect(status.color).toBe('text-amber-700');
  });

  it('returns EXPIRED status info when lot status is EXPIRED or past expiryDate', () => {
    const expiredByStatus = { ...baseLot, status: 'EXPIRED' } as ISupplyChainLot;
    expect(getCodeStatus(expiredByStatus).label).toBe('Hết hạn sử dụng');

    const expiredByDate = {
      ...baseLot,
      status: 'ACTIVE',
      expiryDate: '2020-01-01T00:00:00Z',
    } as ISupplyChainLot;
    expect(getCodeStatus(expiredByDate).label).toBe('Hết hạn sử dụng');
  });

  it('returns CANCELLED status info when lot is cancelled', () => {
    const lot = { ...baseLot, status: 'CANCELLED' } as ISupplyChainLot;
    const status = getCodeStatus(lot);

    expect(status.label).toBe('Mã đã bị hủy');
  });

  it('returns ACTIVE / DISTRIBUTED status info for valid circulating lot', () => {
    const activeLot = { ...baseLot, status: 'ACTIVE' } as ISupplyChainLot;
    expect(getCodeStatus(activeLot).label).toBe('Hợp lệ (Đang lưu hành)');

    const distributedLot = { ...baseLot, status: 'DISTRIBUTED' } as ISupplyChainLot;
    expect(getCodeStatus(distributedLot).label).toBe('Hợp lệ (Đang lưu hành)');
  });

  it('falls back to QR certificate info when lot is not provided', () => {
    const certifiedQr: TraceQrInfo = {
      qrCode: 'QR123',
      isCertified: true,
      status: 'ACTIVE',
      certificationStatus: 'CERTIFIED',
    };
    const status = getCodeStatus(undefined, certifiedQr);
    expect(status.label).toBe('Hợp lệ (Đã chứng thực OCOP)');
  });

  it('returns invalid status for rejected QR without lot', () => {
    const rejectedQr: TraceQrInfo = {
      qrCode: 'QR123',
      status: 'REJECTED',
      isCertified: false,
    };
    const status = getCodeStatus(undefined, rejectedQr);
    expect(status.label).toBe('Không hợp lệ / Đã hủy');
  });
});
