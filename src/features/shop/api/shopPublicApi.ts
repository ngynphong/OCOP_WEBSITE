import { publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  ResponseBase,
  GetShopsPublicParams,
  ShopInfo,
  ShopListResponse,
  ShopPolicyResponse,
  ShopPublicDetailResponse,
  SubscriptionPlanListResponse,
} from '../types/shopTypes';

export const shopPublicApi = {
  getShops: (params?: GetShopsPublicParams): Promise<ShopListResponse> => {
    const filteredParams = params
      ? Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
        )
      : {};
    return publicAxiosClient.get(API_ENDPOINTS.PUBLIC.SHOPS, { params: filteredParams });
  },

  getShopBySlug: (slug: string): Promise<ShopPublicDetailResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.SHOPS, slug));
  },

  getShopPolicy: (slug: string): Promise<ShopPolicyResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.SHOPS, slug, 'policy'));
  },

  getSubscriptionPlans: (): Promise<SubscriptionPlanListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.SHOPS}/subscription-plans`, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getFeaturedShops: (limit = 6): Promise<ResponseBase<ShopInfo[]>> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.SHOPS}/featured`, {
      params: { limit },
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
};
