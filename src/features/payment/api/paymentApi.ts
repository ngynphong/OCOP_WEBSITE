import { axiosClient, publicAxiosClient } from '@/lib/axios';
import {
  IPaymentGateway,
  IPaymentGatewayAdmin,
  IUpdatePaymentGatewayConfig,
  ApiResponse,
} from '../types';

export const paymentApi = {
  // Admin APIs
  getAdminGateways: (): Promise<ApiResponse<IPaymentGatewayAdmin[]>> =>
    axiosClient.get('/admin/payment-gateways'),

  getAdminGatewayById: (id: string): Promise<ApiResponse<IPaymentGatewayAdmin>> =>
    axiosClient.get(`/admin/payment-gateways/${id}`),

  toggleGateway: (id: string): Promise<ApiResponse<IPaymentGatewayAdmin>> =>
    axiosClient.patch(`/admin/payment-gateways/${id}/toggle`),

  updateGatewayConfig: (
    id: string,
    data: IUpdatePaymentGatewayConfig,
  ): Promise<ApiResponse<IPaymentGatewayAdmin>> =>
    axiosClient.patch(`/admin/payment-gateways/${id}/config`, data),

  // User APIs
  getUserGateways: (): Promise<ApiResponse<IPaymentGateway[]>> =>
    publicAxiosClient.get('/payment-gateways'),
};
