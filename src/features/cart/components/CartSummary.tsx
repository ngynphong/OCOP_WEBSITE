'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Tag, ShieldCheck, ChevronRight, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useValidateCart } from '../hooks/useCart';
import { useValidateVoucher } from '@/features/vouchers/hooks/useVouchers';
import toast from 'react-hot-toast';
import type { CartItem } from '../types/cartTypes';
import type { VoucherValidateResponse } from '@/features/vouchers/types';

function formatVND(amount: number): string {
  return amount.toLocaleString('vi-VN') + '₫';
}

interface CartSummaryProps {
  selectedItems: CartItem[];
  hasIssues: boolean;
}

export function CartSummary({ selectedItems, hasIssues }: CartSummaryProps) {
  const router = useRouter();
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidateResponse | null>(null);

  const { mutate: validateCart, isPending: isValidating } = useValidateCart();
  const { mutate: checkVoucher, isPending: isCheckingVoucher } = useValidateVoucher();

  const subtotal = selectedItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Tính toán số tiền giảm giá
  const discountAmount = useMemo(() => {
    if (!appliedVoucher || !appliedVoucher.valid) return 0;

    let discount = 0;
    if (appliedVoucher.type === 'PERCENT') {
      discount = (subtotal * appliedVoucher.discountValue) / 100;
      if (appliedVoucher.maxDiscount > 0) {
        discount = Math.min(discount, appliedVoucher.maxDiscount);
      }
    } else {
      discount = appliedVoucher.discountValue;
    }

    return Math.min(discount, subtotal);
  }, [appliedVoucher, subtotal]);

  const total = subtotal - discountAmount;
  const canCheckout = selectedItems.length > 0 && !hasIssues;

  const handleApplyVoucher = () => {
    if (!voucherCode.trim()) return;

    // Lấy shopId của shop đầu tiên trong list (giả sử voucher áp dụng cho shop này)
    const shopId = selectedItems.length > 0 ? selectedItems[0].shopId : undefined;

    checkVoucher(
      { code: voucherCode, shopId },
      {
        onSuccess: (res) => {
          if (res.data.valid) {
            setAppliedVoucher(res.data);
            toast.success('Đã áp dụng mã giảm giá!');
          } else {
            setAppliedVoucher(null);
            toast.error(res.data.description || 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
          }
        },
        onError: () => {
          setAppliedVoucher(null);
        },
      },
    );
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const handleCheckout = () => {
    if (!canCheckout) return;

    validateCart(undefined, {
      onSuccess: (res) => {
        if (res.data.isValid) {
          router.push('/checkout');
        } else {
          // Có issue — thông báo để user xử lý trước
          toast.error(
            `Vui lòng xử lý ${res.data.invalidItems} sản phẩm có vấn đề trước khi đặt hàng`,
          );
        }
      },
    });
  };

  return (
    <div className="sticky top-28 space-y-4">
      {/* Order Summary Card */}
      <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm">
        <h2 className="text-base font-bold text-stone-800 mb-5">Tóm tắt đơn hàng</h2>

        {/* Voucher */}
        <div className="mb-5">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">
            Mã giảm giá
          </label>
          {appliedVoucher ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 group">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-emerald-600" />
                <div>
                  <p className="text-sm font-bold text-emerald-800">{appliedVoucher.code}</p>
                  <p className="text-[10px] text-emerald-600 font-medium">
                    Giảm {formatVND(discountAmount)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleRemoveVoucher}
                className="p-1 hover:bg-emerald-100 rounded-lg text-emerald-400 hover:text-emerald-700 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex-1 flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 focus-within:border-green-400 transition-colors">
                <Tag className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Nhập mã voucher"
                  className="flex-1 text-sm font-medium text-stone-800 bg-transparent focus:outline-none placeholder:text-stone-300 placeholder:font-normal"
                />
              </div>
              <button
                onClick={handleApplyVoucher}
                disabled={isCheckingVoucher || !voucherCode}
                className="px-4 py-2 bg-green-700 hover:bg-green-800 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm font-bold rounded-xl transition-colors shrink-0 flex items-center justify-center min-w-[80px]"
              >
                {isCheckingVoucher ? <Loader2 size={16} className="animate-spin" /> : 'Áp dụng'}
              </button>
            </div>
          )}
        </div>

        {/* Price breakdown */}
        <div className="space-y-3 border-t border-stone-100 pt-4">
          <div className="flex justify-between text-sm text-stone-600">
            <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
            <span className="font-medium">{formatVND(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span>Giảm giá voucher</span>
              <span className="font-bold">- {formatVND(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-stone-600">
            <span>Phí vận chuyển</span>
            <span className="font-medium text-green-700">Tính khi thanh toán</span>
          </div>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-stone-200">
          <span className="text-sm font-bold text-stone-700">Tổng cộng</span>
          <span className="text-2xl font-black text-green-700">{formatVND(total)}</span>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={!canCheckout || isValidating}
          className={cn(
            'w-full mt-5 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base transition-all duration-200',
            canCheckout && !isValidating
              ? 'bg-green-700 hover:bg-green-800 text-white shadow-[0_8px_24px_rgba(22,101,52,0.25)] hover:shadow-[0_12px_32px_rgba(22,101,52,0.35)] hover:scale-[1.01] active:scale-[0.99]'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed',
          )}
        >
          {isValidating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Đang kiểm tra...
            </>
          ) : (
            <>
              Tiến hành thanh toán
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Hint */}
        {!canCheckout && !isValidating && selectedItems.length === 0 && (
          <p className="text-center text-xs text-stone-400 mt-3">
            Chọn ít nhất 1 sản phẩm để đặt hàng
          </p>
        )}
        {hasIssues && (
          <p className="text-center text-xs text-amber-600 mt-3">
            Vui lòng xử lý các sản phẩm có vấn đề trước khi đặt hàng
          </p>
        )}
      </div>

      {/* Trust badge */}
      <div className="bg-green-50 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-green-800 mb-0.5">Mua sắm an toàn</p>
          <p className="text-[11px] text-green-700 leading-relaxed">
            Thanh toán bảo mật 256-bit SSL. Hỗ trợ đổi trả trong 7 ngày với sản phẩm lỗi.
          </p>
        </div>
      </div>

      {/* OCOP Impact card */}
      <div className="bg-amber-50 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-xl shrink-0">🌾</span>
        <div>
          <p className="text-xs font-bold text-amber-900 mb-0.5">Đóng góp cho nông thôn Việt</p>
          <p className="text-[11px] text-amber-700 leading-relaxed">
            Mỗi đơn hàng của bạn trực tiếp hỗ trợ người nông dân và nghệ nhân địa phương.
          </p>
        </div>
      </div>
    </div>
  );
}
