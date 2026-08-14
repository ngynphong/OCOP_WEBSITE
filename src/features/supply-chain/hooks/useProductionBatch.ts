import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supplyChainApi } from '../api/supplyChainApi';
import { toast } from 'react-hot-toast';
import {
  ICreateBatchEventReq,
  ICreateLotReq,
  ILotListReq,
  IProcessTemplate,
  ISupplyChainLot,
  ICreateProcessTemplateReq,
} from '../types/supplyChainTypes';

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useProductionBatch = () => {
  const queryClient = useQueryClient();

  const useGetProductionBatches = (params: ILotListReq) => {
    return useQuery({
      queryKey: ['production-batches', params],
      queryFn: async () => {
        const response = await supplyChainApi.getSellerLots(params);
        return response;
      },
    });
  };

  const useCreateProductionBatch = () => {
    return useMutation({
      mutationFn: async (data: ICreateLotReq) => {
        const response = await supplyChainApi.createLot(data);
        return response;
      },
      onSuccess: (response) => {
        toast.success('Tạo lô sản xuất thành công!');

        // Cập nhật UI ngay lập tức
        queryClient.setQueriesData(
          { queryKey: ['production-batches'] },
          (
            oldData: { data: { totalElements: number; content: ISupplyChainLot[] } } | undefined,
          ) => {
            if (!oldData || !oldData.data || !oldData.data.content) return oldData;
            return {
              ...oldData,
              data: {
                ...oldData.data,
                content: [response.data, ...oldData.data.content],
                totalElements: oldData.data.totalElements + 1,
              },
            };
          },
        );

        queryClient.invalidateQueries({ queryKey: ['production-batches'] });
        queryClient.invalidateQueries({ queryKey: ['material-lots'] });
      },
      onError: (error: ApiErrorResponse) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi tạo lô sản xuất');
      },
    });
  };

  const useGetProductionBatchDetail = (id: number) => {
    return useQuery({
      queryKey: ['production-batch-detail', id],
      queryFn: async () => {
        const response = await supplyChainApi.getSellerLotDetail(id);
        return response;
      },
      enabled: !!id,
    });
  };

  const useAddBatchEvent = () => {
    return useMutation({
      mutationFn: async ({ lotId, data }: { lotId: number; data: ICreateBatchEventReq }) => {
        const response = await supplyChainApi.addBatchEvent(lotId, data);
        return response;
      },
      onSuccess: (_, variables) => {
        toast.success('Ghi nhận sự kiện thành công!');
        queryClient.invalidateQueries({ queryKey: ['production-batch-detail', variables.lotId] });
        queryClient.invalidateQueries({ queryKey: ['production-batches'] });
      },
      onError: (error: ApiErrorResponse) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi ghi nhận sự kiện');
      },
    });
  };

  const useGenerateQrCodes = () => {
    return useMutation({
      mutationFn: async ({ lotId, count }: { lotId: number; count: number }) => {
        const response = await supplyChainApi.generateItemQrCodes(lotId, count);
        return response;
      },
      onSuccess: (_, variables) => {
        toast.success('Sinh mã QR thành công!');
        queryClient.invalidateQueries({ queryKey: ['lot-qr-codes', variables.lotId] });
      },
      onError: (error: ApiErrorResponse) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi sinh mã QR');
      },
    });
  };

  const useGetLotQrCodes = (lotId: number) => {
    return useQuery({
      queryKey: ['lot-qr-codes', lotId],
      queryFn: async () => {
        const response = await supplyChainApi.getLotQrCodes(lotId);
        return response;
      },
      enabled: !!lotId,
    });
  };

  const useGetLotAuditLogs = (lotId: number, page: number = 1, size: number = 20) => {
    return useQuery({
      queryKey: ['lot-audit-logs', lotId, page, size],
      queryFn: async () => {
        const response = await supplyChainApi.getLotAuditLogs(lotId, { page, size });
        return response.data;
      },
      enabled: !!lotId,
    });
  };

  const useGetProcessTemplates = (productId: number) => {
    return useQuery({
      queryKey: ['process-templates', productId],
      queryFn: async () => {
        const response = await supplyChainApi.getProcessTemplates(productId);
        return response.data;
      },
      enabled: !!productId,
    });
  };

  const useCreateProcessTemplate = () => {
    return useMutation({
      mutationFn: async (data: ICreateProcessTemplateReq) => {
        const response = await supplyChainApi.createProcessTemplate(data);
        return response.data;
      },
      onSuccess: () => {
        toast.success('Lưu quy trình chuẩn thành công!');
        queryClient.invalidateQueries({ queryKey: ['process-templates'] });
      },
      onError: (error: ApiErrorResponse) => {
        toast.error(error?.response?.data?.message || 'Có lỗi xảy ra khi lưu quy trình chuẩn');
      },
    });
  };

  return {
    useGetProductionBatches,
    useCreateProductionBatch,
    useGetProductionBatchDetail,
    useAddBatchEvent,
    useGenerateQrCodes,
    useGetLotQrCodes,
    useGetLotAuditLogs,
    useGetProcessTemplates,
    useCreateProcessTemplate,
  };
};
