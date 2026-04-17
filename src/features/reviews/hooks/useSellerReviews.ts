import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewApi } from '../api/reviewApi';
import { SellerReviewQueryParams, SellerReplyPayload } from '../types/reviewTypes';

// ─── Query Hook ───────────────────────────────────────────────────────────────

export const useSellerReviewsQuery = (params?: SellerReviewQueryParams) => {
  return useQuery({
    queryKey: ['seller-reviews', params],
    queryFn: () => reviewApi.getSellerReviews(params),
    staleTime: 2 * 60 * 1000,
  });
};

// ─── Mutation Hook ────────────────────────────────────────────────────────────

export const useSellerReviewMutations = () => {
  const queryClient = useQueryClient();

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: SellerReplyPayload }) =>
      reviewApi.replyToReview(reviewId, data),
    onSuccess: () => {
      toast.success('Gửi phản hồi thành công!');
      queryClient.invalidateQueries({ queryKey: ['seller-reviews'] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi phản hồi');
    },
  });

  return {
    reply: replyMutation.mutateAsync,
    isReplying: replyMutation.isPending,
  };
};
