import { axiosClient, publicAxiosClient } from '@/lib/axios';
import {
  SavedVoucherListResponse,
  Voucher,
  VoucherFormValues,
  VoucherListResponse,
  VoucherValidateResponse,
} from '../types';

export const voucherApi = {
  // 1. Public API (Không cần auth)
  getVoucherDetail: (id: number) => publicAxiosClient.get<Voucher>(`/vouchers/${id}`),

  getPublicFeaturedVouchers: (limit = 4) =>
    publicAxiosClient.get<Voucher[]>('/vouchers/featured', { params: { limit } }),

  validateVoucherPublic: (params: { code: string; shopId?: number; subtotal?: number }) =>
    publicAxiosClient.get<VoucherValidateResponse>('/vouchers/validate', { params }),

  // 2. User API (Ví voucher - Cần auth)
  getSavedVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<SavedVoucherListResponse>('/users/vouchers/saved', { params }),

  checkVoucherSaved: (voucherId: number) =>
    axiosClient.get<boolean>(`/users/vouchers/${voucherId}/saved`),

  saveVoucher: (voucherId: number) => axiosClient.post(`/users/vouchers/${voucherId}/save`),

  unsaveVoucher: (voucherId: number) => axiosClient.delete(`/users/vouchers/${voucherId}/save`),

  validateVoucherUser: (params: { code: string; shopId?: number; subtotal?: number }) =>
    axiosClient.get<VoucherValidateResponse>('/users/vouchers/validate', { params }),

  // 3. Seller API
  getSellerVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<VoucherListResponse>('/seller/vouchers', { params }),

  createSellerVoucher: (data: VoucherFormValues) =>
    axiosClient.post<Voucher>('/seller/vouchers', data),

  updateSellerVoucher: (id: number, data: VoucherFormValues) =>
    axiosClient.put<Voucher>(`/seller/vouchers/${id}`, data),

  deleteSellerVoucher: (id: number) => axiosClient.delete(`/seller/vouchers/${id}`),

  toggleSellerVoucher: (id: number) => axiosClient.patch<Voucher>(`/seller/vouchers/${id}/toggle`),

  // 4. Admin API
  getAdminVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<VoucherListResponse>('/admin/vouchers', { params }),

  createAdminVoucher: (data: VoucherFormValues) =>
    axiosClient.post<Voucher>('/admin/vouchers', data),
};
