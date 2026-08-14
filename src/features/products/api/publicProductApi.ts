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

  getFeaturedProducts: (limit = 12, categoryId?: number): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/featured`, {
      params: { limit, categoryId },
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
    if (qrCode.startsWith('01-') && qrCode.includes('-10-')) {
      const parts = qrCode.split('-');
      const gtin = parts[1];
      const lotCode = parts.slice(3).join('-');
      return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.TRACE}/01/${gtin}/10/${lotCode}`);
    }
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.TRACE, qrCode));
  },

  recordQrScan: (qrCode: string): Promise<ResponseBase<string>> => {
    // Note: We might not be able to record scan for digital link directly unless backend supports it,
    // but we can send it just in case. Backend might ignore or process it.
    if (qrCode.startsWith('01-') && qrCode.includes('-10-')) {
      // Backend does not have an endpoint for recording scan by digital link yet,
      // but digital link tracing doesn't need to increment QR scan count (or we can just skip it).
      return Promise.resolve({
        data: 'Skipped scan for GS1 link',
        message: 'Success',
        status: 200,
        code: 200,
        timestamp: '',
      });
    }
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
