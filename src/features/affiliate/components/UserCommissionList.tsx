import React, { useState } from 'react';
import { CommissionStatus } from '../types/affiliateTypes';
import { useUserCommissions } from '../hooks/useAffiliate';
import { formatCurrencyVND, formatDate } from '@/utils/format';
import { cn } from '@/lib/utils';
import { FiClock, FiCheckCircle, FiXCircle, FiDollarSign } from 'react-icons/fi';
import type { IconType } from 'react-icons';

const statusConfig: Record<CommissionStatus, { label: string; color: string; icon: IconType }> = {
  PENDING: {
    label: 'Chờ duyệt',
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    icon: FiClock,
  },
  APPROVED: {
    label: 'Đã duyệt',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    icon: FiCheckCircle,
  },
  PAID: {
    label: 'Đã thanh toán',
    color: 'text-purple-600 bg-purple-50 border-purple-100',
    icon: FiDollarSign,
  },
  CANCELLED: { label: 'Đã hủy', color: 'text-red-600 bg-red-50 border-red-100', icon: FiXCircle },
};

export const UserCommissionList: React.FC = () => {
  const [status, setStatus] = useState<CommissionStatus | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { commissions, pagination, isLoadingCommissions } = useUserCommissions({
    pageNo: page,
    pageSize: 10,
    status,
  });

  const tabs: { label: string; value: CommissionStatus | undefined }[] = [
    { label: 'Tất cả', value: undefined },
    { label: 'Chờ duyệt', value: 'PENDING' },
    { label: 'Đã duyệt', value: 'APPROVED' },
    { label: 'Đã thanh toán', value: 'PAID' },
    { label: 'Đã hủy', value: 'CANCELLED' },
  ];

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
      <div className="p-6 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-stone-900">Lịch sử Hoa hồng</h3>

        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatus(tab.value);
                setPage(1);
              }}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap',
                status === tab.value
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-stone-500 hover:text-stone-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar">
        <table className="w-full text-left min-w-[800px] md:min-w-full">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                Mã đơn hàng
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                Giá trị đơn
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                Tỉ lệ %
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                Tiền hoa hồng
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                Trạng thái
              </th>
              <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                Thời gian
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoadingCommissions ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-4 bg-stone-100 rounded w-full"></div>
                  </td>
                </tr>
              ))
            ) : commissions.length > 0 ? (
              commissions.map((item) => {
                const config = statusConfig[item.status];
                return (
                  <tr key={item.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <span className="font-mono text-xs md:text-sm font-bold text-stone-600">
                        {item.orderCode}
                      </span>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-stone-900 whitespace-nowrap">
                      {formatCurrencyVND(item.orderAmount)}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-medium text-stone-600 whitespace-nowrap">
                      {item.commissionRate}%
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-emerald-600 whitespace-nowrap">
                      {formatCurrencyVND(item.commissionAmount)}
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                      <div
                        className={cn(
                          'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-bold border',
                          config.color,
                        )}
                      >
                        <config.icon size={12} />
                        {config.label}
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm text-stone-500 whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-stone-400 font-medium">
                  Không tìm thấy lịch sử hoa hồng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="p-6 border-t border-stone-100 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Trang {pagination.page + 1} / {pagination.totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-sm font-bold disabled:opacity-50"
            >
              Trước
            </button>
            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-sm font-bold disabled:opacity-50"
            >
              Sau
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
