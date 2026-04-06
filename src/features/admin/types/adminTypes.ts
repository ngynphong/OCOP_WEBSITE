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
