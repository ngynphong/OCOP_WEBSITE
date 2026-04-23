import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { Voucher, VoucherFormValues, VoucherListResponse, VoucherValidateResponse } from '../types';

export const voucherApi = {
  // Seller API
  getSellerVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<VoucherListResponse>('/seller/vouchers', { params }),

  createSellerVoucher: (data: VoucherFormValues) =>
    axiosClient.post<Voucher>('/seller/vouchers', data),

  updateSellerVoucher: (id: number, data: VoucherFormValues) =>
    axiosClient.put<Voucher>(`/seller/vouchers/${id}`, data),

  deleteSellerVoucher: (id: number) => axiosClient.delete(`/seller/vouchers/${id}`),

  toggleSellerVoucher: (id: number) => axiosClient.patch<Voucher>(`/seller/vouchers/${id}/toggle`),

  // Admin API
  getAdminVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<VoucherListResponse>('/admin/vouchers', { params }),

  createAdminVoucher: (data: VoucherFormValues) =>
    axiosClient.post<Voucher>('/admin/vouchers', data),

  // Public API
  validateVoucher: (code: string, shopId?: number) =>
    publicAxiosClient.get<VoucherValidateResponse>('/vouchers/validate', {
      params: { code, shopId },
    }),

  getPublicFeaturedVouchers: (limit = 4) =>
    publicAxiosClient.get<Voucher[]>('/vouchers/featured', { params: { limit } }),

  collectVoucher: (voucherId: number) => axiosClient.post(`/vouchers/${voucherId}/collect`),
};
