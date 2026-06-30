import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  IShippingProvider,
  ICreateShippingProvider,
  IUpdateShippingProvider,
  IEstimateFeeRequest,
  IEstimateFeeResponse,
  IAdminShippingProvider,
} from '../types';

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export const shippingApi = {
  // Admin APIs
  getAdminProviders: (): Promise<ApiResponse<IAdminShippingProvider[]>> =>
    axiosClient.get(API_ENDPOINTS.ADMIN.SHIPPING_PROVIDERS),

  createProvider: (
    provider: ICreateShippingProvider,
  ): Promise<ApiResponse<IAdminShippingProvider>> =>
    axiosClient.post(API_ENDPOINTS.ADMIN.SHIPPING_PROVIDERS, provider),

  updateProvider: (
    id: string,
    provider: IUpdateShippingProvider,
  ): Promise<ApiResponse<IAdminShippingProvider>> =>
    axiosClient.put(buildRoute(API_ENDPOINTS.ADMIN.SHIPPING_PROVIDERS, id), provider),

  toggleProvider: (id: string): Promise<ApiResponse<IAdminShippingProvider>> =>
    axiosClient.patch(buildRoute(API_ENDPOINTS.ADMIN.SHIPPING_PROVIDERS, id, 'toggle')),

  // User APIs
  getProviders: (): Promise<ApiResponse<IShippingProvider[]>> =>
    axiosClient.get(API_ENDPOINTS.SHIPPING.PROVIDERS),

  estimateFee: (req: IEstimateFeeRequest): Promise<ApiResponse<IEstimateFeeResponse>> =>
    axiosClient.post(API_ENDPOINTS.SHIPPING.ESTIMATE_FEE, req, {
      headers: { 'X-Silent-Loading': 'true' },
    }),
};
