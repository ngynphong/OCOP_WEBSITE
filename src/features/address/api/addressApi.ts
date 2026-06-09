import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import { IUserAddress, ICreateAddressRequest, IUpdateAddressRequest, ApiResponse } from '../types';

export const addressApi = {
  getAddresses: (): Promise<ApiResponse<IUserAddress[]>> =>
    axiosClient.get(API_ENDPOINTS.USERS.ADDRESSES),

  getAddressById: (id: number): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.get(buildRoute(API_ENDPOINTS.USERS.ADDRESSES, id)),

  getDefaultAddress: (): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.get(`${API_ENDPOINTS.USERS.ADDRESSES}/default`),

  createAddress: (data: ICreateAddressRequest): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.post(API_ENDPOINTS.USERS.ADDRESSES, data),

  updateAddress: (id: number, data: IUpdateAddressRequest): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.put(buildRoute(API_ENDPOINTS.USERS.ADDRESSES, id), data),

  setDefaultAddress: (id: number): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.patch(buildRoute(API_ENDPOINTS.USERS.ADDRESSES, id, 'default')),

  deleteAddress: (id: number): Promise<ApiResponse<string>> =>
    axiosClient.delete(buildRoute(API_ENDPOINTS.USERS.ADDRESSES, id)),
};
