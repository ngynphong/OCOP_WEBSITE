'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  Landmark,
  Calendar,
  CheckCircle2,
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { GrowthWalletSummary } from '@/features/growth/types';
import { IRevenueRes } from '@/features/seller-orders/types/sellerOrderTypes';

interface Props {
  wallet?: GrowthWalletSummary;
  revenue?: IRevenueRes;
  isLoading?: boolean;
}

export const SellerWalletMetrics: React.FC<Props> = ({ wallet, revenue, isLoading = false }) => {
  const formatVnd = (amount?: number) => {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Đang cập nhật';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    }
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 rounded-3xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  const currentAccumulated = wallet?.currentPeriodAccumulated ?? wallet?.availableBalance ?? 0;
  const pendingPayout = wallet?.pendingPayout ?? 0;
  const totalPaidOut = wallet?.totalPaidOut ?? 0;
  const grossRevenue = revenue?.grossRevenue ?? 0;
  const totalOrders = revenue?.totalOrders ?? 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Số dư tích lũy kỳ này */}
      <div className="bg-emerald-50/70 border border-emerald-200/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Tích lũy kỳ này (Tạm tính)
            </span>
            <div className="p-2 rounded-xl bg-emerald-100/90 text-emerald-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-950 tracking-tight mt-1">
            {formatVnd(currentAccumulated)}
          </div>
        </div>

        <div className="pt-3 border-t border-emerald-200/60 flex items-center justify-between text-[11px] text-emerald-700">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {wallet?.currentPeriodStart && wallet?.currentPeriodEnd
                ? `${formatDate(wallet.currentPeriodStart)} - ${formatDate(wallet.currentPeriodEnd)}`
                : 'Đơn COMPLETED trong kỳ'}
            </span>
          </div>
          <span className="font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200/50">
            T+3
          </span>
        </div>
      </div>

      {/* Card 2: Đang chờ giải ngân */}
      <div className="bg-amber-50/70 border border-amber-200/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              Đang chờ giải ngân
            </span>
            <div className="p-2 rounded-xl bg-amber-100/90 text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-950 tracking-tight mt-1">
            {formatVnd(pendingPayout)}
          </div>
        </div>

        <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-700">
          <span>Kỳ kế tiếp:</span>
          <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200/50">
            {formatDate(wallet?.nextPayoutDate)}
          </span>
        </div>
      </div>

      {/* Card 3: Đã giải ngân thành công */}
      <div className="bg-blue-50/70 border border-blue-200/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              Đã giải ngân về ngân hàng
            </span>
            <div className="p-2 rounded-xl bg-blue-100/90 text-blue-700">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-950 tracking-tight mt-1">
            {formatVnd(totalPaidOut)}
          </div>
        </div>

        <div className="pt-3 border-t border-blue-200/60 flex items-center gap-1.5 text-[11px] text-blue-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Chuyển khoản VietQR tự động</span>
        </div>
      </div>

      {/* Card 4: Doanh thu gộp tháng này */}
      <div className="bg-purple-50/70 border border-purple-200/80 p-5 rounded-3xl shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">
              Doanh thu gộp (Tháng)
            </span>
            <div className="p-2 rounded-xl bg-purple-100/90 text-purple-700">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-950 tracking-tight mt-1">
            {formatVnd(grossRevenue)}
          </div>
        </div>

        <div className="pt-3 border-t border-purple-200/60 flex items-center justify-between text-[11px] text-purple-700">
          <span>{totalOrders} đơn hàng</span>
          <span className="inline-flex items-center text-purple-800 font-bold hover:underline">
            Chi tiết <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
};
