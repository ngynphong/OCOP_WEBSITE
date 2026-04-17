import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { reviewApi } from '../api/reviewApi';
import { ReviewQueryParams, FlagReviewPayload } from '../types/reviewTypes';

// ─── Query Hook ───────────────────────────────────────────────────────────────

export const useProductReviewsQuery = (productSlug: string, params?: ReviewQueryParams) => {
  return useQuery({
    queryKey: ['product-reviews', productSlug, params],
    queryFn: () => reviewApi.getProductReviews(productSlug, params),
    enabled: !!productSlug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useReviewMutations = (productSlug?: string) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    if (productSlug) {
      queryClient.invalidateQueries({ queryKey: ['product-reviews', productSlug] });
    }
  };

  const submitReview = useMutation({
    mutationFn: (formData: FormData) => reviewApi.submitReview(formData),
    onSuccess: () => {
      toast.success('Gửi đánh giá thành công!');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['orders'] }); // Refresh order history status
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    },
  });

  const helpfulMutation = useMutation({
    mutationFn: (reviewId: number) => reviewApi.markHelpful(reviewId),
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã phản hồi!');
      invalidate();
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra');
    },
  });

  const flagMutation = useMutation({
    mutationFn: ({ reviewId, data }: { reviewId: number; data: FlagReviewPayload }) =>
      reviewApi.flagReview(reviewId, data),
    onSuccess: () => {
      toast.success('Báo cáo đã được gửi.');
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi gửi báo cáo');
    },
  });

  return {
    submitReview: submitReview.mutateAsync,
    isSubmitting: submitReview.isPending,
    markHelpful: helpfulMutation.mutateAsync,
    isMarkingHelpful: helpfulMutation.isPending,
    flagReview: flagMutation.mutateAsync,
    isFlagging: flagMutation.isPending,
  };
};
