import { AuthResponseBase } from '@/features/auth/types';

export type { AuthResponseBase };

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

export type AdminUserListResponse = AuthResponseBase<PaginatedResponse<AdminUserListItem>>;
export type AdminUserDetailResponse = AuthResponseBase<AdminUserListItem>;
export type AdminUserPermissionsResponse = AuthResponseBase<UserPermission[]>;

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
  sorts?: string[] | undefined;
}

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
  reason: string;
  changedByEmail: string;
  changedAt: string;
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

export type AdminShopListResponse = AuthResponseBase<PaginatedResponse<ShopListItem>>;
export type AdminShopDetailResponse = AuthResponseBase<ShopListItem>;
export type AdminShopStatusLogsResponse = AuthResponseBase<ShopStatusLog[]>;
export type AdminShopDocumentResponse = AuthResponseBase<ShopDocument>;
export type AdminOverridePlanResponse = AuthResponseBase<{
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
