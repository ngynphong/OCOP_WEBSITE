import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  GrowthExecuteResponse,
  GrowthOverviewResponse,
  PaginatedOpportunities,
  ProductGrowthItem,
} from '../types';

export const growthApi = {
  getOverview: () => axiosClient.get<GrowthOverviewResponse>(API_ENDPOINTS.SELLER.GROWTH_OVERVIEW),

  getOpportunities: (params?: { page?: number; size?: number }) =>
    axiosClient.get<PaginatedOpportunities>(API_ENDPOINTS.SELLER.GROWTH_OPPORTUNITIES, {
      params,
    }),

  getProducts: () => axiosClient.get<ProductGrowthItem[]>(API_ENDPOINTS.SELLER.GROWTH_PRODUCTS),

  executeOpportunity: (id: number) =>
    axiosClient.post<GrowthExecuteResponse>(
      `${API_ENDPOINTS.SELLER.GROWTH_OPPORTUNITIES}/${id}/execute`,
    ),

  dismissOpportunity: (id: number) =>
    axiosClient.post<void>(`${API_ENDPOINTS.SELLER.GROWTH_OPPORTUNITIES}/${id}/dismiss`),

  markViewed: (id: number) =>
    axiosClient.post<void>(`${API_ENDPOINTS.SELLER.GROWTH_OPPORTUNITIES}/${id}/view`),
};
