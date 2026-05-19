import { axiosClient } from '@/lib/axios';
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
} from '../types/adminTypes';

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
    return axiosClient.get('/admin/orders', { params: filteredParams });
  },

  getDashboard: (): Promise<AdminDashboardResponse> => {
    return axiosClient.get('/admin/orders/dashboard');
  },

  getRefunds: (params: {
    status?: string;
    pageNo?: number;
    pageSize?: number;
  }): Promise<AdminRefundListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get('/admin/refunds', { params: filteredParams });
  },

  processPayout: (
    payoutId: number | string,
    data: IPayoutProcessReq,
  ): Promise<AdminPayoutResponse> => {
    return axiosClient.post(`/admin/payouts/${payoutId}/process`, data);
  },

  approveRefund: (
    refundId: number | string,
    data: IRefundApproveReq,
  ): Promise<AdminRefundActionResponse> => {
    return axiosClient.post(`/admin/refunds/${refundId}/approve`, data);
  },

  getPayouts: (params: IAdminPayoutParams): Promise<AdminPayoutListResponse> => {
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''),
    );
    return axiosClient.get('/admin/payouts', { params: filteredParams });
  },

  generatePayouts: (
    shopId: number | string,
    periodStart: string,
    periodEnd: string,
  ): Promise<AdminPayoutGenerateResponse> => {
    return axiosClient.post(`/admin/payouts/generate`, undefined, {
      params: { shopId, periodStart, periodEnd },
    });
  },
};
