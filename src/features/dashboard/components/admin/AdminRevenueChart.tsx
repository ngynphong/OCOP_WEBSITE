import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { IAdminDashboardChartData } from '@/features/dashboard/types/dashboard';

interface AdminRevenueChartProps {
  revenueChart: IAdminDashboardChartData[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export const AdminRevenueChart = ({ revenueChart }: AdminRevenueChartProps) => {
  return (
    <div className="col-span-12 lg:col-span-8 bg-white p-8 rounded-xl shadow-sm border border-stone-100 overflow-hidden relative group">
      <div className="flex justify-between items-center mb-8">
        <h4 className="text-lg font-black text-stone-900 tracking-tight">
          Xu hướng Doanh thu & Tăng trưởng
        </h4>
        <div className="flex gap-4">
          <span className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Doanh thu
          </span>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={revenueChart}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#a8a29e' }}
              tickFormatter={(val) => {
                try {
                  return format(new Date(val), 'dd/MM');
                } catch {
                  return val;
                }
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: '#a8a29e' }}
              tickFormatter={(val) => {
                if (val >= 1000000) return `${val / 1000000}M`;
                return val;
              }}
            />
            <Tooltip
              formatter={(value) => [formatCurrency(Number(value as number) || 0), 'Doanh thu']}
              labelFormatter={(label) => {
                try {
                  return format(new Date(label), 'dd/MM/yyyy');
                } catch {
                  return label;
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
              dataKey="revenue"
              stroke="#10b981"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
