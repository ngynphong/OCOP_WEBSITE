import React from 'react';
import { TLotStatus } from '../types/supplyChainTypes';
import { cn } from '@/lib/utils';

interface LotStatusBadgeProps {
  status: TLotStatus;
  className?: string;
}

const statusConfig: Record<TLotStatus, { label: string; color: string }> = {
  DRAFT: { label: 'Bản nháp', color: 'bg-stone-50 text-stone-500 border-stone-200' },
  ACTIVE: { label: 'Hoạt động', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  SOLD_OUT: { label: 'Hết hàng', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  EXPIRED: { label: 'Hết hạn', color: 'bg-red-50 text-red-600 border-red-100' },
  SUSPENDED: { label: 'Tạm ngưng', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  RECALLED: { label: 'Đã thu hồi', color: 'bg-red-100 text-red-700 border-red-200' },
  ARCHIVED: { label: 'Lưu trữ', color: 'bg-stone-200 text-stone-700 border-stone-300' },
  CREATED: { label: 'Đã tạo', color: 'bg-stone-100 text-stone-600 border-stone-200' },
  PRODUCTION_STARTED: { label: 'Đang sản xuất', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  PROCESSING: { label: 'Đang chế biến', color: 'bg-orange-50 text-orange-600 border-orange-100' },
  STORAGE: { label: 'Đang lưu kho', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  IN_TRANSIT: { label: 'Đang vận chuyển', color: 'bg-amber-50 text-amber-600 border-amber-100' },
  DISTRIBUTED: {
    label: 'Đã phân phối',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  CANCELLED: { label: 'Đã huỷ', color: 'bg-red-50 text-red-600 border-red-100' },
};

export const LotStatusBadge = ({ status, className }: LotStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.CREATED;

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-all duration-300',
        config.color,
        className,
      )}
    >
      {config.label}
    </span>
  );
};
