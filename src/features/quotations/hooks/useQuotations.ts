import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { quotationApi } from '../api/quotationApi';
import {
  CreateQuotationRequest,
  QuotationListParams,
  ReplyQuotationRequest,
} from '../types/quotationTypes';

export const quotationKeys = {
  all: ['quotations'] as const,
  lists: () => [...quotationKeys.all, 'list'] as const,
  list: (params?: QuotationListParams) => [...quotationKeys.lists(), params] as const,
  me: (params?: QuotationListParams) => [...quotationKeys.all, 'me', params] as const,
  seller: (params?: QuotationListParams) => [...quotationKeys.all, 'seller', params] as const,
  details: () => [...quotationKeys.all, 'detail'] as const,
  detail: (id: string) => [...quotationKeys.details(), id] as const,
};

// ─── Buyer Hooks ──────────────────────────────────────────────────────────────

export const useCreateQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateQuotationRequest) => quotationApi.createQuotation(data),
    onSuccess: () => {
      toast.success('Gửi yêu cầu báo giá thành công');
      queryClient.invalidateQueries({ queryKey: quotationKeys.lists() });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi khi gửi báo giá',
      );
    },
  });
};

export const useMyQuotations = (params?: QuotationListParams) => {
  return useQuery({
    queryKey: quotationKeys.me(params),
    queryFn: () => quotationApi.getMyQuotations(params),
    staleTime: 30 * 1000,
  });
};

export const useAcceptQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (quotationId: string) => quotationApi.acceptQuotation(quotationId),
    onSuccess: () => {
      toast.success('Đã chấp nhận báo giá');
      queryClient.invalidateQueries({ queryKey: quotationKeys.all });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi khi chấp nhận báo giá',
      );
    },
  });
};

// ─── Seller Hooks ─────────────────────────────────────────────────────────────

export const useSellerQuotations = (params?: QuotationListParams) => {
  return useQuery({
    queryKey: quotationKeys.seller(params),
    queryFn: () => quotationApi.getSellerQuotations(params),
    staleTime: 30 * 1000,
  });
};

export const useReplyQuotation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quotationId, data }: { quotationId: string; data: ReplyQuotationRequest }) =>
      quotationApi.replyQuotation(quotationId, data),
    onSuccess: () => {
      toast.success('Đã phản hồi yêu cầu báo giá');
      queryClient.invalidateQueries({ queryKey: quotationKeys.all });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi khi phản hồi',
      );
    },
  });
};
