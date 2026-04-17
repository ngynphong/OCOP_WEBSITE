import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminOrderApi } from '../api/adminOrderApi';
import {
  IAdminOrderParams,
  IAdminRefundParams,
  IPayoutProcessReq,
  IRefundApproveReq,
} from '../types/adminTypes';

export const adminOrderKeys = {
  all: ['admin-orders'] as const,
  lists: () => [...adminOrderKeys.all, 'list'] as const,
  list: (params: IAdminOrderParams) => [...adminOrderKeys.lists(), params] as const,
  dashboard: () => [...adminOrderKeys.all, 'dashboard'] as const,
  refunds: () => [...adminOrderKeys.all, 'refunds'] as const,
  refundList: (params: IAdminRefundParams) => [...adminOrderKeys.refunds(), params] as const,
};

export const useAdminOrdersQuery = (params: IAdminOrderParams) => {
  return useQuery({
    queryKey: adminOrderKeys.list(params),
    queryFn: () => adminOrderApi.getOrders(params),
  });
};

export const useAdminDashboardQuery = () => {
  return useQuery({
    queryKey: adminOrderKeys.dashboard(),
    queryFn: () => adminOrderApi.getDashboard(),
  });
};

export const useAdminRefundsQuery = (params: IAdminRefundParams) => {
  return useQuery({
    queryKey: adminOrderKeys.refundList(params),
    queryFn: () => adminOrderApi.getRefunds(params),
  });
};

export const useAdminOrderMutations = () => {
  const queryClient = useQueryClient();

  const processPayout = useMutation({
    mutationFn: ({ payoutId, data }: { payoutId: number | string; data: IPayoutProcessReq }) =>
      adminOrderApi.processPayout(payoutId, data),
    onSuccess: () => {
      toast.success('Xử lý chi trả thành công');
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
    },
  });

  const approveRefund = useMutation({
    mutationFn: ({ refundId, data }: { refundId: number | string; data: IRefundApproveReq }) =>
      adminOrderApi.approveRefund(refundId, data),
    onSuccess: () => {
      toast.success('Xử lý hoàn tiền thành công');
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.all });
    },
  });

  return {
    processPayout: processPayout.mutateAsync,
    isProcessingPayout: processPayout.isPending,
    approveRefund: approveRefund.mutateAsync,
    isApprovingRefund: approveRefund.isPending,
  };
};
