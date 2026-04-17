import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewApi } from '../api/reviewApi';
import { AdminReviewQueryParams, AdminModerationPayload } from '../types/reviewTypes';

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export const useAdminPendingReviewsQuery = (params?: AdminReviewQueryParams) => {
  return useQuery({
    queryKey: ['admin-pending-reviews', params],
    queryFn: () => reviewApi.getPendingReviews(params),
    staleTime: 60 * 1000,
  });
};

export const useAdminContentFlagsQuery = (params?: {
  status?: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['admin-content-flags', params],
    queryFn: () => reviewApi.getContentFlags(params),
    staleTime: 60 * 1000,
  });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useAdminReviewMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-pending-reviews'] });
    queryClient.invalidateQueries({ queryKey: ['product-reviews'] });
  };

  const approveMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: AdminModerationPayload }) =>
      reviewApi.approveReview(reviewId, data),
    onSuccess: () => {
      toast.success('Đã duyệt đánh giá');
      invalidate();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: AdminModerationPayload }) =>
      reviewApi.rejectReview(reviewId, data),
    onSuccess: () => {
      toast.success('Đã từ chối đánh giá');
      invalidate();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const hideMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: AdminModerationPayload }) =>
      reviewApi.hideReview(reviewId, data),
    onSuccess: () => {
      toast.success('Đã ẩn đánh giá khỏi hệ thống');
      invalidate();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const resolveFlagMutation = useMutation({
    mutationFn: ({ flagId, action }: { flagId: number; action: 'KEEP' | 'REMOVE' }) =>
      reviewApi.resolveContentFlag(flagId, action),
    onSuccess: () => {
      toast.success('Đã giải quyết báo cáo vi phạm');
      queryClient.invalidateQueries({ queryKey: ['admin-content-flags'] });
      invalidate(); // Also refresh review lists in case content was removed
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xử lý báo cáo');
    },
  });

  return {
    approve: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    reject: rejectMutation.mutateAsync,
    isRejecting: rejectMutation.isPending,
    hide: hideMutation.mutateAsync,
    isHiding: hideMutation.isPending,
    resolveFlag: resolveFlagMutation.mutateAsync,
    isResolving: resolveFlagMutation.isPending,
  };
};
