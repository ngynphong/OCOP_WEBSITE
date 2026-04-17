'use client';

import React, { useState } from 'react';
import { Tag, Loader2, X } from 'lucide-react';
import { useValidateVoucher } from '@/features/vouchers/hooks/useVouchers';
import type { VoucherValidateResponse } from '@/features/vouchers/types';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/AppButton';

interface VoucherCheckoutInputProps {
  onApply: (voucher: VoucherValidateResponse | null) => void;
  appliedVoucher: VoucherValidateResponse | null;
  shopId?: number; // Optional: if voucher is per shop
}

export const VoucherCheckoutInput = ({
  onApply,
  appliedVoucher,
  shopId,
}: VoucherCheckoutInputProps) => {
  const [voucherCode, setVoucherCode] = useState('');
  const { mutate: checkVoucher, isPending } = useValidateVoucher();

  const handleApply = () => {
    if (!voucherCode.trim()) return;

    checkVoucher(
      { code: voucherCode, shopId },
      {
        onSuccess: (res) => {
          if (!res.data.valid) {
            onApply(res.data);
            toast.success('Áp dụng mã giảm giá thành công!');
          } else {
            onApply(null);
            toast.error('Mã giảm giá này đã được sử dụng');
          }
        },
        onError: () => {
          onApply(null);
          toast.error('Có lỗi xảy ra khi kiểm tra mã');
        },
      },
    );
  };

  const handleRemove = () => {
    onApply(null);
    setVoucherCode('');
  };

  return (
    <div className="space-y-3">
      <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">
        Mã giảm giá
      </label>

      {appliedVoucher ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 group animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Tag className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-black text-emerald-800">{appliedVoucher.code}</p>
              <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">
                Đã áp dụng
              </p>
            </div>
          </div>
          <button
            onClick={handleRemove}
            className="p-2 hover:bg-emerald-100 rounded-xl text-emerald-400 hover:text-emerald-700 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-3 bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/5 transition-all">
            <Tag className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="VÍ DỤ: OCOP2024"
              className="flex-1 text-sm font-bold text-stone-900 bg-transparent focus:outline-none placeholder:text-stone-300 placeholder:font-bold"
            />
          </div>
          <Button
            onClick={handleApply}
            variant="primary"
            disabled={isPending || !voucherCode.trim()}
            className="px-6 py-3 disabled:bg-stone-100 disabled:text-stone-300 text-white text-xs font-black rounded-2xl transition-all shadow-sm active:scale-95 shrink-0 min-w-[100px] flex items-center justify-center"
          >
            {isPending ? <Loader2 size={16} className="animate-spin" /> : 'ÁP DỤNG'}
          </Button>
        </div>
      )}
    </div>
  );
};
