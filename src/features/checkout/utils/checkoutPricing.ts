import type { VoucherValidateResponse } from '@/features/vouchers/types';

export interface CheckoutPricingParams {
  subtotal: number;
  shippingFee: number;
  voucher?: VoucherValidateResponse | null;
  redeemDiscount?: number;
}

export interface CheckoutPricingResult {
  subtotal: number;
  shippingFee: number;
  voucherDiscount: number;
  redeemDiscount: number;
  totalDiscount: number;
  total: number;
}

/**
 * Calculates voucher discount based on type (FIXED_AMOUNT, PERCENT, FREE_SHIPPING),
 * enforcing minOrderValue, maxDiscount caps, and bounds checking.
 */
export function calculateVoucherDiscount(
  voucher: VoucherValidateResponse | null | undefined,
  subtotal: number,
  shippingFee: number = 0,
): number {
  if (!voucher || !voucher.valid) return 0;
  if (subtotal < (voucher.minOrderValue || 0)) return 0;

  let discount = 0;

  if (voucher.type === 'PERCENT') {
    discount = (subtotal * voucher.discountValue) / 100;
    if (voucher.maxDiscount && voucher.maxDiscount > 0) {
      discount = Math.min(discount, voucher.maxDiscount);
    }
    return Math.min(Math.round(discount), subtotal);
  }

  if (voucher.type === 'FREE_SHIPPING') {
    discount =
      voucher.discountValue > 0 ? Math.min(shippingFee, voucher.discountValue) : shippingFee;
    if (voucher.maxDiscount && voucher.maxDiscount > 0) {
      discount = Math.min(discount, voucher.maxDiscount);
    }
    return Math.min(Math.round(discount), shippingFee);
  }

  // FIXED_AMOUNT
  discount = voucher.discountValue;
  return Math.min(Math.max(0, discount), subtotal);
}

/**
 * Calculates final checkout pricing breakdown, ensuring total cannot be negative.
 */
export function calculateCheckoutPricing({
  subtotal,
  shippingFee,
  voucher,
  redeemDiscount = 0,
}: CheckoutPricingParams): CheckoutPricingResult {
  const safeSubtotal = Math.max(0, subtotal);
  const safeShipping = Math.max(0, shippingFee);
  const safeRedeem = Math.max(0, redeemDiscount);

  const voucherDiscount = calculateVoucherDiscount(voucher, safeSubtotal, safeShipping);
  const totalDiscount = voucherDiscount + safeRedeem;

  const total = Math.max(0, safeSubtotal + safeShipping - totalDiscount);

  return {
    subtotal: safeSubtotal,
    shippingFee: safeShipping,
    voucherDiscount,
    redeemDiscount: safeRedeem,
    totalDiscount,
    total,
  };
}
