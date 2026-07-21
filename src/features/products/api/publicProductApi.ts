import { publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  PublicProductListParams,
  ProductDetailResponse,
  ProductListResponse,
  QrCodeResponse,
  PublicCategoryListResponse,
  PublicCategoryDetailResponse,
  TraceDetailResponse,
  ResponseBase,
  WholesalePrice,
} from '@/features/products/types/productTypes';

export const publicProductApi = {
  getProducts: (params?: PublicProductListParams): Promise<ProductListResponse> => {
    return publicAxiosClient.get(API_ENDPOINTS.PUBLIC.PRODUCTS, {
      params,
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getProduct: (slugOrId: string | number): Promise<ProductDetailResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.PRODUCTS, slugOrId), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getRelatedProducts: (slug: string, limit = 6): Promise<ProductListResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.PRODUCTS, slug, 'related'), {
      params: { limit },
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getFeaturedProducts: (limit = 12): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/featured`, {
      params: { limit },
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getFeaturedStory: (): Promise<ProductDetailResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/featured-story`, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  traceQr: (qrCode: string): Promise<QrCodeResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.TRACE, qrCode));
  },

  getCategories: (): Promise<PublicCategoryListResponse> => {
    return publicAxiosClient.get(API_ENDPOINTS.PUBLIC.CATEGORIES, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  getCategoryBySlug: (slug: string): Promise<PublicCategoryDetailResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.CATEGORIES, slug), {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },

  traceQrDetail: (qrCode: string): Promise<TraceDetailResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.TRACE, qrCode));
  },

  recordQrScan: (qrCode: string): Promise<ResponseBase<string>> => {
    return publicAxiosClient.post(buildRoute(API_ENDPOINTS.PUBLIC.TRACE, qrCode, 'scan'));
  },

  getProvinces: (): Promise<ResponseBase<{ id: number; name: string }[]>> => {
    return publicAxiosClient.get(API_ENDPOINTS.LOCATION.PROVINCES, {
      headers: { 'X-Silent-Loading': 'true' },
    });
  },
  getDiscoveryProducts: (params?: {
    pageNo?: number;
    pageSize?: number;
    sort?: string;
    categoryId?: number;
  }): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/discovery`, {
      headers: { 'X-Silent-Loading': 'true' },
      params,
    });
  },

  getTierPrices: (
    productId: number,
    variantId?: number,
  ): Promise<ResponseBase<WholesalePrice[]>> => {
    return publicAxiosClient.get(
      buildRoute(API_ENDPOINTS.PUBLIC.PRODUCTS, productId, 'tier-prices'),
      {
        params: { variantId },
        headers: { 'X-Silent-Loading': 'true' },
      },
    );
  },
};
