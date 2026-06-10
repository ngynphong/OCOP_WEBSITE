'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '@/features/dashboard/hooks/useDashboard';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/features/auth/constants/permissions';

import dynamic from 'next/dynamic';

// Import extracted components
import { AdminKPIStats } from '@/features/dashboard/components/admin/AdminKPIStats';
import { AdminSidePanel } from '@/features/dashboard/components/admin/AdminSidePanel';
import { AdminTopCategoriesTable } from '@/features/dashboard/components/admin/AdminTopCategoriesTable';

const AdminRevenueChart = dynamic(
  () =>
    import('@/features/dashboard/components/admin/AdminRevenueChart').then(
      (mod) => mod.AdminRevenueChart,
    ),
  { ssr: false },
);

const AdminOverview = () => {
  const [isMounted, setIsMounted] = useState(false);

  // Default to last 30 days
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data: dashboardData, isPending, isError } = useAdminDashboard();

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  if (isPending) {
    return (
      <div className="space-y-10 animate-pulse">
        <div className="h-20 bg-stone-100 rounded-xl w-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-40 bg-stone-100 rounded-xl w-full"></div>
          <div className="h-40 bg-stone-100 rounded-xl w-full"></div>
          <div className="h-40 bg-stone-100 rounded-xl w-full"></div>
        </div>
        <div className="h-80 bg-stone-100 rounded-xl w-full"></div>
      </div>
    );
  }

  if (isError || !dashboardData) {
    return (
      <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">
        <p className="font-bold">Không thể tải dữ liệu Dashboard</p>
      </div>
    );
  }

  const { kpiStats, orderOverview, revenueChart, topCategories, recentActivities } = dashboardData;

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-3">
            Quản trị viên Tổng quan
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Giám sát tăng trưởng khu vực và chỉ số thị trường OCOP.
          </p>
        </motion.div>

        {/* Date Filters */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 bg-white p-3 rounded-xl shadow-sm border border-stone-100"
        >
          <div className="flex flex-col">
            <label className="text-xs text-stone-500 font-medium ml-1">Từ ngày</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="px-3 py-1.5 text-sm text-gray-500 bg-stone-50 border-none rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
          <span className="text-stone-300 mt-4">-</span>
          <div className="flex flex-col">
            <label className="text-xs text-stone-500 font-medium ml-1">Đến ngày</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="px-3 py-1.5 text-sm text-gray-500 bg-stone-50 border-none rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </motion.div>
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

const AdminOverviewWrapper = () => (
  <PermissionGuard permissions={[PERMISSIONS.ANALYTICS_VIEW]}>
    <AdminOverview />
  </PermissionGuard>
);

export default AdminOverviewWrapper;
