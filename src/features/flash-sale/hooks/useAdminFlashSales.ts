import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { flashSaleApi } from '../api/flashSaleApi';
import toast from 'react-hot-toast';

export const useAdminFlashSalesQuery = (
  params?: Record<string, unknown>,
  options?: { enabled?: boolean },
) => {
  return useQuery({
    queryKey: ['admin', 'flash-sales', params],
    queryFn: () => flashSaleApi.getAdminFlashSales(params),
    staleTime: 30 * 1000,
    ...options,
  });
};

export const useAdminFlashSaleDetailQuery = (id: number, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['admin', 'flash-sales', 'detail', id],
    queryFn: () => flashSaleApi.getAdminFlashSaleDetail(id),
    ...options,
  });
};

export const useAdminFlashSaleMutations = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id: number) => flashSaleApi.approveAdminFlashSale(id),
    onSuccess: () => {
      toast.success('Đã duyệt chương trình Flash Sale thành công!');
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sales'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => flashSaleApi.cancelAdminFlashSale(id),
    onSuccess: () => {
      toast.success('Đã hủy chương trình Flash Sale.');
      queryClient.invalidateQueries({ queryKey: ['admin', 'flash-sales'] });
    },
  });

  return {
    approveFlashSale: approveMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    cancelFlashSale: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,
  };
};
