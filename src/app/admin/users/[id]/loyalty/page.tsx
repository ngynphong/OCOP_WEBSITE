import React from 'react';
import AdminLoyaltyManager from '@/features/loyalty/components/AdminLoyaltyManager';
import { FiArrowLeft, FiAward } from 'react-icons/fi';
import Link from 'next/link';

interface LoyaltyPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: 'Quản lý Điểm thưởng - Admin Portal',
};

const UserLoyaltyAdminPage = async ({ params }: LoyaltyPageProps) => {
  const { id } = await params;

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header & Back */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/users/${id}`}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all shadow-sm"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-emerald-900 tracking-tight flex items-center gap-3">
            <FiAward className="text-emerald-600" /> Quản lý Điểm thưởng
          </h2>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">
            <span>Người dùng</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>ID: {id}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="text-emerald-600">Loyalty Management</span>
          </nav>
        </div>
      </div>

      <AdminLoyaltyManager userId={id} />
    </div>
  );
};

export default UserLoyaltyAdminPage;
