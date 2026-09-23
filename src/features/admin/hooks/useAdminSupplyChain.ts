import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { queryKeys } from '@/lib/queryKeys';
import { adminSupplyChainApi, GetAdminLotsParams } from '@/features/admin/api/adminSupplyChainApi';

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

export const useVerifyLotMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { newStatus: string; newLevel?: string; comment?: string };
    }) => adminSupplyChainApi.verifyLot(id, data),
    onSuccess: (_, { id, data }) => {
      if (data.newStatus === 'VERIFIED') {
        toast.success('Đã phê duyệt lô hàng thành công');
      } else {
        toast.success('Đã từ chối lô hàng');
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.supplyChain.adminLots() });
      queryClient.invalidateQueries({ queryKey: queryKeys.supplyChain.adminLotDetail(id) });
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
    },
  });
};
