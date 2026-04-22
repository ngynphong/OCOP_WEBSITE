'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiTrash2, FiAlertTriangle, FiSearch, FiLock, FiArrowLeft } from 'react-icons/fi';
import {
  useAllPermissionsQuery,
  useAdminUserMutations,
} from '@/features/admin/hooks/useAdminUsers';
import { UserPermission } from '@/features/admin/types/adminTypes';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import Link from 'next/link';

const PermissionsPage = () => {
  const { data: allPermsRes, isLoading } = useAllPermissionsQuery();
  const { deletePermission, isDeletingPermission } = useAdminUserMutations();

  const [searchTerm, setSearchTerm] = useState('');
  const [permToDelete, setPermToDelete] = useState<string | null>(null);

  const allPermissions = allPermsRes?.data || [];

  const filteredPermissions = allPermissions.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <Link
          href="/admin/users"
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 transition-all shadow-sm"
        >
          <FiArrowLeft size={18} />
        </Link>
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-stone-900 tracking-tight flex items-center gap-3">
            <FiLock className="text-red-600" /> Quản lý Quyền hệ thống
          </h2>
          <p className="text-stone-500 font-bold mt-1">
            Danh sách tất cả các quyền (Permissions) định danh trong mã nguồn hệ thống.
          </p>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-red-50 border border-red-100 p-6 rounded-[32px] flex items-start gap-4 shadow-sm shadow-red-900/5">
        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-600 shadow-sm shrink-0">
          <FiAlertTriangle size={24} />
        </div>
        <div>
          <h4 className="text-sm font-black text-red-900 uppercase tracking-wider mb-1">
            Cảnh báo Nguy hiểm
          </h4>
          <p className="text-xs text-red-700/80 font-bold leading-relaxed">
            Việc xóa một Quyền (Permission) khỏi hệ thống sẽ thu hồi quyền đó ngay lập tức từ{' '}
            <strong>tất cả người dùng và vai trò (Roles)</strong> đang sở hữu nó. Hành động này có
            thể gây lỗi hệ thống nếu code vẫn đang kiểm tra quyền này. Chỉ thực hiện khi bạn chắc
            chắn quyền này không còn được sử dụng.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-[32px] border border-stone-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-stone-100 bg-stone-50/50 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors" />
            <input
              type="text"
              placeholder="Tìm kiếm quyền theo tên hoặc mô tả..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-stone-200 rounded-2xl text-xs font-black text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
            />
          </div>
          <div className="px-6 py-3 bg-stone-100 rounded-2xl flex items-center gap-3 text-stone-500">
            <span className="text-[10px] font-black uppercase tracking-widest">Tổng số:</span>
            <span className="text-sm font-black text-stone-900">{filteredPermissions.length}</span>
          </div>
        </div>

        {/* Grid */}
        <div className="p-8">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-24 bg-stone-50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredPermissions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiSearch size={24} className="text-stone-300" />
              </div>
              <p className="text-stone-400 font-bold uppercase text-[10px] tracking-widest">
                Không tìm thấy quyền nào
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredPermissions.map((perm: UserPermission) => (
                  <motion.div
                    key={perm.name}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 bg-white border border-stone-100 rounded-3xl hover:border-red-200 hover:shadow-xl hover:shadow-red-900/5 transition-all group relative"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="p-2 bg-stone-50 text-stone-400 group-hover:bg-red-50 group-hover:text-red-600 rounded-xl transition-colors">
                        <FiShield size={18} />
                      </div>
                      <button
                        onClick={() => setPermToDelete(perm.name)}
                        className="p-2 text-stone-200 hover:text-red-600 transition-colors cursor-pointer"
                        title="Xóa vĩnh viễn"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                    <h4
                      className="text-xs font-black text-stone-900 uppercase tracking-tight mb-1 truncate"
                      title={perm.name}
                    >
                      {perm.name}
                    </h4>
                    <p className="text-[10px] text-stone-400 font-bold leading-relaxed line-clamp-2">
                      {perm.description || 'Chưa có mô tả cho quyền này.'}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={!!permToDelete}
        title="Xóa quyền vĩnh viễn?"
        message={`Bạn đang thực hiện xóa vĩnh viễn quyền '${permToDelete}' khỏi hệ thống. Việc này sẽ thu hồi quyền này từ TẤT CẢ người dùng và vai trò đang sở hữu nó. Bạn có chắc chắn?`}
        type="danger"
        confirmText="Xóa vĩnh viễn"
        onConfirm={async () => {
          if (permToDelete) {
            await deletePermission(permToDelete);
            setPermToDelete(null);
          }
        }}
        onCancel={() => setPermToDelete(null)}
        isLoading={isDeletingPermission}
      />
    </div>
  );
};

export default PermissionsPage;
