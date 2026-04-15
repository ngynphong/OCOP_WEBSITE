import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import { IUpdatePaymentGatewayConfig } from '../types';
import toast from 'react-hot-toast';

export const useAdminGateways = () => {
  return useQuery({
    queryKey: ['admin-payment-gateways'],
    queryFn: () => paymentApi.getAdminGateways(),
    select: (res) => res.data,
  });
};

export const useAdminGatewayDetail = (id: string) => {
  return useQuery({
    queryKey: ['admin-payment-gateway', id],
    queryFn: () => paymentApi.getAdminGatewayById(id),
    select: (res) => res.data,
    enabled: !!id,
  });
};

export const useToggleGateway = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => paymentApi.toggleGateway(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-gateways'] });
      toast.success('Đã cập nhật trạng thái cổng thanh toán');
    },
  });
};

export const useUpdateGatewayConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: IUpdatePaymentGatewayConfig }) =>
      paymentApi.updateGatewayConfig(id, data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-payment-gateways'] });
      queryClient.invalidateQueries({ queryKey: ['admin-payment-gateway', res.data.id] });
      toast.success('Cập nhật cấu hình cổng thanh toán thành công');
    },
  });
};
