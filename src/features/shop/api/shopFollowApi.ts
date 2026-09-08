import { axiosClient } from '@/lib/axios';
import { ShopFollowStatusResponse } from '../types/shopFollowTypes';

export const shopFollowApi = {
  getFollowStatus: (shopId: number): Promise<ShopFollowStatusResponse> => {
    return axiosClient.get(`/shops/${shopId}/follow-status`, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  followShop: (shopId: number): Promise<ShopFollowStatusResponse> => {
    return axiosClient.post(`/shops/${shopId}/follow`, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  unfollowShop: (shopId: number): Promise<ShopFollowStatusResponse> => {
    return axiosClient.delete(`/shops/${shopId}/follow`, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
};
