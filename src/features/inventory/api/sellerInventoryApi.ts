import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  AddStockRequest,
  AdjustStockRequest,
  DamagedStockRequest,
  InventoryDetailResponse,
  InventoryListParams,
  InventoryListResponse,
  InventoryLogListResponse,
  LowStockAlertResponse,
  ThresholdRequest,
} from '@/features/inventory/types/inventoryTypes';

export const sellerInventoryApi = {
  getInventory: (params?: InventoryListParams): Promise<InventoryListResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.INVENTORY, { params });
  },

  getInventoryByVariant: (variantId: number): Promise<InventoryDetailResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.SELLER.INVENTORY}/variants/${variantId}`);
  },

  getInventoryLogs: (
    variantId: number,
    params?: InventoryListParams,
  ): Promise<InventoryLogListResponse> => {
    return axiosClient.get(`${API_ENDPOINTS.SELLER.INVENTORY}/variants/${variantId}/logs`, {
      params,
    });
  },

  addStock: (variantId: number, data: AddStockRequest): Promise<InventoryDetailResponse> => {
    return axiosClient.post(
      `${API_ENDPOINTS.SELLER.INVENTORY}/variants/${variantId}/add-stock`,
      data,
    );
  },

  adjustStock: (variantId: number, data: AdjustStockRequest): Promise<InventoryDetailResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.SELLER.INVENTORY}/variants/${variantId}/adjust`, data);
  },

  reportDamaged: (
    variantId: number,
    data: DamagedStockRequest,
  ): Promise<InventoryDetailResponse> => {
    return axiosClient.post(
      `${API_ENDPOINTS.SELLER.INVENTORY}/variants/${variantId}/damaged`,
      data,
    );
  },

  updateThreshold: (
    variantId: number,
    data: ThresholdRequest,
  ): Promise<InventoryDetailResponse> => {
    return axiosClient.patch(
      `${API_ENDPOINTS.SELLER.INVENTORY}/variants/${variantId}/threshold`,
      data,
    );
  },

  getLowStockAlerts: (): Promise<LowStockAlertResponse> => {
    return axiosClient.get(API_ENDPOINTS.SELLER.INVENTORY_LOW_STOCK_ALERTS);
  },
};
