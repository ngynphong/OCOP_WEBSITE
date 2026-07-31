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
    <div className="w-full mt-6 bg-linear-to-r from-red-50/70 via-rose-50/40 to-orange-50/50 p-5 rounded-2xl border border-red-100 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-red-600 text-white rounded-xl shadow-xs">
            <Ticket className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-stone-900 tracking-tight flex items-center gap-2 uppercase">
              MÃ GIẢM GIÁ CỦA SHOP
              <span className="px-2 py-0.5 text-xs font-bold bg-red-100 text-red-600 rounded-full">
                {vouchers.length} ưu đãi
              </span>
            </h3>
            <p className="text-xs text-stone-500 font-medium">
              Lưu mã để sử dụng khi thanh toán các sản phẩm của cửa hàng
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vouchers.map((voucher) => {
          const isSaved = savedIds.has(voucher.id);
          const isCopied = copiedCode === voucher.code;

          return (
            <motion.div
              key={voucher.id}
              whileHover={{ y: -3 }}
              className="relative flex bg-white border border-red-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg hover:shadow-red-900/5 transition-all group min-h-[120px]"
            >
              {/* Left Stub */}
              <div className="w-24 bg-linear-to-br from-red-500 to-rose-600 flex flex-col items-center justify-center border-r border-dashed border-white/40 relative shrink-0 p-2 text-center text-white">
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-rose-50/60 rounded-full translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-rose-50/60 rounded-full translate-x-1/2 translate-y-1/2" />

                <span className="font-black text-xl leading-none">
                  {voucher.type === 'PERCENT' ? (
                    `${voucher.discountValue}%`
                  ) : (
                    <span className="text-sm">
                      {voucher.discountValue >= 1000
                        ? `${voucher.discountValue / 1000}k`
                        : formatCurrencyVND(voucher.discountValue)}
                    </span>
                  )}
                </span>
                <span className="text-[9px] text-red-100 font-black uppercase tracking-widest mt-1">
                  GIẢM GIÁ
                </span>
              </div>

              {/* Right Content */}
              <div className="flex-1 p-3.5 flex flex-col justify-between overflow-hidden">
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
