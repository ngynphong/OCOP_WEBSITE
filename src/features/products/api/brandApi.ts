import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
    return publicAxiosClient.get(API_ENDPOINTS.PUBLIC.BRANDS);
  },

  /**
   * Get brand details by slug for the public storefront.
   */
  getBrandBySlug: (slug: string): Promise<PublicBrandDetailResponse> => {
    return publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.BRANDS, slug));
  },

  // ─── Admin APIs ────────────────────────────────────────────────────────────

  /**
   * Create a new brand (Admin only).
   */
  createBrand: (data: CreateBrandRequest): Promise<PublicBrandDetailResponse> => {
    return axiosClient.post(API_ENDPOINTS.ADMIN.BRANDS, data);
  },

  /**
   * Update an existing brand (Admin only).
   */
  updateBrand: (
    id: number | string,
    data: UpdateBrandRequest,
  ): Promise<PublicBrandDetailResponse> => {
    return axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.BRANDS, id), data);
  },
};
