import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import {
  CreateJournalRequest,
  UpdateJournalRequest,
  ReorderJournalRequest,
} from '@/features/products/types/productTypes';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hooks ───────────────────────────────────────────────────

export const useSellerJournalsQuery = (productId: number | null | undefined) => {
  return useQuery({
    queryKey: ['seller-journals', productId],
    queryFn: () => sellerProductApi.getJournals(productId!),
    enabled: !!productId,
    staleTime: 30 * 1000,
  });
};

export const useSellerQrQuery = (productId: number | null | undefined) => {
  return useQuery({
    queryKey: ['seller-qr', productId],
    queryFn: () => sellerProductApi.getQr(productId!),
    enabled: !!productId,
    staleTime: 60 * 1000,
  });
};

// ─── Mutation Hook ────────────────────────────────────────────────────────────

export const useSellerJournalMutations = (productId: number) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['seller-journals', productId] });
    queryClient.invalidateQueries({ queryKey: ['seller-product', productId] });
  };

  const createJournalMutation = useMutation({
    mutationFn: ({ data, files }: { data: CreateJournalRequest; files?: File[] }) =>
      sellerProductApi.createJournal(productId, data, files),
    onSuccess: () => {
      toast.success('Tạo bước nhật ký thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi tạo bước nhật ký');
    },
  });

  const updateJournalMutation = useMutation({
    mutationFn: ({ journalId, data }: { journalId: number; data: UpdateJournalRequest }) =>
      sellerProductApi.updateJournal(productId, journalId, data),
    onSuccess: () => {
      toast.success('Cập nhật bước nhật ký thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật bước nhật ký');
    },
  });

  const deleteJournalMutation = useMutation({
    mutationFn: (journalId: number) => sellerProductApi.deleteJournal(productId, journalId),
    onSuccess: () => {
      toast.success('Xóa bước nhật ký thành công');
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa bước nhật ký');
    },
  });

  const reorderJournalsMutation = useMutation({
    mutationFn: (data: ReorderJournalRequest) => sellerProductApi.reorderJournals(productId, data),
    onSuccess: () => {
      invalidate();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi sắp xếp nhật ký');
    },
  });

  return {
    createJournal: createJournalMutation.mutateAsync,
    isCreating: createJournalMutation.isPending,
    updateJournal: updateJournalMutation.mutateAsync,
    isUpdating: updateJournalMutation.isPending,
    deleteJournal: deleteJournalMutation.mutateAsync,
    isDeleting: deleteJournalMutation.isPending,
    reorderJournals: reorderJournalsMutation.mutateAsync,
    isReordering: reorderJournalsMutation.isPending,
  };
};
