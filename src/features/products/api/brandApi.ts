import { axiosClient, publicAxiosClient } from '@/lib/axios';
import {
  PublicBrandListResponse,
  PublicBrandDetailResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '../types/productTypes';

/**
 * Brand API handles both public and admin brand operations.
 * Follows the domain-driven design pattern for the Products feature.
 */
export const brandApi = {
  // ─── Public APIs ───────────────────────────────────────────────────────────

  /**
   * Get all active brands for the public storefront.
   */
  getBrands: (): Promise<PublicBrandListResponse> => {
    return publicAxiosClient.get('/brands');
  },

  /**
   * Get brand details by slug for the public storefront.
   */
  getBrandBySlug: (slug: string): Promise<PublicBrandDetailResponse> => {
    return publicAxiosClient.get(`/brands/${slug}`);
  },

  // ─── Admin APIs ────────────────────────────────────────────────────────────

  /**
   * Create a new brand (Admin only).
   */
  createBrand: (data: CreateBrandRequest): Promise<PublicBrandDetailResponse> => {
    return axiosClient.post('/admin/brands', data);
  },

  /**
   * Update an existing brand (Admin only).
   */
  updateBrand: (
    id: number | string,
    data: UpdateBrandRequest,
  ): Promise<PublicBrandDetailResponse> => {
    return axiosClient.put(`/admin/brands/${id}`, data);
  },
};
