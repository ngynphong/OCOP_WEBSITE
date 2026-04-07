'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiSave,
  FiInfo,
  FiShield,
  FiFileText,
  FiCheck,
  FiCheckCircle,
  FiSearch,
} from 'react-icons/fi';
import { AdminRole, UserPermission } from '../types/adminTypes';
import { useAdminRoles } from '../hooks/useAdminRoles';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';

const roleSchema = z.object({
  name: z.string().min(2, 'Tên vai trò ít nhất 2 ký tự').max(50, 'Tên quá dài'),
  description: z.string().max(200, 'Mô tả không quá 200 ký tự'),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface RoleFormDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  role?: AdminRole | null;
}

const RoleFormDrawer = ({ isOpen, onClose, role }: RoleFormDrawerProps) => {
  const { createRole, isCreatingRole, addRolePermissions, removeRolePermissions } = useAdminRoles();
  const { useAllPermissionsQuery } = useAdminUsers();
  const { data: allPermsData, isLoading: isLoadingPerms } = useAllPermissionsQuery();

  const allPermissions = allPermsData?.data || [];
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description || '',
      });
      setSelectedPermissions(role.permissions.map((p) => p.name));
    } else {
      reset({
        name: '',
        description: '',
      });
      setSelectedPermissions([]);
    }
  }, [role, reset, isOpen]);

  const togglePermission = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName) ? prev.filter((p) => p !== permName) : [...prev, permName],
    );
  };

  const onSubmit = async (data: RoleFormData) => {
    try {
      if (role) {
        // Edit mode - manage permissions differences
        const currentPerms = role.permissions.map((p) => p.name);
        const toAdd = selectedPermissions.filter((p) => !currentPerms.includes(p));
        const toRemove = currentPerms.filter((p) => !selectedPermissions.includes(p));

        if (toAdd.length > 0) {
          await addRolePermissions({ roleName: role.name, data: { permissionNames: toAdd } });
        }
        if (toRemove.length > 0) {
          await removeRolePermissions({ roleName: role.name, data: { permissionNames: toRemove } });
        }
      } else {
        // Create mode
        await createRole({
          ...data,
          permissions: selectedPermissions,
        });
      }
      onClose();
    } catch (error) {
      // Errors handled by axios interceptor
    }
  };

  const filteredPermissions = useMemo(() => {
    return allPermissions.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [allPermissions, searchQuery]);

  const isSubmitting = isCreatingRole;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 w-full max-w-2xl bg-white h-full shadow-2xl z-60 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
              <div>
                <h3 className="text-xl font-black text-emerald-900 leading-tight">
                  {role ? `Chỉnh sửa: ${role.name}` : 'Thêm vai trò mới'}
                </h3>
                <p className="text-[10px] text-stone-400 font-black uppercase tracking-[0.2em] mt-1">
                  Định nghĩa các nhóm quyền hạn truy cập
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white rounded-full transition-colors text-stone-400 hover:text-stone-600 shadow-sm border border-transparent hover:border-stone-100"
              >
                <FiX size={24} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">
                {/* Basic Info */}
                <section className="space-y-4">
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                    <FiInfo className="text-emerald-500" /> Thông tin vai trò
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Tên vai trò
                      </label>
                      <div className="relative">
                        <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300" />
                        <input
                          {...register('name')}
                          disabled={!!role}
                          placeholder="Ví dụ: QUẢN_LÝ_KHO"
                          className={cn(
                            'w-full pl-11 pr-4 py-3 bg-stone-50 border rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none',
                            errors.name
                              ? 'border-red-300 ring-4 ring-red-50'
                              : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500',
                            role && 'bg-stone-100 cursor-not-allowed opacity-70',
                          )}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-500 uppercase tracking-normal mb-1.5 ml-1">
                        Mô tả vai trò
                      </label>
                      <div className="relative">
                        <FiFileText className="absolute left-4 top-4 text-stone-300" />
                        <textarea
                          {...register('description')}
                          rows={3}
                          placeholder="Mô tả tóm tắt về vai trò này..."
                          className={cn(
                            'w-full pl-11 pr-4 py-3 bg-stone-50 border rounded-2xl text-sm font-bold text-stone-800 transition-all outline-none resize-none',
                            errors.description
                              ? 'border-red-300 ring-4 ring-red-50'
                              : 'border-stone-100 focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500',
                          )}
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-1.5 ml-1 text-[10px] font-black text-red-500 uppercase italic">
                          {errors.description.message}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Permissions Management */}
                <section className="space-y-4">
                  <div className="flex justify-between items-end">
                    <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                      <FiCheckCircle className="text-emerald-500" /> Danh sách quyền hạn (
                      {selectedPermissions.length})
                    </h4>
                    <div className="relative w-48">
                      <FiSearch
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300"
                        size={12}
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Tìm quyền..."
                        className="w-full pl-8 pr-3 py-1.5 bg-stone-50 text-gray-700 border border-stone-100 rounded-xl text-[10px] font-bold outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {isLoadingPerms ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-12 bg-stone-50 rounded-xl animate-pulse" />
                      ))
                    ) : filteredPermissions.length === 0 ? (
                      <div className="p-10 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-200">
                        <p className="text-[10px] font-black text-stone-300 uppercase italic">
                          Không tìm thấy quyền nào
                        </p>
                      </div>
                    ) : (
                      filteredPermissions.map((perm) => {
                        const isSelected = selectedPermissions.includes(perm.name);
                        return (
                          <div
                            key={perm.name}
                            onClick={() => togglePermission(perm.name)}
                            className={cn(
                              'group flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer select-none',
                              isSelected
                                ? 'bg-emerald-50 border-emerald-200 shadow-sm shadow-emerald-900/5'
                                : 'bg-white border-stone-100 hover:border-emerald-200 hover:bg-stone-50/50',
                            )}
                          >
                            <div
                              className={cn(
                                'w-6 h-6 rounded-lg flex items-center justify-center transition-all',
                                isSelected
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-stone-100 text-stone-300 group-hover:bg-emerald-100',
                              )}
                            >
                              {isSelected && <FiCheck size={14} />}
                            </div>
                            <div className="flex-1">
                              <p
                                className={cn(
                                  'text-xs font-black tracking-tight',
                                  isSelected ? 'text-emerald-900' : 'text-stone-700',
                                )}
                              >
                                {perm.name}
                              </p>
                              <p className="text-[9px] font-bold text-stone-400 leading-tight">
                                {perm.description || 'Chưa có mô tả quyền hạn.'}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </section>
              </div>

              {/* Action Footer */}
              <div className="p-6 border-t border-stone-100 bg-stone-50/50 sticky bottom-0">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-emerald-900 text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 hover:bg-emerald-800 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSave size={18} />
                  )}
                  {role ? 'Lưu thay đổi quyền hạn' : 'Tạo vai trò mới'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default RoleFormDrawer;
