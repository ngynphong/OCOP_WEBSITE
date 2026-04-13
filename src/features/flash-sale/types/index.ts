import { z } from 'zod';
import { AuthResponseBase } from '@/features/admin/types/adminTypes';

export type FlashSaleStatus = 'DRAFT' | 'UPCOMING' | 'ACTIVE' | 'FINISHED' | 'CANCELLED';

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

export const FlashSaleItemSchema = z.object({
  variantId: z.number().int().positive('Variant ID không hợp lệ'),
  salePrice: z.number().min(0, 'Giá khuyến mãi phải >= 0'),
  qtyLimit: z.number().int().min(1, 'Số lượng giới hạn phải >= 1'),
  // Các trường bổ trợ hiển thị (không gửi lên server)
  _productName: z.string().optional(),
  _variantName: z.string().optional(),
  _originalPrice: z.number().optional(),
});

export const FlashSaleRequestSchema = z
  .object({
    name: z.string().min(5, 'Tên chương trình ít nhất 5 ký tự'),
    bannerUrl: z.string().url('Link banner không hợp lệ').optional().or(z.literal('')),
    startTime: z.string().min(1, 'Vui lòng chọn thời gian bắt đầu'),
    endTime: z.string().min(1, 'Vui lòng chọn thời gian kết thúc'),
    items: z.array(FlashSaleItemSchema).min(1, 'Phải có ít nhất 1 sản phẩm tham gia'),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    const now = new Date();

    if (start < now) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Thời gian bắt đầu phải từ thời điểm hiện tại trở đi',
        path: ['startTime'],
      });
    }

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu',
        path: ['endTime'],
      });
    }
  });

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface FlashSaleItem {
  id: number;
  variantId: number;
  productName: string;
  thumbnailUrl: string;
  originalPrice: number;
  salePrice: number;
  discountPercent: number;
  qtyLimit: number;
  qtySold: number;
  remainingQty: number;
  soldOut: boolean;
}

export interface FlashSale {
  id: number;
  name: string;
  bannerUrl: string;
  startTime: string;
  endTime: string;
  secondsLeft: number;
  status: FlashSaleStatus;
  items: FlashSaleItem[];
  active: boolean;
}

// ─── Request/Response Types ──────────────────────────────────────────────────

export type CreateFlashSaleRequest = z.infer<typeof FlashSaleRequestSchema>;
export type UpdateFlashSaleRequest = CreateFlashSaleRequest;

export type FlashSaleDetailResponse = AuthResponseBase<FlashSale>;
export type FlashSaleListResponse = AuthResponseBase<FlashSale[]>;
export type FlashSaleAdminListResponse = AuthResponseBase<{
  content: FlashSale[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}>;
