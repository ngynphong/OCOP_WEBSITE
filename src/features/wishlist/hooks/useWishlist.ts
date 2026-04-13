import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlistApi';
import { MoveToCartRequest } from '../types/wishlistTypes';
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
    onSuccess: () => {
      toast.success('Đã thêm vào danh sách yêu thích');
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-status'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => wishlistApi.removeFromWishlist(productId),
    onSuccess: () => {
      toast.success('Đã xóa khỏi danh sách yêu thích');
      queryClient.invalidateQueries({ queryKey: ['wishlist-count'] });
      queryClient.invalidateQueries({ queryKey: ['wishlist-status'] });
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
