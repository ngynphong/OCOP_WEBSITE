import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  IAdminDashboard,
  IDashboardApiResponse,
  ISellerDashboard,
  IUserDashboard,
} from '../types/dashboard';

export const dashboardApi = {
  getAdminDashboard: async (): Promise<IAdminDashboard> => {
    const response = (await axiosClient.get(
      API_ENDPOINTS.ADMIN.DASHBOARD,
    )) as IDashboardApiResponse<IAdminDashboard>;
    return response.data;
  },

  getSellerDashboard: async (): Promise<ISellerDashboard> => {
    const response = (await axiosClient.get(
      API_ENDPOINTS.SELLER.DASHBOARD,
    )) as IDashboardApiResponse<ISellerDashboard>;
    return response.data;
  },

  getUserDashboard: async (): Promise<IUserDashboard> => {
    const response = (await axiosClient.get(
      API_ENDPOINTS.USERS.DASHBOARD,
    )) as IDashboardApiResponse<IUserDashboard>;
    return response.data;
  },
};
