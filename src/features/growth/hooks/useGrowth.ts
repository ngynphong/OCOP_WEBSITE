import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { growthApi } from '../api/growthApi';
import toast from 'react-hot-toast';

export const GROWTH_KEYS = {
  overview: () => ['seller', 'growth', 'overview'] as const,
  opportunities: (page: number, size: number) =>
    ['seller', 'growth', 'opportunities', page, size] as const,
  products: () => ['seller', 'growth', 'products'] as const,
};

export const useGrowthOverview = () => {
  return useQuery({
    queryKey: GROWTH_KEYS.overview(),
    queryFn: async () => {
      const res = await growthApi.getOverview();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

export const useGrowthOpportunities = (page = 0, size = 20) => {
  return useQuery({
    queryKey: GROWTH_KEYS.opportunities(page, size),
    queryFn: async () => {
      const res = await growthApi.getOpportunities({ page, size });
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

export const useProductGrowth = () => {
  return useQuery({
    queryKey: GROWTH_KEYS.products(),
    queryFn: async () => {
      const res = await growthApi.getProducts();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
};

export interface ExecuteOpportunityArgs {
  id: number;
  silent?: boolean;
}

export const useGrowthMutations = () => {
  const queryClient = useQueryClient();

  const dismissOpportunity = useMutation({
    mutationFn: (id: number) => growthApi.dismissOpportunity(id),
    onSuccess: () => {
      toast.success('Đã bỏ qua đề xuất');
      queryClient.invalidateQueries({ queryKey: ['seller', 'growth'] });
    },
    onError: () => {
      toast.error('Không thể thao tác lúc này');
    },
  });

  const executeOpportunity = useMutation({
    mutationFn: (args: number | ExecuteOpportunityArgs) => {
      const id = typeof args === 'number' ? args : args.id;
      return growthApi.executeOpportunity(id);
    },
    onSuccess: (res, variables) => {
      const isSilent = typeof variables === 'object' && variables.silent;
      if (!isSilent) {
        const msg = res.data?.message || '🎉 Đã hoàn thành cơ hội tăng trưởng!';
        toast.success(msg);
      }
      queryClient.invalidateQueries({ queryKey: ['seller', 'growth'] });
    },
    onError: () => {
      toast.error('Không thể cập nhật cơ hội tăng trưởng lúc này');
    },
  });

  const markViewed = useMutation({
    mutationFn: (id: number) => growthApi.markViewed(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seller', 'growth'] });
    },
  });

  return { dismissOpportunity, executeOpportunity, markViewed };
};
