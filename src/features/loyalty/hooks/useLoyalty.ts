import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loyaltyApi } from '../api/loyaltyApi';
import { IAdjustPointsRequest } from '../types/loyaltyTypes';
import toast from 'react-hot-toast';

// --- Admin Hooks ---

export const useAdminLoyaltyAccount = (userId: string) => {
  return useQuery({
    queryKey: ['admin', 'loyalty', 'account', userId],
    queryFn: () => loyaltyApi.getAdminLoyaltyAccount(userId),
    enabled: !!userId,
  });
};

export const useAdjustPoints = (userId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: IAdjustPointsRequest) => loyaltyApi.adjustPoints(userId, data),
    onSuccess: () => {
      toast.success('Điều chỉnh điểm thành công');
      queryClient.invalidateQueries({ queryKey: ['admin', 'loyalty', 'account', userId] });
    },
  });
};

// --- User Hooks ---

export const useUserLoyaltyAccount = () => {
  return useQuery({
    queryKey: ['loyalty', 'account'],
    queryFn: () => loyaltyApi.getUserLoyaltyAccount(),
  });
};

export const useUserTransactions = (params: {
  type?: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ['loyalty', 'transactions', params],
    queryFn: () => loyaltyApi.getUserTransactions(params),
  });
};

export const useCheckRedeem = (orderAmount: number) => {
  return useQuery({
    queryKey: ['loyalty', 'check-redeem', orderAmount],
    queryFn: () => loyaltyApi.checkRedeem({ orderAmount }),
    enabled: orderAmount > 0,
  });
};
