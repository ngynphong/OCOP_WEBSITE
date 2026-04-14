import { axiosClient } from '@/lib/axios';
import type {
  CartResponse,
  CartCountResponse,
  CartValidateResponse,
  SyncPricesResponse,
  AddToCartRequest,
  UpdateCartItemRequest,
  DeleteCartItemsRequest,
  MergeCartRequest,
} from '../types/cartTypes';

export const cartApi = {
  getCart: (): Promise<CartResponse> => {
    return axiosClient.get('/cart');
  },

  getCount: (): Promise<CartCountResponse> => {
    return axiosClient.get('/cart/count');
  },

  addItem: (data: AddToCartRequest): Promise<CartResponse> => {
    return axiosClient.post('/cart/items', data);
  },

  updateItem: (itemId: number, data: UpdateCartItemRequest): Promise<CartResponse> => {
    return axiosClient.patch(`/cart/items/${itemId}`, data);
  },
  removeItem: (itemId: number): Promise<CartResponse> => {
    return axiosClient.delete(`/cart/items/${itemId}`);
  },

  removeItems: (data: DeleteCartItemsRequest): Promise<CartResponse> => {
    return axiosClient.delete('/cart/items', { data });
  },
  clearCart: (): Promise<CartResponse> => {
    return axiosClient.delete('/cart');
  },

  validate: (): Promise<CartValidateResponse> => {
    return axiosClient.post('/cart/validate');
  },

  syncPrices: (): Promise<SyncPricesResponse> => {
    return axiosClient.post('/cart/sync-prices');
  },

  mergeCart: (data: MergeCartRequest): Promise<CartResponse> => {
    return axiosClient.post('/cart/merge', data);
  },
};
