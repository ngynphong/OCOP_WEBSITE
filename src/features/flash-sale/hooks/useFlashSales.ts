import { useQuery } from '@tanstack/react-query';
import { flashSaleApi } from '../api/flashSaleApi';

export const useActiveFlashSales = (categoryId?: number) => {
  return useQuery({
    queryKey: ['flash-sales', 'active', categoryId],
    queryFn: () => flashSaleApi.getActiveFlashSales(categoryId),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpcomingFlashSales = (categoryId?: number) => {
  return useQuery({
    queryKey: ['flash-sales', 'upcoming', categoryId],
    queryFn: () => flashSaleApi.getUpcomingFlashSales(categoryId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useFlashSaleDetail = (id: number) => {
  return useQuery({
    queryKey: ['flash-sales', 'detail', id],
    queryFn: () => flashSaleApi.getFlashSaleDetail(id),
    enabled: !!id,
  });
};
