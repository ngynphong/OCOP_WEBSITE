'use client';

import React, { useState } from 'react';
import { useAdminLoyaltyAccount, useAdjustPoints } from '../hooks/useLoyalty';
import { FiAward, FiPlusCircle, FiMinusCircle, FiTrendingUp } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import toast from 'react-hot-toast';

interface AdminLoyaltyManagerProps {
  userId: string;
}

const AdminLoyaltyManager = ({ userId }: AdminLoyaltyManagerProps) => {
  const { data: accountRes, isLoading } = useAdminLoyaltyAccount(userId);
  const adjustMutation = useAdjustPoints(userId);

  const [points, setPoints] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(true);

  const account = accountRes?.data;

  const handleAdjust = async () => {
    if (points <= 0) {
      toast.error('Số điểm phải lớn hơn 0');
      return;
    }
    if (!description.trim()) {
      toast.error('Vui lòng nhập lý do điều chỉnh');
      return;
    }

    try {
      const adjustment = isAdding ? points : -points;
      await adjustMutation.mutateAsync({
        points: adjustment,
        description,
      });
      setPoints(0);
      setDescription('');
    } catch (_error) {
      console.error(_error);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-stone-100 rounded-3xl" />
        <div className="h-64 bg-stone-100 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Account Summary */}
      <div className="bg-linear-to-br from-emerald-800 to-green-900 rounded-3xl p-8 text-white shadow-2xl shadow-emerald-900/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-inner">
            <FiAward size={40} className="text-emerald-300" />
          </div>
          <div>
            <p className="text-emerald-200/70 font-bold uppercase tracking-widest text-[10px] mb-1">
              Số dư điểm hiện tại
            </p>
            <h3 className="text-5xl font-black tracking-tighter">
              {account?.availablePoints?.toLocaleString() || 0}
            </h3>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-2 py-0.5 rounded bg-emerald-700/50 text-[10px] font-bold text-emerald-200 border border-emerald-600/30 capitalize">
                {account?.tier || 'Member'}
              </span>
              <span className="text-xs text-emerald-300/80 font-medium">
                Tương đương {account?.pointsValue?.toLocaleString() || 0}đ
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:border-l md:border-white/10 md:pl-8">
          <div>
            <p className="text-emerald-300/50 text-[10px] font-bold uppercase">Tổng tích lũy</p>
            <p className="text-lg font-bold">+{account?.totalEarned?.toLocaleString() || 0}</p>
          </div>
          <div>
            <p className="text-emerald-300/50 text-[10px] font-bold uppercase">Đã sử dụng</p>
            <p className="text-lg font-bold">-{account?.totalUsed?.toLocaleString() || 0}</p>
          </div>
        </div>
      </div>

      {/* Adjustment Form */}
      <div className="bg-white rounded-3xl border border-stone-100 shadow-xl shadow-stone-200/50 p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
            <FiTrendingUp size={20} />
          </div>
          <h3 className="text-xl font-bold text-stone-900">Điều chỉnh điểm thưởng</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-stone-700 mb-3">Tác vụ</label>
              <div className="flex gap-2 p-1 bg-stone-50 rounded-2xl w-fit border border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(true)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    isAdding
                      ? 'bg-white text-green-600 shadow-md shadow-green-100 ring-1 ring-green-50'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <FiPlusCircle /> Cộng điểm
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    !isAdding
                      ? 'bg-white text-red-600 shadow-md shadow-red-100 ring-1 ring-red-50'
                      : 'text-stone-400 hover:text-stone-600'
                  }`}
                >
                  <FiMinusCircle /> Trừ điểm
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-stone-700">Số điểm cần thay đổi</label>
              <div className="relative group">
                <input
                  type="number"
                  value={points || ''}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  placeholder="Nhập số điểm..."
                  className="w-full h-14 pl-5 pr-12 rounded-2xl bg-stone-50 border-2 border-stone-50 focus:border-emerald-500 focus:bg-white outline-hidden transition-all text-lg font-bold placeholder:text-stone-300"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 font-bold text-stone-300 group-focus-within:text-emerald-500 transition-colors">
                  PTS
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-stone-700">Lý do điều chỉnh</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ví dụ: Tặng quà sinh nhật, Bù điểm do lỗi hệ thống..."
                rows={4}
                className="w-full p-5 rounded-2xl bg-stone-50 border-2 border-stone-50 focus:border-emerald-500 focus:bg-white outline-hidden transition-all text-sm font-medium placeholder:text-stone-300 resize-none"
              />
            </div>

            <Button
              onClick={handleAdjust}
              isLoading={adjustMutation.isPending}
              variant={isAdding ? 'primary' : 'danger'}
              className="w-full h-14 rounded-2xl text-base font-bold shadow-xl shadow-emerald-900/10"
            >
              Xác nhận điều chỉnh {isAdding ? 'cộng' : 'trừ'} điểm
            </Button>
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100 flex gap-4">
        <div className="w-10 h-10 shrink-0 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 font-bold">
          !
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-amber-900">Lưu ý quan trọng</p>
          <p className="text-xs text-amber-700/80 leading-relaxed">
            Mọi thao tác điều chỉnh điểm sẽ được ghi lại trong lịch sử giao dịch của người dùng. Vui
            lòng đảm bảo các lý do điều chỉnh rõ ràng để phục vụ công tác đối soát sau này.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLoyaltyManager;
