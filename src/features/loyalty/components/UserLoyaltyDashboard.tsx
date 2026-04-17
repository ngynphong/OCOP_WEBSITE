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
            <div key={i} className="h-32 bg-stone-100 rounded-3xl" />
          ))}
        </div>
        <div className="h-96 bg-stone-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Points */}
        <div className="bg-linear-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-green-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-green-100 font-medium text-sm mb-1">Điểm hiện có</p>
            <h3 className="text-4xl font-bold tracking-tight">
              {account?.availablePoints?.toLocaleString() || 0}
            </h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-green-100/80 bg-white/10 w-fit px-3 py-1.5 rounded-full backdrop-blur-md">
              <FiTrendingUp />
              <span>Tương đương {account?.pointsValue?.toLocaleString() || 0}đ</span>
            </div>
          </div>
          <FiAward className="absolute -right-4 -bottom-4 text-white/10 text-9xl rotate-12 group-hover:scale-110 transition-transform duration-500" />
        </div>

        {/* Tier Info */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-xl shadow-stone-200/50 flex flex-col justify-between">
          <div>
            <p className="text-stone-400 font-medium text-sm mb-1">Hạng thành viên</p>
            <h3 className="text-2xl font-bold text-stone-900 capitalize">
              {account?.tier || 'Thành viên'}
            </h3>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-stone-500">Tiến trình hạng tiếp theo</span>
              <span className="text-stone-900 font-bold">
                {account?.pointsToNextTier || 0} điểm
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, ((account?.totalEarned || 0) / 1000) * 100)}%` }} // Ví dụ logic
              />
            </div>
          </div>
        </div>

        {/* Expiring Soon */}
        <div className="bg-white rounded-3xl p-6 border border-stone-100 shadow-xl shadow-stone-200/50">
          <p className="text-stone-400 font-medium text-sm mb-1">Điểm sắp hết hạn</p>
          <h3 className="text-2xl font-bold text-orange-500">
            {account?.expiringPoints?.toLocaleString() || 0}
          </h3>
          {account?.expiringAt && (
            <div className="mt-4 flex items-center gap-2 text-xs text-stone-500">
              <FiClock />
              <span>Hạn dùng: {format(new Date(account.expiringAt), 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden">
        <div className="p-6 border-b border-stone-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-stone-900">Lịch sử giao dịch điểm</h3>
          <div className="flex gap-2">
            <button className="px-4 py-1.5 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100 hover:bg-green-100 transition-colors">
              Tất cả
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-bold text-stone-500 hover:bg-stone-50 transition-colors">
              Nhận điểm
            </button>
            <button className="px-4 py-1.5 rounded-full text-xs font-bold text-stone-500 hover:bg-stone-50 transition-colors">
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50">
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Ngày giao dịch
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-stone-400 uppercase tracking-wider text-right">
                    Số điểm
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {transactions.map((trans) => {
                  const isPositive = trans.points > 0;
                  return (
                    <tr key={trans.id} className="hover:bg-stone-50/30 transition-colors group">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-stone-500">
                          {format(new Date(trans.createdAt), 'dd/MM/yyyy', { locale: vi })}
                        </p>
                        <p className="text-[10px] text-stone-400">
                          {format(new Date(trans.createdAt), 'HH:mm')}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-stone-900 line-clamp-1">
                          {trans.description}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                            isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                          }`}
                        >
                          {trans.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div
                          className={`flex items-center justify-end gap-1.5 font-bold text-base ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isPositive ? <FiPlusCircle size={14} /> : <FiMinusCircle size={14} />}
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
