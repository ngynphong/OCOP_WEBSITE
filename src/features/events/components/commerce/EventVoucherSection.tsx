'use client';

import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Ticket, Copy, Check } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useSavedVouchers, useSaveVoucherMutations } from '@/features/vouchers/hooks/useVouchers';
import type { EventVoucher } from '../../types/eventCommerceTypes';

interface EventVoucherSectionProps {
  vouchers: EventVoucher[];
}

export function EventVoucherSection({ vouchers }: EventVoucherSectionProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { saveVoucher } = useSaveVoucherMutations();
  const { data: savedResponse } = useSavedVouchers(1, 200, isAuthenticated);

  const savedVoucherIds = useMemo(() => {
    const savedVouchers = savedResponse?.data?.content || [];
    return new Set(savedVouchers.map((voucher) => voucher.voucherId));
  }, [savedResponse]);

  if (!vouchers || vouchers.length === 0) return null;

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSave = (voucherId: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu mã giảm giá');
      return;
    }
    saveVoucher.mutate(voucherId);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  return (
    <section
      id="vouchers"
      className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border shadow-sm"
          style={{
            backgroundColor: 'var(--event-surface, #FEF2F2)',
            color: 'var(--event-primary, #DC2626)',
            borderColor: 'var(--event-primary, #DC2626)',
          }}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Ưu đãi chiến dịch</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Voucher & Mã Giảm Giá Độc Quyền
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Thu thập voucher để nhận ưu đãi trợ giá tối đa khi mua sắm đặc sản OCOP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {vouchers.map((v) => {
          const isSaved = savedVoucherIds.has(v.voucherId);
          const isSaving = saveVoucher.isPending && saveVoucher.variables === v.voucherId;
          const isPercent = v.type === 'PERCENT';
          const discountDisplay = isPercent
            ? `Giảm ${v.discountValue}%`
            : `Giảm ${formatCurrency(v.discountValue)}`;

          return (
            <div
              key={v.id}
              className="relative flex bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* Left stub */}
              <div
                className="w-28 sm:w-32 flex flex-col items-center justify-center p-3 text-white relative text-center"
                style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
              >
                <Ticket className="w-6 h-6 mb-1" />
                <span className="text-xs font-black uppercase tracking-wider leading-tight">
                  {v.shopName ? 'Shop' : 'Toàn Sàn'}
                </span>
                <span className="text-[10px] opacity-80 mt-0.5">OCOP Voucher</span>

                {/* Jagged cutout dots */}
                <div className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-900" />
                <div className="absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-slate-50 dark:bg-slate-900" />
              </div>

              {/* Right content */}
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                      {discountDisplay}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold">
                      {v.code}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Đơn tối thiểu {formatCurrency(v.minOrderValue)}
                    {isPercent && v.maxDiscount && (
                      <span> (tối đa {formatCurrency(v.maxDiscount)})</span>
                    )}
                  </p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(v.code)}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
                  >
                    {copiedCode === v.code ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Đã sao chép
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Copy className="w-3.5 h-3.5" /> Sao chép mã
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSave(v.voucherId)}
                    disabled={isSaved || isSaving}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isSaved
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                        : 'text-white shadow-sm hover:scale-105'
                    }`}
                    style={
                      !isSaved ? { backgroundColor: 'var(--event-primary, #DC2626)' } : undefined
                    }
                  >
                    {isSaved ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Đã lưu ví
                      </span>
                    ) : isSaving ? (
                      'Đang lưu...'
                    ) : (
                      'Lưu Mã'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
