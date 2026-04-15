import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shippingApi } from '../api/shippingApi';
import { IEstimateFeeRequest, ICreateShippingProvider, IUpdateShippingProvider } from '../types';
import toast from 'react-hot-toast';

// Admin hooks
export const useAdminShippingProviders = () => {
  return useQuery({
    queryKey: ['admin-shipping-providers'],
    queryFn: () => shippingApi.getAdminProviders(),
    select: (res) => res.data,
  });
};

export const useCreateShippingProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (provider: ICreateShippingProvider) => shippingApi.createProvider(provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-providers'] });
      toast.success('Thêm đơn vị vận chuyển thành công');
    },
  });
};

export const useUpdateShippingProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, provider }: { id: string; provider: IUpdateShippingProvider }) =>
      shippingApi.updateProvider(id, provider),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-providers'] });
      toast.success('Cập nhật đơn vị vận chuyển thành công');
    },
  });
};

export const useToggleShippingProvider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => shippingApi.toggleProvider(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-providers'] });
      toast.success('Cập nhật trạng thái thành công');
    },
  });
};

// User hooks
export const useShippingProviders = () => {
  return useQuery({
    queryKey: ['shipping-providers'],
    queryFn: () => shippingApi.getProviders(),
    select: (res) => res.data,
  });
};

export const useEstimateShippingFee = () => {
  return useMutation({
    mutationFn: (req: IEstimateFeeRequest) => shippingApi.estimateFee(req),
    // For estimate fee, we might want the whole res.data because it has services
    // The mutation's data property will be res.data because of onResponse interceptor
  });
};
