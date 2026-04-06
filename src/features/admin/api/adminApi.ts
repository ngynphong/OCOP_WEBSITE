import { axiosClient } from '@/lib/axios';
import {
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserPermissionsResponse,
  UpdateStaffProfileRequest,
  GetUsersParams,
  AuthResponseBase,
  StaffProfile,
} from '../types/adminTypes';

export const adminApi = {
  getUsers: (params: GetUsersParams): Promise<AdminUserListResponse> => {
    // Filter out undefined, null, or empty string values from params
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([key, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get('/admin/users', { params: filteredParams });
  },

  getUserDetail: (userId: string): Promise<AdminUserDetailResponse> => {
    return axiosClient.get(`/admin/users/${userId}`);
  },

  getUserPermissions: (userId: string): Promise<AdminUserPermissionsResponse> => {
    return axiosClient.get(`/admin/users/${userId}/permissions`);
  },

  revokePermissions: (userId: string, permissions: string[]): Promise<AuthResponseBase<string>> => {
    return axiosClient.post(`/admin/users/${userId}/permissions/revoke`, permissions);
  },

  grantPermissions: (userId: string, permissions: string[]): Promise<AuthResponseBase<string>> => {
    return axiosClient.post(`/admin/users/${userId}/permissions/grant`, permissions);
  },

  updateUserStatus: (userId: string, status: string): Promise<AdminUserDetailResponse> => {
    return axiosClient.patch(`/admin/users/${userId}/status`, null, {
      params: { status },
    });
  },

  updateUserRoles: (userId: string, roles: string[]): Promise<AdminUserDetailResponse> => {
    return axiosClient.patch(`/admin/users/${userId}/roles`, { roles });
  },

  deleteUser: (userId: string): Promise<AuthResponseBase<string>> => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  updateStaffProfile: (
    userId: string,
    data: UpdateStaffProfileRequest,
  ): Promise<AuthResponseBase<StaffProfile>> => {
    return axiosClient.put(`/admin/users/${userId}/staff-profile`, data);
  },
};
