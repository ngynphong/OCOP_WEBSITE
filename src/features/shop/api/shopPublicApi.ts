import { publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import { Product, PublicCategoryListResponse } from '@/features/products/types/productTypes';
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

  getShopCategories: (slug: string): Promise<PublicCategoryListResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.SHOPS, slug, 'categories'), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getShopBestSellers: (slug: string, limit = 4): Promise<ResponseBase<Product[]>> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.SHOPS, slug, 'best-sellers'), {
      params: { limit },
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getShopFeaturedProducts: (slug: string, limit = 4): Promise<ResponseBase<Product[]>> => {
    return publicAxiosClient.get(
      buildRoute(API_ENDPOINTS.PUBLIC.SHOPS, slug, 'featured-products'),
      {
        params: { limit },
        headers: { 'X-Silent-Loading': 'true' },
      },
    );
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
