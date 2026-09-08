import { useQuery } from '@tanstack/react-query';
import { shopPublicApi } from '../api/shopPublicApi';
import { GetShopsPublicParams } from '../types/shopTypes';

export const usePublicShopsQuery = (params?: GetShopsPublicParams) => {
  return useQuery({
    queryKey: ['public-shops', params],
    queryFn: () => shopPublicApi.getShops(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicShopDetailQuery = (slug: string) => {
  return useQuery({
    queryKey: ['public-shop-detail', slug],
    queryFn: () => shopPublicApi.getShopBySlug(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicShopPolicyQuery = (slug: string) => {
  return useQuery({
    queryKey: ['public-shop-policy', slug],
    queryFn: () => shopPublicApi.getShopPolicy(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePublicShopCategoriesQuery = (slug: string) => {
  return useQuery({
    queryKey: ['public-shop-categories', slug],
    queryFn: () => shopPublicApi.getShopCategories(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicShopBestSellersQuery = (slug: string, limit = 4) => {
  return useQuery({
    queryKey: ['public-shop-best-sellers', slug, limit],
    queryFn: () => shopPublicApi.getShopBestSellers(slug, limit),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicShopFeaturedProductsQuery = (slug: string, limit = 4) => {
  return useQuery({
    queryKey: ['public-shop-featured-products', slug, limit],
    queryFn: () => shopPublicApi.getShopFeaturedProducts(slug, limit),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscriptionPlansQuery = () => {
  return useQuery({
    queryKey: ['subscription-plans'],
    queryFn: () => shopPublicApi.getSubscriptionPlans(),
    staleTime: 30 * 60 * 1000,
  });
};

export const useFeaturedShopsQuery = (limit = 6) => {
  return useQuery({
    queryKey: ['public-shops-featured', limit],
    queryFn: () => shopPublicApi.getFeaturedShops(limit),
    staleTime: 10 * 60 * 1000,
  });
};
