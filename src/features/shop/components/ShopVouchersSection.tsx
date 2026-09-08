'use client';

import React, { useMemo } from 'react';
import { Ticket, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  usePublicShopVouchers,
  useSaveVoucherMutations,
  useSavedVouchers,
} from '@/features/vouchers/hooks/useVouchers';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { formatCurrencyVND } from '@/utils/format';
import { Button } from '@/components/ui/AppButton';

interface ShopVouchersSectionProps {
  shopSlug: string;
}

export function ShopVouchersSection({ shopSlug }: ShopVouchersSectionProps) {
  const { data: vouchersResp, isLoading } = usePublicShopVouchers(shopSlug);
  const { saveVoucher } = useSaveVoucherMutations();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  // Fetch saved vouchers to check user saved status
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

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Đã sao chép mã giảm giá: ${code}`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="flex gap-4 overflow-x-auto pb-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-28 w-80 shrink-0 bg-stone-100 animate-pulse rounded-2xl border border-stone-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (!vouchers || vouchers.length === 0) return null;

  return (
    <div className="w-full rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-50/50 via-white to-rose-50/20 p-3 sm:p-4 md:p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5 mb-3 sm:mb-3.5">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="w-7 h-7 sm:w-8 h-8 rounded-lg sm:rounded-xl bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0">
            <Ticket className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h3 className="text-xs sm:text-base font-bold text-stone-900 tracking-tight">
                MÃ GIẢM GIÁ GIAN HÀNG
              </h3>
              <span className="px-1.5 sm:px-2 py-0.5 rounded text-[8px] sm:text-[9px] font-bold uppercase bg-red-600 text-white tracking-wider">
                ƯU ĐÃI
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium">
              Lưu mã để sử dụng khi thanh toán các sản phẩm của cửa hàng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-2 sm:px-2.5 py-0.5 bg-white/90 border border-red-200 rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold text-red-700 shadow-2xs">
            {vouchers.length} mã ưu đãi có sẵn
          </span>
        </div>
      </div>

      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto pb-2 md:pb-0 snap-x hide-scrollbar scrollbar-none">
        {vouchers.map((voucher) => {
          const isSaved = savedIds.has(voucher.id);
          const isCopied = copiedCode === voucher.code;

          return (
            <motion.div
              key={voucher.id}
              whileHover={{ y: -3 }}
              className="relative flex bg-white border border-red-100 rounded-xl sm:rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:shadow-red-900/5 transition-all group min-h-[110px] sm:min-h-[120px] min-w-[260px] sm:min-w-[300px] md:min-w-0 snap-start shrink-0 md:shrink"
            >
              {/* Left Stub */}
              <div className="w-20 sm:w-24 bg-linear-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center border-r border-dashed border-white/40 relative shrink-0 p-2 text-center text-white">
                <div className="absolute top-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-rose-50/60 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-rose-50/60 rounded-full translate-x-1/2 translate-y-1/2" />

                <span className="font-black text-lg sm:text-xl leading-none">
                  {voucher.type === 'PERCENT' ? (
                    `${voucher.discountValue}%`
                  ) : (
                    <span className="text-xs sm:text-sm">
                      {voucher.discountValue >= 1000
                        ? `${voucher.discountValue / 1000}k`
                        : formatCurrencyVND(voucher.discountValue)}
                    </span>
                  )}
                </span>
                <span className="text-[8px] sm:text-[9px] text-red-100 font-black uppercase tracking-widest mt-1">
                  GIẢM GIÁ
                </span>
              </div>

              {/* Right Content */}
              <div className="flex-1 p-2.5 sm:p-3.5 flex flex-col justify-between overflow-hidden">
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-800 rounded-md text-[10px] font-black uppercase tracking-wider font-mono border border-stone-200">
                      {voucher.code}
                    </span>
                    <button
                      onClick={() => handleCopyCode(voucher.code)}
                      className="text-stone-400 hover:text-stone-700 p-1 rounded transition-colors"
                      title="Sao chép mã"
                    >
                      {isCopied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <h4 className="text-xs font-black text-stone-900 line-clamp-1 group-hover:text-red-600 transition-colors">
                    {voucher.name}
                  </h4>

                  <div className="text-[10px] text-stone-500 font-medium space-y-0.5">
                    <p className="truncate">
                      Đơn tối thiểu:{' '}
                      <span className="font-bold text-stone-700">
                        {formatCurrencyVND(voucher.minOrderValue)}
                      </span>
                    </p>
                    <p className="italic text-stone-400">
                      HSD: {new Date(voucher.expiredAt).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <Button
                    onClick={() => handleCollect(voucher.id)}
                    disabled={isSaved}
                    isLoading={saveVoucher.isPending && saveVoucher.variables === voucher.id}
                    variant={isSaved ? 'outline' : 'danger'}
                    size="sm"
                    className={`w-full rounded-xl py-1.5 h-8 text-[10px] font-black uppercase tracking-wider ${
                      isSaved ? 'bg-stone-100 border-stone-200 text-stone-400' : ''
                    }`}
                  >
                    {isSaved ? 'Đã lưu vào ví' : 'Lưu mã'}
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
