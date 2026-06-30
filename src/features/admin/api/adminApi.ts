import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
} from '@/features/admin/types/adminTypes';
import { CategorySchemaType, CategoryFormSchemaType } from '../types/categorySchema';

export const adminApi = {
  getAuditLogs: (params: GetAuditLogsParams): Promise<AdminAuditLogResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get(API_ENDPOINTS.ADMIN.AUDIT_LOGS, { params: filteredParams });
  },

  getUsers: (params: GetUsersParams): Promise<AdminUserListResponse> => {
    // Filter out undefined, null, or empty string values from params
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get(API_ENDPOINTS.ADMIN.USERS, { params: filteredParams });
  },

  getUserDetail: (userId: string): Promise<AdminUserDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.USERS, userId));
  },

  getUserPermissions: (userId: string): Promise<AdminUserPermissionsResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.USERS, userId, 'permissions'));
  },

  revokePermissions: (userId: string, permissions: string[]): Promise<ResponseBase<string>> => {
    return axiosClient.post(
      `${API_ENDPOINTS.ADMIN.USERS}/${userId}/permissions/revoke`,
      permissions,
    );
  },

  grantPermissions: (userId: string, permissions: string[]): Promise<ResponseBase<string>> => {
    return axiosClient.post(
      `${API_ENDPOINTS.ADMIN.USERS}/${userId}/permissions/grant`,
      permissions,
    );
  },

  updateUserStatus: (userId: string, status: string): Promise<AdminUserDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.USERS, userId, 'status'), null, {
      params: { status },
    });
  },

  updateUserRoles: (userId: string, roles: string[]): Promise<AdminUserDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.USERS, userId, 'roles'), { roles });
  },

  deleteUser: (userId: string): Promise<ResponseBase<string>> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.ADMIN.USERS, userId));
  },

  updateStaffProfile: (
    userId: string,
    data: UpdateStaffProfileRequest,
  ): Promise<ResponseBase<StaffProfile>> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.USERS, userId, 'staff-profile'), data);
  },

  getStaffMyProfile: (): Promise<ResponseBase<StaffProfile>> => {
    return axiosClient.get(API_ENDPOINTS.STAFF.ME_PROFILE);
  },

  // ─── Shop Management ─────────────────────────────────────────────────────

  getShops: (params: GetShopsParams): Promise<AdminShopListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get(API_ENDPOINTS.ADMIN.SHOPS, { params: filteredParams });
  },

  getShopDetail: (shopId: number | string): Promise<AdminShopDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId));
  },

  getShopStatusLogs: (shopId: number | string): Promise<AdminShopStatusLogsResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'status-logs'));
  },

  approveShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<ResponseBase<string>> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'approve'), data);
  },

  rejectShop: (
    shopId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'reject'), data);
  },

  lockShop: (shopId: number | string, data: ShopActionRequest): Promise<ResponseBase<string>> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'lock'), data);
  },

  unlockShop: (shopId: number | string, data: ShopActionRequest): Promise<ResponseBase<string>> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'unlock'), data);
  },

  verifyDocument: (
    documentId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.SHOPS}/documents/${documentId}/verify`, data);
  },

  rejectDocument: (
    documentId: number | string,
    data: ShopActionRequest,
  ): Promise<AdminShopDocumentResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.SHOPS}/documents/${documentId}/reject`, data);
  },

  overridePlan: (
    shopId: number | string,
    data: OverridePlanRequest,
  ): Promise<AdminOverridePlanResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'override-plan'), data);
  },

  updateShopOwner: (
    shopId: number | string,
    data: UpdateShopOwnerRequest,
  ): Promise<AdminShopDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.SHOPS, shopId, 'owner'), data);
  },

  // ─── Subscription Plans ─────────────────────────────────────────────────────

  getSubscriptionPlans: (): Promise<AdminSubscriptionPlanListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS);
  },

  getSubscriptionPlanDetail: (planId: string): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS, planId));
  },

  createSubscriptionPlan: (
    data: CreateSubscriptionPlanRequest,
  ): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS, data);
  },

  updateSubscriptionPlan: (
    planId: string,
    data: UpdateSubscriptionPlanRequest,
  ): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS, planId), data);
  },

  toggleSubscriptionPlan: (planId: string): Promise<AdminSubscriptionPlanDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.SUBSCRIPTION_PLANS, planId, 'toggle'));
  },

  // ─── Permissions ──────────────────────────────────────────────────────────

  getPermissions: (): Promise<AdminUserPermissionsResponse> => {
    return axiosClient.get(API_ENDPOINTS.PERMISSIONS);
  },

  deletePermission: (permission: string): Promise<ResponseBase<string>> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.PERMISSIONS, permission));
  },

  // ─── Roles Management ──────────────────────────────────────────────────────

  getRoles: (): Promise<AdminRoleListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ROLES);
  },

  createRole: (data: CreateRoleRequest): Promise<AdminRoleDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.ROLES, data);
  },

  getRolePermissions: (roleName: string): Promise<AdminUserPermissionsResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ROLES, roleName, 'permissions'));
  },

  addRolePermissions: (
    roleName: string,
    data: RolePermissionsRequest,
  ): Promise<AdminRoleDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ROLES, roleName, 'permissions'), data);
  },

  removeRolePermissions: (
    roleName: string,
    data: RolePermissionsRequest,
  ): Promise<AdminRoleDetailResponse> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.ROLES, roleName, 'permissions'), { data });
  },

  deleteRole: (roleName: string): Promise<ResponseBase<string>> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.ROLES, roleName));
  },

  // ─── Category Management ────────────────────────────────────────────────────

  getCategories: (): Promise<AdminCategoryListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.CATEGORIES);
  },

  getCategoryDetail: (id: number): Promise<AdminCategoryDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.CATEGORIES, id));
  },

  createCategories: (data: CategoryCreateRequest[]): Promise<AdminCategoryListResponse> => {
    return axiosClient.post(API_ENDPOINTS.ADMIN.CATEGORIES, data);
  },

  updateCategory: (
    id: number,
    data: CategoryUpdateRequest,
  ): Promise<AdminCategoryDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.CATEGORIES, id), data);
  },

  deleteCategory: (id: number): Promise<ResponseBase<string>> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.ADMIN.CATEGORIES, id));
  },

  checkCategorySlug: (slug: string): Promise<CategoryCheckSlugResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.CATEGORIES}/check-slug`, null, {
      params: { slug },
      headers: {
        'X-Silent-Loading': 'true',
      },
    });
  },

  createCategoriesFromForm: (data: CategorySchemaType[]): Promise<AdminCategoryListResponse> => {
    return axiosClient.post(API_ENDPOINTS.ADMIN.CATEGORIES, data);
  },

  updateCategoryFromForm: (
    id: number,
    data: CategorySchemaType,
  ): Promise<AdminCategoryDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.CATEGORIES, id), data);
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

    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.CATEGORIES, id), formData, {
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

    return axiosClient.post(API_ENDPOINTS.ADMIN.CATEGORIES, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
