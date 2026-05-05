import { axiosClient } from '@/lib/axios';
import {
  IAdminDashboard,
  IDashboardApiResponse,
  ISellerDashboard,
  IUserDashboard,
} from '../types/dashboard';

export const dashboardApi = {
  getAdminDashboard: async (): Promise<IAdminDashboard> => {
    const response = (await axiosClient.get(
      '/admin/dashboard',
    )) as IDashboardApiResponse<IAdminDashboard>;
    return response.data;
  },

  getSellerDashboard: async (): Promise<ISellerDashboard> => {
    const response = (await axiosClient.get(
      '/seller/dashboard',
    )) as IDashboardApiResponse<ISellerDashboard>;
    return response.data;
  },

  getUserDashboard: async (): Promise<IUserDashboard> => {
    const response = (await axiosClient.get(
      '/users/dashboard',
    )) as IDashboardApiResponse<IUserDashboard>;
    return response.data;
  },
};
