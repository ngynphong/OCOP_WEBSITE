import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  FlashSaleListResponse,
  FlashSaleAdminListResponse,
  FlashSaleDetailResponse,
  BuyFlashSaleResponse,
  CreateFlashSaleRequest,
  UpdateFlashSaleRequest,
} from '../types';
import { FlashSaleBuyRequest } from '@/features/checkout/types/checkoutTypes';

export const flashSaleApi = {
  // ─── Public API ────────────────────────────────────────────────────────────
  getActiveFlashSales: (categoryId?: number): Promise<FlashSaleListResponse> =>
    publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.FLASH_SALES}/active`, { params: { categoryId } }),

  getUpcomingFlashSales: (categoryId?: number): Promise<FlashSaleListResponse> =>
    publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.FLASH_SALES}/upcoming`, {
      params: { categoryId },
    }),

  getFlashSaleDetail: (id: number): Promise<FlashSaleDetailResponse> =>
    publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.FLASH_SALES, id)),

  buyFlashSaleItem: (
    flashSaleItemId: number,
    data: FlashSaleBuyRequest,
  ): Promise<BuyFlashSaleResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.PUBLIC.FLASH_SALES, flashSaleItemId, 'buy'), data),

  // ─── Seller API ────────────────────────────────────────────────────────────
  getSellerFlashSales: (): Promise<FlashSaleListResponse> =>
    axiosClient.get(API_ENDPOINTS.SELLER.FLASH_SALES),

  createFlashSale: (data: CreateFlashSaleRequest): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(API_ENDPOINTS.SELLER.FLASH_SALES, data),

  updateFlashSale: (id: number, data: UpdateFlashSaleRequest): Promise<FlashSaleDetailResponse> =>
    axiosClient.put(buildRoute(API_ENDPOINTS.SELLER.FLASH_SALES, id), data),

  cancelSellerFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.FLASH_SALES, id, 'cancel')),

  activateSellerFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.FLASH_SALES, id, 'activate')),

  // ─── Admin API ─────────────────────────────────────────────────────────────
  getAdminFlashSales: (params?: Record<string, unknown>): Promise<FlashSaleAdminListResponse> =>
    axiosClient.get(API_ENDPOINTS.ADMIN.FLASH_SALES, { params }),

  getAdminFlashSaleDetail: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.FLASH_SALES, id)),

  cancelAdminFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.FLASH_SALES, id, 'cancel')),

  approveAdminFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.FLASH_SALES, id, 'approve')),
};
