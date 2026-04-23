import { axiosClient, publicAxiosClient } from '@/lib/axios';
import {
  ReviewListResponse,
  ReviewDetailResponse,
  FlagReviewPayload,
  SellerReplyPayload,
  AdminModerationPayload,
  ReviewQueryParams,
  SellerReviewQueryParams,
  AdminReviewQueryParams,
  ContentFlagListResponse,
} from '../types/reviewTypes';
import { ResponseBase } from '@/features/auth/types/index';

export const reviewApi = {
  // ─── Consumer API ──────────────────────────────────────────────────────────

  /** Lấy danh sách đánh giá của sản phẩm (Public) */
  getProductReviews: (
    productSlug: string,
    params?: ReviewQueryParams,
  ): Promise<ReviewListResponse> => {
    return publicAxiosClient.get(`/products/${productSlug}/reviews`, { params });
  },

  /** Gửi đánh giá sản phẩm mới (Multipart/FormData kèm ảnh) */
  submitReview: (formData: FormData): Promise<ReviewDetailResponse> => {
    return axiosClient.post('/reviews/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  /** Báo cáo vi phạm đánh giá */
  flagReview: (reviewId: number, data: FlagReviewPayload): Promise<ResponseBase<string>> => {
    return axiosClient.post(`/reviews/${reviewId}/flag`, data);
  },

  /** Đánh dấu đánh giá là hữu ích */
  markHelpful: (reviewId: number): Promise<ResponseBase<string>> => {
    return axiosClient.post(`/reviews/${reviewId}/helpful`);
  },

  // ─── Seller API ────────────────────────────────────────────────────────────

  /** Seller xem danh sách đánh giá của shop */
  getSellerReviews: (params?: SellerReviewQueryParams): Promise<ReviewListResponse> => {
    return axiosClient.get('/seller/reviews', { params });
  },

  /** Seller phản hồi đánh giá */
  replyToReview: (reviewId: number, data: SellerReplyPayload): Promise<ReviewDetailResponse> => {
    return axiosClient.patch(`/seller/reviews/${reviewId}/reply`, data);
  },

  // ─── Admin API ─────────────────────────────────────────────────────────────

  /** Admin danh sách đánh giá đang chờ duyệt */
  getPendingReviews: (params?: AdminReviewQueryParams): Promise<ReviewListResponse> => {
    return axiosClient.get('/admin/reviews/pending', { params });
  },

  /** Admin phê duyệt đánh giá */
  approveReview: (
    reviewId: number,
    data: AdminModerationPayload,
  ): Promise<ReviewDetailResponse> => {
    return axiosClient.post(`/admin/reviews/${reviewId}/approve`, data);
  },

  /** Admin từ chối đánh giá */
  rejectReview: (reviewId: number, data: AdminModerationPayload): Promise<ReviewDetailResponse> => {
    return axiosClient.post(`/admin/reviews/${reviewId}/reject`, data);
  },

  /** Admin ẩn đánh giá */
  hideReview: (reviewId: number, data: AdminModerationPayload): Promise<ReviewDetailResponse> => {
    return axiosClient.post(`/admin/reviews/${reviewId}/hide`, data);
  },

  /** Admin danh sách các báo cáo vi phạm nội dung */
  getContentFlags: (params?: {
    status?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<ContentFlagListResponse> => {
    return axiosClient.get('/admin/content-flags', { params });
  },

  /** Admin xử lý báo cáo vi phạm sản phẩm/đánh giá */
  resolveContentFlag: (flagId: number, action: string): Promise<ResponseBase<string>> => {
    return axiosClient.post(`/admin/content-flags/${flagId}/resolve`, null, {
      params: { action },
    });
  },
};
