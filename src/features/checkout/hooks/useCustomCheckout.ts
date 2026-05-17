import { useQuery } from '@tanstack/react-query';
import { customCheckoutApi } from '../api/customCheckoutApi';

export const useCustomCheckoutInfo = (token: string | null) => {
  return useQuery({
    queryKey: ['custom-checkout', token],
    queryFn: () => customCheckoutApi.getCheckoutInfo(token!),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
