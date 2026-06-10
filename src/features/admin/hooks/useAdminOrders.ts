import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminOrderApi } from '@/features/admin/api/adminOrderApi';
import {
  IAdminOrderParams,
  IAdminRefundParams,
  IPayoutProcessReq,
  IRefundApproveReq,
  IAdminPayoutParams,
} from '@/features/admin/types/adminTypes';

export const adminOrderKeys = {
  all: ['admin-orders'] as const,
  lists: () => [...adminOrderKeys.all, 'list'] as const,
  list: (params: IAdminOrderParams) => [...adminOrderKeys.lists(), params] as const,
  dashboard: () => [...adminOrderKeys.all, 'dashboard'] as const,
  refunds: () => [...adminOrderKeys.all, 'refunds'] as const,
  refundList: (params: IAdminRefundParams) => [...adminOrderKeys.refunds(), params] as const,
  payouts: () => [...adminOrderKeys.all, 'payouts'] as const,
  payoutList: (params: IAdminPayoutParams) => [...adminOrderKeys.payouts(), params] as const,
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

export const useAdminPayoutsQuery = (params: IAdminPayoutParams) => {
  return useQuery({
    queryKey: adminOrderKeys.payoutList(params),
    queryFn: () => adminOrderApi.getPayouts(params),
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

  const generatePayouts = useMutation({
    mutationFn: ({
      shopId,
      periodStart,
      periodEnd,
    }: {
      shopId: number | string;
      periodStart: string;
      periodEnd: string;
    }) => adminOrderApi.generatePayouts(shopId, periodStart, periodEnd),
    onSuccess: () => {
      toast.success('Tạo đối soát thành công');
      queryClient.invalidateQueries({ queryKey: adminOrderKeys.payouts() });
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
    generatePayouts: generatePayouts.mutateAsync,
    isGeneratingPayouts: generatePayouts.isPending,
    approveRefund: approveRefund.mutateAsync,
    isApprovingRefund: approveRefund.isPending,
  };
};
