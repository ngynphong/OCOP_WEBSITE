'use client';

import React from 'react';
import { Clock, Trash2, Edit2, Power, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Voucher, SavedVoucherResponse } from '../types';
import { formatCurrencyVND } from '@/utils/format';

interface VoucherCardProps {
  voucher: Voucher | SavedVoucherResponse;
  onEdit?: (voucher: Voucher) => void;
  onDelete?: (id: number) => void;
  onToggle?: (id: number) => void;
  isActionsLoading?: boolean;
}

export function VoucherCard({
  voucher,
  onEdit,
  onDelete,
  onToggle,
  isActionsLoading,
}: VoucherCardProps) {
  const isExpired = new Date(voucher.expiredAt) < new Date();
  const isActive = voucher.status === 'ACTIVE';

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div
      className={cn(
        'group relative flex bg-white rounded-[20px] overflow-hidden border border-stone-200 transition-all duration-300 hover:shadow-xl hover:shadow-stone-200/40 min-h-[140px]',
        !isActive && 'opacity-75 grayscale-[0.3]',
        isExpired && 'border-red-100',
      )}
    >
      {/* 🎫 Left Side: Discount Indicator (The "Stub") */}
      <div
        className={cn(
          'w-32 shrink-0 flex flex-col items-center justify-center p-4 text-white relative border-r border-dashed border-white/30 transition-colors',
          isActive ? 'bg-emerald-500' : 'bg-stone-400',
          isExpired && !isActive && 'bg-red-400',
        )}
      >
        <div className="text-center">
          <span className="block text-2xl font-black tracking-tighter leading-none">
            {voucher.type === 'PERCENT'
              ? `${voucher.discountValue}%`
              : voucher.type === 'FREE_SHIPPING'
                ? 'FREE'
                : 'VND'}
          </span>
          {voucher.type === 'FIXED_AMOUNT' && (
            <span className="block text-[11px] font-black mt-1 leading-none truncate max-w-[80px]">
              {formatCurrencyVND(voucher.discountValue).replace('₫', '')}
            </span>
          )}
          <span className="block text-[9px] font-black uppercase tracking-[0.2em] mt-2 opacity-80 decoration-white/50">
            OFF
          </span>
        </div>

        {/* Decorative Ticket Circles */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-white rounded-full transition-colors group-hover:bg-stone-50" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white rounded-full transition-colors group-hover:bg-stone-50" />
      </div>

      {/* 📋 Right Side: Voucher Details (The "Body") */}
      <div className="flex-1 p-5 flex flex-col justify-between overflow-hidden">
        <div className="space-y-2">
          {/* Header & Badges */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex flex-wrap items-center gap-2 overflow-hidden">
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-emerald-100 whitespace-nowrap">
                {voucher.code}
              </span>
              {isExpired && (
                <span className="px-2 py-0.5 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase tracking-wider border border-red-100">
                  Hết hạn
                </span>
              )}
            </div>

            {/* Quick Actions Menu */}
            <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {onToggle && (
                <button
                  onClick={() => onToggle(voucher.id)}
                  disabled={isActionsLoading}
                  className={cn(
                    'p-1.5 rounded-lg transition-all',
                    isActive
                      ? 'text-emerald-500 hover:bg-emerald-50'
                      : 'text-stone-400 hover:bg-stone-50',
                  )}
                  title={isActive ? 'Tạm dừng' : 'Kích hoạt'}
                >
                  <Power size={14} />
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(voucher)}
                  disabled={isActionsLoading}
                  className="p-1.5 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                  title="Chỉnh sửa"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(voucher.id)}
                  disabled={isActionsLoading}
                  className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Xóa"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>

          <h3 className="text-base font-black text-stone-900 leading-tight truncate">
            {voucher.name}
          </h3>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5 text-stone-500">
              <ShieldCheck size={12} className="text-stone-400" />
              <span className="text-[11px] font-medium italic">
                Min {formatCurrencyVND(voucher.minOrderValue)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <Clock size={12} className="text-stone-400" />
              <span className="text-[11px] font-medium italic">
                Hạn {formatDate(voucher.expiredAt)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <span className="text-[11px] font-medium italic whitespace-nowrap">
                Giảm tối đa: {formatCurrencyVND(voucher.maxDiscount || 0)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-500">
              <span className="text-[11px] font-black italic bg-stone-100 px-1.5 py-0.5 rounded text-stone-600">
                {voucher.perUserLimit} lượt/người
              </span>
            </div>
          </div>
        </div>

        {/* Usable Status Badge (for User Wallet) */}
        {'usable' in voucher && (
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
              Trạng thái
            </span>
            {voucher.usable ? (
              <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Có thể dùng
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-[10px] font-black text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200 uppercase tracking-wider">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                Đã sử dụng
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
