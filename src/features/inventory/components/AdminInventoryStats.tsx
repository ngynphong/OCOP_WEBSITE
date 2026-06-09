import React from 'react';
import { motion } from 'framer-motion';
import { FiBox, FiAlertTriangle, FiXCircle } from 'react-icons/fi';

interface AdminInventoryStatsProps {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  isLoading?: boolean;
}

export const AdminInventoryStats = ({
  totalItems,
  lowStockCount,
  outOfStockCount,
  isLoading,
}: AdminInventoryStatsProps) => {
  const stats = [
    {
      label: 'Tổng số mặt hàng',
      value: totalItems,
      icon: FiBox,
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'border-blue-100',
    },
    {
      label: 'Cảnh báo kho thấp',
      value: lowStockCount,
      icon: FiAlertTriangle,
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'border-amber-100',
    },
    {
      label: 'Đã hết hàng',
      value: outOfStockCount,
      icon: FiXCircle,
      color: 'bg-red-50 text-red-600',
      borderColor: 'border-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={`bg-white p-6 rounded-xl border ${stat.borderColor} shadow-sm flex items-center gap-5`}
        >
          <div
            className={`w-14 h-14 rounded-xl ${stat.color} flex items-center justify-center text-2xl shrink-0 shadow-sm`}
          >
            <stat.icon />
          </div>
          <div>
            <p className="text-stone-500 text-xs font-bold uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            {isLoading ? (
              <div className="h-8 w-16 bg-stone-100 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-black text-stone-900 leading-none">
                {stat.value.toLocaleString()}
              </p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
