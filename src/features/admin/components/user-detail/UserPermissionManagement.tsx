'use client';

import React, { useState } from 'react';
import { FiCheckCircle, FiPlus, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { UserPermission, AdminUserListItem } from '@/features/admin/types/adminTypes';

interface UserPermissionManagementProps {
  user: AdminUserListItem;
  permissions: UserPermission[];
  availablePermissions: UserPermission[];
  isLoadingPerms: boolean;
  onRevokePermission: (perm: string) => Promise<void>;
  onGrantPermissions: (perms: string[]) => Promise<void>;
}

const UserPermissionManagement = ({
  permissions,
  availablePermissions,
  isLoadingPerms,
  onRevokePermission,
  onGrantPermissions,
}: UserPermissionManagementProps) => {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionFilter, setPermissionFilter] = useState('');

  const permissionCategories = Array.from(
    new Set(availablePermissions.map((p) => p.name.split('.')[0])),
  ).sort();

  const filteredAvailablePermissions = availablePermissions.filter((p) => {
    if (!permissionFilter) return true;
    return p.name.startsWith(permissionFilter);
  });

  const togglePermission = (permName: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permName) ? prev.filter((p) => p !== permName) : [...prev, permName],
    );
  };

  const handleGrant = async () => {
    if (selectedPermissions.length === 0) return;
    await onGrantPermissions(selectedPermissions);
    setSelectedPermissions([]);
  };

  return (
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
          permissions.map((perm) => (
            <div
              key={perm.name}
              className="p-4 bg-stone-50 rounded-2xl border border-stone-100 flex justify-between items-start group min-w-[240px]"
            >
              <div>
                <p className="text-xs font-black text-stone-900 uppercase mb-1">{perm.name}</p>
                <p className="text-[10px] text-stone-400 leading-relaxed max-w-[180px]">
                  {perm.description}
                </p>
              </div>
              <button
                onClick={() => onRevokePermission(perm.name)}
                title="Thu hồi quyền"
                className="text-stone-300 hover:text-amber-600 transition-colors cursor-pointer"
              >
                <FiX size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <h5 className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
            Lọc theo danh mục
          </h5>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPermissionFilter('')}
              className={cn(
                'px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer',
                !permissionFilter
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
              )}
            >
              Tất cả
            </button>
            {permissionCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setPermissionFilter(cat)}
                className={cn(
                  'px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all cursor-pointer',
                  permissionFilter === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
          {filteredAvailablePermissions.length === 0 ? (
            <div className="col-span-2 py-8 text-center text-stone-400 text-xs font-bold italic">
              Không có quyền nào phù hợp trong mục này.
            </div>
          ) : (
            filteredAvailablePermissions.map((p) => (
              <div
                key={p.name}
                onClick={() => togglePermission(p.name)}
                className={cn(
                  'p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3',
                  selectedPermissions.includes(p.name)
                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                    : 'bg-white border-stone-100 hover:border-blue-100',
                )}
              >
                <div
                  className={cn(
                    'w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 mt-0.5',
                    selectedPermissions.includes(p.name)
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-stone-200 bg-white',
                  )}
                >
                  {selectedPermissions.includes(p.name) && <FiCheckCircle size={12} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-black text-stone-900 uppercase truncate">
                    {p.name}
                  </p>
                  <p className="text-[10px] text-stone-400 leading-tight line-clamp-1">
                    {p.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-stone-50 flex items-center justify-between">
          <span className="text-[10px] font-bold text-stone-400">
            Đã chọn: <span className="text-blue-600 font-black">{selectedPermissions.length}</span>{' '}
            quyền
          </span>
          <button
            onClick={handleGrant}
            disabled={selectedPermissions.length === 0}
            className="px-8 py-3 bg-blue-600 text-white text-[10px] font-black rounded-2xl uppercase hover:bg-blue-700 shadow-lg shadow-blue-900/10 transition-all flex items-center gap-2 disabled:opacity-40 disabled:grayscale active:scale-95 cursor-pointer"
          >
            <FiPlus /> Cấp quyền cho user
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionManagement;
