import { useQuery, useMutation } from '@tanstack/react-query';
import { flashSaleApi } from '../api/flashSaleApi';
import { FlashSaleBuyRequest } from '@/features/checkout/types/checkoutTypes';

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

export const useBuyFlashSaleItem = () => {
  return useMutation({
    mutationFn: ({
      flashSaleItemId,
      data,
    }: {
      flashSaleItemId: number;
      data: FlashSaleBuyRequest;
    }) => flashSaleApi.buyFlashSaleItem(flashSaleItemId, data),
  });
};
