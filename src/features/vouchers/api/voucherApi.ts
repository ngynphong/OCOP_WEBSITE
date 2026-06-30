import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  SavedVoucherListResponse,
  Voucher,
  VoucherFormValues,
  VoucherListResponse,
  VoucherValidateResponse,
} from '../types';

export const voucherApi = {
  // 1. Public API (Không cần auth)
  getVoucherDetail: (id: number) =>
    publicAxiosClient.get<Voucher>(buildRoute(API_ENDPOINTS.PUBLIC.VOUCHERS, id)),

  getPublicFeaturedVouchers: (limit = 4) =>
    publicAxiosClient.get<Voucher[]>(`${API_ENDPOINTS.PUBLIC.VOUCHERS}/featured`, {
      params: { limit },
    }),

  validateVoucherPublic: (params: { code: string; shopId?: number; subtotal?: number }) =>
    publicAxiosClient.get<VoucherValidateResponse>(`${API_ENDPOINTS.PUBLIC.VOUCHERS}/validate`, {
      params,
      headers: {
        'X-Silent-Loading': 'true',
      },
    }),

  // 2. User API (Ví voucher - Cần auth)
  getSavedVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<SavedVoucherListResponse>(`${API_ENDPOINTS.USERS.VOUCHERS}/saved`, { params }),

  checkVoucherSaved: (voucherId: number) =>
    axiosClient.get<boolean>(buildRoute(API_ENDPOINTS.USERS.VOUCHERS, voucherId, 'saved')),

  saveVoucher: (voucherId: number) =>
    axiosClient.post(buildRoute(API_ENDPOINTS.USERS.VOUCHERS, voucherId, 'save')),

  unsaveVoucher: (voucherId: number) =>
    axiosClient.delete(buildRoute(API_ENDPOINTS.USERS.VOUCHERS, voucherId, 'save')),

  validateVoucherUser: (params: { code: string; shopId?: number; subtotal?: number }) =>
    axiosClient.get<VoucherValidateResponse>(`${API_ENDPOINTS.USERS.VOUCHERS}/validate`, {
      params,
    }),

  // 3. Seller API
  getSellerVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<VoucherListResponse>(`${API_ENDPOINTS.SELLER.VOUCHERS}`, { params }),

  createSellerVoucher: (data: VoucherFormValues) =>
    axiosClient.post<Voucher>(`${API_ENDPOINTS.SELLER.VOUCHERS}`, data),

  updateSellerVoucher: (id: number, data: VoucherFormValues) =>
    axiosClient.put<Voucher>(buildRoute(API_ENDPOINTS.SELLER.VOUCHERS, id), data),

  deleteSellerVoucher: (id: number) =>
    axiosClient.delete(buildRoute(API_ENDPOINTS.SELLER.VOUCHERS, id)),

  toggleSellerVoucher: (id: number) =>
    axiosClient.patch<Voucher>(buildRoute(API_ENDPOINTS.SELLER.VOUCHERS, id, 'toggle')),

  // 4. Admin API
  getAdminVouchers: (params: { pageNo?: number; pageSize?: number }) =>
    axiosClient.get<VoucherListResponse>(`${API_ENDPOINTS.ADMIN.VOUCHERS}`, { params }),

  createAdminVoucher: (data: VoucherFormValues) =>
    axiosClient.post<Voucher>(`${API_ENDPOINTS.ADMIN.VOUCHERS}`, data),
};
