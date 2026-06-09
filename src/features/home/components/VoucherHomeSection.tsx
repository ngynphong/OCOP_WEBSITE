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
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 w-full bg-stone-100 animate-pulse rounded-xl border border-stone-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (vouchers.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-12">
      <div className="flex flex-col gap-8">
        <div className="flex items-end justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-600 font-black text-xs uppercase tracking-[0.2em]">
              <span className="w-8 h-[2px] bg-red-600" />
              Ưu đãi giới hạn
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-stone-900 tracking-tight flex items-center gap-3">
              VOUCHER OCOP
              <Ticket className="w-8 h-8 text-red-500" />
            </h2>
          </div>
          <button className="flex items-center gap-1 text-green-900 hover:text-green-700 font-bold transition-all text-sm group">
            Xem tất cả{' '}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vouchers.map((voucher) => (
            <motion.div
              key={voucher.id}
              whileHover={{ y: -8 }}
              className="relative flex bg-white border border-stone-100 rounded-xl overflow-hidden shadow-xs hover:shadow-2xl hover:shadow-stone-200/50 transition-all group min-h-[130px]"
            >
              {/* Left Cut-out part */}
              <div className="w-28 bg-linear-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center border-r border-dashed border-white/30 relative shrink-0">
                <div className="absolute top-0 right-0 w-4 h-4 bg-stone-50 rounded-full translate-x-1/2 -translate-y-1/2 shadow-inner" />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-stone-50 rounded-full translate-x-1/2 translate-y-1/2 shadow-inner" />

                <span className="text-white font-black text-2xl leading-none">
                  {voucher.type === 'PERCENT' ? (
                    `${voucher.discountValue}%`
                  ) : (
                    <span className="text-lg">
                      {voucher.discountValue >= 1000
                        ? `${voucher.discountValue / 1000}k`
                        : voucher.discountValue}
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-red-100 font-black uppercase tracking-widest mt-1">
                  GIẢM GIÁ
                </span>
              </div>

              {/* Right Content part */}
              <div className="flex-1 p-4 flex flex-col justify-between gap-2 overflow-hidden">
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-stone-900 line-clamp-1 group-hover:text-red-600 transition-colors uppercase tracking-tight">
                    {voucher.name}
                  </h3>
                  <div className="flex flex-col">
                    <p className="text-[10px] text-stone-400 font-bold">
                      Đơn tối thiểu: {formatCurrencyVND(voucher.minOrderValue)}
                    </p>
                    <p className="text-[9px] text-stone-300 font-medium italic mt-0.5">
                      HSD: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleCollect(voucher.id)}
                  disabled={!isAuthenticated || savedIds.has(voucher.id)}
                  isLoading={saveVoucher.isPending && saveVoucher.variables === voucher.id}
                  variant={
                    savedIds.has(voucher.id) ? 'outline' : isAuthenticated ? 'danger' : 'outline'
                  }
                  size="sm"
                  className={`w-full rounded-xl py-2 h-9 text-[11px] font-black uppercase tracking-widest ${
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
