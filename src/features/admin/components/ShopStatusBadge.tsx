import React from 'react';
import { ShopStatus } from '../types/adminTypes';
import { cn } from '@/lib/utils';

interface ShopStatusBadgeProps {
  status: ShopStatus;
  className?: string;
}

const statusConfig: Record<ShopStatus, { label: string; className: string }> = {
  PENDING: {
    label: 'Chờ duyệt',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  ACTIVE: {
    label: 'Đang hoạt động',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  LOCKED: {
    label: 'Đã khóa',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  REJECTED: {
    label: 'Bị từ chối',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

const ShopStatusBadge = ({ status, className }: ShopStatusBadgeProps) => {
  const config = statusConfig[status] || statusConfig.PENDING;

  return (
    <span
      className={cn(
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border tracking-wider inline-flex items-center justify-center',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  );
};

export default ShopStatusBadge;
