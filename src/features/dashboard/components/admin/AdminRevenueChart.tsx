import React from 'react';
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { IAdminDashboardChartData } from '@/features/dashboard/types/dashboard';

interface AdminRevenueChartProps {
  revenueChart: IAdminDashboardChartData[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

const compactCurrency = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)} tỷ`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(0)} tr`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`;
  return value.toString();
};

export const AdminRevenueChart = ({ revenueChart }: AdminRevenueChartProps) => (
  <section className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-6">
    <div className="mb-6">
      <h3 className="text-lg font-black tracking-tight text-stone-900">
        Doanh thu và đơn hoàn tất
      </h3>
      <p className="mt-1 text-sm text-stone-500">Diễn biến theo từng ngày trong khoảng đã chọn.</p>
    </div>

    {revenueChart.length === 0 ? (
      <div className="flex h-72 items-center justify-center rounded-xl bg-stone-50 text-sm text-stone-400">
        Chưa có dữ liệu giao dịch trong khoảng thời gian này
      </div>
    ) : (
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={revenueChart} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="adminRevenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.26} />
                <stop offset="95%" stopColor="#059669" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e7e5e4" />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              minTickGap={24}
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
            />
            <YAxis
              yAxisId="revenue"
              axisLine={false}
              tickLine={false}
              width={54}
              tick={{ fontSize: 11, fill: '#78716c' }}
              tickFormatter={compactCurrency}
            />
            <YAxis
              yAxisId="orders"
              orientation="right"
              axisLine={false}
              tickLine={false}
              width={30}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#78716c' }}
            />
            <Tooltip
              labelFormatter={(label) => format(new Date(label), 'dd MMMM yyyy', { locale: vi })}
              formatter={(value, name) => [
                name === 'Doanh thu'
                  ? formatCurrency(Number(value) || 0)
                  : `${Number(value).toLocaleString('vi-VN')} đơn`,
                name,
              ]}
              contentStyle={{
                borderRadius: '14px',
                border: '1px solid #e7e5e4',
                boxShadow: '0 10px 30px -15px rgb(28 25 23 / 0.35)',
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            <Area
              yAxisId="revenue"
              type="monotone"
              dataKey="revenue"
              name="Doanh thu"
              stroke="#059669"
              strokeWidth={2.5}
              fill="url(#adminRevenueFill)"
            />
            <Line
              yAxisId="orders"
              type="monotone"
              dataKey="orders"
              name="Đơn hoàn tất"
              stroke="#0284c7"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )}
  </section>
);
