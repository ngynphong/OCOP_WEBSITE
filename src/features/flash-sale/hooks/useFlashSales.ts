import { useQuery } from '@tanstack/react-query';
import { flashSaleApi } from '../api/flashSaleApi';

export const useActiveFlashSales = () => {
  return useQuery({
    queryKey: ['flash-sales', 'active'],
    queryFn: () => flashSaleApi.getActiveFlashSales(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useUpcomingFlashSales = () => {
  return useQuery({
    queryKey: ['flash-sales', 'upcoming'],
    queryFn: () => flashSaleApi.getUpcomingFlashSales(),
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
