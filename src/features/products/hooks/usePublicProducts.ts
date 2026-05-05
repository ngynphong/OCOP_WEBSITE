'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import { publicProductApi } from '@/features/products/api/publicProductApi';
import { brandApi } from '@/features/products/api/brandApi';
import { PublicProductListParams } from '@/features/products/types/productTypes';

export const usePublicCategoriesQuery = () => {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: () => publicProductApi.getCategories(),
    staleTime: 10 * 60 * 1000,
  });
};

export const usePublicProvincesQuery = () => {
  return useQuery({
    queryKey: ['public-provinces'],
    queryFn: () => publicProductApi.getProvinces(),
    staleTime: 30 * 60 * 1000,
  });
};

// ─── Standalone Query Hooks ───────────────────────────────────────────────────

export const usePublicProductsQuery = (
  params?: PublicProductListParams,
  options?: Record<string, unknown>,
) => {
  return useQuery({
    queryKey: ['public-products', params],
    queryFn: () => publicProductApi.getProducts(params),
    staleTime: 60 * 1000,
    ...options,
  });
};

export const usePublicProductsInfiniteQuery = (
  params?: PublicProductListParams,
  options?: Record<string, unknown>,
) => {
  return useInfiniteQuery({
    queryKey: ['public-products-infinite', params],
    queryFn: ({ pageParam = 1 }) =>
      publicProductApi.getProducts({
        ...params,
        pageNo: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { pageNo, totalPage } = lastPage.data;
      return pageNo < totalPage ? pageNo + 1 : undefined;
    },
    staleTime: 60 * 1000,
    ...options,
  });
};

import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteDiscoveryProductsQuery = (
  params?: { pageSize?: number; sort?: string },
  options?: Record<string, unknown>,
) => {
  return useInfiniteQuery({
    queryKey: ['public-products-discovery', params],
    queryFn: ({ pageParam = 1 }) =>
      publicProductApi.getDiscoveryProducts({
        ...params,
        pageNo: pageParam as number,
        pageSize: params?.pageSize || 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { pageNo, totalPage } = lastPage.data;
      return pageNo + 1 < totalPage ? pageNo + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

export const usePublicProductDetailQuery = (slugOrId: string | number | null | undefined) => {
  return useQuery({
    queryKey: ['public-product', slugOrId],
    queryFn: () => publicProductApi.getProduct(slugOrId!),
    enabled: !!slugOrId,
    staleTime: 60 * 1000,
  });
};

export const useRelatedProductsQuery = (slug: string | null | undefined, limit = 6) => {
  return useQuery({
    queryKey: ['public-products-related', slug, limit],
    queryFn: () => publicProductApi.getRelatedProducts(slug!, limit),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedProductsQuery = (limit = 12) => {
  return useQuery({
    queryKey: ['public-products-featured', limit],
    queryFn: () => publicProductApi.getFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000,
  });
};

export const useFeaturedStoryQuery = () => {
  return useQuery({
    queryKey: ['public-featured-story'],
    queryFn: () => publicProductApi.getFeaturedStory(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useTraceQrQuery = (qrCode: string | null | undefined) => {
  return useQuery({
    queryKey: ['trace-qr', qrCode],
    queryFn: () => publicProductApi.traceQr(qrCode!),
    enabled: !!qrCode,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicCategoryDetailQuery = (slug: string | null | undefined) => {
  return useQuery({
    queryKey: ['public-category-detail', slug],
    queryFn: () => publicProductApi.getCategoryBySlug(slug!),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePublicBrandsQuery = () => {
  return useQuery({
    queryKey: ['public-brands'],
    queryFn: () => brandApi.getBrands(),
    staleTime: 30 * 60 * 1000,
  });
};

export const usePublicBrandDetailQuery = (slug: string | null | undefined) => {
  return useQuery({
    queryKey: ['public-brand-detail', slug],
    queryFn: () => brandApi.getBrandBySlug(slug!),
    enabled: !!slug,
    staleTime: 60 * 60 * 1000,
  });
};

export const useTraceDetailQuery = (qrCode: string | null | undefined) => {
  return useQuery({
    queryKey: ['trace-detail', qrCode],
    queryFn: () => publicProductApi.traceQrDetail(qrCode!),
    enabled: !!qrCode,
    staleTime: 60 * 1000,
  });
};

export const useRecordScanMutation = () => {
  return useMutation({
    mutationFn: (qrCode: string) => publicProductApi.recordQrScan(qrCode),
  });
};
