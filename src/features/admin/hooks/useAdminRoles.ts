import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { CreateRoleRequest, RolePermissionsRequest } from '../types/adminTypes';
import toast from 'react-hot-toast';

// ─── Standalone Query Hooks ────────────────────────────────────────────────────

export const useRolesQuery = () => {
  return useQuery({
    queryKey: ['admin-roles'],
    queryFn: () => adminApi.getRoles(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useRolePermissionsQuery = (roleName: string | null | undefined) => {
  return useQuery({
    queryKey: ['admin-role-permissions', roleName],
    queryFn: () => adminApi.getRolePermissions(roleName!),
    enabled: !!roleName,
    staleTime: 60 * 1000,
  });
};

// ─── Mutation Hook ─────────────────────────────────────────────────────────────

export const useAdminRoleMutations = () => {
  const queryClient = useQueryClient();

  const createRoleMutation = useMutation({
    mutationFn: (data: CreateRoleRequest) => adminApi.createRole(data),
    onSuccess: () => {
      toast.success('Tạo vai trò thành công');
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    },
  });

  const addRolePermissionsMutation = useMutation({
    mutationFn: ({ roleName, data }: { roleName: string; data: RolePermissionsRequest }) =>
      adminApi.addRolePermissions(roleName, data),
    onSuccess: (_, variables) => {
      toast.success(`Đã cập nhật quyền cho vai trò ${variables.roleName}`);
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-role-permissions', variables.roleName] });
    },
  });

  const removeRolePermissionsMutation = useMutation({
    mutationFn: ({ roleName, data }: { roleName: string; data: RolePermissionsRequest }) =>
      adminApi.removeRolePermissions(roleName, data),
    onSuccess: (_, variables) => {
      toast.success(`Đã gỡ quyền khỏi vai trò ${variables.roleName}`);
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
      queryClient.invalidateQueries({ queryKey: ['admin-role-permissions', variables.roleName] });
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleName: string) => adminApi.deleteRole(roleName),
    onSuccess: () => {
      toast.success('Đã xóa vai trò');
      queryClient.invalidateQueries({ queryKey: ['admin-roles'] });
    },
  });

  return {
    createRole: createRoleMutation.mutateAsync,
    isCreatingRole: createRoleMutation.isPending,
    addRolePermissions: addRolePermissionsMutation.mutateAsync,
    isAddingPermissions: addRolePermissionsMutation.isPending,
    removeRolePermissions: removeRolePermissionsMutation.mutateAsync,
    isRemovingPermissions: removeRolePermissionsMutation.isPending,
    deleteRole: deleteRoleMutation.mutateAsync,
    isDeletingRole: deleteRoleMutation.isPending,
  };
};

/**
 * @deprecated Dùng `useRolesQuery`, `useRolePermissionsQuery`, `useAdminRoleMutations` riêng lẻ.
 */
export const useAdminRoles = () => useAdminRoleMutations();
