'use client';

import { FiAward, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

interface UserLoyaltyPointsProps {
  id: string;
}

const UserLoyaltyPoints = ({ id }: UserLoyaltyPointsProps) => {
  return (
    <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 relative overflow-hidden group">
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-100/50 rounded-full group-hover:scale-125 transition-transform duration-700" />
      <div className="relative z-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-amber-600 shadow-sm shadow-amber-900/5 shrink-0">
            <FiAward size={24} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-amber-900 uppercase tracking-tight">
              Quản lý Điểm thưởng & Ưu đãi
            </h4>
            <p className="text-stone-500 text-[10px] font-bold leading-relaxed max-w-[300px]">
              Kiểm tra số dư, lịch sử tích lũy và thực hiện các thao tác cộng/trừ điểm thưởng cho
              người dùng này.
            </p>
          </div>
        </div>
        <Link
          href={`/admin/users/${id}/loyalty`}
          className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-amber-700 transition-all shadow-lg shadow-amber-900/20 active:scale-95 shrink-0"
        >
          Tới quản lý <FiArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default UserLoyaltyPoints;
