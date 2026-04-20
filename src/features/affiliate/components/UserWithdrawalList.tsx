import React from 'react';
import { WithdrawalRequest } from '../types/affiliateTypes';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo } from 'react-icons/fi';
import { formatCurrencyVND } from '@/utils/format';

interface UserWithdrawalListProps {
  withdrawals: WithdrawalRequest[];
}

export const UserWithdrawalList: React.FC<UserWithdrawalListProps> = ({ withdrawals }) => {
  const getStatusBadge = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-600 text-xs font-bold ring-1 ring-stone-200">
            <FiClock size={12} /> Đang chờ
          </span>
        );
      case 'APPROVED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold ring-1 ring-emerald-200">
            <FiCheckCircle size={12} /> Đã duyệt
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-600 text-xs font-bold ring-1 ring-red-200">
            <FiXCircle size={12} /> Từ chối
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-500 text-xs font-bold ring-1 ring-stone-200">
            Đã hủy
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
      <div className="p-6 border-b border-stone-50 flex items-center justify-between">
        <h3 className="font-bold text-stone-900">Lịch sử rút tiền</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50/50">
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                Ngày yêu cầu
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                Số tiền
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                Ngân hàng
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                Ghi chú
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {withdrawals.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-stone-400">
                  Chưa có yêu cầu rút tiền nào.
                </td>
              </tr>
            ) : (
              withdrawals.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm text-stone-600">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-[10px] text-stone-400">
                      {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-stone-900">
                    {formatCurrencyVND(item.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-stone-600">{item.bankInfo}</td>
                  <td className="px-6 py-4">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-4">
                    {item.adminNote ? (
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 bg-stone-50 p-2 rounded-lg border border-stone-100 max-w-[200px]">
                        <FiInfo className="shrink-0" />
                        <span className="truncate">{item.adminNote}</span>
                      </div>
                    ) : (
                      <span className="text-stone-300">-</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
