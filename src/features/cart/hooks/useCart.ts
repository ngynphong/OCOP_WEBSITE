import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { cartApi } from '../api/cartApi';
import { getSessionId, clearSessionId } from '../utils/cartSession';
import type {
  AddToCartRequest,
  UpdateCartItemRequest,
  DeleteCartItemsRequest,
  CartData,
  CartCountData,
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
    onMutate: async (data: AddToCartRequest) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.cart });
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.count });

      const previousCart = queryClient.getQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart);
      const previousCount = queryClient.getQueryData<{ data: CartCountData }>(
        CART_QUERY_KEYS.count,
      );

      // Optimistically update count
      queryClient.setQueryData<{ data: CartCountData }>(CART_QUERY_KEYS.count, (old) => {
        if (!old?.data) return old;
        return { data: { count: old.data.count + data.qty } };
      });

      return { previousCart, previousCount };
    },
    onError: (err, data, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.cart, context.previousCart);
      }
      if (context?.previousCount) {
        queryClient.setQueryData(CART_QUERY_KEYS.count, context.previousCount);
      }
      toast.error('Lỗi khi thêm vào giỏ hàng');
    },
    onSuccess: () => {
      toast.success('Đã thêm vào giỏ hàng');
    },
    onSettled: () => {
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
    onMutate: async ({ itemId, data }) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.cart });
      const previousCart = queryClient.getQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart);

      if (previousCart) {
        queryClient.setQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart, (old) => {
          if (!old?.data) return old;
          const newItems = old.data.items.map((item) =>
            item.id === itemId
              ? { ...item, qty: data.qty, subtotal: item.currentPrice * data.qty }
              : item,
          );
          return { data: { ...old.data, items: newItems } };
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.cart, context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: number) => cartApi.removeItem(itemId),
    onMutate: async (itemId: number) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.cart });
      const previousCart = queryClient.getQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart);

      if (previousCart) {
        queryClient.setQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart, (old) => {
          if (!old?.data) return old;
          const newItems = old.data.items.filter((item) => item.id !== itemId);
          return { data: { ...old.data, items: newItems } };
        });
      }

      return { previousCart };
    },
    onError: (err, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.cart, context.previousCart);
      }
      toast.error('Lỗi khi xóa sản phẩm');
    },
    onSuccess: () => {
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useRemoveCartItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DeleteCartItemsRequest) => cartApi.removeItems(data),
    onMutate: async (data: DeleteCartItemsRequest) => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.cart });
      const previousCart = queryClient.getQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart);

      if (previousCart) {
        queryClient.setQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart, (old) => {
          if (!old?.data) return old;
          const newItems = old.data.items.filter((item) => !data.itemIds.includes(item.id));
          return { data: { ...old.data, items: newItems } };
        });
      }

      return { previousCart };
    },
    onError: (err, data, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.cart, context.previousCart);
      }
      toast.error('Lỗi khi xóa các sản phẩm');
    },
    onSuccess: () => {
      toast.success('Đã xóa các sản phẩm khỏi giỏ hàng');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.cart });
      queryClient.invalidateQueries({ queryKey: CART_QUERY_KEYS.count });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartApi.clearCart(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.cart });
      await queryClient.cancelQueries({ queryKey: CART_QUERY_KEYS.count });

      const previousCart = queryClient.getQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart);
      const previousCount = queryClient.getQueryData<{ data: CartCountData }>(
        CART_QUERY_KEYS.count,
      );

      queryClient.setQueryData<{ data: CartData }>(CART_QUERY_KEYS.cart, (old) => {
        if (!old?.data) return old;
        return { data: { ...old.data, items: [], totalItems: 0, totalAmount: 0 } };
      });
      queryClient.setQueryData<{ data: CartCountData }>(CART_QUERY_KEYS.count, {
        data: { count: 0 },
      });

      return { previousCart, previousCount };
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(CART_QUERY_KEYS.cart, context.previousCart);
      }
      if (context?.previousCount) {
        queryClient.setQueryData(CART_QUERY_KEYS.count, context.previousCount);
      }
      toast.error('Lỗi khi xóa giỏ hàng');
    },
    onSuccess: () => {
      toast.success('Đã xóa toàn bộ giỏ hàng');
    },
    onSettled: () => {
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
