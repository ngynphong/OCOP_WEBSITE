'use client';

import React from 'react';
import { X, Ticket, Loader2, Wallet, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSavedVouchers } from '../hooks/useVouchers';
import { formatCurrencyVND } from '@/utils/format';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/lib/utils';

interface VoucherSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  currentCode?: string;
}

export function VoucherSelectionModal({
  isOpen,
  onClose,
  onSelect,
  currentCode,
}: VoucherSelectionModalProps) {
  const { data: savedRes, isLoading } = useSavedVouchers(1, 50);
  const vouchers = savedRes?.data?.content || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[110]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-[120] overflow-hidden border border-stone-100"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-linear-to-r from-stone-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900 leading-tight uppercase tracking-tight">
                    Ví Voucher của bạn
                  </h3>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-0.5">
                    Chọn mã để được giảm giá ngay
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="max-h-[60vh] overflow-y-auto p-6 custom-scrollbar">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                    Đang tải ví voucher...
                  </p>
                </div>
              ) : vouchers.length === 0 ? (
                <div className="py-16 flex flex-col items-center justify-center text-center px-8">
                  <div className="w-16 h-16 bg-stone-50 rounded-xl flex items-center justify-center mb-4">
                    <Ticket className="w-8 h-8 text-stone-200" />
                  </div>
                  <h4 className="text-stone-900 font-black uppercase tracking-tight">
                    Ví của bạn đang trống
                  </h4>
                  <p className="text-stone-400 text-xs font-medium mt-2 leading-relaxed">
                    Hãy dạo quanh trang chủ để lưu những mã giảm giá cực hời từ OCOP nhé!
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-6 border-stone-200 text-stone-600"
                    onClick={onClose}
                  >
                    ĐÃ HIỂU
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {vouchers.map((v) => {
                    const isSelected = currentCode === v.code;
                    return (
                      <div
                        key={v.savedId}
                        className={cn(
                          'flex bg-white border rounded-xl overflow-hidden transition-all duration-300 relative group',
                          isSelected
                            ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-lg shadow-emerald-500/10'
                            : 'border-stone-100 hover:border-stone-200 hover:shadow-md',
                        )}
                      >
                        {/* Left part */}
                        <div
                          className={cn(
                            'w-24 shrink-0 flex flex-col items-center justify-center text-white relative border-r border-dashed border-white/30',
                            isSelected
                              ? 'bg-emerald-500'
                              : 'bg-stone-400 group-hover:bg-emerald-400',
                          )}
                        >
                          <span className="text-xl font-black">
                            {v.type === 'PERCENT' ? `${v.discountValue}%` : 'VND'}
                          </span>
                          <span className="text-[8px] font-black uppercase tracking-tighter opacity-80">
                            GIẢM GIÁ
                          </span>
                          {/* Circles */}
                          <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white rounded-full" />
                          <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white rounded-full" />
                        </div>

                        {/* Right part */}
                        <div className="flex-1 p-4 flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-black border border-emerald-100 uppercase tracking-wider">
                                {v.code}
                              </span>
                              {isSelected && (
                                <CheckCircle2
                                  size={14}
                                  className="text-emerald-500 animate-in zoom-in duration-300"
                                />
                              )}
                            </div>
                            <h4 className="text-sm font-black text-stone-900 leading-tight truncate">
                              {v.name}
                            </h4>
                            <p className="text-[10px] text-stone-500 font-medium">
                              Đơn tối thiểu: {formatCurrencyVND(v.minOrderValue)}
                            </p>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-[9px] text-stone-400 font-medium">
                              HSD: {new Date(v.expiredAt).toLocaleDateString('vi-VN')}
                            </p>
                            <Button
                              size="sm"
                              variant={isSelected ? 'outline' : 'primary'}
                              className="h-8 rounded-xl px-4 text-[10px] uppercase font-black tracking-widest"
                              onClick={() => {
                                onSelect(v.code);
                                onClose();
                              }}
                            >
                              {isSelected ? 'ĐANG DÙNG' : 'DÙNG NGAY'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 bg-stone-50 border-t border-stone-100">
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest text-center">
                Hệ thống sẽ tự động áp dụng mã có giá trị cao nhất
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
