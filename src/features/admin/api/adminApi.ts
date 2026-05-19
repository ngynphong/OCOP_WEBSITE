import { axiosClient } from '@/lib/axios';
import {
  AdminUserListResponse,
  AdminUserDetailResponse,
  AdminUserPermissionsResponse,
  UpdateStaffProfileRequest,
  GetUsersParams,
  ResponseBase,
  StaffProfile,
  GetShopsParams,
  AdminShopListResponse,
  AdminShopDetailResponse,
  AdminShopStatusLogsResponse,
  ShopActionRequest,
  AdminShopDocumentResponse,
  OverridePlanRequest,
  AdminOverridePlanResponse,
  UpdateShopOwnerRequest,
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
  // Categories
  CategoryCreateRequest,
  CategoryUpdateRequest,
  AdminCategoryListResponse,
  AdminCategoryDetailResponse,
  CategoryCheckSlugResponse,
  AdminAuditLogResponse,
  GetAuditLogsParams,
} from '../types/adminTypes';
import { CategorySchemaType, CategoryFormSchemaType } from '../types/categorySchema';

export const adminApi = {
  getAuditLogs: (params: GetAuditLogsParams): Promise<AdminAuditLogResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get('/admin/audit-logs', { params: filteredParams });
  },

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

  revokePermissions: (userId: string, permissions: string[]): Promise<ResponseBase<string>> => {
    return axiosClient.post(`/admin/users/${userId}/permissions/revoke`, permissions);
  },

  grantPermissions: (userId: string, permissions: string[]): Promise<ResponseBase<string>> => {
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

  deleteUser: (userId: string): Promise<ResponseBase<string>> => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  updateStaffProfile: (
    userId: string,
    data: UpdateStaffProfileRequest,
  ): Promise<ResponseBase<StaffProfile>> => {
    return axiosClient.put(`/admin/users/${userId}/staff-profile`, data);
  },

  getStaffMyProfile: (): Promise<ResponseBase<StaffProfile>> => {
    return axiosClient.get('/staff/me/profile');
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
  ): Promise<ResponseBase<string>> => {
    return axiosClient.post(`/admin/shops/${shopId}/approve`, data);
  },

  rejectShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.post(`/admin/shops/${shopId}/reject`, data);
  },

  lockShop: (shopId: number | string, data: ShopActionRequest): Promise<ResponseBase<string>> => {
    return axiosClient.post(`/admin/shops/${shopId}/lock`, data);
  },

  unlockShop: (shopId: number | string, data: ShopActionRequest): Promise<ResponseBase<string>> => {
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

  updateShopOwner: (
    shopId: number | string,
    data: UpdateShopOwnerRequest,
  ): Promise<AdminShopDetailResponse> => {
    return axiosClient.patch(`/admin/shops/${shopId}/owner`, data);
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

  deletePermission: (permission: string): Promise<ResponseBase<string>> => {
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

  deleteRole: (roleName: string): Promise<ResponseBase<string>> => {
    return axiosClient.delete(`/roles/${roleName}`);
  },

  // ─── Category Management ────────────────────────────────────────────────────

  getCategories: (): Promise<AdminCategoryListResponse> => {
    return axiosClient.get('/admin/categories');
  },

  getCategoryDetail: (id: number): Promise<AdminCategoryDetailResponse> => {
    return axiosClient.get(`/admin/categories/${id}`);
  },

  createCategories: (data: CategoryCreateRequest[]): Promise<AdminCategoryListResponse> => {
    return axiosClient.post('/admin/categories', data);
  },

  updateCategory: (
    id: number,
    data: CategoryUpdateRequest,
  ): Promise<AdminCategoryDetailResponse> => {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },

  deleteCategory: (id: number): Promise<ResponseBase<string>> => {
    return axiosClient.delete(`/admin/categories/${id}`);
  },

  checkCategorySlug: (slug: string): Promise<CategoryCheckSlugResponse> => {
    return axiosClient.post('/admin/categories/check-slug', null, {
      params: { slug },
    });
  },

  createCategoriesFromForm: (data: CategorySchemaType[]): Promise<AdminCategoryListResponse> => {
    return axiosClient.post('/admin/categories', data);
  },

  updateCategoryFromForm: (
    id: number,
    data: CategorySchemaType,
  ): Promise<AdminCategoryDetailResponse> => {
    return axiosClient.put(`/admin/categories/${id}`, data);
  },

  updateCategoryMultipart: (
    id: number,
    data: CategoryFormSchemaType,
  ): Promise<AdminCategoryDetailResponse> => {
    const formData = new FormData();

    // Prepare request object (JSON)
    const requestObj = {
      name: data.name,
      slug: data.slug,
      parentId: data.parentId,
      description: data.description,
      sortOrder: data.sortOrder?.toString(),
      isActive: data.isActive,
    };

    formData.append(
      'request',
      new Blob([JSON.stringify(requestObj)], { type: 'application/json' }),
    );

    if (data.iconFile && data.iconFile[0]) {
      formData.append('icon', data.iconFile[0]);
    }
    if (data.bannerFile && data.bannerFile[0]) {
      formData.append('banner', data.bannerFile[0]);
    }

    return axiosClient.put(`/admin/categories/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  createCategoriesMultipart: (
    formDatas: CategoryFormSchemaType[],
  ): Promise<AdminCategoryListResponse> => {
    const formData = new FormData();

    // Prepare data array (JSON)
    const dataArray = formDatas.map((fd) => ({
      name: fd.name,
      slug: fd.slug,
      parentId: fd.parentId,
      description: fd.description,
      sortOrder: fd.sortOrder?.toString(),
      isActive: fd.isActive,
    }));

    formData.append('data', JSON.stringify(dataArray));

    // Append icons and banners
    formDatas.forEach((fd) => {
      if (fd.iconFile && fd.iconFile[0]) {
        formData.append('icons', fd.iconFile[0]);
      }
      if (fd.bannerFile && fd.bannerFile[0]) {
        formData.append('banners', fd.bannerFile[0]);
      }
    });

    return axiosClient.post('/admin/categories', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
