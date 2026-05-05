import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ['adminDashboard'],
    queryFn: dashboardApi.getAdminDashboard,
    staleTime: 5 * 60 * 1000, // 5 minutes
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
