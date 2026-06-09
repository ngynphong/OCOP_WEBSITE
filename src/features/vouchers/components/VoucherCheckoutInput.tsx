import React, { useState, useEffect, useCallback } from 'react';
import { Tag, Loader2, X, CheckCircle2, AlertCircle, Wallet } from 'lucide-react';
import { useValidateVoucher } from '@/features/vouchers/hooks/useVouchers';
import type { VoucherValidateResponse } from '@/features/vouchers/types';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';

import { VoucherSelectionModal } from './VoucherSelectionModal';

interface VoucherCheckoutInputProps {
  onApply: (voucher: VoucherValidateResponse | null) => void;
  appliedVoucher: VoucherValidateResponse | null;
  shopId?: number;
}

export const VoucherCheckoutInput = ({
  onApply,
  appliedVoucher,
  shopId,
}: VoucherCheckoutInputProps) => {
  const [voucherCode, setVoucherCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutate: checkVoucher, isPending } = useValidateVoucher();

  const debouncedVoucherCode = useDebounce(voucherCode, 900);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleApply = useCallback(
    (code: string) => {
      checkVoucher(
        { code, shopId },
        {
          onSuccess: (res) => {
            if (res.data.valid) {
              onApply(res.data);
              setError(null);
              toast.success('Áp dụng mã giảm giá thành công!');
            } else {
              onApply(null);
              setError(res.data.description || 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
            }
          },
          onError: () => {
            onApply(null);
            setError('Có lỗi xảy ra khi kiểm tra mã');
          },
        },
      );
    },
    [checkVoucher, onApply, shopId],
  );

  useEffect(() => {
    if (
      debouncedVoucherCode &&
      !appliedVoucher &&
      debouncedVoucherCode === voucherCode &&
      debouncedVoucherCode.length >= 3
    ) {
      handleApply(debouncedVoucherCode);
    }
  }, [debouncedVoucherCode, voucherCode, appliedVoucher, handleApply]);

  const handleRemove = () => {
    onApply(null);
    setVoucherCode('');
    setError(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between ml-1">
        <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest block">
          Mã giảm giá
        </label>
        {!appliedVoucher && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-colors"
          >
            <Wallet size={12} />
            Ví Voucher
          </button>
        )}
      </div>

      {appliedVoucher ? (
        <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 group animate-in fade-in slide-in-from-top-1">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
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
        <div className="space-y-2">
          <div className="relative group">
            <div
              className={`flex items-center gap-3 bg-stone-50 border rounded-xl px-4 py-3.5 transition-all duration-300 ${
                error
                  ? 'border-red-200 bg-red-50/30 ring-4 ring-red-500/5'
                  : 'border-stone-200 focus-within:border-green-500 focus-within:ring-4 focus-within:ring-green-500/5'
              }`}
            >
              <Tag
                className={`w-4 h-4 shrink-0 transition-colors ${error ? 'text-red-400' : 'text-stone-400 group-focus-within:text-green-600'}`}
              />
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => {
                  setVoucherCode(e.target.value.toUpperCase());
                  setError(null);
                }}
                placeholder="VÍ DỤ: OCOP2024"
                className="flex-1 text-sm font-bold text-stone-900 bg-transparent focus:outline-none placeholder:text-stone-300"
              />
              {isPending && <Loader2 size={16} className="animate-spin text-green-600 shrink-0" />}
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-1.5 px-3 mt-1.5 animate-in fade-in slide-in-from-top-1">
                <AlertCircle size={12} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-500 uppercase tracking-tight">
                  {error}
                </span>
              </div>
            )}
          </div>

          <p className="text-[10px] text-stone-400 font-medium px-1">
            * Nhập mã hoặc chọn từ ví để nhận ưu đãi.
          </p>
        </div>
      )}

      <VoucherSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(code) => {
          setVoucherCode(code);
          handleApply(code);
        }}
        currentCode={appliedVoucher?.code}
      />
    </div>
  );
};
