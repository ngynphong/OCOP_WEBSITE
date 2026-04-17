'use client';

import {
  useAdminUserMutations,
  useUserDetailQuery,
  useUserPermissionsQuery,
  useAllPermissionsQuery,
} from '@/features/admin/hooks/useAdminUsers';
import { UserPermission } from '@/features/admin/types/adminTypes';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiShield,
  FiBriefcase,
  FiCalendar,
  FiLock,
  FiUnlock,
  FiTrash2,
  FiCheckCircle,
  FiPlus,
  FiX,
  FiAward,
} from 'react-icons/fi';
import Image from 'next/image';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

const UserDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const {
    updateUserStatus,
    updateUserRoles,
    grantPermissions,
    revokePermissions,
    deleteUser,
    deletePermission,
  } = useAdminUserMutations();

  const { data: userRes, isLoading: isLoadingUser } = useUserDetailQuery(id as string);
  const { data: permRes, isLoading: isLoadingPerms } = useUserPermissionsQuery(id as string);
  const { data: allPermsRes } = useAllPermissionsQuery();

  const user = userRes?.data;
  const permissions = permRes?.data || [];

  const [newRole, setNewRole] = useState('');
  const [newPermission, setNewPermission] = useState('');

  // Modal States
  const [showLockModal, setShowLockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permToDelete, setPermToDelete] = useState<string | null>(null);

  const allPermissions = allPermsRes?.data || [];
  const userPermissionNames = permissions.map((p: UserPermission) => p.name);
  const availablePermissions = allPermissions.filter(
    (p: UserPermission) => !userPermissionNames.includes(p.name),
  );

  if (isLoadingUser) {
    return null;
  }

  if (!user)
    return (
      <div className="text-center py-20 font-black text-stone-400">Người dùng không tồn tại</div>
    );

  const handleAddRole = async () => {
    if (!newRole) return;
    if (user.roles.includes(newRole)) {
      toast.error('Người dùng đã có vai trò này');
      return;
    }
    await updateUserRoles({ userId: user.id, roles: [...user.roles, newRole] });
    setNewRole('');
  };

  const handleRemoveRole = async (roleToRemove: string) => {
    await updateUserRoles({
      userId: user.id,
      roles: user.roles.filter((r: string) => r !== roleToRemove),
    });
  };

  const handleGrantPermission = async () => {
    if (!newPermission) return;
    await grantPermissions({ userId: user.id, permissions: [newPermission] });
    setNewPermission('');
  };

  const statusColors = {
    ACTIVE: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    LOCKED: 'text-red-600 bg-red-50 border-red-100',
    PENDING_VERIFY: 'text-amber-600 bg-amber-50 border-amber-100',
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Back */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/users"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all shadow-sm"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-2xl font-black text-emerald-900 tracking-tight">
            Chi tiết tài khoản
          </h2>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            <span>Người dùng</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="text-emerald-600">{user.email}</span>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column: User Profile & Meta */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full -mr-8 -mt-8 group-hover:scale-110 transition-transform duration-500 opacity-50" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center overflow-hidden border-4 border-white shadow-xl mb-6">
                {user.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt={user.firstName}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-emerald-700 font-black text-2xl">
                    {user.lastName[0]}
                    {user.firstName[0]}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-black text-stone-900 mb-1">
                {user.lastName} {user.firstName}
              </h3>

              <span
                className={`text-[10px] font-black px-4 py-1 rounded-full border mb-8 ${statusColors[user.status as keyof typeof statusColors]}`}
              >
                {user.status}
              </span>

              <div className="w-full space-y-4 pt-6 border-t border-stone-50">
                <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
                  <FiMail className="text-stone-300" />
                  <span className="flex-1 truncate">{user.email}</span>
                  {user.emailVerified && <FiCheckCircle className="text-emerald-500" />}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
                  <FiPhone className="text-stone-300" />
                  <span className="flex-1">{user.phoneNumber || 'N/A'}</span>
                  {user.phoneVerified && <FiCheckCircle className="text-emerald-500" />}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-stone-600">
                  <FiCalendar className="text-stone-300" />
                  <span>
                    Tham gia: {format(new Date(user.createdAt), 'dd MMMM, yyyy', { locale: vi })}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <div className="bg-red-50/30 p-8 rounded-3xl border border-red-100 space-y-4">
            <h4 className="text-[10px] font-black text-red-900 uppercase tracking-widest flex items-center gap-2">
              <FiShield /> Danger Zone
            </h4>
            <p className="text-xs text-red-700 font-medium leading-relaxed">
              Các hành động này có thể ảnh hưởng trực tiếp đến quyền truy cập của người dùng.
            </p>
            <div className="grid grid-cols-1 gap-2 pt-2">
              <button
                onClick={() => setShowLockModal(true)}
                className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
                  user.status === 'LOCKED'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-amber-500 text-white shadow-lg shadow-amber-500/20'
                }`}
              >
                {user.status === 'LOCKED' ? <FiUnlock /> : <FiLock />}
                {user.status === 'LOCKED' ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
              </button>
              <Link
                href={`/admin/users/${user.id}/loyalty`}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-stone-200 text-stone-700 rounded-xl text-xs font-black hover:bg-stone-50 transition-all shadow-sm"
              >
                <FiAward /> Quản lý điểm thưởng
              </Link>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-xs font-black hover:bg-red-600 hover:text-white transition-all"
              >
                <FiTrash2 /> Xoá tài khoản
              </button>
            </div>
          </div>
        </div>

        {/* Modals */}
        <ConfirmModal
          isOpen={showLockModal}
          title={user.status === 'LOCKED' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?'}
          message={
            user.status === 'LOCKED'
              ? `Bạn có chắc chắn muốn mở khóa tài khoản cho ${user.lastName} ${user.firstName}? Người dùng sẽ có thể đăng nhập lại.`
              : `Bạn có chắc chắn muốn khóa tài khoản này? ${user.lastName} ${user.firstName} sẽ không thể truy nhập vào hệ thống cho đến khi được mở khóa.`
          }
          type={user.status === 'LOCKED' ? 'info' : 'warning'}
          confirmText={user.status === 'LOCKED' ? 'Mở khóa ngay' : 'Khóa tài khoản'}
          onConfirm={async () => {
            await updateUserStatus({
              userId: user.id,
              status: user.status === 'LOCKED' ? 'ACTIVE' : 'LOCKED',
            });
            setShowLockModal(false);
          }}
          onCancel={() => setShowLockModal(false)}
        />

        <ConfirmModal
          isOpen={showDeleteModal}
          title="Xóa vĩnh viễn tài khoản?"
          message={`Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản của ${user.lastName} ${user.firstName} (${user.email}) khỏi hệ thống?`}
          type="danger"
          confirmText="Xóa vĩnh viễn"
          onConfirm={async () => {
            await deleteUser(user.id);
            setShowDeleteModal(false);
            router.push('/admin/users');
          }}
          onCancel={() => setShowDeleteModal(false)}
        />

        {/* Right Column: Roles, Permissions, Profile */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Roles Management */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2">
                <FiShield className="text-emerald-600" /> Vai trò hệ thống
              </h4>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              <AnimatePresence>
                {user.roles.map((role: string) => (
                  <motion.span
                    key={role}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 text-xs font-black rounded-xl uppercase border border-stone-200 group"
                  >
                    {role}
                    <button
                      onClick={() => handleRemoveRole(role)}
                      className="text-stone-400 hover:text-red-500 transition-colors"
                    >
                      <FiX />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>

            <div className="flex gap-2 p-1 bg-stone-50 rounded-2xl border border-stone-100 max-w-sm">
              <input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value.toUpperCase())}
                placeholder="Thêm vai trò (e.g. STAFF)..."
                className="flex-1 bg-transparent border-none text-xs text-gray-700 font-bold px-3 outline-none"
              />
              <button
                onClick={handleAddRole}
                className="px-4 py-2 bg-emerald-600 text-white text-[10px] font-black rounded-xl uppercase hover:bg-emerald-700 transition-all flex items-center gap-1.5"
              >
                <FiPlus /> Thêm mới
              </button>
            </div>
          </div>

          {/* Permissions Management */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
            <h4 className="text-lg font-black text-stone-900 tracking-tight flex items-center gap-2 mb-6">
              <FiCheckCircle className="text-blue-600" /> Quyền truy cập
            </h4>

            <div className="flex flex-wrap gap-3 mb-8">
              {isLoadingPerms ? (
                <div className="col-span-2 text-stone-400 text-xs font-bold animate-pulse">
                  Đang định danh quyền...
                </div>
              ) : permissions.length === 0 ? (
                <div className="col-span-2 text-stone-400 text-xs font-bold italic">
                  Chưa có quyền đặc biệt nào được cấp.
                </div>
              ) : (
                permissions.map((perm: UserPermission) => (
                  <div
                    key={perm.name}
                    className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex justify-between items-start group min-w-[240px]"
                  >
                    <div>
                      <p className="text-xs font-black text-stone-900 uppercase mb-1">
                        {perm.name}
                      </p>
                      <p className="text-[10px] text-stone-400 leading-relaxed max-w-[180px]">
                        {perm.description}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        revokePermissions({ userId: user.id, permissions: [perm.name] })
                      }
                      title="Thu hồi quyền"
                      className="text-stone-300 hover:text-amber-600 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex flex-col gap-4">
              <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                Cấp quyền mới từ hệ thống
              </h5>
              <div className="flex gap-2">
                <select
                  value={newPermission}
                  onChange={(e) => setNewPermission(e.target.value)}
                  className="flex-1 bg-stone-50 border border-stone-100 text-xs text-gray-700 font-bold px-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/10 transition-all cursor-pointer"
                >
                  <option value="">Chọn quyền để cấp...</option>
                  {availablePermissions.map((p: UserPermission) => (
                    <option key={p.name} value={p.name}>
                      {p.name} - {p.description}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleGrantPermission}
                  disabled={!newPermission}
                  className="px-6 py-2.5 bg-blue-600 text-white text-[10px] font-black rounded-xl uppercase hover:bg-blue-700 transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:grayscale"
                >
                  <FiPlus /> Cấp quyền
                </button>
              </div>
            </div>

            {/* Global Permission Management (Deletion) */}
            <div className="mt-12 pt-8 border-t border-stone-50">
              <h5 className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-6">
                Quản lý quyền hệ thống (Nguy hiểm)
              </h5>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {allPermissions.map((p: UserPermission) => (
                  <div
                    key={p.name}
                    className="flex items-center justify-between px-3 py-2 bg-red-50/30 rounded-xl border border-red-100 group"
                  >
                    <span className="text-[9px] font-black text-red-900 truncate" title={p.name}>
                      {p.name}
                    </span>
                    <button
                      onClick={() => setPermToDelete(p.name)}
                      className="text-red-300 hover:text-red-600 transition-colors"
                    >
                      <FiTrash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <ConfirmModal
            isOpen={!!permToDelete}
            title="Xóa quyền khỏi hệ thống?"
            message={`Bạn đang thực hiện xóa vĩnh viễn quyền '${permToDelete}' khỏi hệ thống. Việc này sẽ thu hồi quyền này từ TẤT CẢ người dùng đang sở hữu nó. Bạn có chắc chắn?`}
            type="danger"
            confirmText="Xóa vĩnh viễn"
            onConfirm={async () => {
              if (permToDelete) {
                await deletePermission(permToDelete);
                setPermToDelete(null);
              }
            }}
            onCancel={() => setPermToDelete(null)}
          />

          {/* Staff Profile - Only if USER is staff or admin wants to manage */}
          {user.staffProfile && (
            <div className="bg-emerald-900 text-white p-8 rounded-3xl shadow-xl shadow-emerald-900/10 relative overflow-hidden">
              <FiBriefcase className="absolute -right-8 -bottom-8 text-[120px] text-white/5" />
              <h4 className="text-lg font-black tracking-tight flex items-center gap-2 mb-6">
                Hồ sơ nhân sự
              </h4>
              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 mb-1">Mã nhân viên</p>
                  <p className="text-sm font-bold">{user.staffProfile.employeeId}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 mb-1">Phòng ban</p>
                  <p className="text-sm font-bold">{user.staffProfile.department}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 mb-1">Chức vụ</p>
                  <p className="text-sm font-bold">{user.staffProfile.position}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase opacity-50 mb-1">Người quản lý</p>
                  <p className="text-sm font-bold">
                    {user.staffProfile.managedByName || 'Chưa cập nhật'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;
