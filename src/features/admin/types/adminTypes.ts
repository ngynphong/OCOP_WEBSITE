import { ResponseBase } from '@/features/auth/types';

export type { ResponseBase };

export interface AdminUserListItem {
  id: string;
  email: string;
  phoneNumber: string;
  affiliateCode: string;
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  avatarUrl: string;
  status: 'ACTIVE' | 'LOCKED' | 'PENDING_VERIFY';
  emailVerified: boolean;
  phoneVerified: boolean;
  deleted: boolean;
  failedLoginAttempts: number;
  lockTime: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  loyaltyPoints: number;
  staffProfile: StaffProfile | null;
}

export interface StaffProfile {
  profileId: number;
  employeeId: string;
  department: string;
  position: string;
  hiredAt: string;
  managedByEmployeeId: string | null;
  managedByName: string | null;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phoneNumber: string;
}

export interface PaginatedResponse<T> {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  sortBy: string[];
  items: T[];
}

export interface UserPermission {
  name: string;
  description: string;
}

export interface AdminRole {
  name: string;
  description: string;
  permissions: UserPermission[];
}

export type AdminUserListResponse = ResponseBase<PaginatedResponse<AdminUserListItem>>;
export type AdminUserDetailResponse = ResponseBase<AdminUserListItem>;
export type AdminUserPermissionsResponse = ResponseBase<UserPermission[]>;
export type AdminRoleListResponse = ResponseBase<AdminRole[]>;
export type AdminRoleDetailResponse = ResponseBase<AdminRole>;

export interface CreateRoleRequest {
  name: string;
  description: string;
  permissions: string[];
}

export interface RolePermissionsRequest {
  permissionNames: string[];
}

export interface UpdateStaffProfileRequest {
  employeeId: string;
  department: string;
  position: string;
  managedById: number;
  hiredAt: string;
}

export interface GetUsersParams {
  pageNo?: number;
  pageSize?: number;
  keyword?: string | undefined;
  status?: string | undefined;
  sorts?: string | undefined;
}

export type ShopDetailTabType = 'overview' | 'legality' | 'subscription' | 'history';

// Shop Management Types
export type ShopStatus = 'PENDING' | 'ACTIVE' | 'LOCKED' | 'REJECTED';
export type ShopDocumentType = 'BUSINESS_LICENSE';

export interface ShopDocument {
  id: number;
  docType: ShopDocumentType;
  fileUrl: string;
  isVerified: boolean;
  verifiedByEmail: string | null;
  verifiedAt: string | null;
  note: string | null;
  createdAt: string;
}

export interface ShopListItem {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  status: ShopStatus;
  rejectionNote: string | null;
  ownerEmail: string;
  ownerName: string;
  provinceName: string;
  districtName: string;
  wardName: string;
  addressLine: string;
  taxCode: string;
  businessRegNo: string;
  ratingAvg: number;
  totalReviews: number;
  planName: string;
  approvedByEmail: string | null;
  approvedAt: string | null;
  createdAt: string;
  documents?: ShopDocument[];
}

export interface ShopStatusLog {
  id: number;
  fromStatus: ShopStatus;
  toStatus: ShopStatus;
  note: string;
  createdByEmail: string;
  createdAt: string;
}

export interface GetShopsParams {
  pageNo?: number;
  pageSize?: number;
  keyword?: string;
  status?: ShopStatus;
  provinceId?: number;
}

export interface OverridePlanRequest {
  planId: string;
  billingCycle: string;
  paymentMethod: string;
  paymentRef: string;
}

export interface ShopActionRequest {
  note: string;
}

export type AdminShopListResponse = ResponseBase<PaginatedResponse<ShopListItem>>;
export type AdminShopDetailResponse = ResponseBase<ShopListItem>;
export type AdminShopStatusLogsResponse = ResponseBase<ShopStatusLog[]>;
export type AdminShopDocumentResponse = ResponseBase<ShopDocument>;
export type AdminOverridePlanResponse = ResponseBase<{
  id: number;
  planName: string;
  planSlug: string;
  startedAt: string;
  expiredAt: string;
  amountPaid: number;
  paymentRef: string;
  status: string;
  createdAt: string;
  active: boolean;
}>;

// ─── Subscription Plan Management Types ───────────────────────────────────────

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  sortOrder: string;
  priceMonthly: number;
  priceYearly: number;
  yearlyDiscountPercent: number;
  isFree: boolean;
  maxProducts: number;
  unlimitedProducts: boolean;
  maxImagesPerProduct: string;
  commissionRate: number;
  commissionCashbackRate: number;
  cashbackThreshold: number;
  paymentFeeRate: number;
  payoutFee: number;
  payoutDays: string;
  features: {
    flashSale: boolean;
    affiliate: boolean;
    blog: boolean;
    exportReport: boolean;
    bulkImport: boolean;
    apiAccess: boolean;
    analyticsPro: boolean;
  };
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  maxProducts: number;
  maxImagesPerProduct: string;
  commissionRate: number;
  commissionCashbackRate: number;
  cashbackThreshold: number;
  paymentFeeRate: number;
  payoutFee: number;
  payoutDays: string;
  features: string[];
  sortOrder: string;
}

export type UpdateSubscriptionPlanRequest = CreateSubscriptionPlanRequest;

export type AdminSubscriptionPlanListResponse = ResponseBase<SubscriptionPlan[]>;
export type AdminSubscriptionPlanDetailResponse = ResponseBase<SubscriptionPlan>;
// ─── Category Management Types ──────────────────────────────────────────────

export interface Category {
  id: number;
  name: string;
  slug: string;
  iconUrl: string;
  bannerUrl: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
  parentId: number | null;
  children: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  slug: string;
  parentId: number | null;
  iconUrl: string;
  bannerUrl: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
}

export type CategoryUpdateRequest = CategoryCreateRequest;

export type AdminCategoryListResponse = ResponseBase<Category[]>;
export type AdminCategoryDetailResponse = ResponseBase<Category>;
export type CategoryCheckSlugResponse = ResponseBase<boolean>;

// ─── Admin Order Management Types ──────────────────────────────────────────

export interface IAdminOrderParams {
  status?: string;
  startDate?: string;
  endDate?: string;
  keyword?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface IAdminRefundParams {
  status?: string;
  pageNo?: number;
  pageSize?: number;
}

export interface IAdminOrderListItem {
  id: number;
  orderCode: string;
  status: string;
  paymentStatus: string;
  shopName: string;
  shopSlug: string;
  shopLogoUrl: string;
  thumbnail: string;
  firstItemName: string;
  firstItemVariantName: string;
  itemCount: number;
  totalAmount: number;
  paymentMethod: string;
  canCancel: boolean;
  createdAt: string;
}

export interface IAdminOrderListRes {
  content: IAdminOrderListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface IAdminDashboardStats {
  totalOrders: number;
  gmv: number;
  avgOrderValue: number;
  commissionRevenue: number;
  pendingPayout: number;
}

export interface IAdminDashboardRes {
  today: IAdminDashboardStats;
  month: IAdminDashboardStats;
  ordersByStatus: Record<string, number>;
}

export interface IAdminRefundListItem {
  refundId: number;
  status: string;
  amount: number;
  estimatedProcessDays: number;
  message: string;
}

export interface IAdminRefundListRes {
  content: IAdminRefundListItem[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface IPayoutProcessReq {
  paymentRef: string;
  note: string;
}

export interface IRefundApproveReq {
  action: 'APPROVE' | 'REJECT';
  note: string;
  refundAmount?: number;
  rejectReason?: string;
}

export interface IAdminPayoutRes {
  id: number;
  periodStart: string;
  periodEnd: string;
  grossRevenue: number;
  commissionFee: number;
  cashbackAmount: number;
  refundDeducted: number;
  netPayout: number;
  status: string;
  scheduledPayoutDate: string;
  paidAt: string;
  paymentRef: string;
}

export type AdminOrderListResponse = ResponseBase<IAdminOrderListRes>;
export type AdminDashboardResponse = ResponseBase<IAdminDashboardRes>;
export type AdminRefundListResponse = ResponseBase<IAdminRefundListRes>;
export type AdminPayoutResponse = ResponseBase<IAdminPayoutRes>;
export type AdminRefundActionResponse = ResponseBase<IAdminRefundListItem>;
