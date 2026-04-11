import { z } from 'zod';
import { AuthResponseBase } from '@/features/auth/types';

export type { AuthResponseBase };

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ShopStatus = 'PENDING' | 'ACTIVE' | 'LOCKED' | 'REJECTED';

export type ShopDocumentType =
  | 'BUSINESS_LICENSE'
  | 'CCCD_FRONT'
  | 'CCCD_BACK'
  | 'TAX_CERT'
  | 'OCOP_CERT'
  | 'OTHER';

export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'CANCELLED';

// ─── Core Entities ───────────────────────────────────────────────────────────

export interface ShopInfo {
  id: number;
  name: string;
  slug: string;
  logoUrl: string;
  bannerUrl: string;
  description: string;
  status: ShopStatus;
  provinceName: string;
  districtName: string;
  wardName: string;
  addressLine: string;
  taxCode: string;
  businessRegNo: string;
  ratingAvg: number;
  totalReviews: number;
  planName: string;
  approvedAt: string | null;
  createdAt: string;
}

export interface ShopPolicy {
  shippingPolicy: string;
  returnPolicy: string;
  warrantyPolicy: string;
  updatedAt: string;
}

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

export interface ShopSubscription {
  id: number;
  planName: string;
  planSlug: string;
  startedAt: string;
  expiredAt: string;
  amountPaid: number;
  paymentRef: string;
  status: SubscriptionStatus;
  createdAt: string;
  active: boolean;
}

export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  priceMonthly: number;
  priceYearly: number;
  yearlyDiscountPercent: number;
  maxProducts: number;
  unlimitedProducts: boolean;
  maxImagesPerProduct: string;
  commissionRate: number;
  features: string | string[] | Record<string, boolean>;
  isActive: boolean;
  sortOrder: string;
}

// ─── Paginated ────────────────────────────────────────────────────────────────

export interface PaginatedShops {
  pageNo: number;
  pageSize: number;
  totalPage: number;
  totalElement: number;
  sortBy: string[];
  items: ShopInfo[];
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface GetShopsPublicParams {
  keyword?: string;
  status?: ShopStatus;
  provinceId?: number;
  pageNo?: number;
  pageSize?: number;
}

// ─── Request Bodies ──────────────────────────────────────────────────────────

export interface CreateShopRequest {
  name: string;
  slug: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  addressLine: string;
  taxCode: string;
  businessRegNo: string;
  planId: string;
}

export interface UpdateShopRequest {
  name: string;
  description: string;
  logoUrl?: string;
  bannerUrl?: string;
  provinceId: number;
  districtId: number;
  wardId: number;
  addressLine: string;
  taxCode: string;
  businessRegNo: string;
}

export interface UpdateShopPolicyRequest {
  shippingPolicy: string;
  returnPolicy: string;
  warrantyPolicy: string;
}

export interface CreateSubscriptionRequest {
  planId: string;
  billingCycle: string;
  paymentMethod: string;
  paymentRef: string;
}

// ─── Response Types ──────────────────────────────────────────────────────────

export type ShopListResponse = AuthResponseBase<PaginatedShops>;
export interface ShopDetailData {
  shopResponse: ShopInfo;
  missingRequiredDocuments: boolean;
  missingFields: string[];
}

export type ShopDetailResponse = AuthResponseBase<ShopDetailData>;
export type ShopPublicDetailResponse = AuthResponseBase<ShopInfo>;
export type ShopPolicyResponse = AuthResponseBase<ShopPolicy>;
export type SubscriptionPlanListResponse = AuthResponseBase<SubscriptionPlan[]>;
export type ShopDocumentListResponse = AuthResponseBase<ShopDocument[]>;
export type ShopDocumentResponse = AuthResponseBase<ShopDocument>;
export type ShopDocumentDeleteResponse = AuthResponseBase<string>;
export type ShopSubscriptionResponse = AuthResponseBase<ShopSubscription>;
export type ShopSubscriptionListResponse = AuthResponseBase<ShopSubscription[]>;

// ─── Zod Schemas (Form Validation) ────────────────────────────────────────────

export const createShopSchema = z.object({
  name: z.string().min(2, 'Tên shop phải có ít nhất 2 ký tự'),
  slug: z
    .string()
    .min(3, 'Slug phải có ít nhất 3 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  provinceId: z.number().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  districtId: z.number().min(1, 'Vui lòng chọn quận/huyện'),
  wardId: z.number().min(1, 'Vui lòng chọn phường/xã'),
  addressLine: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  taxCode: z.string().min(10, 'Mã số thuế không hợp lệ'),
  businessRegNo: z.string().min(5, 'Số ĐKKD không hợp lệ'),
  planId: z.string().min(1, 'Vui lòng chọn gói dịch vụ'),
});

export type CreateShopFormData = z.infer<typeof createShopSchema>;

export const updateShopSchema = z.object({
  name: z.string().min(2, 'Tên shop phải có ít nhất 2 ký tự'),
  description: z.string().min(10, 'Mô tả phải có ít nhất 10 ký tự'),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  provinceId: z.number().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  districtId: z.number().min(1, 'Vui lòng chọn quận/huyện'),
  wardId: z.number().min(1, 'Vui lòng chọn phường/xã'),
  addressLine: z.string().min(5, 'Địa chỉ phải có ít nhất 5 ký tự'),
  taxCode: z.string(),
  businessRegNo: z.string(),
});

export type UpdateShopFormData = z.infer<typeof updateShopSchema>;

export const updateShopPolicySchema = z.object({
  shippingPolicy: z.string().min(5, 'Vui lòng nhập chính sách vận chuyển'),
  returnPolicy: z.string().min(5, 'Vui lòng nhập chính sách đổi trả'),
  warrantyPolicy: z.string().min(5, 'Vui lòng nhập chính sách bảo hành'),
});

export type UpdateShopPolicyFormData = z.infer<typeof updateShopPolicySchema>;
