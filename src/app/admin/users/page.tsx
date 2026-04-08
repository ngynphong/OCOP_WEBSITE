'use client';

import { useState, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import {
  FiSearch,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShield,
} from 'react-icons/fi';
import { useUsersQuery, useAdminUserMutations } from '@/features/admin/hooks/useAdminUsers';
import { GetUsersParams, AdminUserListItem } from '@/features/admin/types/adminTypes';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const UserListPage = () => {
  const [params, setParams] = useState<GetUsersParams>({
    pageNo: 1,
    pageSize: 10,
    keyword: undefined,
    status: undefined,
    sorts: 'createdAt:desc',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { updateUserStatus } = useAdminUserMutations();

  const queryParams = useMemo(
    () => ({
      ...params,
      keyword: debouncedSearchTerm || undefined,
    }),
    [params, debouncedSearchTerm],
  );

  const { data, isLoading } = useUsersQuery(queryParams);

  // Modal State
  const [lockTarget, setLockTarget] = useState<AdminUserListItem | null>(null);

  const users = data?.data?.items || [];
  const totalPage = data?.data?.totalPage || 0;

  const statusColors = {
    ACTIVE: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    LOCKED: 'text-red-600 bg-red-50 border-red-100',
    PENDING_VERIFY: 'text-amber-600 bg-amber-50 border-amber-100',
  };

  const statusLabels = {
    ACTIVE: 'Hoạt động',
    LOCKED: 'Đã khóa',
    PENDING_VERIFY: 'Chờ xác thực',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight mb-2">
            Quản lý người dùng
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Danh sách toàn bộ thành viên, đối tác và nhân viên trong hệ thống.
          </p>
        </div>
        <Link
          href="/admin/roles"
          className="flex items-center gap-2 px-6 py-3 bg-emerald-900 text-white text-sm font-black rounded-2xl hover:bg-emerald-800 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
        >
          <FiShield size={18} /> Quản lý Vai trò
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-stone-100 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[300px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            name="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setParams((prev) => ({ ...prev, pageNo: 1 }));
            }}
            placeholder="Tìm theo tên, email, số điện thoại..."
            className="w-full pl-11 pr-4 py-2.5 bg-stone-50 text-gray-700 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all font-medium"
          />
        </div>

        <select
          value={params.sorts || ''}
          onChange={(e) =>
            setParams((prev: GetUsersParams) => ({
              ...prev,
              sorts: e.target.value || undefined,
              pageNo: 1,
            }))
          }
          className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2.5 px-4 focus:ring-2 focus:ring-emerald-500/10"
        >
          <option value="">Sắp xếp</option>
          <option value="createdAt:desc">Ngày tạo mới nhất</option>
          <option value="createdAt:asc">Ngày tạo cũ nhất</option>
        </select>

        <select
          value={params.status || ''}
          onChange={(e) =>
            setParams((prev: GetUsersParams) => ({
              ...prev,
              status: e.target.value || undefined,
              pageNo: 1,
            }))
          }
          className="bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-600 py-2.5 px-4 focus:ring-2 focus:ring-emerald-500/10"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="LOCKED">Đã khóa</option>
          <option value="PENDING_VERIFY">Chờ xác thực</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-50">
                <th className="px-8 py-5">Người dùng</th>
                <th className="px-8 py-5">Liên hệ</th>
                <th className="px-8 py-5">Vai trò</th>
                <th className="px-8 py-5">Trạng thái</th>
                <th className="px-8 py-5">Ngày tham gia</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-8 py-6 h-20 bg-stone-50/50" />
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-8 py-20 text-center text-stone-400 font-bold uppercase tracking-widest text-xs"
                  >
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user: AdminUserListItem) => (
                  <tr key={user.id} className="hover:bg-stone-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
                          {user.avatarUrl ? (
                            <Image
                              src={user.avatarUrl}
                              alt={user.firstName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <span className="text-emerald-700 font-black text-xs">
                              {user.lastName[0]}
                              {user.firstName[0]}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-black text-stone-900 leading-tight">
                            {user.lastName} {user.firstName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium font-sans">
                          <FiMail className="text-stone-300" /> {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium font-sans">
                            <FiPhone className="text-stone-300" /> {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role: string) => (
                          <span
                            key={role}
                            className="text-[9px] font-black px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full uppercase"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${statusColors[user.status as keyof typeof statusColors]}`}
                      >
                        {statusLabels[user.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 font-bold">
                        <FiCalendar className="text-stone-300" />
                        {format(new Date(user.createdAt), 'dd MMM, yyyy', { locale: vi })}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                        >
                          <FiEye size={14} />
                        </Link>
                        <button
                          onClick={() => setLockTarget(user)}
                          className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all shadow-sm ${
                            user.status === 'LOCKED'
                              ? 'bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white'
                              : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'
                          }`}
                        >
                          {user.status === 'LOCKED' ? (
                            <FiUserCheck size={14} />
                          ) : (
                            <FiUserX size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Lock/Unlock Confirm Modal */}
        <ConfirmModal
          isOpen={!!lockTarget}
          title={lockTarget?.status === 'LOCKED' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?'}
          message={
            lockTarget?.status === 'LOCKED'
              ? `Bạn có chắc chắn muốn mở khóa cho ${lockTarget?.lastName} ${lockTarget?.firstName}?`
              : `Bạn có chắc chắn muốn khóa tài khoản của ${lockTarget?.lastName} ${lockTarget?.firstName}? Người dùng này sẽ không thể đăng nhập.`
          }
          type={lockTarget?.status === 'LOCKED' ? 'info' : 'warning'}
          confirmText={lockTarget?.status === 'LOCKED' ? 'Mở khóa' : 'Khóa ngay'}
          onConfirm={async () => {
            if (lockTarget) {
              await updateUserStatus({
                userId: lockTarget.id,
                status: lockTarget.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED',
              });
              setLockTarget(null);
            }
          }}
          onCancel={() => setLockTarget(null)}
        />

        {/* Pagination Section */}
        <div className="px-8 py-5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
          <Pagination
            currentPage={params.pageNo || 1}
            totalPages={totalPage}
            pageSize={params.pageSize}
            totalElements={data?.data?.totalElement}
            onPageChange={(page: number) =>
              setParams((p: GetUsersParams) => ({ ...p, pageNo: page }))
            }
            onPageSizeChange={(size: number) =>
              setParams((p: GetUsersParams) => ({ ...p, pageSize: size, pageNo: 1 }))
            }
          />
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
