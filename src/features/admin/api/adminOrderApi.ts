import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  AdminOrderListResponse,
  AdminDashboardResponse,
  AdminRefundListResponse,
  AdminPayoutResponse,
  AdminPayoutListResponse,
  AdminPayoutGenerateResponse,
  AdminRefundActionResponse,
  IPayoutProcessReq,
  IRefundApproveReq,
  IAdminPayoutParams,
} from '@/features/admin/types/adminTypes';

export const adminOrderApi = {
  getOrders: (params: {
    status?: string;
    startDate?: string;
    endDate?: string;
    keyword?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<AdminOrderListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get(API_ENDPOINTS.ADMIN.ORDERS, { params: filteredParams });
  },

  getDashboard: (): Promise<AdminDashboardResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.ORDERS_DASHBOARD);
  },

  getRefunds: (params: {
    status?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<AdminRefundListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get(API_ENDPOINTS.ADMIN.REFUNDS, { params: filteredParams });
  },

  processPayout: (
    payoutId: number | string,
    data: IPayoutProcessReq,
  ): Promise<AdminPayoutResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.PAYOUTS, payoutId, 'process'), data);
  },

  approveRefund: (
    refundId: number | string,
    data: IRefundApproveReq,
  ): Promise<AdminRefundActionResponse> => {
    return axiosClient.post(buildRoute(API_ENDPOINTS.ADMIN.REFUNDS, refundId, 'approve'), data);
  },

  getPayouts: (params: IAdminPayoutParams): Promise<AdminPayoutListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get(API_ENDPOINTS.ADMIN.PAYOUTS, { params: filteredParams });
  },

  generatePayouts: (
    shopId: number | string,
    periodStart: string,
    periodEnd: string,
  ): Promise<AdminPayoutGenerateResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.PAYOUTS}/generate`, undefined, {
      params: { shopId, periodStart, periodEnd },
    });
  },
};
