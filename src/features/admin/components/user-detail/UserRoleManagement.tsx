'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShield, FiPlus, FiX, FiAward } from 'react-icons/fi';
import toast from 'react-hot-toast';

import { AdminUserListItem, AdminRole } from '@/features/admin/types/adminTypes';

interface UserRoleManagementProps {
  user: AdminUserListItem;
  availableRoles: AdminRole[];
  onAddRole: (role: string) => Promise<void>;
  onRemoveRole: (role: string) => Promise<void>;
}

const UserRoleManagement = ({
  user,
  availableRoles,
  onAddRole,
  onRemoveRole,
}: UserRoleManagementProps) => {
  const [newRole, setNewRole] = useState('');

  const handleAddRole = async () => {
    if (!newRole) return;
    if (user.roles.includes(newRole)) {
      toast.error('Người dùng đã có vai trò này');
      return;
    }
    try {
      await onAddRole(newRole);
      setNewRole('');
    } catch (error: unknown) {
      console.error('Add role error', error);
      toast.error(error instanceof Error ? error.message : 'Có lỗi xảy ra khi thêm vai trò');
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-stone-100">
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
                onClick={() => onRemoveRole(role)}
                className="text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
              >
                <FiX size={14} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex gap-3 mt-auto">
        <div className="relative flex-1 group">
          <FiAward className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-emerald-600 transition-colors" />
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 bg-stone-50 border border-stone-100 rounded-xl text-xs font-black text-stone-800 outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Chọn vai trò để thêm...</option>
            {availableRoles.map((role: AdminRole) => (
              <option key={role.name} value={role.name}>
                {role.name} {role.description ? `- ${role.description}` : ''}
              </option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <FiPlus className="text-stone-400" />
          </div>
        </div>
        <button
          onClick={handleAddRole}
          disabled={!newRole}
          className="px-6 py-3.5 bg-[#0D631B] text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-900/20 flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiPlus /> Thêm
        </button>
      </div>
    </div>
  );
};

export default UserRoleManagement;
