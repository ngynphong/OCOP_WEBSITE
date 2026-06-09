import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { IAdminDashboardTopCategory } from '@/features/dashboard/types/dashboard';
import { Pagination } from '@/components/ui/Pagination';

interface AdminTopCategoriesTableProps {
  topCategories: IAdminDashboardTopCategory[];
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

export const AdminTopCategoriesTable = ({ topCategories }: AdminTopCategoriesTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const totalElements = topCategories.length;
  const totalPages = Math.ceil(totalElements / pageSize);

  const paginatedCategories = topCategories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
      <div className="px-8 py-6 flex justify-between items-center border-b border-stone-50 bg-stone-50/50">
        <h4 className="text-lg font-black text-stone-900 tracking-tight">
          Danh mục sản phẩm hàng đầu
        </h4>
        <button className="text-emerald-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 hover:text-emerald-700 transition-colors">
          Xem toàn bộ <FiArrowRight />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-50">
              <th className="px-8 py-5">Danh mục</th>
              <th className="px-8 py-5">Thị phần</th>
              <th className="px-8 py-5">Sản phẩm</th>
              <th className="px-8 py-5">Doanh thu (30 ngày)</th>
              <th className="px-8 py-5 text-right">Tăng trưởng</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {paginatedCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-50 transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <span className="text-sm font-black text-stone-900">{cat.name}</span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-stone-100 rounded-full max-w-[100px] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.sharePercentage}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                    <span className="text-[10px] font-black text-stone-400">
                      {cat.sharePercentage}%
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className="text-xs font-bold text-stone-600">
                    {formatNumber(cat.totalProducts)} sản phẩm
                  </span>
                </td>
                <td className="px-8 py-5">
                  <span className="text-xs font-black text-stone-900">
                    {formatCurrency(cat.revenue)}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      cat.trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
                    }`}
                  >
                    {cat.trend >= 0 ? `+${cat.trend}%` : `${cat.trend}%`}
                  </span>
                </td>
              </tr>
            ))}
            {paginatedCategories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-8 py-10 text-center text-sm text-stone-400">
                  Chưa có dữ liệu danh mục
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Container */}
      {totalElements > 0 && (
        <div className="p-6 border-t border-stone-50 bg-white">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={setCurrentPage}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </div>
      )}
    </div>
  );
};
