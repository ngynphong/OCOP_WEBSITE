import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  IAdminDashboard,
  IAdminDashboardParams,
  IDashboardApiResponse,
  ISellerDashboard,
  IUserDashboard,
} from '../types/dashboard';

export const dashboardApi = {
  getAdminDashboard: async (params: IAdminDashboardParams): Promise<IAdminDashboard> => {
    const response = (await axiosClient.get(API_ENDPOINTS.ADMIN.DASHBOARD, {
      params,
      headers: { 'X-Silent-Loading': 'true' },
    })) as IDashboardApiResponse<IAdminDashboard>;
    return response.data;
  },

  getSellerDashboard: async (): Promise<ISellerDashboard> => {
    const response = (await axiosClient.get(API_ENDPOINTS.SELLER.DASHBOARD, {
      headers: { 'X-Silent-Loading': 'true' },
    })) as IDashboardApiResponse<ISellerDashboard>;
    return response.data;
  },

  getUserDashboard: async (): Promise<IUserDashboard> => {
    const response = (await axiosClient.get(API_ENDPOINTS.USERS.DASHBOARD, {
      headers: { 'X-Silent-Loading': 'true' },
    })) as IDashboardApiResponse<IUserDashboard>;
    return response.data;
  },
};
