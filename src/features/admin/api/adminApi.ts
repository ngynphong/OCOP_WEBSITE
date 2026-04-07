import { axiosClient } from '@/lib/axios';
import {
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserPermissionsResponse,
  UpdateStaffProfileRequest,
  GetUsersParams,
  AuthResponseBase,
  StaffProfile,
  GetShopsParams,
  AdminShopListResponse,
  AdminShopDetailResponse,
  AdminShopStatusLogsResponse,
  ShopActionRequest,
  AdminShopDocumentResponse,
  OverridePlanRequest,
  AdminOverridePlanResponse,
} from '../types/adminTypes';

export const adminApi = {
  getUsers: (params: GetUsersParams): Promise<AdminUserListResponse> => {
    // Filter out undefined, null, or empty string values from params
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
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

  // Shop Management
  getShops: (params: GetShopsParams): Promise<AdminShopListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get('/admin/shops', { params: filteredParams });
  },

  getShopDetail: (shopId: number | string): Promise<AdminShopDetailResponse> => {
    return axiosClient.get(`/admin/shops/${shopId}`);
  },

  getShopStatusLogs: (shopId: number | string): Promise<AdminShopStatusLogsResponse> => {
    return axiosClient.get(`/admin/shops/${shopId}/status-logs`);
  },

  approveShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<AuthResponseBase<string>> => {
    return axiosClient.post(`/admin/shops/${shopId}/approve`, data);
  },

  rejectShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.post(`/admin/shops/${shopId}/reject`, data);
  },

  lockShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<AuthResponseBase<string>> => {
    return axiosClient.post(`/admin/shops/${shopId}/lock`, data);
  },

  unlockShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<AuthResponseBase<string>> => {
    return axiosClient.post(`/admin/shops/${shopId}/unlock`, data);
  },

  verifyDocument: (
    documentId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.patch(`/admin/shop-documents/${documentId}/verify`, data);
  },

  rejectDocument: (
    documentId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.patch(`/admin/shop-documents/${documentId}/reject`, data);
  },

  overridePlan: (
    shopId: number | string,
    data: OverridePlanRequest,
  ): Promise<AdminOverridePlanResponse> => {
    return axiosClient.post(`/admin/shops/${shopId}/override-plan`, data);
  },
};
