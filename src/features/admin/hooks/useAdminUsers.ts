import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/features/admin/api/adminApi';
import { GetUsersParams, UpdateStaffProfileRequest } from '@/features/admin/types/adminTypes';
import toast from 'react-hot-toast';

// ─── Standalone Query Hooks ────────────────────────────────────────────────────

export const useUsersQuery = (params: GetUsersParams) => {
  return useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminApi.getUsers(params),
    staleTime: 30 * 1000,
  });
};

export const useUserDetailQuery = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ['admin-user-detail', userId],
    queryFn: () => adminApi.getUserDetail(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
};

export const useStaffMyProfileQuery = () => {
  return useQuery({
    queryKey: ['admin-staff-my-profile'],
    queryFn: () => adminApi.getStaffMyProfile(),
    staleTime: 60 * 1000,
  });
};

export const useUserPermissionsQuery = (userId: string | null | undefined) => {
  return useQuery({
    queryKey: ['admin-user-permissions', userId],
    queryFn: () => adminApi.getUserPermissions(userId!),
    enabled: !!userId,
    staleTime: 60 * 1000,
  });
};

export const useAllPermissionsQuery = () => {
  return useQuery({
    queryKey: ['admin-all-permissions'],
    queryFn: () => adminApi.getPermissions(),
    staleTime: 5 * 60 * 1000,
  });
};

// ─── Mutation Hook ─────────────────────────────────────────────────────────────

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: string }) =>
      adminApi.updateUserStatus(userId, status),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
    },
  });

  const updateUserRolesMutation = useMutation({
    mutationFn: ({ userId, roles }: { userId: string; roles: string[] }) =>
      adminApi.updateUserRoles(userId, roles),
    onSuccess: () => {
      toast.success('Cập nhật quyền thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
    },
  });

  const grantPermissionsMutation = useMutation({
    mutationFn: ({ userId, permissions }: { userId: string; permissions: string[] }) =>
      adminApi.grantPermissions(userId, permissions),
    onSuccess: () => {
      toast.success('Cấp quyền thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-user-permissions'] });
    },
  });

  const revokePermissionsMutation = useMutation({
    mutationFn: ({ userId, permissions }: { userId: string; permissions: string[] }) =>
      adminApi.revokePermissions(userId, permissions),
    onSuccess: () => {
      toast.success('Thu hồi quyền thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-user-permissions'] });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      toast.success('Đã xóa người dùng');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const updateStaffProfileMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: string; data: UpdateStaffProfileRequest }) =>
      adminApi.updateStaffProfile(userId, data),
    onSuccess: () => {
      toast.success('Cập nhật hồ sơ nhân viên thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail'] });
    },
  });

  const deletePermissionMutation = useMutation({
    mutationFn: (permission: string) => adminApi.deletePermission(permission),
    onSuccess: () => {
      toast.success('Đã xóa quyền khỏi hệ thống');
      queryClient.invalidateQueries({ queryKey: ['admin-all-permissions'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user-permissions'] });
    },
  });

  return {
    updateUserStatus: updateUserStatusMutation.mutateAsync,
    isUpdatingStatus: updateUserStatusMutation.isPending,
    updateUserRoles: updateUserRolesMutation.mutateAsync,
    isUpdatingRoles: updateUserRolesMutation.isPending,
    grantPermissions: grantPermissionsMutation.mutateAsync,
    isGrantingPermissions: grantPermissionsMutation.isPending,
    revokePermissions: revokePermissionsMutation.mutateAsync,
    isRevokingPermissions: revokePermissionsMutation.isPending,
    deleteUser: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending,
    updateStaffProfile: updateStaffProfileMutation.mutateAsync,
    isUpdatingStaffProfile: updateStaffProfileMutation.isPending,
    deletePermission: deletePermissionMutation.mutateAsync,
    isDeletingPermission: deletePermissionMutation.isPending,
  };
};

/**
 * @deprecated Dùng `useUsersQuery`, `useUserDetailQuery`, `useAdminUserMutations` riêng lẻ.
 */
export const useAdminUsers = () => useAdminUserMutations();
