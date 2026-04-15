import { axiosClient } from '@/lib/axios';
import { IUserAddress, ICreateAddressRequest, IUpdateAddressRequest, ApiResponse } from '../types';

export const addressApi = {
  getAddresses: (): Promise<ApiResponse<IUserAddress[]>> => axiosClient.get('/users/addresses'),

  getAddressById: (id: number): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.get(`/users/addresses/${id}`),

  getDefaultAddress: (): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.get('/users/addresses/default'),

  createAddress: (data: ICreateAddressRequest): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.post('/users/addresses', data),

  updateAddress: (id: number, data: IUpdateAddressRequest): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.put(`/users/addresses/${id}`, data),

  setDefaultAddress: (id: number): Promise<ApiResponse<IUserAddress>> =>
    axiosClient.patch(`/users/addresses/${id}/default`),

  deleteAddress: (id: number): Promise<ApiResponse<string>> =>
    axiosClient.delete(`/users/addresses/${id}`),
};
