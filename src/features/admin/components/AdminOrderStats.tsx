'use client';

import React from 'react';
import { FiShoppingBag, FiDollarSign, FiTrendingUp, FiClock, FiPercent } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { formatCurrencyVND } from '@/utils/format';
import { IAdminDashboardRes } from '../types/adminTypes';

interface AdminOrderStatsProps {
  data?: IAdminDashboardRes;
  isLoading: boolean;
}

const StatCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  isCurrency = false,
}: {
  title: string;
  value: number;
  subValue?: string;
  icon: IconType;
  color: string;
  isCurrency?: boolean;
}) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 flex flex-col justify-between hover:shadow-md transition-all">
    <div className={`p-3 rounded-xl ${color} w-fit mb-4`}>
      <Icon className="text-white text-xl" />
    </div>
    <div>
      <p className="text-2xl md:text-3xl font-black text-stone-900 tracking-tighter">
        {isCurrency ? formatCurrencyVND(value) : value.toLocaleString()}
      </p>
      <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">
        {title}
      </p>
      {subValue && <p className="text-[10px] text-stone-500 font-bold mt-2">{subValue}</p>}
    </div>
  </div>
);

export const AdminOrderStats = ({ data, isLoading }: AdminOrderStatsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-40 bg-stone-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  const today = data?.today;
  const month = data?.month;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Tổng đơn hôm nay"
        value={today?.totalOrders || 0}
        subValue={`Tháng này: ${month?.totalOrders || 0}`}
        icon={FiShoppingBag}
        color="bg-blue-500"
      />
      <StatCard
        title="GMV hôm nay"
        value={today?.gmv || 0}
        subValue={`Tháng này: ${formatCurrencyVND(month?.gmv || 0)}`}
        icon={FiTrendingUp}
        color="bg-emerald-500"
        isCurrency
      />
      <StatCard
        title="Giá trị TB đơn (AOV)"
        value={today?.avgOrderValue || 0}
        icon={FiPercent}
        color="bg-amber-500"
        isCurrency
      />
      <StatCard
        title="Doanh thu hoa hồng"
        value={today?.commissionRevenue || 0}
        subValue={`Tháng này: ${formatCurrencyVND(month?.commissionRevenue || 0)}`}
        icon={FiDollarSign}
        color="bg-indigo-500"
        isCurrency
      />
      <StatCard
        title="Chờ chi trả (Payout)"
        value={today?.pendingPayout || 0}
        icon={FiClock}
        color="bg-rose-500"
        isCurrency
      />
    </div>
  );
};
