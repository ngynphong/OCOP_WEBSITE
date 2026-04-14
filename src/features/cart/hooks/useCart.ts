import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '../api/cartApi';
import { getSessionId, clearSessionId } from '../utils/cartSession';
import type {
  AddToCartRequest,
  UpdateCartItemRequest,
  DeleteCartItemsRequest,
} from '../types/cartTypes';

export const CART_QUERY_KEYS = {
  cart: ['cart'] as const,
  count: ['cart-count'] as const,
} as const;

export const useCart = () => {
  return useQuery({
    queryKey: CART_QUERY_KEYS.cart,
    queryFn: () => cartApi.getCart(),
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

export const useCartCount = () => {
  return useQuery({
    queryKey: CART_QUERY_KEYS.count,
    queryFn: () => cartApi.getCount(),
    staleTime: 30 * 1000,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddToCartRequest) => cartApi.addItem(data),
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }: { itemId: number; data: UpdateCartItemRequest }) =>
      cartApi.updateItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
    onError: () => {},
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useRemoveCartItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCartItemsRequest) => cartApi.removeItems(data),
    onSuccess: () => {
      toast.success('Đã xóa các sản phẩm khỏi giỏ hàng');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onSuccess: () => {
      toast.success('Đã xóa toàn bộ giỏ hàng');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useValidateCart = () => {
  return useMutation({
    mutationFn: () => cartApi.validate(),
  });
};

export const useSyncCartPrices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.syncPrices(),
    onSuccess: () => {
      toast.success('Đã cập nhật giá mới');
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
    },
  });
};

export const useMergeCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const sessionId = getSessionId();
      if (!sessionId)
        return Promise.resolve(null as unknown as Awaited<ReturnType<typeof cartApi.mergeCart>>);
      return cartApi.mergeCart({ sessionId });
    },
    onSuccess: (data) => {
      if (data) {
        clearSessionId();
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
        queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
      }
    },
  });
};
