import { useQuery } from '@tanstack/react-query';
import { publicProductApi } from '@/features/products/api/publicProductApi';
import { PublicProductListParams } from '@/features/products/types/productTypes';

export const usePublicCategoriesQuery = () => {
  return useQuery({
    queryKey: ['public-categories'],
    queryFn: () => publicProductApi.getCategories(),
    staleTime: 10 * 60 * 1000, // categories ít thay đổi, cache 10 phút
  });
};

// ─── Standalone Query Hooks ───────────────────────────────────────────────────

export const usePublicProductsQuery = (params?: PublicProductListParams) => {
  return useQuery({
    queryKey: ['public-products', params],
    queryFn: () => publicProductApi.getProducts(params),
    staleTime: 60 * 1000,
  });
};

export const usePublicProductDetailQuery = (id: number | null | undefined) => {
  return useQuery({
    queryKey: ['public-product', id],
    queryFn: () => publicProductApi.getProduct(id!),
    enabled: !!id,
    staleTime: 60 * 1000,
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
