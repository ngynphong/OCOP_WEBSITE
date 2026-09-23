'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { OrderStatusBadge } from '@/features/orders/components/OrderStatusBadge';

interface OrderDetailHeaderProps {
  orderCode: string;
  createdAt: string;
  status: string;
}

export const OrderDetailHeader: React.FC<OrderDetailHeaderProps> = ({
  orderCode,
  createdAt,
  status,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 pb-4 md:pb-6 border-b border-stone-100">
      <div className="flex items-start md:items-center gap-3 md:gap-4">
        <Link
          href="/dashboard/don-hang"
          className="w-10 h-10 mt-0.5 md:mt-0 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-100 hover:scale-105 active:scale-95 transition-all shadow-sm shrink-0"
        >
          <ChevronLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg md:text-2xl font-black text-stone-900 tracking-tight flex flex-wrap items-center gap-x-2 gap-y-1 leading-tight">
            <span>Chi tiết đơn hàng</span>
            <span className="text-stone-300 font-light hidden md:inline">#</span>
            <span className="font-extrabold tracking-widest text-xs md:text-2xl text-stone-500 md:text-stone-900 break-all bg-stone-100 md:bg-transparent px-2 py-0.5 md:p-0 rounded-md md:rounded-none">
              {orderCode}
            </span>
          </h1>
          <p className="text-[11px] md:text-xs text-stone-400 font-bold mt-1.5 md:mt-1">
            Đặt ngày {new Date(createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 pl-[52px] md:pl-0">
        <span className="text-xs font-black uppercase text-stone-400 tracking-widest hidden md:inline">
          Trạng thái:
        </span>
        <OrderStatusBadge status={status} />
      </div>
    </div>
  );
};
