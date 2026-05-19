'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useAdminUserMutations,
  useUserDetailQuery,
  useUserPermissionsQuery,
  useAllPermissionsQuery,
} from '@/features/admin/hooks/useAdminUsers';
import { useRolesQuery } from '@/features/admin/hooks/useAdminRoles';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

// Modular Components
import UserDetailHeader from '@/features/admin/components/user-detail/UserDetailHeader';
import UserDetailSidebar from '@/features/admin/components/user-detail/UserDetailSidebar';
import UserRoleManagement from '@/features/admin/components/user-detail/UserRoleManagement';
import UserPermissionManagement from '@/features/admin/components/user-detail/UserPermissionManagement';
import UserStaffProfile from '@/features/admin/components/user-detail/UserStaffProfile';
import UserLoyaltyPoints from '@/features/admin/components/user-detail/UserLoyaltyPoints';

const UserDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const {
    updateUserStatus,
    updateUserRoles,
    grantPermissions,
    revokePermissions,
    deleteUser,
    updateStaffProfile,
    isUpdatingStaffProfile,
  } = useAdminUserMutations();

  const { data: userRes, isLoading: isLoadingUser } = useUserDetailQuery(id as string);
  const { data: permRes, isLoading: isLoadingPerms } = useUserPermissionsQuery(id as string);
  const { data: allPermsRes } = useAllPermissionsQuery();
  const { data: rolesRes } = useRolesQuery();

  const user = userRes?.data;
  const permissions = useMemo(() => permRes?.data || [], [permRes]);
  const allPermissions = useMemo(() => allPermsRes?.data || [], [allPermsRes]);
  const allSystemRoles = useMemo(() => rolesRes?.data || [], [rolesRes]);

  // Modal States
  const [showLockModal, setShowLockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Derived Data
  const availableRoles = useMemo(
    () => allSystemRoles.filter((r) => !user?.roles.includes(r.name)),
    [allSystemRoles, user?.roles],
  );

  const availablePermissions = useMemo(() => {
    const userPermissionNames = permissions.map((p) => p.name);
    return allPermissions.filter((p) => !userPermissionNames.includes(p.name));
  }, [allPermissions, permissions]);

  if (isLoadingUser) return <LoadingOverlay />;
  if (!user)
    return (
      <div className="text-center py-20 font-black text-stone-400">Người dùng không tồn tại</div>
    );

  return (
    <div className="space-y-8 pb-20">
      <UserDetailHeader
        user={user}
        onLock={() => setShowLockModal(true)}
        onDelete={() => setShowDeleteModal(true)}
      />

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 space-y-6 lg:col-span-4">
          <UserDetailSidebar user={user} />
          <UserStaffProfile
            userId={user.id}
            staffProfile={user.staffProfile}
            onUpdate={async (data) => {
              await updateStaffProfile({ userId: user.id, data });
            }}
            isUpdating={isUpdatingStaffProfile}
          />
        </div>
        <div className="col-span-12 lg:col-span-8 space-y-8">
          <UserLoyaltyPoints id={id as string} />
          <UserRoleManagement
            user={user}
            availableRoles={availableRoles}
            onAddRole={async (role) => {
              await updateUserRoles({ userId: user.id, roles: [...user.roles, role] });
            }}
            onRemoveRole={async (role) => {
              await updateUserRoles({
                userId: user.id,
                roles: user.roles.filter((r) => r !== role),
              });
            }}
          />

          <UserPermissionManagement
            user={user}
            permissions={permissions}
            availablePermissions={availablePermissions}
            isLoadingPerms={isLoadingPerms}
            onRevokePermission={async (permName) => {
              await revokePermissions({ userId: user.id, permissions: [permName] });
            }}
            onGrantPermissions={async (perms) => {
              await grantPermissions({ userId: user.id, permissions: perms });
            }}
          />
        </div>
      </div>

      {/* Confirmation Modals */}
      <ConfirmModal
        isOpen={showLockModal}
        title={user.status === 'LOCKED' ? 'Mở khóa tài khoản?' : 'Tạm khóa tài khoản?'}
        message={
          user.status === 'LOCKED'
            ? 'Người dùng này sẽ có thể đăng nhập lại vào hệ thống.'
            : 'Người dùng này sẽ không thể đăng nhập cho đến khi được mở khóa.'
        }
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
        title="Xóa tài khoản vĩnh viễn?"
        message="Hành động này không thể hoàn tác. Mọi dữ liệu liên quan đến người dùng này sẽ bị xóa."
        type="danger"
        onConfirm={async () => {
          await deleteUser(user.id);
          setShowDeleteModal(false);
          router.push('/admin/users');
        }}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default UserDetailPage;
