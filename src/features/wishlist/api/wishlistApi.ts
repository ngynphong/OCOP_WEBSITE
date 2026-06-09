import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  WishlistListResponse,
  WishlistActionResponse,
  WishlistCountDataResponse,
  WishlistStatusDataResponse,
  MoveToCartRequest,
  MoveToCartResponse,
} from '../types/wishlistTypes';

export const wishlistApi = {
  getWishlist: (pageNo = 1, pageSize = 10): Promise<WishlistListResponse> => {
    return axiosClient.get(API_ENDPOINTS.WISHLIST.BASE, { params: { pageNo, pageSize } });
  },

  addToWishlist: (productId: number): Promise<WishlistActionResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.WISHLIST.BASE, productId));
  },

  removeFromWishlist: (productId: number): Promise<WishlistActionResponse> => {
    return axiosClient.delete(buildRoute(API_ENDPOINTS.WISHLIST.BASE, productId));
  },

  getCount: (): Promise<WishlistCountDataResponse> => {
    return axiosClient.get(API_ENDPOINTS.WISHLIST.COUNT);
  },

  checkStatus: (productIds: number[]): Promise<WishlistStatusDataResponse> => {
    const params = new URLSearchParams();
    productIds.forEach((id) => params.append('productIds', id.toString()));
    return axiosClient.get(API_ENDPOINTS.WISHLIST.CHECK, { params });
  },

  moveToCart: (data: MoveToCartRequest): Promise<MoveToCartResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.WISHLIST.BASE}/move-to-cart`, data);
  },
};
