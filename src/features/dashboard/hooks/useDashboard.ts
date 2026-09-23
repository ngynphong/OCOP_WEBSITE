import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { IAdminDashboardParams } from '../types/dashboard';

export const useAdminDashboard = (params: IAdminDashboardParams) => {
  return useQuery({
    queryKey: ['adminDashboard', params],
    queryFn: () => dashboardApi.getAdminDashboard(params),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};

export const useSellerDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['sellerDashboard'],
    queryFn: dashboardApi.getSellerDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled,
  });
};

export const useUserDashboard = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['userDashboard'],
    queryFn: dashboardApi.getUserDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    enabled,
  });
};
