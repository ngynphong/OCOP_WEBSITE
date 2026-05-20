import { publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
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
    return publicAxiosClient.get(API_ENDPOINTS.PUBLIC.PRODUCTS, { params });
  },

  getProduct: (slugOrId: string | number): Promise<ProductDetailResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/${slugOrId}`);
  },

  getRelatedProducts: (slug: string, limit = 6): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/${slug}/related`, {
      params: { limit },
    });
  },

  getFeaturedProducts: (limit = 12): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/featured`, {
      params: { limit },
    });
  },

  getFeaturedStory: (): Promise<ProductDetailResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/featured-story`);
  },

  traceQr: (qrCode: string): Promise<QrCodeResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.TRACE}/${qrCode}`);
  },

  getCategories: (): Promise<PublicCategoryListResponse> => {
    return publicAxiosClient.get(API_ENDPOINTS.PUBLIC.CATEGORIES);
  },

  getCategoryBySlug: (slug: string): Promise<PublicCategoryDetailResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.CATEGORIES}/${slug}`);
  },

  traceQrDetail: (qrCode: string): Promise<TraceDetailResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.TRACE}/${qrCode}`);
  },

  recordQrScan: (qrCode: string): Promise<ResponseBase<string>> => {
    return publicAxiosClient.post(`${API_ENDPOINTS.PUBLIC.TRACE}/${qrCode}/scan`);
  },

  getProvinces: (): Promise<ResponseBase<{ id: number; name: string }[]>> => {
    return publicAxiosClient.get(API_ENDPOINTS.LOCATION.PROVINCES);
  },
  getDiscoveryProducts: (params?: {
    pageNo?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/discovery`, { params });
  },

  getTierPrices: (
    productId: number,
    variantId?: number,
  ): Promise<ResponseBase<WholesalePrice[]>> => {
    return publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.PRODUCTS}/${productId}/tier-prices`, {
      params: { variantId },
    });
  },
};
