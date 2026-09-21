'use client';

import { memo } from 'react';
import { Ticket, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  usePublicFeaturedVouchers,
  useSaveVoucherMutations,
  useSavedVouchers,
} from '@/features/vouchers/hooks/useVouchers';
import { useAppSelector } from '@/store/hooks';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { formatCurrencyVND } from '@/utils/format';
import { Button } from '@/components/ui/AppButton';

export const VoucherHomeSection = memo(function VoucherHomeSection() {
  const { data: vouchersResp, isLoading } = usePublicFeaturedVouchers(6);
  const { saveVoucher } = useSaveVoucherMutations();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch saved vouchers to check status
  const { data: savedResp } = useSavedVouchers(1, 50, isAuthenticated);

  const vouchers = vouchersResp?.data || [];

  const savedIds = useMemo(() => {
    const list = savedResp?.data?.content || [];
    return new Set(list.map((v) => v.voucherId));
  }, [savedResp]);

  const handleCollect = (id: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu mã giảm giá');
      return;
    }
    saveVoucher.mutate(id);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-stone-100 animate-pulse rounded-xl border border-stone-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col gap-3.5 sm:gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Ticket className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight uppercase">
              VOUCHER OCOP
            </h2>
            <span className="hidden sm:inline-block text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Ưu đãi hôm nay
            </span>
          </div>
          <button className="flex items-center gap-1 text-emerald-800 hover:text-emerald-700 font-bold transition-colors text-xs sm:text-sm group">
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 6 Vouchers in 1 row on desktop */}
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x hide-scrollbar">
          {vouchers.slice(0, 6).map((voucher) => (
            <motion.div
              key={voucher.id}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex bg-white border border-stone-200/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all group min-h-[86px] sm:min-h-[90px] w-[185px] sm:w-auto shrink-0 snap-start"
            >
              {/* Left Cut-out part */}
              <div className="w-14 sm:w-16 bg-linear-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center border-r border-dashed border-white/30 relative shrink-0 p-1.5 text-center text-white">
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-stone-100 rounded-full translate-x-1/2 -translate-y-1/2 shadow-inner" />
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-stone-100 rounded-full translate-x-1/2 translate-y-1/2 shadow-inner" />

                <span className="text-white font-black text-sm sm:text-base leading-none">
                  {voucher.type === 'PERCENT' ? (
                    `${voucher.discountValue}%`
                  ) : (
                    <span>
                      {voucher.discountValue >= 1000
                        ? `${voucher.discountValue / 1000}k`
                        : voucher.discountValue}
                    </span>
                  )}
                </span>
                <span className="text-[8px] text-red-100 font-black uppercase tracking-wider mt-1">
                  GIẢM
                </span>
              </div>

              {/* Right Content part */}
              <div className="flex-1 p-2 flex flex-col justify-between gap-1 overflow-hidden">
                <div className="space-y-0.5">
                  <h3 className="text-[11px] font-black text-stone-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {voucher.name}
                  </h3>
                  <p className="text-[9.5px] text-stone-500 font-medium truncate">
                    Đơn từ: {formatCurrencyVND(voucher.minOrderValue)}
                  </p>
                  <p className="text-[8.5px] text-stone-400 font-normal italic truncate">
                    HSD: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>

                <Button
                  onClick={() => handleCollect(voucher.id)}
                  disabled={savedIds.has(voucher.id)}
                  isLoading={saveVoucher.isPending && saveVoucher.variables === voucher.id}
                  variant={savedIds.has(voucher.id) ? 'outline' : 'danger'}
                  size="sm"
                  className={`w-full rounded-lg py-1 min-h-[26px] text-[10px] font-black uppercase tracking-wider transition-all ${
                    savedIds.has(voucher.id)
                      ? 'bg-stone-100 border-stone-200 text-stone-400'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-2xs'
                  }`}
                >
                  {savedIds.has(voucher.id) ? 'Đã lưu' : 'Lưu'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

VoucherHomeSection.displayName = 'VoucherHomeSection';
