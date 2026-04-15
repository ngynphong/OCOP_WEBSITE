import { axiosClient, publicAxiosClient } from '@/lib/axios';
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
    publicAxiosClient.get('/flash-sales/active', { params: { categoryId } }),

  getUpcomingFlashSales: (categoryId?: number): Promise<FlashSaleListResponse> =>
    publicAxiosClient.get('/flash-sales/upcoming', { params: { categoryId } }),

  getFlashSaleDetail: (id: number): Promise<FlashSaleDetailResponse> =>
    publicAxiosClient.get(`/flash-sales/${id}`),

  buyFlashSaleItem: (
    flashSaleItemId: number,
    data: FlashSaleBuyRequest,
  ): Promise<BuyFlashSaleResponse> => axiosClient.post(`/flash-sales/${flashSaleItemId}/buy`, data),

  // ─── Seller API ────────────────────────────────────────────────────────────
  getSellerFlashSales: (): Promise<FlashSaleListResponse> => axiosClient.get('/seller/flash-sales'),

  createFlashSale: (data: CreateFlashSaleRequest): Promise<FlashSaleDetailResponse> =>
    axiosClient.post('/seller/flash-sales', data),

  updateFlashSale: (id: number, data: UpdateFlashSaleRequest): Promise<FlashSaleDetailResponse> =>
    axiosClient.put(`/seller/flash-sales/${id}`, data),

  cancelSellerFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(`/seller/flash-sales/${id}/cancel`),

  activateSellerFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(`/seller/flash-sales/${id}/activate`),

  // ─── Admin API ─────────────────────────────────────────────────────────────
  getAdminFlashSales: (params?: Record<string, unknown>): Promise<FlashSaleAdminListResponse> =>
    axiosClient.get('/admin/flash-sales', { params }),

  getAdminFlashSaleDetail: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.get(`/admin/flash-sales/${id}`),

  cancelAdminFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(`/admin/flash-sales/${id}/cancel`),

  approveAdminFlashSale: (id: number): Promise<FlashSaleDetailResponse> =>
    axiosClient.post(`/admin/flash-sales/${id}/approve`),
};
