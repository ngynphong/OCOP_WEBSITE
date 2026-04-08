import { useQuery } from '@tanstack/react-query';
import { shopPublicApi } from '../api/shopPublicApi';
import { GetShopsPublicParams } from '../types/shopTypes';

export const usePublicShop = () => {
  const useShopsQuery = (params?: GetShopsPublicParams) => {
    return useQuery({
      queryKey: ['public-shops', params],
      queryFn: () => shopPublicApi.getShops(params),
      staleTime: 5 * 60 * 1000,
    });
  };

  const useShopDetailQuery = (slug: string) => {
    return useQuery({
      queryKey: ['public-shop-detail', slug],
      queryFn: () => shopPublicApi.getShopBySlug(slug),
      enabled: !!slug,
      staleTime: 5 * 60 * 1000,
    });
  };

  const useShopPolicyQuery = (slug: string) => {
    return useQuery({
      queryKey: ['public-shop-policy', slug],
      queryFn: () => shopPublicApi.getShopPolicy(slug),
      enabled: !!slug,
      staleTime: 10 * 60 * 1000,
    });
  };

  const useSubscriptionPlansQuery = () => {
    return useQuery({
      queryKey: ['subscription-plans'],
      queryFn: () => shopPublicApi.getSubscriptionPlans(),
      staleTime: 30 * 60 * 1000,
    });
  };

  return {
    useShopsQuery,
    useShopDetailQuery,
    useShopPolicyQuery,
    useSubscriptionPlansQuery,
  };
};
