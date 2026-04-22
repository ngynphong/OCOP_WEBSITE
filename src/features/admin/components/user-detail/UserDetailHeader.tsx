'use client';

import { FiArrowLeft, FiLock, FiUnlock, FiTrash2 } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import Link from 'next/link';

import { AdminUserListItem } from '@/features/admin/types/adminTypes';

interface UserDetailHeaderProps {
  user: AdminUserListItem;
  onLock: () => void;
  onDelete: () => void;
}

const UserDetailHeader = ({ user, onLock, onDelete }: UserDetailHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="p-3 bg-white border border-stone-100 rounded-2xl hover:bg-stone-50 transition-colors shadow-sm text-stone-400 hover:text-stone-600 cursor-pointer"
        >
          <FiArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-3xl font-black text-stone-900 tracking-tight">Chi tiết nhân sự</h2>
          <p className="text-stone-500 font-bold mt-1 uppercase text-[10px] tracking-widest flex items-center gap-2">
            ID: <span className="text-emerald-600">#{user.id.slice(0, 8)}</span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onLock}
          className="bg-amber-50 text-amber-600 border-amber-100 hover:bg-amber-100 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all"
        >
          {user.status === 'LOCKED' ? (
            <>
              <FiUnlock /> Mở khóa
            </>
          ) : (
            <>
              <FiLock /> Tạm khóa
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onDelete}
          className="bg-red-50 text-red-600 border-red-100 hover:bg-red-100 px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 transition-all"
        >
          <FiTrash2 /> Xóa tài khoản
        </Button>
      </div>
    </div>
  );
};

export default UserDetailHeader;
