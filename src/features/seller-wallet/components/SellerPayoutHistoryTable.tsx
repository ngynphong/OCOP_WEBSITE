'use client';

import React, { useState } from 'react';
import { Wallet, Calendar, CheckCircle2, Clock } from 'lucide-react';
import { IPayoutItem } from '@/features/seller-orders/types/sellerOrderTypes';
import { Pagination } from '@/components/ui/Pagination';

interface Props {
  payouts: IPayoutItem[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const SellerPayoutHistoryTable: React.FC<Props> = ({
  payouts,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalElements,
  onPageChange,
  onPageSizeChange,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const formatVnd = (amount?: number) => {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      return `${d}/${m}/${y}`;
    }
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/60">
            <CheckCircle2 className="w-3 h-3" /> Đã chuyển khoản
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-100/80 text-blue-800 border border-blue-200/60">
            <Clock className="w-3 h-3" /> Đã duyệt - Chờ chuyển
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100/80 text-amber-800 border border-amber-200/60">
            <Clock className="w-3 h-3" /> Chờ đến hạn
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-100/80 text-rose-800 border border-rose-200/60">
            Đã từ chối
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  // Filter payouts based on filterStatus
  const filteredPayouts =
    filterStatus === 'ALL' ? payouts : payouts.filter((p) => p.status === filterStatus);

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Filter */}
      <div className="p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Lịch Sử Các Kỳ Đối Soát & Quyết Toán
            </h3>
            <p className="text-xs text-gray-500">Chi tiết đối soát 2 kỳ mỗi tháng (T+3)</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { key: 'ALL', label: 'Tất cả' },
            { key: 'PAID', label: 'Đã chuyển tiền' },
            { key: 'APPROVED', label: 'Đã duyệt' },
            { key: 'PENDING', label: 'Chờ đến hạn' },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterStatus(tab.key)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                filterStatus === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Content */}
      {!filteredPayouts.length ? (
        <div className="py-16 px-4 text-center flex flex-col items-center justify-center">
          <div className="p-4 rounded-3xl bg-gray-50 text-gray-400 mb-3">
            <Wallet className="w-10 h-10" />
          </div>
          {filterStatus !== 'ALL' ? (
            <>
              <h4 className="text-sm font-bold text-gray-800">
                Không tìm thấy kỳ quyết toán nào ở trạng thái này
              </h4>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                Trang hiện tại không có bản ghi phù hợp với bộ lọc đã chọn. Hãy thử chuyển trang
                hoặc đặt lại bộ lọc.
              </p>
              <button
                type="button"
                onClick={() => setFilterStatus('ALL')}
                className="mt-3.5 px-4 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Xem tất cả kỳ quyết toán
              </button>
            </>
          ) : (
            <>
              <h4 className="text-sm font-bold text-gray-800">Chưa có dữ liệu kỳ quyết toán nào</h4>
              <p className="text-xs text-gray-500 max-w-sm mt-1 leading-relaxed">
                Hệ thống sẽ tự động tổng hợp đơn hàng hoàn tất và tạo kỳ quyết toán vào ngày 15 và
                ngày cuối cùng của tháng.
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                <th className="py-3.5 px-5">Kỳ quyết toán</th>
                <th className="py-3.5 px-4">Doanh thu gộp</th>
                <th className="py-3.5 px-4">Chiết khấu sàn OCOP</th>
                <th className="py-3.5 px-4">Hoàn/Hủy</th>
                <th className="py-3.5 px-4">Thực nhận (Net)</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-5">Mã đối soát / Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayouts.map((p) => (
                <tr key={p.id} className="hover:bg-emerald-50/20 transition-colors">
                  <td className="py-4 px-5">
                    <div className="font-bold text-gray-900">
                      {p.periodStart} &rarr; {p.periodEnd}
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Giải ngân: {p.scheduledPayoutDate}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-bold text-gray-800">{formatVnd(p.grossRevenue)}</td>

                  <td className="py-4 px-4 text-rose-600 font-medium">
                    -{formatVnd(p.commissionFee)}
                    {p.cashbackAmount > 0 && (
                      <span className="block text-[10px] text-emerald-600 font-bold">
                        +{formatVnd(p.cashbackAmount)} hoàn phí
                      </span>
                    )}
                  </td>

                  <td className="py-4 px-4 text-gray-500">
                    {p.refundDeducted > 0 ? (
                      <span className="text-amber-600 font-medium">
                        -{formatVnd(p.refundDeducted)}
                      </span>
                    ) : (
                      '0 ₫'
                    )}
                  </td>

                  <td className="py-4 px-4 font-black text-emerald-600 text-sm">
                    {formatVnd(p.netPayout)}
                  </td>

                  <td className="py-4 px-4">{getStatusBadge(p.status)}</td>

                  <td className="py-4 px-5 text-gray-500">
                    {p.paymentRef ? (
                      <div className="font-mono text-[11px] text-gray-700 bg-gray-100 px-2 py-0.5 rounded w-fit">
                        {p.paymentRef}
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">Tự động quyết toán</span>
                    )}
                    {p.paidAt && (
                      <span className="block text-[10px] text-gray-400 mt-0.5">
                        Ngày chi: {formatDate(p.paidAt)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {onPageChange && (totalElements !== undefined ? totalElements > 0 : payouts.length > 0) && (
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalElements={totalElements}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
};
