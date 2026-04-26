import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { affiliateApi } from '../api/affiliateApi';
import {
  CreateWithdrawalPayload,
  GetWithdrawalsParams,
  ProcessWithdrawalPayload,
  GetCommissionsParams,
} from '../types/affiliateTypes';

/**
 * Hook lấy thông tin tài khoản affiliate của người dùng
 */
export const useAffiliateAccount = () => {
  const accountQuery = useQuery({
    queryKey: ['affiliate-account'],
    queryFn: () => affiliateApi.getAffiliateAccount(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    account: accountQuery.data?.data,
    isLoadingAccount: accountQuery.isLoading,
    isErrorAccount: accountQuery.isError,
    refetchAccount: accountQuery.refetch,
  };
};

/**
 * Hook lấy lịch sử hoa hồng của người dùng
 */
export const useUserCommissions = (params: GetCommissionsParams) => {
  const commissionsQuery = useQuery({
    queryKey: ['user-commissions', params],
    queryFn: () => affiliateApi.getUserCommissions(params),
    staleTime: 1 * 60 * 1000,
  });

  return {
    commissions: commissionsQuery.data?.data?.content || [],
    pagination: {
      totalElements: commissionsQuery.data?.data?.totalElements || 0,
      totalPages: commissionsQuery.data?.data?.totalPages || 0,
      page: commissionsQuery.data?.data?.page || 0,
      size: commissionsQuery.data?.data?.size || 10,
    },
    isLoadingCommissions: commissionsQuery.isLoading,
    isErrorCommissions: commissionsQuery.isError,
    refetchCommissions: commissionsQuery.refetch,
  };
};

/**
 * Hook lấy lịch sử rút tiền của người dùng
 */
export const useUserWithdrawals = (params: GetWithdrawalsParams) => {
  const withdrawalsQuery = useQuery({
    queryKey: ['user-withdrawals', params],
    queryFn: () => affiliateApi.getUserWithdrawals(params),
    staleTime: 1 * 60 * 1000,
  });

  return {
    withdrawals: withdrawalsQuery.data?.data?.content || [],
    pagination: {
      totalElements: withdrawalsQuery.data?.data?.totalElements || 0,
      totalPages: withdrawalsQuery.data?.data?.totalPages || 0,
      page: withdrawalsQuery.data?.data?.page || 0,
      size: withdrawalsQuery.data?.data?.size || 10,
    },
    isLoadingWithdrawals: withdrawalsQuery.isLoading,
    isErrorWithdrawals: withdrawalsQuery.isError,
    refetchWithdrawals: withdrawalsQuery.refetch,
  };
};

/**
 * Hook quản lý các mutations cho affiliate (rút tiền)
 */
export const useAffiliateMutations = () => {
  const queryClient = useQueryClient();

  const createWithdrawalMutation = useMutation({
    mutationFn: (data: CreateWithdrawalPayload) => affiliateApi.createWithdrawal(data),
    onSuccess: () => {
      toast.success('Yêu cầu rút tiền của bạn đã được gửi thành công.');
      queryClient.invalidateQueries({ queryKey: ['user-withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['affiliate-account'] });
    },
  });

  return {
    createWithdrawal: createWithdrawalMutation.mutateAsync,
    isCreatingWithdrawal: createWithdrawalMutation.isPending,
  };
};

/**
 * Hook dành cho Admin quản lý affiliate
 */
export const useAdminAffiliate = (params: GetWithdrawalsParams) => {
  const queryClient = useQueryClient();

  const withdrawalsQuery = useQuery({
    queryKey: ['admin-withdrawals', params],
    queryFn: () => affiliateApi.adminGetWithdrawals(params),
    staleTime: 30 * 1000,
  });

  const processWithdrawalMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ProcessWithdrawalPayload }) =>
      affiliateApi.adminProcessWithdrawal(id, data),
    onSuccess: () => {
      toast.success('Đã cập nhật trạng thái yêu cầu rút tiền thành công.');
      queryClient.invalidateQueries({ queryKey: ['admin-withdrawals'] });
    },
  });

  return {
    withdrawals: withdrawalsQuery.data?.data?.content || [],
    pagination: {
      totalElements: withdrawalsQuery.data?.data?.totalElements || 0,
      totalPages: withdrawalsQuery.data?.data?.totalPages || 0,
      page: withdrawalsQuery.data?.data?.page || 0,
      size: withdrawalsQuery.data?.data?.size || 10,
    },
    isLoading: withdrawalsQuery.isLoading,
    isError: withdrawalsQuery.isError,
    refetch: withdrawalsQuery.refetch,

    processWithdrawal: processWithdrawalMutation.mutateAsync,
    isProcessing: processWithdrawalMutation.isPending,
  };
};
