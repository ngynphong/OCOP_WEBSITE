import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderApi } from '../api/orderApi';
import { IBatchOrderReq, ICancelOrderReq, IOrderListReq, IRefundReq } from '../types/orderTypes';
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
  return useMutation({
    mutationFn: (data: IBatchOrderReq) => orderApi.createBatchOrders(data),
  });
};

export const useOrders = (params: IOrderListReq) => {
  return useQuery({
    queryKey: orderKeys.list(params),
    queryFn: () => orderApi.getOrders(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useOrderDetails = (orderCode: string) => {
  return useQuery({
    queryKey: orderKeys.detail(orderCode),
    queryFn: () => orderApi.getOrderByCode(orderCode),
    enabled: !!orderCode,
    staleTime: 1000 * 60 * 2,
  });
};

export const useOrderShipment = (orderCode: string) => {
  return useQuery({
    queryKey: orderKeys.shipment(orderCode),
    queryFn: () => orderApi.getShipmentTracking(orderCode),
    enabled: !!orderCode,
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
