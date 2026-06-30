import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
    return axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.LOYALTY, userId));
  },

  adjustPoints: (
    userId: string,
    data: IAdjustPointsRequest,
  ): Promise<AdminAdjustPointsResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.LOYALTY, userId, 'adjust'), data);
  },

  // User Endpoints
  getUserLoyaltyAccount: (): Promise<UserLoyaltyAccountResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.LOYALTY}/account`);
  },

  getUserTransactions: (params: {
    type?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<UserTransactionListResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.LOYALTY}/transactions`, { params });
  },

  checkRedeem: (data: ICheckRedeemRequest): Promise<CheckRedeemResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.LOYALTY}/check-redeem`, data, {
      headers: {
        'X-Silent-Loading': 'true',
      },
    });
  },
};
