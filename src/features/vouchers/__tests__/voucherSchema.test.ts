import { describe, it, expect } from 'vitest';
import { voucherSchema } from '../types';

describe('voucherSchema', () => {
  const validVoucher = {
    code: 'OCOP10K',
    name: 'Giảm 10K cho đơn hàng từ 100K',
    type: 'FIXED_AMOUNT' as const,
    discountValue: 10000,
    maxDiscount: null,
    minOrderValue: 100000,
    usageLimit: 100,
    perUserLimit: 1,
    startAt: '2026-09-23T00:00:00.000Z',
    expiredAt: '2026-10-23T00:00:00.000Z',
  };

  it('validates a correct voucher payload', () => {
    const result = voucherSchema.safeParse(validVoucher);
    expect(result.success).toBe(true);
  });

  it('converts voucher code to uppercase automatically', () => {
    const result = voucherSchema.safeParse({
      ...validVoucher,
      code: 'ocop50k',
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe('OCOP50K');
    }
  });

  it('fails when code is less than 3 or more than 20 characters', () => {
    const shortCode = voucherSchema.safeParse({
      ...validVoucher,
      code: 'AB',
    });
    expect(shortCode.success).toBe(false);

    const longCode = voucherSchema.safeParse({
      ...validVoucher,
      code: 'A'.repeat(25),
    });
    expect(longCode.success).toBe(false);
  });

  it('fails when expiredAt is before or equal to startAt', () => {
    const invalidDate = voucherSchema.safeParse({
      ...validVoucher,
      startAt: '2026-10-01T00:00:00.000Z',
      expiredAt: '2026-09-01T00:00:00.000Z',
    });
    expect(invalidDate.success).toBe(false);
    if (!invalidDate.success) {
      expect(invalidDate.error.issues[0].message).toContain(
        'Ngày kết thúc phải lớn hơn ngày bắt đầu',
      );
    }
  });

  it('fails when limits are less than 1', () => {
    const zeroLimit = voucherSchema.safeParse({
      ...validVoucher,
      usageLimit: 0,
    });
    expect(zeroLimit.success).toBe(false);
  });
});
