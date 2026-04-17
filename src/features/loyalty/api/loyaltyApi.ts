import { axiosClient } from '@/lib/axios';
import {
  AdminLoyaltyAccountResponse,
  AdminAdjustPointsResponse,
  IAdjustPointsRequest,
  UserLoyaltyAccountResponse,
  UserTransactionListResponse,
  ICheckRedeemRequest,
  CheckRedeemResponse,
} from '../types/loyaltyTypes';

export const loyaltyApi = {
  // Admin Endpoints
  getAdminLoyaltyAccount: (userId: string): Promise<AdminLoyaltyAccountResponse> => {
    return axiosClient.get(`/admin/loyalty/accounts/${userId}`);
  },

  adjustPoints: (
    userId: string,
    data: IAdjustPointsRequest,
  ): Promise<AdminAdjustPointsResponse> => {
    return axiosClient.post(`/admin/loyalty/accounts/${userId}/adjust`, data);
  },

  // User Endpoints
  getUserLoyaltyAccount: (): Promise<UserLoyaltyAccountResponse> => {
    return axiosClient.get('/loyalty/account');
  },

  getUserTransactions: (params: {
    type?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<UserTransactionListResponse> => {
    return axiosClient.get('/loyalty/transactions', { params });
  },

  checkRedeem: (data: ICheckRedeemRequest): Promise<CheckRedeemResponse> => {
    return axiosClient.post('/loyalty/check-redeem', data);
  },
};
