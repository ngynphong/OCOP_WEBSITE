import React from 'react';
import { motion } from 'framer-motion';
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingBag,
  FiArrowUpRight,
  FiArrowDownRight,
} from 'react-icons/fi';
import { IAdminDashboardKpiStats } from '@/features/dashboard/types/dashboard';

interface AdminKPIStatsProps {
  kpiStats: IAdminDashboardKpiStats;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

export const AdminKPIStats = ({ kpiStats }: AdminKPIStatsProps) => {
  const KPI_CARDS = [
    {
      label: 'Doanh thu tháng',
      value: formatCurrency(kpiStats.monthlyRevenue.value),
      trend: kpiStats.monthlyRevenue.trend,
      icon: FiTrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Nhà bán hàng',
      value: formatNumber(kpiStats.totalSellers.value),
      trend: kpiStats.totalSellers.trend,
      icon: FiUsers,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Tổng người mua',
      value: formatNumber(kpiStats.totalBuyers.value),
      trend: kpiStats.totalBuyers.trend,
      icon: FiShoppingBag,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {KPI_CARDS.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 relative group overflow-hidden"
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-full -mr-8 -mt-8 opacity-50 group-hover:scale-110 transition-transform duration-500`}
          />
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-3 relative z-10">
            {stat.label}
          </p>
          <h3 className="text-2xl font-black text-stone-900 mb-3 relative z-10">{stat.value}</h3>
          <div className="flex items-center gap-1.5 relative z-10">
            <span
              className={`flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full ${
                stat.trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
              }`}
            >
              {stat.trend >= 0 ? `+${stat.trend}%` : `${stat.trend}%`}{' '}
              {stat.trend >= 0 ? <FiArrowUpRight /> : <FiArrowDownRight />}
            </span>
            <span className="text-[10px] font-bold text-stone-400 italic">so với tháng trước</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
