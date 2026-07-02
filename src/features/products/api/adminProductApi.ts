import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  AdminProductListParams,
  ProductDetailResponse,
  ProductListResponse,
  AdminApproveProductResponse,
  UpdateProductStoryRequest,
} from '@/features/products/types/productTypes';

export const adminProductApi = {
  getProducts: (params?: AdminProductListParams): Promise<ProductListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.PRODUCTS, { params });
  },

  getProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id));
  },

  approveProduct: (id: number, note?: string): Promise<AdminApproveProductResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'approve'), { note });
  },

  rejectProduct: (id: number, note: string): Promise<ProductDetailResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'reject'), { note });
  },

  setFeatured: (id: number, featured: boolean): Promise<ProductDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'feature'), null, {
      params: { featured },
    });
  },

  setFeaturedStory: (id: number, featuredStory: boolean): Promise<ProductDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'feature-story'), null, {
      params: { featuredStory },
    });
  },

  hideProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'hide'));
  },

  updateProductStory: (
    id: number,
    data: UpdateProductStoryRequest,
  ): Promise<ProductDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'story'), data);
  },

  updateCategory: (id: number, categoryId: number): Promise<ProductDetailResponse> => {
    return axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PRODUCTS, id, 'category'), null, {
      params: { categoryId },
    });
  },
};
