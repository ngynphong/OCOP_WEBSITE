'use client';

import React from 'react';
import { FiEye } from 'react-icons/fi';
import { formatCurrencyVND } from '@/utils/format';
import { IAdminRefundListItem, IAdminRefundParams, IRefundApproveReq } from '../types/adminTypes';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/AppButton';

interface AdminRefundTableProps {
  refunds: IAdminRefundListItem[];
  isLoading: boolean;
  totalPage: number;
  totalElement: number;
  params: IAdminRefundParams;
  setParams: (params: IAdminRefundParams) => void;
  onApproveRefund?: (data: { refundId: number; data: IRefundApproveReq }) => Promise<unknown>;
  isApproving?: boolean;
}

const statusMap: Record<string, { label: string; color: string }> = {
  REQUESTED: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-600' },
  PENDING: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-600' },
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
  onApproveRefund,
  isApproving,
}: AdminRefundTableProps) => {
  const [selectedRefund, setSelectedRefund] = React.useState<IAdminRefundListItem | null>(null);
  const [actionType, setActionType] = React.useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [note, setNote] = React.useState('');
  const [refundAmount, setRefundAmount] = React.useState<number | ''>('');
  const [rejectReason, setRejectReason] = React.useState('');

  const handleProcess = async () => {
    if (!selectedRefund || !onApproveRefund) return;

    await onApproveRefund({
      refundId: selectedRefund.refundId,
      data: {
        action: actionType,
        note,
        refundAmount:
          actionType === 'APPROVE' && refundAmount !== '' ? Number(refundAmount) : undefined,
        rejectReason: actionType === 'REJECT' ? rejectReason : undefined,
      },
    });

    setSelectedRefund(null);
    setNote('');
    setRefundAmount('');
    setRejectReason('');
  };
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
                    {refund.status === 'REQUESTED' || refund.status === 'PENDING' ? (
                      <button
                        onClick={() => setSelectedRefund(refund)}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Xử lý
                      </button>
                    ) : (
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-stone-400 shadow-sm border border-transparent hover:border-stone-100">
                        <FiEye size={18} />
                      </button>
                    )}
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

      {/* Modal */}
      {selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-xl font-black text-[#00490E] mb-2">Xử lý yêu cầu hoàn tiền</h3>
            <p className="text-sm text-stone-500 mb-6">
              Yêu cầu #{selectedRefund.refundId} - Số tiền:{' '}
              <span className="font-bold text-rose-600">
                {formatCurrencyVND(selectedRefund.amount)}
              </span>
            </p>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActionType('APPROVE')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                Đồng ý hoàn tiền
              </button>
              <button
                onClick={() => setActionType('REJECT')}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  actionType === 'REJECT'
                    ? 'bg-red-100 text-red-700 ring-2 ring-red-500/20'
                    : 'bg-stone-50 text-stone-500 hover:bg-stone-100'
                }`}
              >
                Từ chối
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                  Ghi chú nội bộ
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Ghi chú về quyết định này..."
                  rows={2}
                />
              </div>

              {actionType === 'APPROVE' ? (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                    Số tiền thực hoàn
                  </label>
                  <input
                    type="text"
                    value={refundAmount !== '' ? formatCurrencyVND(refundAmount) : ''}
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, '');
                      setRefundAmount(rawValue ? Number(rawValue) : '');
                    }}
                    className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder={`Gợi ý: ${formatCurrencyVND(selectedRefund.amount)}`}
                  />
                  <p className="text-[10px] text-stone-400 mt-1.5 ml-1">
                    Bỏ trống để hoàn toàn bộ số tiền yêu cầu
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                    Lý do từ chối
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full bg-stone-50 border text-gray-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                    placeholder="Lý do từ chối để thông báo cho khách hàng..."
                    rows={2}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRefund(null);
                  setNote('');
                  setRefundAmount('');
                  setRejectReason('');
                }}
                className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold text-sm transition-colors"
              >
                Hủy
              </Button>
              <Button
                onClick={handleProcess}
                disabled={isApproving}
                className={`flex-1 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-white ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50`}
              >
                {isApproving ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
