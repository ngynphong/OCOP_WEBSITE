'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiClock,
  FiPackage,
  FiCheckCircle,
  FiXCircle,
  FiTrendingUp,
  FiShoppingBag,
} from 'react-icons/fi';
import { useAdminFlashSaleDetailQuery } from '../hooks/useAdminFlashSales';
import { useAdminFlashSaleMutations } from '../hooks/useAdminFlashSales';
import { Button } from '@/components/ui/AppButton';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatCurrencyVND } from '@/utils/format';

interface FlashSaleDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  flashSaleId: number | null;
}

export function FlashSaleDetailDrawer({
  isOpen,
  onClose,
  flashSaleId,
}: FlashSaleDetailDrawerProps) {
  const { data: detailData, isPending } = useAdminFlashSaleDetailQuery(flashSaleId || 0, {
    enabled: isOpen && !!flashSaleId,
  });

  const { approveFlashSale, cancelFlashSale, isApproving, isCanceling } =
    useAdminFlashSaleMutations();

  const flashSale = detailData?.data;

  const handleApprove = async () => {
    if (!flashSaleId) return;
    try {
      await approveFlashSale(flashSaleId);
      onClose();
    } catch {
      // toast handled in mutation
    }
  };

  const handleCancel = async () => {
    if (!flashSaleId) return;
    try {
      await cancelFlashSale(flashSaleId);
      onClose();
    } catch {
      // toast handled in mutation
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-stone-50 shadow-2xl z-[70] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-6 bg-white border-b border-stone-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-xl font-black text-stone-800">Chi tiết Flash Sale</h2>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">
                  ID: #{flashSaleId}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-400"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {isPending ? (
                <div className="h-64 flex flex-col items-center justify-center gap-4">
                  <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    Đang tải thông tin...
                  </p>
                </div>
              ) : !flashSale ? (
                <div className="text-center py-12">
                  <p className="text-stone-500">Không tìm thấy thông tin chương trình.</p>
                </div>
              ) : (
                <>
                  {/* Overview Card */}
                  <div className="bg-white rounded-xl p-6 border border-stone-100 shadow-sm space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/3 aspect-video md:aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                        {flashSale.bannerUrl ? (
                          <Image
                            src={flashSale.bannerUrl}
                            alt={flashSale.name}
                            width={300}
                            height={300}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-stone-300 gap-2">
                            <FiPackage size={40} />
                            <span className="text-[8px] font-black uppercase">Không có banner</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-4">
                        <div>
                          <span
                            className={cn(
                              'px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest',
                              flashSale.status === 'ACTIVE'
                                ? 'bg-emerald-100 text-emerald-600'
                                : flashSale.status === 'UPCOMING'
                                  ? 'bg-amber-100 text-amber-600'
                                  : flashSale.status === 'DRAFT'
                                    ? 'bg-stone-100 text-stone-500'
                                    : 'bg-red-50 text-red-500',
                            )}
                          >
                            {flashSale.status}
                          </span>
                          <h3 className="text-2xl font-black text-stone-800 mt-3">
                            {flashSale.name}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 gap-3">
                          <div className="flex items-center gap-3 text-stone-600">
                            <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                              <FiClock className="text-stone-400" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-stone-400 uppercase">
                                Bắt đầu
                              </p>
                              <p className="text-sm font-bold">
                                {new Date(flashSale.startTime).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-stone-600">
                            <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center shrink-0">
                              <FiClock className="text-stone-400" />
                            </div>
                            <div>
                              <p className="text-[9px] font-black text-stone-400 uppercase">
                                Kết thúc
                              </p>
                              <p className="text-sm font-bold">
                                {new Date(flashSale.endTime).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-stone-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                        <FiPackage size={20} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-stone-400 uppercase">Tổng SP</p>
                        <p className="text-lg font-black text-stone-800">
                          {flashSale.items.length}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-100 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <FiShoppingBag size={20} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-stone-400 uppercase">Đã bán</p>
                        <p className="text-lg font-black text-stone-800">
                          {flashSale.items.reduce((acc, item) => acc + item.qtySold, 0)}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-stone-100 flex items-center gap-3 col-span-2 md:col-span-1">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <FiTrendingUp size={20} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-stone-400 uppercase">TQ khả dĩ</p>
                        <p className="text-lg font-black text-stone-800">
                          {flashSale.items.reduce((acc, item) => acc + item.remainingQty, 0)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Product Details List */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-black text-stone-800 flex items-center gap-2">
                      <FiPackage className="text-red-500" /> Danh sách sản phẩm tham gia
                    </h4>
                    <div className="space-y-3">
                      {flashSale.items.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-4 rounded-xl border border-stone-100 flex items-center gap-4 group hover:border-red-100 transition-all"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 shrink-0">
                            {item.thumbnailUrl ? (
                              <Image
                                src={item.thumbnailUrl}
                                alt={item.productName}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-300">
                                <FiPackage size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-stone-800 truncate">
                              {item.productName}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs font-black text-red-600">
                                {formatCurrencyVND(item.salePrice)}
                              </span>
                              <span className="text-[10px] text-stone-400 line-through">
                                {formatCurrencyVND(item.originalPrice)}
                              </span>
                              <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                -{item.discountPercent}%
                              </span>
                            </div>
                            <div className="mt-2 w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{ width: `${(item.qtySold / item.qtyLimit) * 100}%` }}
                              />
                            </div>
                            <p className="text-[8px] font-black text-stone-400 uppercase mt-1 tracking-wider">
                              Đã bán: <span className="text-stone-800">{item.qtySold}</span> /{' '}
                              {item.qtyLimit}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Footer Actions */}
            {!isPending && flashSale && flashSale.status === 'UPCOMING' && (
              <div className="p-6 bg-white border-t border-stone-100 grid grid-cols-2 gap-4 shrink-0">
                <Button
                  variant="outline"
                  className="w-full py-4 border-stone-200 text-red-500 hover:bg-red-50 hover:border-red-100 rounded-xl font-black text-sm"
                  leftIcon={<FiXCircle size={18} />}
                  onClick={handleCancel}
                  isLoading={isCanceling}
                  disabled={isApproving}
                >
                  Hủy chương trình
                </Button>
                <Button
                  variant="primary"
                  className="w-full py-4 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-black text-sm shadow-lg shadow-emerald-500/20"
                  leftIcon={<FiCheckCircle size={18} />}
                  onClick={handleApprove}
                  isLoading={isApproving}
                  disabled={isCanceling}
                >
                  Duyệt đăng ký
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
