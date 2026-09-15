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
    publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.FLASH_SALES}/active`, {
      params: { categoryId },
      headers: { 'X-Silent-Loading': 'true' },
    }),

  getUpcomingFlashSales: (categoryId?: number): Promise<FlashSaleListResponse> =>
    publicAxiosClient.get(`${API_ENDPOINTS.PUBLIC.FLASH_SALES}/upcoming`, {
      params: { categoryId },
      headers: { 'X-Silent-Loading': 'true' },
    }),

  getFlashSaleDetail: (id: number): Promise<FlashSaleDetailResponse> =>
    publicAxiosClient.get(buildRoute(API_ENDPOINTS.PUBLIC.FLASH_SALES, id), {
      headers: { 'X-Silent-Loading': 'true' },
    }),

  buyFlashSaleItem: (
    flashSaleItemId: number,
    data: FlashSaleBuyRequest,
  ): Promise<BuyFlashSaleResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.PUBLIC.FLASH_SALES, flashSaleItemId, 'buy'), data),

  // ─── Seller API ────────────────────────────────────────────────────────────
  getSellerFlashSales: (): Promise<FlashSaleListResponse> =>
    axiosClient.get(API_ENDPOINTS.SELLER.FLASH_SALES, {
      headers: { 'X-Silent-Loading': 'true' },
    }),

  createFlashSale: (data: CreateFlashSaleRequest): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(API_ENDPOINTS.SELLER.FLASH_SALES, data),

  updateFlashSale: (id: number, data: UpdateFlashSaleRequest): Promise<FlashSaleDetailResponse> =>
    axiosClient.put(buildRoute(API_ENDPOINTS.SELLER.FLASH_SALES, id), data),

  cancelSellerFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.FLASH_SALES, id, 'cancel'), {
      headers: { 'X-Silent-Loading': 'true' },
    }),

  scheduleSellerFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.SELLER.FLASH_SALES, id, 'schedule'), {
      headers: { 'X-Silent-Loading': 'true' },
    }),

  // ─── Admin API ─────────────────────────────────────────────────────────────
  getAdminFlashSales: (params?: Record<string, unknown>): Promise<FlashSaleAdminListResponse> =>
    axiosClient.get(API_ENDPOINTS.ADMIN.FLASH_SALES, {
      params,
      headers: { 'X-Silent-Loading': 'true' },
    }),

  getAdminFlashSaleDetail: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.FLASH_SALES, id), {
      headers: { 'X-Silent-Loading': 'true' },
    }),

  cancelAdminFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.FLASH_SALES, id, 'cancel'), {
      headers: { 'X-Silent-Loading': 'true' },
    }),

  approveAdminFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.FLASH_SALES, id, 'approve'), {
      headers: { 'X-Silent-Loading': 'true' },
    }),
};
