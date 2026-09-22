import React from 'react';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import { IAdminDashboardTopCategory } from '@/features/dashboard/types/dashboard';

interface AdminTopCategoriesTableProps {
  topCategories: IAdminDashboardTopCategory[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);

export const AdminTopCategoriesTable = ({ topCategories }: AdminTopCategoriesTableProps) => (
  <section className="overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
    <div className="flex items-center justify-between gap-4 border-b border-stone-100 px-5 py-5 sm:px-6">
      <div>
        <h3 className="text-lg font-black tracking-tight text-stone-900">Danh mục nổi bật</h3>
        <p className="mt-1 text-sm text-stone-500">
          Top 5 danh mục theo doanh thu trong khoảng đã chọn.
        </p>
      </div>
      <Link
        href="/admin/analytics"
        className="inline-flex shrink-0 items-center gap-2 text-sm font-bold text-emerald-700 hover:text-emerald-900"
      >
        Phân tích thêm <FiArrowRight />
      </Link>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full min-w-[680px] text-left">
        <thead>
          <tr className="border-b border-stone-100 bg-stone-50/70 text-xs font-bold uppercase tracking-wide text-stone-400">
            <th className="px-6 py-4">Danh mục</th>
            <th className="px-6 py-4">Tỷ trọng</th>
            <th className="px-6 py-4">Sản phẩm</th>
            <th className="px-6 py-4">Doanh thu</th>
            <th className="px-6 py-4 text-right">So với kỳ trước</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {topCategories.map((category, index) => (
            <tr key={category.id} className="transition-colors hover:bg-stone-50/80">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-xs font-black text-emerald-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-bold text-stone-900">{category.name}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-stone-100">
                    <div
                      className="h-full rounded-full bg-emerald-500"
                      style={{ width: `${Math.min(category.sharePercentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-500">
                    {category.sharePercentage.toLocaleString('vi-VN')}%
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-semibold text-stone-600">
                {category.totalProducts.toLocaleString('vi-VN')}
              </td>
              <td className="px-6 py-4 text-sm font-bold text-stone-900">
                {formatCurrency(category.revenue)}
              </td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${
                    category.trend >= 0
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {category.trend >= 0 ? '+' : ''}
                  {category.trend.toLocaleString('vi-VN')}%
                </span>
              </td>
            </tr>
          ))}
          {topCategories.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-14 text-center text-sm text-stone-400">
                Chưa có doanh thu theo danh mục trong khoảng thời gian này
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
);
