import React from 'react';
import { WithdrawalRequest, BankInfo } from '../types/affiliateTypes';
import { FiClock, FiCheckCircle, FiXCircle, FiInfo, FiLoader, FiZap } from 'react-icons/fi';
import { formatCurrencyVND, formatDate } from '@/utils/format';

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
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold ring-1 ring-blue-100">
            <FiCheckCircle size={12} /> Đã duyệt
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 text-xs font-bold ring-1 ring-amber-100">
            <FiLoader className="animate-spin" size={12} /> Đang xử lý
          </span>
        );
      case 'PAID':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold ring-1 ring-emerald-100">
            <FiZap size={12} /> Đã thanh toán
          </span>
        );
      case 'REJECTED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-xs font-bold ring-1 ring-red-100">
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

  const renderBankInfo = (bankInfoStr: string) => {
    try {
      const info: BankInfo = JSON.parse(bankInfoStr);
      return (
        <div className="text-xs">
          <p className="font-bold text-stone-900">{info.bankName}</p>
          <p className="text-stone-500">
            {info.accountNumber} - {info.accountName}
          </p>
        </div>
      );
    } catch {
      return <span className="text-xs text-stone-600 italic">{bankInfoStr}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
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
                  <td className="px-6 py-4 text-sm text-stone-600">{formatDate(item.createdAt)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-stone-900">
                    {formatCurrencyVND(item.amount)}
                  </td>
                  <td className="px-6 py-4">{renderBankInfo(item.bankInfo)}</td>
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
