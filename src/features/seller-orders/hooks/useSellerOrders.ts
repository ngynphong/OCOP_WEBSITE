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

export const useInfiniteSellerOrders = (
  params: Omit<ISellerOrderListReq, 'pageNo'>,
  isB2B = false,
) => {
  return useInfiniteQuery({
    queryKey: [...sellerOrderKeys.lists(), params, isB2B],
    queryFn: ({ pageParam = 1 }) =>
      isB2B
        ? sellerOrderApi.getB2BOrders({
            status: params.status,
            pageNo: (pageParam as number) - 1, // B2B has 0-indexed pageNo
            pageSize: params.pageSize || 10,
          })
        : sellerOrderApi.getOrders(
            { ...params, pageNo: pageParam as number },
            { 'X-Silent-Loading': 'true' },
          ),
    getNextPageParam: (lastPage) => {
      const pageData = lastPage.data as Record<string, unknown>;
      const page =
        pageData.pageNo !== undefined ? (pageData.pageNo as number) : (pageData.page as number);
      const totalPages =
        pageData.totalPage !== undefined
          ? (pageData.totalPage as number)
          : (pageData.totalPages as number);
      // For B2B 0-indexed pages, lastPage.data.pageNo + 1 < totalPage
      if (pageData.pageNo !== undefined) {
        return page + 1 < totalPages ? page + 2 : undefined;
      }
      return page + 1 < totalPages ? page + 2 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60,
  });
};

export const useSellerOrderDetailsQuery = (orderCode: string, isB2B = false) => {
  return useQuery({
    queryKey: [...sellerOrderKeys.detail(orderCode), isB2B],
    queryFn: () =>
      isB2B
        ? sellerOrderApi.getB2BOrderByCode(orderCode)
        : sellerOrderApi.getOrderByCode(orderCode),
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

export const useConfirmB2BPaymentMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      data,
    }: {
      orderCode: string;
      data: { type: 'DEPOSIT' | 'FINAL'; note?: string };
    }) => sellerOrderApi.confirmB2BPayment(orderCode, data),
    onSuccess: (_, variables) => {
      toast.success('Xác nhận thanh toán B2B thành công');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...sellerOrderKeys.detail(variables.orderCode), true],
      });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi khi xác nhận thanh toán',
      );
    },
  });
};

export const useUpdateB2BOrderStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderCode,
      data,
    }: {
      orderCode: string;
      data: { status: 'PROCESSING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED'; reason?: string };
    }) => sellerOrderApi.updateB2BOrderStatus(orderCode, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật trạng thái đơn hàng B2B thành công');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: [...sellerOrderKeys.detail(variables.orderCode), true],
      });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi khi cập nhật trạng thái đơn hàng',
      );
    },
  });
};

export const useUpdateB2BShippingInfoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: {
        carrierName: string;
        driverName: string;
        driverPhone: string;
        licensePlate: string;
        trackingNumber: string;
        note?: string;
      };
    }) => sellerOrderApi.updateB2BShippingInfo(id, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật thông tin giao xe sỉ thành công');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: [...sellerOrderKeys.detail(variables.id), true] });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi khi cập nhật thông tin giao hàng',
      );
    },
  });
};

// Khối thống kê và tài chính
export const useSellerRevenueQuery = (params: IRevenueReq, isB2B = false) => {
  return useQuery({
    queryKey: [...sellerOrderKeys.revenue(params), isB2B],
    queryFn: () =>
      isB2B ? sellerOrderApi.getB2BRevenue(params) : sellerOrderApi.getRevenue(params),
  });
};

export const useSellerRefundsQuery = (
  params: { pageNo?: number; pageSize?: number; status?: string },
  isB2B = false,
) => {
  return useQuery({
    queryKey: [...sellerOrderKeys.refunds(params), isB2B],
    queryFn: () =>
      isB2B ? sellerOrderApi.getB2BRefunds(params) : sellerOrderApi.getRefunds(params),
  });
};

export const useUpdateB2BRefundStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      refundId,
      data,
    }: {
      refundId: string;
      data: { status: 'APPROVED' | 'REJECTED'; actionNote?: string };
    }) => sellerOrderApi.updateB2BRefundStatus(refundId, data),
    onSuccess: () => {
      toast.success('Xử lý khiếu nại hoàn tiền sỉ thành công');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.all });
    },
    onError: (error: unknown) => {
      toast.error(
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          'Có lỗi xảy ra khi xử lý khiếu nại',
      );
    },
  });
};

export const useSellerPayoutsQuery = (
  params: { pageNo?: number; pageSize?: number },
  isB2B = false,
) => {
  return useQuery({
    queryKey: [...sellerOrderKeys.payouts(params), isB2B],
    queryFn: () =>
      isB2B ? sellerOrderApi.getB2BPayouts(params) : sellerOrderApi.getPayouts(params),
  });
};
