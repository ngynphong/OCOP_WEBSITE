import React, { useMemo } from 'react';
import { WithdrawalRequest, WithdrawalStatus, BankInfo } from '../types/affiliateTypes';
import {
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiDollarSign,
  FiLoader,
  FiZap,
} from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/lib/utils';
import { formatCurrencyVND } from '@/utils/format';

interface AdminWithdrawalManagerProps {
  withdrawals: WithdrawalRequest[];
  onProcess: (id: number) => void;
  filter: WithdrawalStatus | 'ALL';
  onFilterChange: (filter: WithdrawalStatus | 'ALL') => void;
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
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold ring-1 ring-blue-200">
          <FiCheckCircle size={12} /> Đã duyệt
        </span>
      );
    case 'PROCESSING':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-600 text-xs font-bold ring-1 ring-amber-200">
          <FiLoader className="animate-spin" size={12} /> Đang xử lý
        </span>
      );
    case 'PAID':
      return (
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold ring-1 ring-emerald-200">
          <FiZap size={12} /> Đã thanh toán
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
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-200 text-stone-400 text-xs font-bold ring-1 ring-stone-300">
          <FiXCircle size={12} /> Đã hủy
        </span>
      );
    default:
      return status;
  }
};

const FILTER_OPTIONS: { value: WithdrawalStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ duyệt' },
  { value: 'APPROVED', label: 'Đã duyệt' },
  { value: 'PROCESSING', label: 'Đang xử lý' },
  { value: 'PAID', label: 'Thanh toán' },
  { value: 'REJECTED', label: 'Từ chối' },
];

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

  const renderBankInfo = (bankInfoStr: string) => {
    try {
      const info: BankInfo = JSON.parse(bankInfoStr);
      return (
        <div className="space-y-0.5">
          <p className="font-bold text-stone-900">{info.bankName}</p>
          <p className="text-xs text-stone-600">{info.accountNumber}</p>
          <p className="text-[10px] text-stone-400 uppercase">{info.accountName}</p>
        </div>
      );
    } catch {
      return <span className="text-xs text-stone-600 italic">{bankInfoStr}</span>;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-hidden p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <h3 className="text-xl font-bold text-emerald-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-lg">
            <FiDollarSign size={20} />
          </div>
          Quản lý lệnh rút tiền
        </h3>

        <div className="flex items-center gap-2 bg-stone-100/50 p-1.5 rounded-xl border border-stone-200 overflow-x-auto no-scrollbar">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onFilterChange(opt.value)}
              className={cn(
                'px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 whitespace-nowrap',
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

      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="border-y border-emerald-900/10">
              <th className="px-6 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                User / Email
              </th>
              <th className="px-6 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Số tiền
              </th>
              <th className="px-6 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Ngân hàng
              </th>
              <th className="px-6 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Thông tin xử lý
              </th>
              <th className="px-6 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest">
                Trạng thái
              </th>
              <th className="px-6 py-5 text-xs font-bold text-emerald-900/40 uppercase tracking-widest text-center">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-900/5">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-stone-400">
                  Không tìm thấy yêu cầu nào.
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-white/40 transition-colors">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <FiUser size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-stone-900 truncate max-w-[180px]">
                          {item.userEmail}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {new Date(item.createdAt).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-black text-emerald-700">
                      {formatCurrencyVND(item.amount)}
                    </p>
                  </td>
                  <td className="px-6 py-6">{renderBankInfo(item.bankInfo)}</td>
                  <td className="px-6 py-6">
                    {item.processedByEmail ? (
                      <div className="space-y-1">
                        <p className="text-[11px] font-bold text-stone-600 flex items-center gap-1">
                          <FiUser size={10} /> {item.processedByEmail}
                        </p>
                        {item.adminNote && (
                          <p className="text-[10px] text-stone-400 italic bg-stone-50 p-1.5 rounded-lg border border-stone-100">
                            {item.adminNote}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-stone-300 italic">Chưa xử lý</span>
                    )}
                  </td>
                  <td className="px-6 py-6">{getStatusBadge(item.status)}</td>
                  <td className="px-6 py-6 text-center">
                    {!['PAID', 'REJECTED', 'CANCELLED'].includes(item.status) ? (
                      <Button
                        variant="primary"
                        onClick={() => onProcess(item.id)}
                        className="rounded-xl px-4 py-2 h-auto text-xs font-bold"
                      >
                        Xử lý
                      </Button>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-bold bg-stone-50 py-1.5 rounded-lg border border-stone-100">
                        <FiCheckCircle size={10} /> ĐÃ KẾT THÚC
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
