import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
    return axiosClient.get(API_ENDPOINTS.CART.BASE);
  },

  getCount: (): Promise<CartCountResponse> => {
    return axiosClient.get(API_ENDPOINTS.CART.COUNT);
  },

  addItem: (data: AddToCartRequest): Promise<CartResponse> => {
    return axiosClient.post(API_ENDPOINTS.CART.ITEMS, data, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  updateItem: (itemId: number, data: UpdateCartItemRequest): Promise<CartResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.CART.ITEMS, itemId), data, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
  removeItem: (itemId: number): Promise<CartResponse> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.CART.ITEMS, itemId), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  removeItems: (data: DeleteCartItemsRequest): Promise<CartResponse> => {
    return axiosClient.delete(API_ENDPOINTS.CART.ITEMS, {
      data,
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
  clearCart: (): Promise<CartResponse> => {
    return axiosClient.delete(API_ENDPOINTS.CART.BASE, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  validate: (): Promise<CartValidateResponse> => {
    return axiosClient.post(API_ENDPOINTS.CART.VALIDATE);
  },

  syncPrices: (): Promise<SyncPricesResponse> => {
    return axiosClient.post(API_ENDPOINTS.CART.SYNC_PRICES);
  },

  mergeCart: (data: MergeCartRequest): Promise<CartResponse> => {
    return axiosClient.post(API_ENDPOINTS.CART.MERGE, data);
  },
};
