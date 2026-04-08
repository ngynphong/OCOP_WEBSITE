'use client';

import { useState } from 'react';
import {
  FiShield,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiChevronLeft,
  FiInfo,
  FiCheckCircle,
} from 'react-icons/fi';
import { useRolesQuery, useAdminRoleMutations } from '@/features/admin/hooks/useAdminRoles';
import { AdminRole } from '@/features/admin/types/adminTypes';
import Link from 'next/link';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import RoleFormDrawer from '@/features/admin/components/RoleFormDrawer';

const RoleListPage = () => {
  const { data, isLoading } = useRolesQuery();
  const { deleteRole } = useAdminRoleMutations();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminRole | null>(null);

  const roles = data?.data || [];

  const handleEdit = (role: AdminRole) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsDrawerOpen(true);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      await deleteRole(deleteTarget.name);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 text-stone-400 hover:text-emerald-700 text-xs font-black uppercase tracking-widest transition-colors mb-2"
          >
            <FiChevronLeft /> Quay lại Quản lý người dùng
          </Link>
          <h2 className="text-3xl font-black text-emerald-900 tracking-tight">
            Quản lý Vai trò & Quyền hạn
          </h2>
          <p className="text-stone-500 text-sm font-medium">
            Thiết lập các nhóm quyền hạn truy cập hệ thống cho từng loại tài khoản.
          </p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-sm font-black rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 active:scale-95"
        >
          <FiPlus size={18} /> Thêm vai trò mới
        </button>
      </div>

      {/* Role Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-64 bg-stone-100 rounded-3xl animate-pulse border border-stone-200"
            />
          ))
        ) : roles.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-stone-200">
            <FiShield className="mx-auto text-stone-200 mb-4" size={48} />
            <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">
              Chưa có vai trò nào được định nghĩa
            </p>
          </div>
        ) : (
          roles.map((role) => (
            <div
              key={role.name}
              className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-xl hover:shadow-emerald-900/5 transition-all group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                  <FiShield size={24} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(role)}
                    className="p-2 bg-stone-50 text-stone-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all"
                    title="Chỉnh sửa"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(role)}
                    className="p-2 bg-stone-50 text-stone-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                    title="Xóa"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-black text-emerald-900 mb-2">{role.name}</h3>
              <p className="text-stone-500 text-sm font-medium mb-6 flex-1">
                {role.description || 'Không có mô tả cho vai trò này.'}
              </p>

              <div className="pt-4 border-t border-stone-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    Quyền hạn ({role.permissions.length})
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {role.permissions.slice(0, 5).map((perm) => (
                    <span
                      key={perm.name}
                      className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-stone-50 text-stone-500 rounded-lg group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors"
                    >
                      <FiCheckCircle size={10} className="text-emerald-500/50" />
                      {perm.name}
                    </span>
                  ))}
                  {role.permissions.length > 5 && (
                    <span className="text-[10px] font-bold text-stone-400 px-2 py-1">
                      +{role.permissions.length - 5} khác
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Card */}
      <div className="bg-emerald-900 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h4 className="text-lg font-black mb-2 flex items-center gap-2">
            <FiInfo /> Lưu ý về Phân quyền
          </h4>
          <p className="text-emerald-100/80 text-sm leading-relaxed">
            Các thay đổi về vai trò và quyền hạn sẽ có hiệu lực ngay lập tức. Hãy cẩn trọng khi thực
            hiện các thay đổi này vì nó ảnh hưởng trực tiếp đến khả năng truy cập tài nguyên của
            nhân viên và người dùng trong hệ thống.
          </p>
        </div>
        <FiShield className="absolute -right-8 -bottom-8 text-emerald-800/40 w-48 h-48 -rotate-12" />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Xác nhận xóa vai trò?"
        message={`Bạn có chắc chắn muốn xóa vai trò "${deleteTarget?.name}"? Hành động này không thể hoàn tác và các tài khoản thuộc vai trò này có thể mất quyền truy cập.`}
        type="warning"
        confirmText="Xóa vĩnh viễn"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <RoleFormDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        role={selectedRole}
      />
    </div>
  );
};

export default RoleListPage;
