'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFilter } from 'react-icons/fi';
import { useAdminDashboard } from '@/features/dashboard/hooks/useDashboard';

// Import extracted components
import { AdminKPIStats } from '@/features/dashboard/components/admin/AdminKPIStats';
import { AdminRevenueChart } from '@/features/dashboard/components/admin/AdminRevenueChart';
import { AdminSidePanel } from '@/features/dashboard/components/admin/AdminSidePanel';
import { AdminTopCategoriesTable } from '@/features/dashboard/components/admin/AdminTopCategoriesTable';

const AdminOverview = () => {
  const [isMounted, setIsMounted] = useState(false);
  const { data: dashboardData, isPending, isError } = useAdminDashboard();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  if (isPending) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 bg-stone-100 rounded-2xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-stone-100 rounded-3xl w-full"></div>
          <div className="h-40 bg-stone-100 rounded-3xl w-full"></div>
          <div className="h-40 bg-stone-100 rounded-3xl w-full"></div>
        </div>
        <div className="h-80 bg-stone-100 rounded-3xl w-full"></div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 rounded-2xl">
        <p className="font-bold">Không thể tải dữ liệu Dashboard</p>
      </div>
    );
  }

  const { kpiStats, orderOverview, revenueChart, topCategories, recentActivities } = dashboardData;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex justify-between items-end">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-3">
            Quản trị viên Tổng quan
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Giám sát tăng trưởng khu vực và chỉ số thị trường OCOP.
          </p>
        </motion.div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-stone-600 text-xs font-bold rounded-xl border border-stone-200 hover:bg-stone-50 transition-all shadow-sm">
            <FiFilter /> Lọc chế độ xem
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
            <FiDownload /> Xuất dữ liệu
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <AdminKPIStats kpiStats={kpiStats} />

      {/* Middle Section: Chart & Activity */}
      <div className="grid grid-cols-12 gap-8">
        {/* Chart Area */}
        <AdminRevenueChart revenueChart={revenueChart} />

        {/* Recent Activity */}
        <AdminSidePanel orderOverview={orderOverview} recentActivities={recentActivities} />
      </div>

      {/* Categories Table with Pagination */}
      <AdminTopCategoriesTable topCategories={topCategories} />
    </div>
  );
};

export default AdminOverview;
