import { describe, it, expect } from 'vitest';
import { calculateVoucherDiscount, calculateCheckoutPricing } from '../utils/checkoutPricing';
import type { VoucherValidateResponse } from '@/features/vouchers/types';

describe('calculateVoucherDiscount', () => {
  const baseVoucher: VoucherValidateResponse = {
    valid: true,
    invalidReason: null,
    code: 'TEST',
    type: 'FIXED_AMOUNT',
    discountValue: 20000,
    maxDiscount: null,
    minOrderValue: 100000,
    description: 'Test voucher',
    calculatedDiscount: null,
    applicableProductIds: null,
    applicableCategoryIds: null,
  };

  it('returns 0 if voucher is null, undefined, or invalid', () => {
    expect(calculateVoucherDiscount(null, 200000)).toBe(0);
    expect(calculateVoucherDiscount(undefined, 200000)).toBe(0);
    expect(calculateVoucherDiscount({ ...baseVoucher, valid: false }, 200000)).toBe(0);
  });

  it('returns 0 if subtotal is below minOrderValue', () => {
    expect(calculateVoucherDiscount(baseVoucher, 80000)).toBe(0);
  });

  describe('FIXED_AMOUNT voucher', () => {
    it('applies exact discount value when order meets minOrderValue', () => {
      const discount = calculateVoucherDiscount(baseVoucher, 150000);
      expect(discount).toBe(20000);
    });

    it('caps discount at subtotal to prevent negative item price', () => {
      const hugeDiscountVoucher: VoucherValidateResponse = {
        ...baseVoucher,
        discountValue: 500000,
        minOrderValue: 50000,
      };
      const discount = calculateVoucherDiscount(hugeDiscountVoucher, 100000);
      expect(discount).toBe(100000);
    });
  });

  describe('PERCENT voucher', () => {
    const percentVoucher: VoucherValidateResponse = {
      ...baseVoucher,
      type: 'PERCENT',
      discountValue: 20, // 20%
      maxDiscount: 50000, // max 50,000 VND
      minOrderValue: 100000,
    };

    it('calculates percentage correctly without hitting maxDiscount cap', () => {
      // 20% of 150,000 = 30,000 (< 50,000)
      const discount = calculateVoucherDiscount(percentVoucher, 150000);
      expect(discount).toBe(30000);
    });

    it('caps discount at maxDiscount when percentage exceeds it', () => {
      // 20% of 500,000 = 100,000 (> maxDiscount 50,000)
      const discount = calculateVoucherDiscount(percentVoucher, 500000);
      expect(discount).toBe(50000);
    });
  });

  describe('FREE_SHIPPING voucher', () => {
    const freeShippingVoucher: VoucherValidateResponse = {
      ...baseVoucher,
      type: 'FREE_SHIPPING',
      discountValue: 0, // 0 = full free shipping
      maxDiscount: 30000,
      minOrderValue: 100000,
    };

    it('discounts shipping fee up to maxDiscount', () => {
      // Shipping fee 25,000 (< 30,000)
      const discount = calculateVoucherDiscount(freeShippingVoucher, 150000, 25000);
      expect(discount).toBe(25000);

      // Shipping fee 45,000 (> maxDiscount 30,000)
      const cappedDiscount = calculateVoucherDiscount(freeShippingVoucher, 150000, 45000);
      expect(cappedDiscount).toBe(30000);
    });
  });
});

describe('calculateCheckoutPricing', () => {
  const percentVoucher: VoucherValidateResponse = {
    valid: true,
    invalidReason: null,
    code: 'SALE10',
    type: 'PERCENT',
    discountValue: 10,
    maxDiscount: 50000,
    minOrderValue: 100000,
    description: 'Giảm 10%',
    calculatedDiscount: null,
    applicableProductIds: null,
    applicableCategoryIds: null,
  };

  it('calculates full checkout breakdown with subtotal, shipping, voucher, and points', () => {
    const result = calculateCheckoutPricing({
      subtotal: 300000,
      shippingFee: 30000,
      voucher: percentVoucher, // 10% of 300,000 = 30,000
      redeemDiscount: 20000, // 20,000 VND from points
    });

    expect(result.subtotal).toBe(300000);
    expect(result.shippingFee).toBe(30000);
    expect(result.voucherDiscount).toBe(30000);
    expect(result.redeemDiscount).toBe(20000);
    expect(result.totalDiscount).toBe(50000);
    // 300,000 + 30,000 - 50,000 = 280,000
    expect(result.total).toBe(280000);
  });

  it('guarantees total never drops below 0 even if discounts exceed total amount', () => {
    const result = calculateCheckoutPricing({
      subtotal: 50000,
      shippingFee: 10000,
      voucher: null,
      redeemDiscount: 100000,
    });

    expect(result.total).toBe(0);
  });
});
