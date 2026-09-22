import React from 'react';
import Link from 'next/link';
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { IAdminDashboardOrderOverview } from '@/features/dashboard/types/dashboard';

interface AdminSidePanelProps {
  orderOverview: IAdminDashboardOrderOverview;
}

export const AdminSidePanel = ({ orderOverview }: AdminSidePanelProps) => {
  const statuses = [
    { label: 'Chờ xác nhận', value: orderOverview.pending, color: 'bg-amber-500' },
    { label: 'Đang xử lý', value: orderOverview.inProgress, color: 'bg-sky-500' },
    { label: 'Hoàn tất', value: orderOverview.completed, color: 'bg-emerald-500' },
    { label: 'Đã hủy', value: orderOverview.cancelled, color: 'bg-rose-500' },
  ];
  const total = statuses.reduce((sum, item) => sum + item.value, 0);

  return (
    <section className="flex h-full flex-col rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-black tracking-tight text-stone-900">Trạng thái đơn hàng</h3>
          <p className="mt-1 text-sm text-stone-500">Các đơn được tạo trong khoảng đã chọn.</p>
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <FiShoppingBag />
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-emerald-950 p-5 text-white">
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-200/70">
          Tổng đơn hàng
        </p>
        <p className="mt-2 text-3xl font-black">{total.toLocaleString('vi-VN')}</p>
        <div className="mt-5 flex h-2 overflow-hidden rounded-full bg-white/10">
          {statuses.map((status) => (
            <span
              key={status.label}
              className={status.color}
              style={{ width: `${total ? (status.value / total) * 100 : 0}%` }}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 flex-1 space-y-4">
        {statuses.map((status) => (
          <div key={status.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${status.color}`} />
              <span className="text-sm font-medium text-stone-600">{status.label}</span>
            </div>
            <span className="text-sm font-black text-stone-900">
              {status.value.toLocaleString('vi-VN')}
            </span>
          </div>
        ))}
      </div>

      <Link
        href="/admin/orders"
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-emerald-800 transition-colors hover:bg-emerald-50"
      >
        Quản lý đơn hàng <FiArrowRight />
      </Link>
    </section>
  );
};
