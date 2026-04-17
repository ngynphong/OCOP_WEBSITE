'use client';

import React from 'react';
import { FiEye } from 'react-icons/fi';
import { formatCurrencyVND } from '@/utils/format';
import { IAdminRefundListItem, IAdminRefundParams } from '../types/adminTypes';
import { Pagination } from '@/components/ui/Pagination';

interface AdminRefundTableProps {
  refunds: IAdminRefundListItem[];
  isLoading: boolean;
  totalPage: number;
  totalElement: number;
  params: IAdminRefundParams;
  setParams: (params: IAdminRefundParams) => void;
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-600' },
  APPROVED: { label: 'Đã duyệt', color: 'bg-emerald-100 text-emerald-600' },
  REJECTED: { label: 'Đã từ chối', color: 'bg-red-100 text-red-600' },
  COMPLETED: { label: 'Hoàn thành', color: 'bg-green-100 text-green-600' },
};

export const AdminRefundTable = ({
  refunds,
  isLoading,
  totalPage,
  totalElement,
  params,
  setParams,
}: AdminRefundTableProps) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-stone-50 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-black text-[#00490E] uppercase tracking-wider">
            Yêu cầu Hoàn tiền
          </h3>
          <div className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-xs font-bold">
            {totalElement} yêu cầu
          </div>
        </div>

        <select
          className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2 px-4 focus:ring-2 focus:ring-emerald-500/10"
          value={params.status || ''}
          onChange={(e) => setParams({ ...params, status: e.target.value || undefined, pageNo: 1 })}
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(statusMap).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50/50 text-stone-400 text-[10px] uppercase tracking-widest font-black border-b border-stone-50">
              <th className="py-4 px-8">ID</th>
              <th className="py-4 px-8 text-right">Số tiền</th>
              <th className="py-4 px-8">Lý do/Tin nhắn</th>
              <th className="py-4 px-8 text-center">Xử lý (Ngày)</th>
              <th className="py-4 px-8 text-center">Trạng thái</th>
              <th className="py-4 px-8 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={6} className="px-8 py-6 h-20 bg-stone-50/50" />
                </tr>
              ))
            ) : refunds.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-8 py-20 text-center text-stone-400 font-bold uppercase text-xs"
                >
                  Không tìm thấy yêu cầu nào
                </td>
              </tr>
            ) : (
              refunds.map((refund) => (
                <tr key={refund.refundId} className="hover:bg-stone-50 transition-all group">
                  <td className="py-5 px-8 font-bold text-stone-900">#{refund.refundId}</td>
                  <td className="py-5 px-8 text-right font-black text-rose-600">
                    {formatCurrencyVND(refund.amount)}
                  </td>
                  <td className="py-5 px-8">
                    <div className="text-sm text-stone-600 line-clamp-1 italic max-w-xs">
                      &quot;{refund.message}&quot;
                    </div>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span className="text-xs font-bold text-stone-500">
                      {refund.estimatedProcessDays} ngày
                    </span>
                  </td>
                  <td className="py-5 px-8 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusMap[refund.status]?.color || 'bg-stone-100 text-stone-600'}`}
                    >
                      {statusMap[refund.status]?.label || refund.status}
                    </span>
                  </td>
                  <td className="py-5 px-8 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors text-rose-600 shadow-sm border border-transparent hover:border-stone-100">
                      <FiEye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-8 py-5 border-t border-stone-50 bg-stone-50/30">
        <Pagination
          currentPage={params.pageNo || 1}
          totalPages={totalPage}
          pageSize={params.pageSize}
          totalElements={totalElement}
          onPageChange={(page) => setParams({ ...params, pageNo: page })}
          onPageSizeChange={(size) => setParams({ ...params, pageSize: size, pageNo: 1 })}
        />
      </div>
    </div>
  );
};
