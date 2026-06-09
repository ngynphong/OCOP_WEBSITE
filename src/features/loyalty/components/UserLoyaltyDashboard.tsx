'use client';

import React from 'react';
import { useUserLoyaltyAccount, useUserTransactions } from '../hooks/useLoyalty';
import { FiAward, FiTrendingUp, FiClock, FiMinusCircle, FiPlusCircle } from 'react-icons/fi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const UserLoyaltyDashboard = () => {
  const { data: accountRes, isLoading: isAccountLoading } = useUserLoyaltyAccount();
  const { data: transactionsRes, isLoading: isTransLoading } = useUserTransactions({
    pageNo: 1,
    pageSize: 10,
  });

  const account = accountRes?.data;
  const transactions = transactionsRes?.data?.content || [];

  if (isAccountLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-stone-100 rounded-xl" />
          ))}
        </div>
        <div className="h-96 bg-stone-100 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Points */}
        <div className="bg-linear-to-br from-green-600 to-emerald-700 rounded-xl p-5 md:p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-green-100 font-medium text-xs md:text-sm mb-1">Điểm hiện có</p>
            <h3 className="text-3xl md:text-4xl font-bold tracking-tight">
              {account?.availablePoints?.toLocaleString() || 0}
            </h3>
            <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-green-100/80 bg-white/10 w-fit px-2.5 md:px-3 py-1 md:py-1.5 rounded-full backdrop-blur-md">
              <FiTrendingUp size={14} />
              <span>Tương đương {account?.pointsValue?.toLocaleString() || 0}đ</span>
            </div>
          </div>
          <FiAward className="absolute -right-4 -bottom-4 text-white/10 text-8xl md:text-9xl rotate-12 group-hover:scale-110 transition-transform duration-500" />
        </div>

        {/* Tier Info */}
        <div className="bg-white rounded-xl p-5 md:p-6 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col justify-between">
          <div>
            <p className="text-stone-400 font-medium text-xs md:text-sm mb-1">Hạng thành viên</p>
            <h3 className="text-xl md:text-2xl font-bold text-stone-900 capitalize">
              {account?.tier || 'Thành viên'}
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-[10px] md:text-xs mb-1.5">
              <span className="text-stone-500">Tiến trình hạng tiếp theo</span>
              <span className="text-stone-900 font-bold">
                {account?.pointsToNextTier || 0} điểm
              </span>
            </div>
            <div className="w-full h-1.5 md:h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, ((account?.totalEarned || 0) / 1000) * 100)}%` }} // Ví dụ logic
              />
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-xl p-5 md:p-6 border border-stone-100 shadow-xl shadow-stone-200/50">
          <p className="text-stone-400 font-medium text-xs md:text-sm mb-1">Điểm sắp hết hạn</p>
          <h3 className="text-xl md:text-2xl font-bold text-orange-500">
            {account?.expiringPoints?.toLocaleString() || 0}
          </h3>
          {account?.expiringAt && (
            <div className="mt-3 md:mt-4 flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-stone-500">
              <FiClock size={12} className="md:w-3.5 md:h-3.5" />
              <span>Hạn dùng: {format(new Date(account.expiringAt), 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-stone-50 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <h3 className="text-base md:text-lg font-bold text-stone-900">Lịch sử giao dịch điểm</h3>
          <div className="flex flex-wrap gap-2">
            <button className="px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors">
              Tất cả
            </button>
            <button className="px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-stone-500 bg-stone-50 md:bg-transparent border border-transparent hover:bg-stone-100 transition-colors">
              Nhận điểm
            </button>
            <button className="px-3 md:px-4 py-1.5 rounded-full text-[10px] md:text-xs font-bold text-stone-500 bg-stone-50 md:bg-transparent border border-transparent hover:bg-stone-100 transition-colors">
              Đổi quà
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isTransLoading ? (
            <div className="p-10 text-center text-stone-400">Đang tải lịch sử...</div>
          ) : transactions.length === 0 ? (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-stone-50 flex items-center justify-center text-stone-300">
                <FiClock size={40} />
              </div>
              <p className="text-stone-400 font-medium">Bạn chưa có giao dịch điểm nào</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[500px] md:min-w-full">
              <thead>
                <tr className="bg-stone-50/50">
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                    Ngày giao dịch
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                    Mô tả
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider whitespace-nowrap">
                    Loại
                  </th>
                  <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-bold text-stone-400 uppercase tracking-wider text-right whitespace-nowrap">
                    Số điểm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {transactions.map((trans) => {
                  const isPositive = trans.points > 0;
                  return (
                    <tr key={trans.id} className="hover:bg-stone-50/30 transition-colors group">
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <p className="text-xs md:text-sm font-medium text-stone-500">
                          {format(new Date(trans.createdAt), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-0.5">
                          {format(new Date(trans.createdAt), 'HH:mm')}
                        </p>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <p className="text-xs md:text-sm font-bold text-stone-900 line-clamp-2 md:line-clamp-1 max-w-[200px] md:max-w-none">
                          {trans.description}
                        </p>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 whitespace-nowrap">
                        <span
                          className={`px-2 md:px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-tight ${
                            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {trans.type}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-right whitespace-nowrap">
                        <div
                          className={`flex items-center justify-end gap-1 md:gap-1.5 font-bold text-sm md:text-base ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isPositive ? (
                            <FiPlusCircle size={12} className="md:w-[14px] md:h-[14px]" />
                          ) : (
                            <FiMinusCircle size={12} className="md:w-[14px] md:h-[14px]" />
                          )}
                          <span>{Math.abs(trans.points).toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserLoyaltyDashboard;
