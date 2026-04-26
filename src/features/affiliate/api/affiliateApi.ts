import { axiosClient } from '@/lib/axios';
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
    return axiosClient.get('/users/affiliate/account');
  },

  getUserWithdrawals: (
    params: GetWithdrawalsParams,
  ): Promise<ApiResponse<PaginatedResponse<WithdrawalRequest>>> => {
    return axiosClient.get('/users/affiliate/withdrawals', { params });
  },

  getUserCommissions: (
    params: GetCommissionsParams,
  ): Promise<ApiResponse<PaginatedResponse<Commission>>> => {
    return axiosClient.get('/users/affiliate/commissions', { params });
  },

  createWithdrawal: (data: CreateWithdrawalPayload): Promise<ApiResponse<WithdrawalRequest>> => {
    const payload = {
      ...data,
      bankInfo: JSON.stringify(data.bankInfo),
    };
    return axiosClient.post('/users/affiliate/withdrawals', payload);
  },

  // Admin APIs
  adminGetWithdrawals: (
    params: GetWithdrawalsParams,
  ): Promise<ApiResponse<PaginatedResponse<WithdrawalRequest>>> => {
    return axiosClient.get('/admin/affiliate/withdrawals', { params });
  },

  adminProcessWithdrawal: (
    id: number,
    data: ProcessWithdrawalPayload,
  ): Promise<ApiResponse<WithdrawalRequest>> => {
    return axiosClient.post(
      `/admin/affiliate/withdrawals/${id}/process`,
      data.adminNote ? { adminNote: data.adminNote } : {},
      {
        params: { status: data.status },
      },
    );
  },
};
