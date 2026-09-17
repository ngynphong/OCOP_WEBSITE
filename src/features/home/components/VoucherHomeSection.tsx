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
  const { data: vouchersResp, isLoading } = usePublicFeaturedVouchers(4);
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
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-6 overflow-x-auto pb-3 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x hide-scrollbar">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 w-[285px] xs:w-[310px] sm:w-[330px] md:w-auto shrink-0 snap-start bg-stone-100 animate-pulse rounded-xl sm:rounded-2xl border border-stone-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 md:py-12">
      <div className="flex flex-col gap-5 sm:gap-8">
        <div className="flex items-end justify-between gap-3">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex items-center gap-1.5 sm:gap-2 text-red-600 font-black text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em]">
              <span className="w-5 sm:w-8 h-[2px] bg-red-600" />
              Ưu đãi giới hạn
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-2 sm:gap-3">
              VOUCHER OCOP
              <Ticket className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-red-500 shrink-0" />
            </h2>
          </div>
          <button className="min-h-[44px] flex items-center gap-1 text-green-900 hover:text-green-700 active:opacity-70 font-bold transition-all text-xs sm:text-sm group shrink-0 py-1">
            <span>Xem tất cả</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 md:gap-6 overflow-x-auto pb-3 md:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory hide-scrollbar">
          {vouchers.map((voucher) => (
            <motion.div
              key={voucher.id}
              whileHover={{ y: -6 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex bg-white border border-stone-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:shadow-stone-200/50 transition-all group min-h-[124px] sm:min-h-[130px] w-[285px] xs:w-[310px] sm:w-[330px] md:w-auto shrink-0 snap-start"
            >
              {/* Left Cut-out part */}
              <div className="w-24 sm:w-28 bg-linear-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center border-r border-dashed border-white/30 relative shrink-0 p-2 text-center text-white">
                <div className="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-stone-50 rounded-full translate-x-1/2 -translate-y-1/2 shadow-inner" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-stone-50 rounded-full translate-x-1/2 translate-y-1/2 shadow-inner" />

                <span className="text-white font-black text-xl sm:text-2xl leading-none">
                  {voucher.type === 'PERCENT' ? (
                    `${voucher.discountValue}%`
                  ) : (
                    <span className="text-base sm:text-lg">
                      {voucher.discountValue >= 1000
                        ? `${voucher.discountValue / 1000}k`
                        : voucher.discountValue}
                    </span>
                  )}
                </span>
                <span className="text-[9px] sm:text-[10px] text-red-100 font-black uppercase tracking-widest mt-1">
                  GIẢM GIÁ
                </span>
              </div>

              {/* Right Content part */}
              <div className="flex-1 p-3 sm:p-4 flex flex-col justify-between gap-2 overflow-hidden">
                <div className="space-y-1">
                  <h3 className="text-xs sm:text-sm font-black text-stone-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {voucher.name}
                  </h3>
                  <div className="flex flex-col">
                    <p className="text-[10px] sm:text-xs text-stone-500 font-bold truncate">
                      Đơn tối thiểu: {formatCurrencyVND(voucher.minOrderValue)}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-stone-400 font-medium italic mt-0.5">
                      HSD: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleCollect(voucher.id)}
                  disabled={savedIds.has(voucher.id)}
                  isLoading={saveVoucher.isPending && saveVoucher.variables === voucher.id}
                  variant={savedIds.has(voucher.id) ? 'outline' : 'danger'}
                  size="sm"
                  className={`w-full rounded-xl py-2 min-h-[38px] sm:min-h-[40px] text-[11px] font-black uppercase tracking-widest transition-transform active:scale-[0.98] ${
                    savedIds.has(voucher.id) ? 'bg-stone-100 border-stone-200 text-stone-400' : ''
                  }`}
                >
                  {savedIds.has(voucher.id) ? 'Đã lưu' : 'Lưu ngay'}
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
