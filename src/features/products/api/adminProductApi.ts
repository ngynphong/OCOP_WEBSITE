import { axiosClient } from '@/lib/axios';
import {
  AdminProductListParams,
  ProductDetailResponse,
  ProductListResponse,
  AdminApproveProductResponse,
} from '@/features/products/types/productTypes';

export const adminProductApi = {
  getProducts: (params?: AdminProductListParams): Promise<ProductListResponse> => {
    return axiosClient.get('/admin/products', { params });
  },

  getProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.get(`/admin/products/${id}`);
  },

  approveProduct: (id: number, note?: string): Promise<AdminApproveProductResponse> => {
    return axiosClient.post(`/admin/products/${id}/approve`, { note });
  },

  rejectProduct: (id: number, note: string): Promise<ProductDetailResponse> => {
    return axiosClient.post(`/admin/products/${id}/reject`, { note });
  },

  setFeatured: (id: number, featured: boolean): Promise<ProductDetailResponse> => {
    return axiosClient.patch(`/admin/products/${id}/feature`, null, { params: { featured } });
  },

  setFeaturedStory: (id: number, featuredStory: boolean): Promise<ProductDetailResponse> => {
    return axiosClient.patch(`/admin/products/${id}/feature-story`, null, {
      params: { featuredStory },
    });
  },

  hideProduct: (id: number): Promise<ProductDetailResponse> => {
    return axiosClient.patch(`/admin/products/${id}/hide`);
  },
};
