import { publicAxiosClient } from '@/lib/axios';
import {
  GetShopsPublicParams,
  ShopListResponse,
  ShopDetailResponse,
  ShopPolicyResponse,
  SubscriptionPlanListResponse,
} from '../types/shopTypes';

export const shopPublicApi = {
  getShops: (params?: GetShopsPublicParams): Promise<ShopListResponse> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
        )
      : {};
    return publicAxiosClient.get('/shops', { params: filteredParams });
  },

  getShopBySlug: (slug: string): Promise<ShopDetailResponse> => {
    return publicAxiosClient.get(`/shops/${slug}`);
  },

  getShopPolicy: (slug: string): Promise<ShopPolicyResponse> => {
    return publicAxiosClient.get(`/shops/${slug}/policy`);
  },

  getSubscriptionPlans: (): Promise<SubscriptionPlanListResponse> => {
    return publicAxiosClient.get('/shops/subscription-plans');
  },
};
