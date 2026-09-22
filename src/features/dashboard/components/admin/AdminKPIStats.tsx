import React from 'react';
import { motion } from 'framer-motion';
import {
  FiArrowDownRight,
  FiArrowUpRight,
  FiShoppingBag,
  FiTrendingUp,
  FiUserPlus,
  FiUsers,
} from 'react-icons/fi';
import { IAdminDashboardKpiStats } from '@/features/dashboard/types/dashboard';

interface AdminKPIStatsProps {
  kpiStats: IAdminDashboardKpiStats;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

const formatNumber = (value: number) => new Intl.NumberFormat('vi-VN').format(value);

export const AdminKPIStats = ({ kpiStats }: AdminKPIStatsProps) => {
  const cards = [
    {
      label: 'Doanh thu',
      value: formatCurrency(kpiStats.revenue.value),
      trend: kpiStats.revenue.trend,
      icon: FiTrendingUp,
      accent: 'text-emerald-700',
      iconBg: 'bg-emerald-100',
    },
    {
      label: 'Đơn hoàn tất',
      value: formatNumber(kpiStats.completedOrders.value),
      trend: kpiStats.completedOrders.trend,
      icon: FiShoppingBag,
      accent: 'text-sky-700',
      iconBg: 'bg-sky-100',
    },
    {
      label: 'Người dùng mới',
      value: formatNumber(kpiStats.newUsers.value),
      trend: kpiStats.newUsers.trend,
      icon: FiUserPlus,
      accent: 'text-violet-700',
      iconBg: 'bg-violet-100',
    },
    {
      label: 'Cửa hàng mới',
      value: formatNumber(kpiStats.newShops.value),
      trend: kpiStats.newShops.trend,
      icon: FiUsers,
      accent: 'text-amber-700',
      iconBg: 'bg-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card, index) => {
        const isUp = card.trend >= 0;
        return (
          <motion.article
            key={card.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-stone-500">{card.label}</p>
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
              >
                <card.icon className={`text-lg ${card.accent}`} />
              </span>
            </div>
            <p className="truncate text-2xl font-black tracking-tight text-stone-900">
              {card.value}
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-1 font-bold ${
                  isUp ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}
              >
                {isUp ? <FiArrowUpRight /> : <FiArrowDownRight />}
                {isUp ? '+' : ''}
                {card.trend.toLocaleString('vi-VN')}%
              </span>
              <span className="text-stone-400">so với kỳ trước</span>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};
