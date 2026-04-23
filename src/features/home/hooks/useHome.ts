import { useQuery } from '@tanstack/react-query';
import { homeApi } from '../api/homeApi';

export const useBannersQuery = () => {
  return useQuery({
    queryKey: ['home-banners'],
    queryFn: () => homeApi.getBanners(),
    staleTime: 30 * 60 * 1000, // 30 mins
  });
};

export const useQuickLinksQuery = () => {
  return useQuery({
    queryKey: ['home-quick-links'],
    queryFn: () => homeApi.getQuickLinks(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};
