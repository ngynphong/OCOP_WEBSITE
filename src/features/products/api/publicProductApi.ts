import { publicAxiosClient } from '@/lib/axios';
import {
  PublicProductListParams,
  ProductDetailResponse,
  ProductListResponse,
  QrCodeResponse,
  PublicCategoryListResponse,
  PublicCategoryDetailResponse,
  TraceDetailResponse,
  ResponseBase,
} from '@/features/products/types/productTypes';

export const publicProductApi = {
  getProducts: (params?: PublicProductListParams): Promise<ProductListResponse> => {
    return publicAxiosClient.get('/products', { params });
  },

  getProduct: (slugOrId: string | number): Promise<ProductDetailResponse> => {
    return publicAxiosClient.get(`/products/${slugOrId}`);
  },

  getRelatedProducts: (slug: string, limit = 6): Promise<ProductListResponse> => {
    return publicAxiosClient.get(`/products/${slug}/related`, { params: { limit } });
  },

  getFeaturedProducts: (limit = 12): Promise<ProductListResponse> => {
    return publicAxiosClient.get('/products/featured', { params: { limit } });
  },

  traceQr: (qrCode: string): Promise<QrCodeResponse> => {
    return publicAxiosClient.get(`/trace/${qrCode}`);
  },

  getCategories: (): Promise<PublicCategoryListResponse> => {
    return publicAxiosClient.get('/categories');
  },

  getCategoryBySlug: (slug: string): Promise<PublicCategoryDetailResponse> => {
    return publicAxiosClient.get(`/categories/${slug}`);
  },

  traceQrDetail: (qrCode: string): Promise<TraceDetailResponse> => {
    return publicAxiosClient.get(`/trace/${qrCode}`);
  },

  recordQrScan: (qrCode: string): Promise<ResponseBase<string>> => {
    return publicAxiosClient.post(`/trace/${qrCode}/scan`);
  },

  getProvinces: (): Promise<ResponseBase<{ id: number; name: string }[]>> => {
    return publicAxiosClient.get('/location/provinces');
  },
  getDiscoveryProducts: (params?: {
    pageNo?: number;
    pageSize?: number;
    sort?: string;
  }): Promise<ProductListResponse> => {
    return publicAxiosClient.get('/products/discovery', { params });
  },
};
