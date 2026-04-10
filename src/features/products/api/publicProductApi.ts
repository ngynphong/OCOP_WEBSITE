import { publicAxiosClient } from '@/lib/axios';
import {
  PublicProductListParams,
  ProductDetailResponse,
  ProductListResponse,
  QrCodeResponse,
  PublicCategoryListResponse,
} from '@/features/products/types/productTypes';

export const publicProductApi = {
  getProducts: (params?: PublicProductListParams): Promise<ProductListResponse> => {
    return publicAxiosClient.get('/products', { params });
  },

  getProduct: (id: number): Promise<ProductDetailResponse> => {
    return publicAxiosClient.get(`/products/${id}`);
  },

  traceQr: (qrCode: string): Promise<QrCodeResponse> => {
    return publicAxiosClient.get(`/products/trace/${qrCode}`);
  },

  getCategories: (): Promise<PublicCategoryListResponse> => {
    return publicAxiosClient.get('/categories');
  },
};
