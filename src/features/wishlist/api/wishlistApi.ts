import { axiosClient } from '@/lib/axios';
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
    return axiosClient.get('/wishlist', { params: { pageNo, pageSize } });
  },

  addToWishlist: (productId: number): Promise<WishlistActionResponse> => {
    return axiosClient.post(`/wishlist/${productId}`);
  },

  removeFromWishlist: (productId: number): Promise<WishlistActionResponse> => {
    return axiosClient.delete(`/wishlist/${productId}`);
  },

  getCount: (): Promise<WishlistCountDataResponse> => {
    return axiosClient.get('/wishlist/count');
  },

  checkStatus: (productIds: number[]): Promise<WishlistStatusDataResponse> => {
    const params = new URLSearchParams();
    productIds.forEach((id) => params.append('productIds', id.toString()));
    return axiosClient.get('/wishlist/check', { params });
  },

  moveToCart: (data: MoveToCartRequest): Promise<MoveToCartResponse> => {
    return axiosClient.post('/wishlist/move-to-cart', data);
  },
};
