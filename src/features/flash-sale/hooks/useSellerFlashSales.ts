import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { flashSaleApi } from '../api/flashSaleApi';
import { CreateFlashSaleRequest, UpdateFlashSaleRequest } from '../types';
import toast from 'react-hot-toast';

export const useSellerFlashSalesQuery = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: ['seller', 'flash-sales'],
    queryFn: () => flashSaleApi.getSellerFlashSales(),
    ...options,
  });
};

export const useSellerFlashSaleMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateFlashSaleRequest) => flashSaleApi.createFlashSale(data),
    onSuccess: () => {
      toast.success('Tạo chương trình Flash Sale thành công!');
      queryClient.invalidateQueries({ queryKey: ['seller', 'flash-sales'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFlashSaleRequest }) =>
      flashSaleApi.updateFlashSale(id, data),
    onSuccess: () => {
      toast.success('Cập nhật Flash Sale thành công!');
      queryClient.invalidateQueries({ queryKey: ['seller', 'flash-sales'] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: number) => flashSaleApi.cancelSellerFlashSale(id),
    onSuccess: () => {
      toast.success('Đã hủy chương trình Flash Sale.');
      queryClient.invalidateQueries({ queryKey: ['seller', 'flash-sales'] });
    },
  });

  const activateMutation = useMutation({
    mutationFn: (id: number) => flashSaleApi.activateSellerFlashSale(id),
    onSuccess: () => {
      toast.success('Đã kích hoạt Flash Sale!');
      queryClient.invalidateQueries({ queryKey: ['seller', 'flash-sales'] });
    },
  });

  return {
    createFlashSale: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    updateFlashSale: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    cancelFlashSale: cancelMutation.mutateAsync,
    isCanceling: cancelMutation.isPending,
    activateFlashSale: activateMutation.mutateAsync,
    isActivating: activateMutation.isPending,
  };
};
