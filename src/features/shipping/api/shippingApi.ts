import { axiosClient } from '@/lib/axios';
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
    axiosClient.get('/admin/shipping/providers'),

  createProvider: (
    provider: ICreateShippingProvider,
  ): Promise<ApiResponse<IAdminShippingProvider>> =>
    axiosClient.post('/admin/shipping/providers', provider),

  updateProvider: (
    id: string,
    provider: IUpdateShippingProvider,
  ): Promise<ApiResponse<IAdminShippingProvider>> =>
    axiosClient.put(`/admin/shipping/providers/${id}`, provider),

  toggleProvider: (id: string): Promise<ApiResponse<IAdminShippingProvider>> =>
    axiosClient.patch(`/admin/shipping/providers/${id}/toggle`),

  // User APIs
  getProviders: (): Promise<ApiResponse<IShippingProvider[]>> =>
    axiosClient.get('/shipping/providers'),

  estimateFee: (req: IEstimateFeeRequest): Promise<ApiResponse<IEstimateFeeResponse>> =>
    axiosClient.post('/shipping/estimate-fee', req),
};
