'use client';

import React from 'react';
import { DollarSign, ShoppingBag, Users, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { GrowthKpis } from '../types';

interface Props {
  kpis?: GrowthKpis;
  isLoading?: boolean;
}

export const GrowthKpiCards: React.FC<Props> = ({ kpis, isLoading = false }) => {
  const formatVnd = (amount?: number) => {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const renderGrowthRate = (rate?: number) => {
    if (rate == null) return null;
    const isPositive = rate >= 0;
    return (
      <span
        className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
        }`}
      >
        {isPositive ? (
          <TrendingUp className="w-3 h-3 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 mr-1" />
        )}
        {isPositive ? `+${rate}%` : `${rate}%`}
        <span className="text-[11px] font-normal text-gray-500 ml-1">so với tháng trước</span>
      </span>
    );
  };

  const cards = [
    {
      title: 'Doanh thu tháng này',
      value: formatVnd(kpis?.monthlyRevenue),
      subtext: renderGrowthRate(kpis?.revenueGrowthRate),
      icon: DollarSign,
      iconColor: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Đơn hàng hoàn tất',
      value: kpis?.monthlyOrders ?? 0,
      subtext: renderGrowthRate(kpis?.ordersGrowthRate),
      icon: ShoppingBag,
      iconColor: 'text-blue-600 bg-blue-50',
    },
    {
      title: 'Khách hàng mới',
      value: kpis?.newCustomers ?? 0,
      subtext: <span className="text-xs text-gray-500">Khách phát sinh giao dịch</span>,
      icon: Users,
      iconColor: 'text-purple-600 bg-purple-50',
    },
    {
      title: 'Cơ hội tăng trưởng',
      value: kpis?.totalOpportunities ?? 0,
      subtext: (
        <span className="text-xs font-medium text-amber-600">
          {kpis?.highPriorityCount ?? 0} việc ưu tiên xử lý ngay
        </span>
      ),
      icon: Zap,
      iconColor: 'text-amber-600 bg-amber-50',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 rounded-xl bg-gray-100 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">{card.title}</span>
              <div className={`p-2.5 rounded-xl ${card.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="text-2xl font-bold text-gray-900 tracking-tight">{card.value}</div>
              <div className="mt-2 flex items-center">{card.subtext}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
