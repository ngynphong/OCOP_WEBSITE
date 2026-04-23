'use client';

import { memo } from 'react';
import { Ticket, ChevronRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  usePublicFeaturedVouchers,
  useCollectVoucher,
} from '@/features/vouchers/hooks/useVouchers';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';

export const VoucherHomeSection = memo(function VoucherHomeSection() {
  const { data: vouchersResp, isLoading } = usePublicFeaturedVouchers(4);
  const { mutate: collectVoucher, isPending: isCollecting } = useCollectVoucher();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Mock data if API is empty or failing (for demonstration in development)
  const mockVouchers = [
    {
      id: 101,
      code: 'OCOPNEW',
      name: 'Giảm 20k cho đơn đầu tiên',
      type: 'CASH',
      discountValue: 20000,
      minOrderValue: 100000,
      expiredAt: '2026-12-31',
    },
    {
      id: 102,
      code: 'FREESHIP',
      name: 'Miễn phí vận chuyển',
      type: 'CASH',
      discountValue: 15000,
      minOrderValue: 200000,
      expiredAt: '2026-12-31',
    },
    {
      id: 103,
      code: 'OCOP5SAO',
      name: 'Giảm 10% đặc sản 5 sao',
      type: 'PERCENT',
      discountValue: 10,
      minOrderValue: 500000,
      expiredAt: '2026-12-31',
    },
    {
      id: 104,
      code: 'TET2026',
      name: 'Ưu đãi Tết OCOP',
      type: 'PERCENT',
      discountValue: 15,
      minOrderValue: 1000000,
      expiredAt: '2026-12-31',
    },
  ];

  const vouchers = vouchersResp?.data?.length ? vouchersResp.data : mockVouchers;

  const handleCollect = (id: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu mã giảm giá');
      return;
    }
    collectVoucher(id);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="h-40 w-full bg-stone-100 animate-pulse rounded-[32px]" />
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-xl">
              <Ticket className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight">
              ƯU ĐÃI ĐỘC QUYỀN
            </h2>
          </div>
          <button className="flex items-center gap-1 text-stone-500 hover:text-green-700 font-bold transition-colors">
            Xem tất cả <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {vouchers.map((voucher) => (
            <motion.div
              key={voucher.id}
              whileHover={{ y: -4 }}
              className="relative flex bg-white border border-stone-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              {/* Left Cut-out part */}
              <div className="w-24 bg-red-50 flex flex-col items-center justify-center border-r border-dashed border-red-200 relative">
                <div className="absolute top-0 left-0 w-4 h-4 bg-stone-50 rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 left-0 w-4 h-4 bg-stone-50 rounded-full -translate-x-1/2 translate-y-1/2" />

                <span className="text-red-600 font-black text-xl">
                  {voucher.type === 'PERCENT'
                    ? `${voucher.discountValue}%`
                    : `${voucher.discountValue / 1000}k`}
                </span>
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">
                  Giảm giá
                </span>
              </div>

              {/* Right Content part */}
              <div className="flex-1 p-4 flex flex-col justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-stone-800 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {voucher.name}
                  </h3>
                  <p className="text-[10px] text-stone-500 mt-1">
                    Đơn tối thiểu {(voucher.minOrderValue || 0).toLocaleString('vi-VN')}đ
                  </p>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="text-[9px] text-stone-400 font-medium">
                    HSD: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                  </div>
                  <button
                    onClick={() => handleCollect(voucher.id)}
                    disabled={isCollecting}
                    className="px-4 py-1.5 bg-red-600 hover:bg-red-700 disabled:bg-stone-300 text-white text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center gap-1"
                  >
                    {isCollecting ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Lưu'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

VoucherHomeSection.displayName = 'VoucherHomeSection';
