'use client';

import React from 'react';
import { ProductStatus } from '@/features/products/types/productTypes';
import { cn } from '@/lib/utils';

interface ProductStatusBadgeProps {
  status: ProductStatus;
  className?: string;
}

const STATUS_CONFIG: Record<ProductStatus, { label: string; classes: string }> = {
  DRAFT: {
    label: 'Nháp',
    classes: 'bg-stone-100 text-stone-600 border-stone-200',
  },
  PENDING_REVIEW: {
    label: 'Đang chờ duyệt',
    classes: 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse',
  },
  APPROVED: {
    label: 'Đang bán',
    classes: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  REJECTED: {
    label: 'Bị từ chối',
    classes: 'bg-red-50 text-red-600 border-red-100',
  },
  DISCONTINUED: {
    label: 'Ngừng kinh doanh',
    classes: 'bg-gray-100 text-gray-500 border-gray-200',
  },
};

export function ProductStatusBadge({ status, className }: ProductStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.DRAFT;

  return (
    <span
      className={cn(
        'text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border',
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
