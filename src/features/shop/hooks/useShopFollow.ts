import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shopFollowApi } from '../api/shopFollowApi';
import { ShopFollowStatusResponse } from '../types/shopFollowTypes';
import toast from 'react-hot-toast';

export const useShopFollowStatusQuery = (shopId: number) => {
  return useQuery({
    queryKey: ['shop-follow-status', shopId],
    queryFn: () => shopFollowApi.getFollowStatus(shopId),
    enabled: !!shopId,
    staleTime: 60 * 1000,
  });
};

export const useToggleShopFollowMutation = (shopId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (isCurrentlyFollowing: boolean) => {
      if (isCurrentlyFollowing) {
        return await shopFollowApi.unfollowShop(shopId);
      } else {
        return await shopFollowApi.followShop(shopId);
      }
    },
    onMutate: async (isCurrentlyFollowing: boolean) => {
      // Hủy các query đang chạy để tránh ghi đè
      await queryClient.cancelQueries({ queryKey: ['shop-follow-status', shopId] });

      // Lấy snapshot trạng thái trước đó
      const previousStatus = queryClient.getQueryData<ShopFollowStatusResponse>([
        'shop-follow-status',
        shopId,
      ]);

      // Optimistic Update ngay lập tức trên UI
      queryClient.setQueryData<ShopFollowStatusResponse>(['shop-follow-status', shopId], (old) => {
        if (!old?.data) return old;
        const newCount = isCurrentlyFollowing
          ? Math.max(0, old.data.followerCount - 1)
          : old.data.followerCount + 1;
        return {
          ...old,
          data: {
            isFollowing: !isCurrentlyFollowing,
            followerCount: newCount,
          },
        };
      });

      return { previousStatus };
    },
    onError: (err: unknown, isCurrentlyFollowing, context) => {
      // Rollback lại dữ liệu cũ nếu API thất bại
      if (context?.previousStatus) {
        queryClient.setQueryData(['shop-follow-status', shopId], context.previousStatus);
      }
      const errorMessage =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Thao tác theo dõi không thành công, vui lòng thử lại sau.';
      toast.error(errorMessage);
    },
    onSuccess: (data, isCurrentlyFollowing) => {
      if (data?.data) {
        queryClient.setQueryData(['shop-follow-status', shopId], data);
      }
      if (isCurrentlyFollowing) {
        toast.success('Đã hủy theo dõi gian hàng');
      } else {
        toast.success(
          'Đã theo dõi gian hàng thành công! Bạn sẽ nhận được thông báo về sản phẩm và voucher mới.',
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['shop-follow-status', shopId] });
    },
  });
};
