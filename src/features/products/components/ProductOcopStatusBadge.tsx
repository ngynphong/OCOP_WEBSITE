'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/features/products/types/productTypes';
import {
  FiAward,
  FiClock,
  FiAlertCircle,
  FiCheckCircle,
  FiPlus,
  FiArrowRight,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';

export interface ProductOcopStatusBadgeProps {
  product: Product;
  onClick?: () => void;
  showAction?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export function ProductOcopStatusBadge({
  product,
  onClick,
  showAction = true,
  className,
  size = 'sm',
}: ProductOcopStatusBadgeProps) {
  const cert = product.certification;
  const stars = cert?.starLevel || product.ocopStar || 0;

  // 1. ĐÃ ĐƯỢC CHỨNG NHẬN VÀ CÒN HIỆU LỰC
  if (cert?.status === 'ACTIVE') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold transition-all',
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-2xs',
          onClick && 'cursor-pointer hover:bg-emerald-100/70',
          className,
        )}
        title={`Chứng nhận OCOP ${stars} sao chính thức`}
      >
        <FiAward
          className="text-amber-500 fill-amber-400 shrink-0"
          size={size === 'sm' ? 14 : 16}
        />
        <span>OCOP {stars}★ Đã duyệt</span>
        <FiCheckCircle size={12} className="text-emerald-600 ml-0.5 shrink-0" />
      </div>
    );
  }

  // 2. ĐANG CHỜ DUYỆT HỒ SƠ
  if (cert?.status === 'PENDING_APPROVAL') {
    return (
      <div
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold transition-all',
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs animate-pulse',
          onClick && 'cursor-pointer hover:bg-amber-100',
          className,
        )}
        title="Hồ sơ OCOP đang được ban quản lý thẩm định"
      >
        <FiClock className="text-amber-600 shrink-0" size={size === 'sm' ? 13 : 15} />
        <span>OCOP: Đang thẩm định</span>
      </div>
    );
  }

  // 3. HỒ SƠ BỊ TỪ CHỐI
  if (cert?.status === 'REJECTED') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold transition-all',
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-red-50 text-red-700 border border-red-200 shadow-2xs',
          className,
        )}
        title="Hồ sơ OCOP bị từ chối - Bấm để nộp lại"
      >
        <FiAlertCircle className="text-red-500 shrink-0" size={size === 'sm' ? 13 : 15} />
        <span>OCOP bị từ chối</span>
        {showAction && (
          <Link
            href={`/dashboard/san-pham/${product.id}?tab=info`}
            onClick={(e) => e.stopPropagation()}
            className="ml-1 inline-flex items-center gap-0.5 px-2 py-0.2 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
          >
            Nộp lại
            <FiArrowRight size={10} />
          </Link>
        )}
      </div>
    );
  }

  // 4. CHỨNG NHẬN HẾT HẠN
  if (cert?.status === 'EXPIRED') {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold transition-all',
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-stone-100 text-stone-600 border border-stone-200',
          className,
        )}
      >
        <FiAlertCircle className="text-stone-400 shrink-0" size={size === 'sm' ? 13 : 15} />
        <span>OCOP: Hết hạn</span>
        {showAction && (
          <Link
            href={`/dashboard/san-pham/${product.id}?tab=info`}
            onClick={(e) => e.stopPropagation()}
            className="ml-1 text-[11px] underline font-bold text-stone-700 hover:text-emerald-700"
          >
            Gia hạn
          </Link>
        )}
      </div>
    );
  }

  // 5. CÓ SAO OCOP CŨ NHƯNG CHƯA NỘP HỒ SƠ SỐ HÓA
  if (stars > 0) {
    return (
      <div
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-bold transition-all',
          size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
          'bg-amber-50/70 text-amber-800 border border-amber-200/80 shadow-2xs',
          className,
        )}
        title="Sản phẩm có sao OCOP nhưng chưa nộp hồ sơ chứng nhận số hóa"
      >
        <FiAward className="text-amber-500 shrink-0" size={size === 'sm' ? 13 : 15} />
        <span>OCOP {stars}★</span>
        {showAction && (
          <Link
            href={`/dashboard/san-pham/${product.id}?tab=info`}
            onClick={(e) => e.stopPropagation()}
            className="ml-1 inline-flex items-center gap-0.5 px-2 py-0.2 bg-amber-600 hover:bg-amber-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
          >
            Bổ sung
            <FiArrowRight size={10} />
          </Link>
        )}
      </div>
    );
  }

  // 6. CHƯA CÓ CHỨNG NHẬN OCOP
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-semibold transition-all',
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        'bg-stone-100/80 text-stone-500 border border-dashed border-stone-300',
        className,
      )}
      title="Sản phẩm chưa có hồ sơ chứng nhận OCOP"
    >
      <FiAward className="text-stone-400 shrink-0" size={size === 'sm' ? 13 : 15} />
      <span>Chưa bổ sung OCOP</span>
      {showAction && (
        <Link
          href={`/dashboard/san-pham/${product.id}?tab=info`}
          onClick={(e) => e.stopPropagation()}
          className="ml-1 inline-flex items-center gap-0.5 px-2 py-0.2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer"
        >
          <FiPlus size={10} />
          Bổ sung
        </Link>
      )}
    </div>
  );
}
