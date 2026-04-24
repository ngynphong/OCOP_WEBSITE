import { z } from 'zod';

export type VoucherType = 'FIXED_AMOUNT' | 'PERCENT' | 'FREE_SHIPPING';
export type VoucherStatus = 'ACTIVE' | 'PAUSED' | 'EXPIRED' | 'USED_UP';

export interface Voucher {
  id: number;
  code: string;
  name: string;
  type: VoucherType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number;
  usageLimit: number;
  usedCount: number;
  perUserLimit: number;
  startAt: string;
  expiredAt: string;
  status: VoucherStatus;
  shopId?: number | null;
  shopName?: string | null;
  shopSlug?: string | null;
  shopLogoUrl?: string | null;
}

export interface SavedVoucherResponse extends Voucher {
  savedId: number;
  savedAt: string;
  userUsedCount: number;
  isUsable: boolean;
}

export interface VoucherListResponse {
  content: Voucher[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface SavedVoucherListResponse {
  content: SavedVoucherResponse[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface VoucherValidateResponse {
  valid: boolean;
  invalidReason: string | null;
  code: string;
  type: VoucherType;
  discountValue: number;
  maxDiscount: number | null;
  minOrderValue: number;
  description: string;
  calculatedDiscount: number | null;
  applicableProductIds: number[] | null;
  applicableCategoryIds: number[] | null;
}

// Zod Schema cho Form Validation (Dành cho Seller tạo voucher)
export const voucherSchema = z
  .object({
    code: z
      .string()
      .min(3, 'Mã voucher phải có ít nhất 3 ký tự')
      .max(20, 'Mã voucher tối đa 20 ký tự')
      .toUpperCase(),
    name: z.string().min(5, 'Tên voucher phải có ít nhất 5 ký tự'),
    type: z.enum(['FIXED_AMOUNT', 'PERCENT', 'FREE_SHIPPING']),
    discountValue: z.number().min(0, 'Giá trị giảm không hợp lệ'),
    maxDiscount: z.number().nullable(),
    minOrderValue: z.number().min(0, 'Giá trị đơn hàng tối thiểu không hợp lệ'),
    usageLimit: z.number().min(1, 'Giới hạn sử dụng phải ít nhất là 1'),
    perUserLimit: z.number().min(1, 'Giới hạn mỗi người dùng phải ít nhất là 1'),
    startAt: z.string().min(1, 'Vui lòng chọn ngày bắt đầu'),
    expiredAt: z.string().min(1, 'Vui lòng chọn ngày kết thúc'),
  })
  .refine((data) => new Date(data.expiredAt) > new Date(data.startAt), {
    message: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
    path: ['expiredAt'],
  });

export type VoucherFormValues = z.infer<typeof voucherSchema>;
