import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  AffiliateAccount,
  WithdrawalRequest,
  CreateWithdrawalPayload,
  ProcessWithdrawalPayload,
  PaginatedResponse,
  ApiResponse,
  GetWithdrawalsParams,
  GetCommissionsParams,
  Commission,
} from '../types/affiliateTypes';

export const affiliateApi = {
  // User APIs
  getAffiliateAccount: (): Promise<ApiResponse<AffiliateAccount>> => {
    return axiosClient.get(API_ENDPOINTS.USERS.AFFILIATE_ACCOUNT);
  },

  getUserWithdrawals: (
    params: GetWithdrawalsParams,
  ): Promise<ApiResponse<PaginatedResponse<WithdrawalRequest>>> => {
    return axiosClient.get(API_ENDPOINTS.USERS.AFFILIATE_WITHDRAWALS, { params });
  },

  getUserCommissions: (
    params: GetCommissionsParams,
  ): Promise<ApiResponse<PaginatedResponse<Commission>>> => {
    return axiosClient.get(API_ENDPOINTS.USERS.AFFILIATE_COMMISSIONS, { params });
  },

  createWithdrawal: (data: CreateWithdrawalPayload): Promise<ApiResponse<WithdrawalRequest>> => {
    const payload = {
      ...data,
      bankInfo: JSON.stringify(data.bankInfo),
    };
    return axiosClient.post(API_ENDPOINTS.USERS.AFFILIATE_WITHDRAWALS, payload);
  },

  // Admin APIs
  adminGetWithdrawals: (
    params: GetWithdrawalsParams,
  ): Promise<ApiResponse<PaginatedResponse<WithdrawalRequest>>> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.AFFILIATE_WITHDRAWALS, { params });
  },

  adminProcessWithdrawal: (
    id: number,
    data: ProcessWithdrawalPayload,
  ): Promise<ApiResponse<WithdrawalRequest>> => {
    return axiosClient.post(
      buildRoute(API_ENDPOINTS.ADMIN.AFFILIATE_WITHDRAWALS, id, 'process'),
      data.adminNote ? { adminNote: data.adminNote } : {},
      {
        params: { status: data.status },
      },
    );
  },
};
