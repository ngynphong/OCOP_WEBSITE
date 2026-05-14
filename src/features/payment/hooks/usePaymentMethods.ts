import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { paymentApi } from '../api/paymentApi';
import { ResponseBase } from '@/features/auth/types';
import { IPaymentGateway } from '../types';

export const usePaymentMethods = (
  options?: Partial<UseQueryOptions<ResponseBase<IPaymentGateway[]>, Error, IPaymentGateway[]>>,
) => {
  return useQuery({
    queryKey: ['payment-gateways'],
    queryFn: () => paymentApi.getUserGateways(),
    select: (res) => res.data,
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  });
};
