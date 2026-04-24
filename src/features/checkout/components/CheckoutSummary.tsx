'use client';

import React, { useMemo, memo } from 'react';
import { ShieldCheck, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/AppButton';

import { VoucherCheckoutInput } from '@/features/vouchers/components/VoucherCheckoutInput';
import type { VoucherValidateResponse } from '@/features/vouchers/types';

interface CheckoutSummaryProps {
  subtotal: number;
  shippingFee: number;
  appliedVoucher: VoucherValidateResponse | null;
  onApplyVoucher: (voucher: VoucherValidateResponse | null) => void;
  redeemDiscount?: number;
  isPending?: boolean;
  onConfirm: () => void;
  canConfirm: boolean;
  affiliateCode: string;
  onAffiliateCodeChange: (code: string) => void;
}

export const CheckoutSummary = memo(function CheckoutSummary({
  subtotal,
  shippingFee,
  appliedVoucher,
  onApplyVoucher,
  redeemDiscount = 0,
  isPending,
  onConfirm,
  canConfirm,
  affiliateCode,
  onAffiliateCodeChange,
}: CheckoutSummaryProps) {
  const discount = useMemo(() => {
    if (!appliedVoucher || !appliedVoucher.valid) return 0;

    let disc = 0;
    if (appliedVoucher.type === 'PERCENT') {
      disc = (subtotal * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscount && appliedVoucher.maxDiscount > 0) {
        disc = Math.min(disc, appliedVoucher.maxDiscount);
      }
    } else {
      disc = appliedVoucher.discountValue;
    }
    return Math.min(disc, subtotal);
  }, [appliedVoucher, subtotal]);

  const total = useMemo(
    () => subtotal + shippingFee - discount - redeemDiscount,
    [subtotal, shippingFee, discount, redeemDiscount],
  );

  return (
    <div className="bg-white rounded-[32px] p-8 border border-stone-100 shadow-xl shadow-stone-200/50 sticky top-28">
      <h2 className="text-xl font-black text-stone-900 mb-6 tracking-tight">Tóm tắt thanh toán</h2>

      {/* Voucher Input */}
      <div className="mb-6">
        <VoucherCheckoutInput appliedVoucher={appliedVoucher} onApply={onApplyVoucher} />
      </div>

      {/* Affiliate Code Input */}
      <div className="mb-8 border-b border-stone-100 pb-8">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
            Mã giới thiệu (Affiliate - tùy chọn)
          </label>
          <input
            type="text"
            placeholder="Nhập mã giới thiệu..."
            value={affiliateCode}
            onChange={(e) => onAffiliateCodeChange(e.target.value)}
            disabled={isPending}
            className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl px-4 py-2.5 text-xs focus:outline-hidden focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition-all font-bold placeholder:font-normal placeholder:text-stone-300"
          />
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex justify-between items-center text-stone-500">
          <span className="text-sm font-medium">Tạm tính</span>
          <span className="text-sm font-bold text-stone-700">
            {subtotal.toLocaleString('vi-VN')}₫
          </span>
        </div>
        <div className="flex justify-between items-center text-stone-500">
          <span className="text-sm font-medium">Phí vận chuyển</span>
          <span className="text-sm font-bold text-stone-700">
            {shippingFee > 0 ? `+${shippingFee.toLocaleString('vi-VN')}₫` : 'Miễn phí'}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between items-center text-emerald-600 animate-in fade-in slide-in-from-right-2">
            <span className="text-sm font-medium">Giảm giá voucher</span>
            <span className="text-sm font-black">-{discount.toLocaleString('vi-VN')}₫</span>
          </div>
        )}
        {redeemDiscount > 0 && (
          <div className="flex justify-between items-center text-green-600 animate-in fade-in slide-in-from-right-2">
            <span className="text-sm font-medium">Giảm giá điểm thưởng</span>
            <span className="text-sm font-black">-{redeemDiscount.toLocaleString('vi-VN')}₫</span>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-dashed border-stone-200 mb-8">
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-stone-400 uppercase tracking-widest">
            Tổng cộng
          </span>
          <div className="text-right">
            <p className="text-3xl font-black text-green-700 leading-none">
              {total.toLocaleString('vi-VN')}₫
            </p>
            <p className="text-[10px] text-stone-400 font-bold mt-2 uppercase tracking-tight">
              Đã bao gồm VAT (nếu có)
            </p>
          </div>
        </div>
      </div>

      <Button
        onClick={onConfirm}
        disabled={!canConfirm || isPending}
        className={cn(
          'w-full py-4 rounded-2xl flex items-center justify-center gap-2',
          canConfirm && !isPending
            ? 'bg-green-700 hover:bg-green-800 shadow-green-900/20'
            : 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none',
        )}
        variant="primary"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            ĐANG XỬ LÝ...
          </>
        ) : (
          <>
            XÁC NHẬN THANH TOÁN
            <ArrowRight size={20} />
          </>
        )}
      </Button>

      <div className="mt-8 pt-8 border-t border-stone-100 flex flex-col gap-4">
        <div className="flex items-start gap-3 bg-stone-50/50 p-4 rounded-2xl border border-stone-100/50">
          <ShieldCheck className="w-5 h-5 text-green-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-black text-stone-800 uppercase tracking-widest">
              Đảm bảo OCOP
            </h4>
            <p className="text-[11px] text-stone-500 leading-relaxed font-medium">
              Hoàn tiền 100% nếu sản phẩm không đúng chất lượng chứng nhận. Bảo mật thông tin giao
              dịch tuyệt đối.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
