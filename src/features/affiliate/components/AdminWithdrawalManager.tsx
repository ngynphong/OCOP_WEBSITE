import React, { useMemo } from 'react';
import { WithdrawalRequest } from '../types/affiliateTypes';
import { FiClock, FiCheckCircle, FiXCircle, FiUser, FiDollarSign } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/lib/utils';
import { formatCurrencyVND } from '@/utils/format';

interface AdminWithdrawalManagerProps {
  withdrawals: WithdrawalRequest[];
  onProcess: (id: number) => void;
  filter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';
  onFilterChange: (filter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED') => void;
}

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
    default:
      return status;
  }
};

const FILTER_OPTIONS = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Thành công' },
  { value: 'REJECTED', label: 'Từ chối' },
] as const;

export const AdminWithdrawalManager: React.FC<AdminWithdrawalManagerProps> = ({
  withdrawals,
  onProcess,
  filter,
  onFilterChange,
}) => {
  const filteredData = useMemo(() => {
    if (filter === 'ALL') return withdrawals;
    return withdrawals.filter((item) => item.status === filter);
  }, [withdrawals, filter]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
            <FiDollarSign size={20} />
          </div>
          Quản lý lệnh rút tiền
        </h3>

        <div className="flex items-center gap-2 bg-stone-100/50 p-1.5 rounded-2xl border border-stone-200">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300',
                filter === opt.value
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-stone-400 hover:text-stone-600',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-8">
        <table className="w-full text-left">
          <thead>
            <tr className="border-y border-emerald-900/10">
              <th className="px-8 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                User / Email
              </th>
              <th className="px-8 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Số tiền
              </th>
              <th className="px-8 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Ngân hàng
              </th>
              <th className="px-8 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Ngày tạo
              </th>
              <th className="px-8 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-8 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/5">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-8 py-20 text-center text-stone-400">
                  Không tìm thấy yêu cầu nào.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <FiUser size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-stone-900 truncate max-w-[150px]">
                          {item.userEmail}
                        </p>
                        <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                          ID: #{item.accountId}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-emerald-700">
                      {formatCurrencyVND(item.amount)}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-xs text-stone-600 bg-white/50 p-2 rounded-lg border border-stone-200">
                      <span className="truncate max-w-[150px]">{item.bankInfo}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs text-stone-600">
                      {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
                    </p>
                  </td>
                  <td className="px-8 py-6">{getStatusBadge(item.status)}</td>
                  <td className="px-8 py-6 text-center">
                    {item.status === 'PENDING' ? (
                      <Button
                        variant="primary"
                        onClick={() => onProcess(item.id)}
                        className="rounded-xl px-4 py-2 h-auto text-xs font-bold"
                      >
                        Xử lý
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-bold bg-stone-50 py-1.5 rounded-lg border border-stone-100">
                        <FiCheckCircle size={10} /> ĐÃ XỬ LÝ
                      </div>
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
