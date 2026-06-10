import { useAuthProfile } from './useAuthProfile';
import { PermissionValue } from '../constants/permissions';

export const usePermission = () => {
  const { profile, isLoadingProfile } = useAuthProfile();

  const permissions = profile?.permissions || [];
  const roles = profile?.roles || [];

  const isSuperAdmin = roles.includes('ADMIN');

  const hasPermission = (permission: PermissionValue): boolean => {
    if (isSuperAdmin) return true;
    return permissions.includes(permission);
  };

  const hasAnyPermission = (requiredPermissions: PermissionValue[]): boolean => {
    if (isSuperAdmin) return true;
    return requiredPermissions.some((p) => permissions.includes(p));
  };

  const hasAllPermissions = (requiredPermissions: PermissionValue[]): boolean => {
    if (isSuperAdmin) return true;
    return requiredPermissions.every((p) => permissions.includes(p));
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  const isAdminUser = (): boolean => {
    if (roles.length === 0) return false;
    const CUSTOMER_ONLY_ROLES = ['USER', 'SELLER'];
    return roles.some((role) => !CUSTOMER_ONLY_ROLES.includes(role));
  };

  return {
    permissions,
    roles,
    isSuperAdmin,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdminUser: isAdminUser(),
    isLoadingProfile,
  };
};
