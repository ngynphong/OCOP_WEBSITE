import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import {
  IBatchOrderReq,
  ICancelOrderReq,
  IOrderListReq,
  IRefundReq,
  IBuyNowReq,
  ICreateB2BOrderReq,
  IRefundB2BOrderReq,
  IReviewB2BOrderReq,
} from '../types/orderTypes';
import toast from 'react-hot-toast';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: IOrderListReq) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
  shipment: (id: string) => [...orderKeys.all, 'shipment', id] as const,
};

export const useCreateBatchOrders = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBatchOrderReq) => orderApi.createBatchOrders(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useBuyNow = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IBuyNowReq) => orderApi.buyNow(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useOrders = (params: IOrderListReq, isB2B = false) => {
  return useQuery({
    queryKey: [...orderKeys.list(params), isB2B],
    queryFn: () => (isB2B ? orderApi.getB2BOrders(params) : orderApi.getOrders(params)),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useInfiniteOrders = (params: Omit<IOrderListReq, 'pageNo'>, isB2B = false) => {
  return useInfiniteQuery({
    queryKey: [...orderKeys.lists(), params, isB2B],
    queryFn: ({ pageParam = 1 }) =>
      isB2B
        ? orderApi.getB2BOrders(
            { ...params, pageNo: pageParam as number },
            { 'X-Silent-Loading': 'true' },
          )
        : orderApi.getOrders(
            { ...params, pageNo: pageParam as number },
            { 'X-Silent-Loading': 'true' },
          ),
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data;
      return page + 1 < totalPages ? page + 2 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrderDetails = (orderCode: string, isB2B = false) => {
  return useQuery({
    queryKey: [...orderKeys.detail(orderCode), isB2B],
    queryFn: () =>
      isB2B ? orderApi.getB2BOrderById(orderCode) : orderApi.getOrderByCode(orderCode),
    enabled: !!orderCode,
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrderShipment = (orderCode: string, skip = false) => {
  return useQuery({
    queryKey: orderKeys.shipment(orderCode),
    queryFn: () => orderApi.getShipmentTracking(orderCode),
    enabled: !!orderCode && !skip,
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, data }: { orderCode: string; data: ICancelOrderReq }) =>
      orderApi.cancelOrder(orderCode, data),
    onSuccess: (res, variables) => {
      toast.success('Hủy đơn hàng thành công');
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderCode) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useRefundOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, data }: { orderCode: string; data: IRefundReq }) =>
      orderApi.refundOrder(orderCode, data),
    onSuccess: (res, variables) => {
      toast.success('Đã gửi yêu cầu trả hàng/hoàn tiền');
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderCode) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useConfirmReceived = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderCode: string) => orderApi.confirmReceived(orderCode),
    onSuccess: (res, variables) => {
      toast.success('Đã xác nhận lấy hàng thành công');
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useReorder = () => {
  return useMutation({
    mutationFn: (orderCode: string) => orderApi.reorder(orderCode),
  });
};

export const useUploadPaymentProof = (isB2B = false) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderCode, file }: { orderCode: string; file: File }) =>
      isB2B
        ? orderApi.uploadB2BPaymentProof(orderCode, file)
        : orderApi.uploadPaymentProof(orderCode, file),
    onSuccess: (_, variables) => {
      toast.success('Tải lên minh chứng thanh toán thành công');
      queryClient.invalidateQueries({
        queryKey: [...orderKeys.detail(variables.orderCode), isB2B],
      });
    },
  });
};

export const useCreateB2BOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreateB2BOrderReq) => orderApi.createB2BOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useCancelB2BOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      orderApi.cancelB2BOrder(id, { reason }),
    onSuccess: (_, variables) => {
      toast.success('Hủy đơn hàng sỉ thành công');
      queryClient.invalidateQueries({ queryKey: [...orderKeys.detail(variables.id), true] });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useConfirmB2BReceived = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderApi.confirmB2BReceived(id),
    onSuccess: (_, variables) => {
      toast.success('Xác nhận đã nhận hàng sỉ thành công');
      queryClient.invalidateQueries({ queryKey: [...orderKeys.detail(variables), true] });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useRefundB2BOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      refundType,
      reason,
      amount,
      evidenceImages,
    }: {
      id: string;
      refundType: string;
      reason: string;
      amount: number;
      evidenceImages?: File[];
    }) => orderApi.refundB2BOrder(id, { refundType, reason, amount, evidenceImages }),
    onSuccess: (_, variables) => {
      toast.success('Gửi yêu cầu trả hàng/hoàn tiền sỉ thành công');
      queryClient.invalidateQueries({ queryKey: [...orderKeys.detail(variables.id), true] });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

export const useB2BShipmentTracking = (id: string, enabled = false) => {
  return useQuery({
    queryKey: [...orderKeys.shipment(id), 'b2b'],
    queryFn: () => orderApi.getB2BShipmentTracking(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 2,
  });
};

export const useReviewB2BOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      rating,
      comment,
      images,
    }: {
      id: string;
      rating: number;
      comment: string;
      images?: string[];
    }) => orderApi.reviewB2BOrder(id, { rating, comment, images }),
    onSuccess: (_, variables) => {
      toast.success('Đánh giá đơn hàng sỉ thành công');
      queryClient.invalidateQueries({ queryKey: [...orderKeys.detail(variables.id), true] });
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};
