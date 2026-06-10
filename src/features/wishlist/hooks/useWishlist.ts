import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlistApi';
import {
  MoveToCartRequest,
  WishlistStatusDataResponse,
  WishlistCountDataResponse,
} from '../types/wishlistTypes';
import toast from 'react-hot-toast';
import { useAppSelector } from '@/store/hooks';

export const useWishlist = (pageNo = 1, pageSize = 12) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['wishlist', pageNo, pageSize],
    queryFn: () => wishlistApi.getWishlist(pageNo, pageSize),
    enabled: isAuthenticated,
  });
};

export const useWishlistCount = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['wishlist-count'],
    queryFn: () => wishlistApi.getCount(),
    enabled: isAuthenticated,
  });
};

export const useWishlistStatus = (productIds: number[]) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return useQuery({
    queryKey: ['wishlist-status', productIds.sort().join(',')],
    queryFn: () => wishlistApi.checkStatus(productIds),
    enabled: isAuthenticated && productIds.length > 0,
    staleTime: 60 * 1000,
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => wishlistApi.addToWishlist(productId),
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist-status'] });
      await queryClient.cancelQueries({ queryKey: ['wishlist-count'] });

      const previousStatuses = queryClient.getQueriesData({ queryKey: ['wishlist-status'] });
      const previousCount = queryClient.getQueryData(['wishlist-count']);

      queryClient.setQueriesData<WishlistStatusDataResponse>(
        { queryKey: ['wishlist-status'] },
        (old: WishlistStatusDataResponse | undefined) => {
          if (!old?.data) return old;
          return { ...old, data: { ...old.data, [productId]: true } };
        },
      );

      queryClient.setQueryData<WishlistCountDataResponse>(
        ['wishlist-count'],
        (old: WishlistCountDataResponse | undefined) => {
          if (!old?.data) return old;
          return { ...old, data: { ...old.data, total: (old.data.total || 0) + 1 } };
        },
      );

      return { previousStatuses, previousCount };
    },
    onError: (
      err: Error,
      productId: number,
      context?: {
        previousStatuses: [import('@tanstack/react-query').QueryKey, unknown][];
        previousCount: unknown;
      },
    ) => {
      if (context?.previousStatuses) {
        context.previousStatuses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousCount) {
        queryClient.setQueryData(['wishlist-count'], context.previousCount);
      }
      toast.error('Lỗi khi thêm vào danh sách yêu thích');
    },
    onSuccess: () => {
      toast.success('Đã thêm vào danh sách yêu thích');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-status'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => wishlistApi.removeFromWishlist(productId),
    onMutate: async (productId: number) => {
      await queryClient.cancelQueries({ queryKey: ['wishlist-status'] });
      await queryClient.cancelQueries({ queryKey: ['wishlist-count'] });

      const previousStatuses = queryClient.getQueriesData({ queryKey: ['wishlist-status'] });
      const previousCount = queryClient.getQueryData(['wishlist-count']);

      queryClient.setQueriesData<WishlistStatusDataResponse>(
        { queryKey: ['wishlist-status'] },
        (old: WishlistStatusDataResponse | undefined) => {
          if (!old?.data) return old;
          const newData = { ...old.data };
          newData[productId] = false;
          return { ...old, data: newData };
        },
      );

      queryClient.setQueryData<WishlistCountDataResponse>(
        ['wishlist-count'],
        (old: WishlistCountDataResponse | undefined) => {
          if (!old?.data) return old;
          return { ...old, data: { ...old.data, total: Math.max(0, (old.data.total || 0) - 1) } };
        },
      );

      return { previousStatuses, previousCount };
    },
    onError: (
      err: Error,
      productId: number,
      context?: {
        previousStatuses: [import('@tanstack/react-query').QueryKey, unknown][];
        previousCount: unknown;
      },
    ) => {
      if (context?.previousStatuses) {
        context.previousStatuses.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      if (context?.previousCount) {
        queryClient.setQueryData(['wishlist-count'], context.previousCount);
      }
      toast.error('Lỗi khi xóa khỏi danh sách yêu thích');
    },
    onSuccess: () => {
      toast.success('Đã xóa khỏi danh sách yêu thích');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist-status'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useMoveToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MoveToCartRequest) => wishlistApi.moveToCart(data),
    onSuccess: () => {
      toast.success('Đã chuyển vào giỏ hàng');
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
