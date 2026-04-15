import { useQuery } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';

export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['payment-gateways'],
    queryFn: () => paymentApi.getUserGateways(),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
