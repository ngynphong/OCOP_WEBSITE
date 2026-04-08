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
  // Subscription Plan
  CreateSubscriptionPlanRequest,
  UpdateSubscriptionPlanRequest,
  AdminSubscriptionPlanListResponse,
  AdminSubscriptionPlanDetailResponse,
  // Roles & Permissions
  AdminRoleListResponse,
  AdminRoleDetailResponse,
  CreateRoleRequest,
  RolePermissionsRequest,
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

  // ─── Shop Management ─────────────────────────────────────────────────────

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
    return axiosClient.post(`/admin/shops/documents/${documentId}/verify`, data);
  },

  rejectDocument: (
    documentId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.post(`/admin/shops/documents/${documentId}/reject`, data);
  },

  overridePlan: (
    shopId: number | string,
    data: OverridePlanRequest,
  ): Promise<AdminOverridePlanResponse> => {
    return axiosClient.post(`/admin/shops/${shopId}/override-plan`, data);
  },

  // ─── Subscription Plans ─────────────────────────────────────────────────────

  getSubscriptionPlans: (): Promise<AdminSubscriptionPlanListResponse> => {
    return axiosClient.get('/admin/subscription-plans');
  },

  getSubscriptionPlanDetail: (planId: string): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.get(`/admin/subscription-plans/${planId}`);
  },

  createSubscriptionPlan: (
    data: CreateSubscriptionPlanRequest,
  ): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.post('/admin/subscription-plans', data);
  },

  updateSubscriptionPlan: (
    planId: string,
    data: UpdateSubscriptionPlanRequest,
  ): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.put(`/admin/subscription-plans/${planId}`, data);
  },

  toggleSubscriptionPlan: (planId: string): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.patch(`/admin/subscription-plans/${planId}/toggle`);
  },

  // ─── Permissions ──────────────────────────────────────────────────────────

  getPermissions: (): Promise<AdminUserPermissionsResponse> => {
    return axiosClient.get('/permissions');
  },

  deletePermission: (permission: string): Promise<AuthResponseBase<string>> => {
    return axiosClient.delete(`/permissions/${permission}`);
  },

  // ─── Roles Management ──────────────────────────────────────────────────────

  getRoles: (): Promise<AdminRoleListResponse> => {
    return axiosClient.get('/roles');
  },

  createRole: (data: CreateRoleRequest): Promise<AdminRoleDetailResponse> => {
    return axiosClient.post('/roles', data);
  },

  getRolePermissions: (roleName: string): Promise<AdminUserPermissionsResponse> => {
    return axiosClient.get(`/roles/${roleName}/permissions`);
  },

  addRolePermissions: (
    roleName: string,
    data: RolePermissionsRequest,
  ): Promise<AdminRoleDetailResponse> => {
    return axiosClient.post(`/roles/${roleName}/permissions`, data);
  },

  removeRolePermissions: (
    roleName: string,
    data: RolePermissionsRequest,
  ): Promise<AdminRoleDetailResponse> => {
    return axiosClient.delete(`/roles/${roleName}/permissions`, { data });
  },

  deleteRole: (roleName: string): Promise<AuthResponseBase<string>> => {
    return axiosClient.delete(`/roles/${roleName}`);
  },
};
