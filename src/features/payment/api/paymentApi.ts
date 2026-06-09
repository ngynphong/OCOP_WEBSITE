import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  IPaymentGateway,
  IPaymentGatewayAdmin,
  IUpdatePaymentGatewayConfig,
  ApiResponse,
} from '../types';

export const paymentApi = {
  // Admin APIs
  getAdminGateways: (): Promise<ApiResponse<IPaymentGatewayAdmin[]>> =>
    axiosClient.get(API_ENDPOINTS.ADMIN.PAYMENT_GATEWAYS),

  getAdminGatewayById: (id: string): Promise<ApiResponse<IPaymentGatewayAdmin>> =>
    axiosClient.get(buildRoute(API_ENDPOINTS.ADMIN.PAYMENT_GATEWAYS, id)),

  toggleGateway: (id: string): Promise<ApiResponse<IPaymentGatewayAdmin>> =>
    axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PAYMENT_GATEWAYS, id, 'toggle')),

  updateGatewayConfig: (
    id: string,
    data: IUpdatePaymentGatewayConfig,
  ): Promise<ApiResponse<IPaymentGatewayAdmin>> =>
    axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.PAYMENT_GATEWAYS, id, 'config'), data),

  // User APIs
  getUserGateways: (): Promise<ApiResponse<IPaymentGateway[]>> =>
    axiosClient.get(API_ENDPOINTS.PUBLIC.PAYMENT_GATEWAYS),

  handlePaymentWebhook: (
    gateway: string,
    params: Record<string, string | string[] | undefined>,
    body: Record<string, unknown> = {},
  ): Promise<ApiResponse<unknown>> =>
    publicAxiosClient.post(buildRoute(API_ENDPOINTS.WEBHOOKS.PAYMENT, gateway), body, { params }),
};
