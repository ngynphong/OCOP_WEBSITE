import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys } from '@/lib/queryKeys';
import {
  adminSupplyChainApi,
  GetAdminLotsParams,
  RecallLotPayload,
} from '@/features/admin/api/adminSupplyChainApi';

type ApiError = { response?: { data?: { message?: string } } };

export const useAdminLotsQuery = (params: GetAdminLotsParams) => {
  return useQuery({
    queryKey: queryKeys.supplyChain.adminLots(params),
    queryFn: () => adminSupplyChainApi.getLots(params),
    staleTime: 30 * 1000,
  });
};

export const useAdminLotDetailQuery = (id: number | null | undefined, enabled: boolean = true) => {
  return useQuery({
    queryKey: queryKeys.supplyChain.adminLotDetail(id),
    queryFn: () => adminSupplyChainApi.getLotDetail(id!),
    enabled: !!id && enabled,
    staleTime: 30 * 1000,
  });
};

export const useSuspendLotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminSupplyChainApi.suspendLot(id, reason),
    onSuccess: (_, { id }) => {
      toast.success('Đã tạm dừng lưu hành lô hàng');
      queryClient.invalidateQueries({ queryKey: ['admin_lots'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplyChain.adminLotDetail(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạm dừng lô hàng');
    },
  });
};

export const useReactivateLotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => adminSupplyChainApi.reactivateLot(id),
    onSuccess: (_, id) => {
      toast.success('Đã kích hoạt lại lô hàng');
      queryClient.invalidateQueries({ queryKey: ['admin_lots'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplyChain.adminLotDetail(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt lại lô hàng');
    },
  });
};

export const useRecallLotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: RecallLotPayload }) =>
      adminSupplyChainApi.recallLot(id, payload),
    onSuccess: (_, { id }) => {
      toast.success('Đã ban hành lệnh thu hồi lô hàng');
      queryClient.invalidateQueries({ queryKey: ['admin_lots'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplyChain.adminLotDetail(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi phát lệnh thu hồi');
    },
  });
};

export const useExpireLotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) =>
      adminSupplyChainApi.expireLot(id, reason),
    onSuccess: (_, { id }) => {
      toast.success('Đã đánh dấu hết hạn lô hàng');
      queryClient.invalidateQueries({ queryKey: ['admin_lots'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplyChain.adminLotDetail(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi đánh dấu hết hạn');
    },
  });
};
