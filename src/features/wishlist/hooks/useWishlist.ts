import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { wishlistApi } from '../api/wishlistApi';
import { MoveToCartRequest } from '../types/wishlistTypes';
import toast from 'react-hot-toast';

export const useWishlist = (pageNo = 0, pageSize = 10) => {
  return useQuery({
    queryKey: ['wishlist', pageNo, pageSize],
    queryFn: () => wishlistApi.getWishlist(pageNo, pageSize),
  });
};

export const useWishlistCount = () => {
  return useQuery({
    queryKey: ['wishlist-count'],
    queryFn: () => wishlistApi.getCount(),
  });
};

export const useWishlistStatus = (productIds: number[]) => {
  return useQuery({
    queryKey: ['wishlist-status', productIds],
    queryFn: () => wishlistApi.checkStatus(productIds),
    enabled: productIds.length > 0,
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
      // Cần invalidate thêm query của giỏ hàng nếu có
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
