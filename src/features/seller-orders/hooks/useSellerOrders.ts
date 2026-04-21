import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerOrderApi } from '../api/sellerOrderApi';
import {
  ISellerOrderListReq,
  IConfirmOrderReq,
  IRejectOrderReq,
  IRevenueReq,
} from '../types/sellerOrderTypes';

export const sellerOrderKeys = {
  all: ['seller-orders'] as const,
  lists: () => [...sellerOrderKeys.all, 'list'] as const,
  list: (params: ISellerOrderListReq) => [...sellerOrderKeys.lists(), params] as const,
  details: () => [...sellerOrderKeys.all, 'detail'] as const,
  detail: (code: string) => [...sellerOrderKeys.details(), code] as const,
  revenue: (params: IRevenueReq) => [...sellerOrderKeys.all, 'revenue', params] as const,
  refunds: (params: { pageNo?: number; pageSize?: number; status?: string }) =>
    [...sellerOrderKeys.all, 'refunds', params] as const,
  payouts: (params: { pageNo?: number; pageSize?: number }) =>
    [...sellerOrderKeys.all, 'payouts', params] as const,
};

export const useSellerOrdersQuery = (params: ISellerOrderListReq) => {
  return useQuery({
    queryKey: sellerOrderKeys.list(params),
    queryFn: () => sellerOrderApi.getOrders(params),
    staleTime: 1000 * 60, // 1 min
  });
};

export const useInfiniteSellerOrders = (params: Omit<ISellerOrderListReq, 'pageNo'>) => {
  return useInfiniteQuery({
    queryKey: [...sellerOrderKeys.lists(), params],
    queryFn: ({ pageParam = 1 }) =>
      sellerOrderApi.getOrders(
        { ...params, pageNo: pageParam as number },
        { 'X-Silent-Loading': 'true' },
      ),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
};

export const useSellerOrderDetailsQuery = (orderCode: string) => {
  return useQuery({
    queryKey: sellerOrderKeys.detail(orderCode),
    queryFn: () => sellerOrderApi.getOrderByCode(orderCode),
    enabled: !!orderCode,
  });
};

// Mutations
export const useConfirmOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, data }: { orderCode: string; data: IConfirmOrderReq }) =>
      sellerOrderApi.confirmOrder(orderCode, data),
    onSuccess: (_, variables) => {
      toast.success('Xác nhận đơn hàng thành công');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.detail(variables.orderCode) });
    },
  });
};

export const useRejectOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, data }: { orderCode: string; data: IRejectOrderReq }) =>
      sellerOrderApi.rejectOrder(orderCode, data),
    onSuccess: (_, variables) => {
      toast.success('Đã từ chối đơn hàng');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.detail(variables.orderCode) });
    },
  });
};

// Khối thống kê và tài chính
export const useSellerRevenueQuery = (params: IRevenueReq) => {
  return useQuery({
    queryKey: sellerOrderKeys.revenue(params),
    queryFn: () => sellerOrderApi.getRevenue(params),
  });
};

export const useSellerRefundsQuery = (params: {
  pageNo?: number;
  pageSize?: number;
  status?: string;
}) => {
  return useQuery({
    queryKey: sellerOrderKeys.refunds(params),
    queryFn: () => sellerOrderApi.getRefunds(params),
  });
};

export const useSellerPayoutsQuery = (params: { pageNo?: number; pageSize?: number }) => {
  return useQuery({
    queryKey: sellerOrderKeys.payouts(params),
    queryFn: () => sellerOrderApi.getPayouts(params),
  });
};
