import { z } from 'zod';
import { ResponseBase } from '@/features/auth/types/index';

// ─── Core Interfaces ─────────────────────────────────────────────────────────

export interface SellerReply {
  content: string;
  repliedAt: string;
}

export interface Review {
  id: number;
  userName: string;
  avatarUrl: string;
  rating: number;
  content: string;
  images: string[];
  isVerified: boolean;
  helpfulCount: number;
  createdAt: string;
  sellerReply?: SellerReply;
  productSlug?: string; // Optional context
  productName?: string; // Optional context
}

export interface ReviewSummary {
  avgRating: number;
  totalReviews: number;
  distribution: Record<string, number>;
}

export interface ReviewPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface ReviewListResponseData extends ReviewPaginatedResponse<Review> {
  summary?: ReviewSummary;
}

export type ReviewListResponse = ResponseBase<ReviewListResponseData>;
export type ReviewDetailResponse = ResponseBase<Review>;

// ─── Content Flag Interfaces ─────────────────────────────────────────────────

export type ContentFlagStatus = 'PENDING' | 'RESOLVED_KEPT' | 'RESOLVED_REMOVED';

export interface ContentFlag {
  id: number;
  reviewId: number;
  reporterName: string;
  reason: string;
  detail: string;
  status: ContentFlagStatus | undefined;
  createdAt: string;
  resolvedAt?: string;
  review?: Review; // Nested review context
}

export type ContentFlagListResponse = ResponseBase<ReviewPaginatedResponse<ContentFlag>>;

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const submitReviewSchema = z.object({
  orderItemId: z.number({ message: 'ID sản phẩm không khớp' }),
  rating: z.number().min(1, 'Vui lòng chọn mức đánh giá').max(5),
  content: z
    .string()
    .min(5, 'Nội dung đánh giá phải có ít nhất 5 ký tự')
    .max(1000, 'Nội dung quá dài'),
  images: z.array(z.string()).max(5, 'Chỉ được tải lên tối đa 5 ảnh').optional(),
});

export type SubmitReviewPayload = z.infer<typeof submitReviewSchema>;

export const flagReviewSchema = z.object({
  reason: z.enum(['OTHER', 'SPAM', 'MISINFORMATION', 'FAKE', 'OFFENSIVE'] as const, {
    message: 'Vui lòng chọn lý do báo cáo',
  }),
  detail: z.string().max(200, 'Chi tiết báo cáo tối đa 200 ký tự').optional(),
});

export type FlagReviewPayload = z.infer<typeof flagReviewSchema>;

export const sellerReplySchema = z.object({
  content: z.string().min(2, 'Phản hồi quá ngắn').max(500, 'Phản hồi tối đa 500 ký tự'),
});

export type SellerReplyPayload = z.infer<typeof sellerReplySchema>;

export const adminModerationSchema = z.object({
  note: z.string().max(200, 'Ghi chú tối đa 200 ký tự').optional(),
});

export type AdminModerationPayload = z.infer<typeof adminModerationSchema>;

// ─── Query Parameters ────────────────────────────────────────────────────────

export interface ReviewQueryParams {
  pageNo?: number;
  pageSize?: number;
  rating?: number;
  hasImage?: boolean;
  search?: string;
}

export interface SellerReviewQueryParams extends ReviewQueryParams {
  productId?: number;
}

export interface AdminReviewQueryParams extends ReviewQueryParams {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'HIDDEN';
}
