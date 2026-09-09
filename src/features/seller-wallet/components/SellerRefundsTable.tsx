'use client';

import React from 'react';
import { RotateCcw, CheckCircle2 } from 'lucide-react';
import { IRefundItem } from '@/features/seller-orders/types/sellerOrderTypes';
import { Pagination } from '@/components/ui/Pagination';

interface Props {
  refunds: IRefundItem[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
  totalElements?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export const SellerRefundsTable: React.FC<Props> = ({
  refunds,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalElements,
  onPageChange,
  onPageSizeChange,
}) => {
  const formatVnd = (amount?: number) => {
    if (amount == null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3 h-3" /> Đã hoàn tiền
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-gray-100 text-gray-700">
            Từ chối
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800">
            Đang xử lý
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm space-y-3">
        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse" />
        <div className="h-16 bg-gray-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">
              Chi Tiết Đơn Hàng Hoàn Trả & Khấu Trừ
            </h3>
            <p className="text-xs text-gray-500">
              Các khoản bồi hoàn hoặc trả hàng phát sinh trong kỳ
            </p>
          </div>
        </div>
      </div>

      {!refunds.length ? (
        <div className="py-12 px-4 text-center flex flex-col items-center justify-center">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600 mb-2">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h4 className="text-sm font-bold text-gray-800">Không có phát sinh hoàn tiền nào</h4>
          <p className="text-xs text-gray-500 max-w-sm mt-0.5">
            Cửa hàng của bạn đang vận hành rất tốt mà không có đơn hàng nào bị cấn trừ hoặc khiếu
            nại hoàn trả.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-gray-50/70 text-gray-500 font-bold border-b border-gray-100">
                <th className="py-3.5 px-5">Mã hoàn tiền</th>
                <th className="py-3.5 px-4">Số tiền cấn trừ</th>
                <th className="py-3.5 px-4">Thời gian xử lý</th>
                <th className="py-3.5 px-4">Trạng thái</th>
                <th className="py-3.5 px-5">Lý do hoàn trả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {refunds.map((r) => (
                <tr key={r.refundId} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-5 font-bold text-gray-800">#{r.refundId}</td>
                  <td className="py-3.5 px-4 font-bold text-rose-600">-{formatVnd(r.amount)}</td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {r.estimatedProcessDays} ngày làm việc
                  </td>
                  <td className="py-3.5 px-4">{getStatusBadge(r.status)}</td>
                  <td className="py-3.5 px-5 text-gray-600 max-w-xs truncate" title={r.message}>
                    {r.message || 'Theo yêu cầu người mua'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {onPageChange && (totalElements !== undefined ? totalElements > 0 : refunds.length > 0) && (
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
