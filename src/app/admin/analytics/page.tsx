'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PermissionGuard } from '@/components/guards/PermissionGuard';
import { PERMISSIONS } from '@/features/auth/constants/permissions';
import { usePlatformAnalytics } from '@/features/admin/hooks/useAnalytics';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { format } from 'date-fns';

const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(value);
};

const AdminAnalytics = () => {
  // Default to last 30 days
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [toDate, setToDate] = useState(() => new Date().toISOString().split('T')[0]);

  const { data, isPending, isError } = usePlatformAnalytics(fromDate, toDate);

  // Aggregates
  const totalRevenue = data?.reduce((acc, curr) => acc + curr.totalRevenue, 0) || 0;
  const totalRefunds = data?.reduce((acc, curr) => acc + curr.totalRefunded, 0) || 0;
  const newUsers = data?.reduce((acc, curr) => acc + curr.newUsers, 0) || 0;
  const newOrders = data?.reduce((acc, curr) => acc + curr.newOrders, 0) || 0;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight leading-none mb-3">
            Thống kê chuyên sâu
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Phân tích dữ liệu giao dịch, người dùng và tăng trưởng nền tảng.
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

      {isPending ? (
        <div className="space-y-8 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-24 bg-stone-100 rounded-xl w-full"></div>
            <div className="h-24 bg-stone-100 rounded-xl w-full"></div>
            <div className="h-24 bg-stone-100 rounded-xl w-full"></div>
            <div className="h-24 bg-stone-100 rounded-xl w-full"></div>
          </div>
          <div className="h-96 bg-stone-100 rounded-xl w-full"></div>
        </div>
      ) : isError ? (
        <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl">
          <p className="font-bold">Không thể tải dữ liệu Thống kê</p>
        </div>
      ) : (
        <>
          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
              <p className="text-sm text-stone-500 font-medium">Tổng Doanh thu</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{formatVND(totalRevenue)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
              <p className="text-sm text-stone-500 font-medium">Hoàn tiền</p>
              <p className="text-2xl font-bold text-red-500 mt-1">{formatVND(totalRefunds)}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
              <p className="text-sm text-stone-500 font-medium">Đơn hàng mới</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                {new Intl.NumberFormat().format(newOrders)}
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100">
              <p className="text-sm text-stone-500 font-medium">Người dùng mới</p>
              <p className="text-2xl font-bold text-emerald-900 mt-1">
                {new Intl.NumberFormat().format(newUsers)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-6">Biểu đồ Doanh thu</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 30, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="statDate"
                      tickFormatter={(val) => {
                        try {
                          return format(new Date(val), 'dd/MM');
                        } catch {
                          return val;
                        }
                      }}
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <YAxis
                      tickFormatter={(val) => {
                        if (val >= 1000000) return `${(val / 1000000).toFixed(0)}M`;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                        return val;
                      }}
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <Tooltip
                      formatter={(val) => formatVND(Number(val))}
                      labelFormatter={(val) => {
                        try {
                          return format(new Date(val as string), 'dd/MM/yyyy');
                        } catch {
                          return val;
                        }
                      }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalRevenue"
                      stroke="#10b981"
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="text-lg font-bold text-emerald-900 mb-6">Trạng thái Đơn hàng</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                      dataKey="statDate"
                      tickFormatter={(val) => {
                        try {
                          return format(new Date(val), 'dd/MM');
                        } catch {
                          return val;
                        }
                      }}
                      stroke="#9ca3af"
                      fontSize={12}
                    />
                    <YAxis stroke="#9ca3af" fontSize={12} />
                    <Tooltip
                      labelFormatter={(val) => {
                        try {
                          return format(new Date(val as string), 'dd/MM/yyyy');
                        } catch {
                          return val;
                        }
                      }}
                      contentStyle={{
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend iconType="circle" />
                    <Bar dataKey="newOrders" name="Đơn mới" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar
                      dataKey="completedOrders"
                      name="Hoàn thành"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="cancelledOrders"
                      name="Đã hủy"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AdminAnalyticsWrapper = () => (
  <PermissionGuard permissions={[PERMISSIONS.ANALYTICS_VIEW]}>
    <AdminAnalytics />
  </PermissionGuard>
);

export default AdminAnalyticsWrapper;
