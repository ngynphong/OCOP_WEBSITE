import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  AdjustStockRequest,
  InventoryDetailResponse,
  InventoryListParams,
  InventoryListResponse,
  LowStockAlertResponse,
} from '@/features/inventory/types/inventoryTypes';

export const adminInventoryApi = {
  // ─── Inventory Management ──────────────────────────────────────────────────

  getInventory: (params?: InventoryListParams): Promise<InventoryListResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.INVENTORY, { params });
  },

  getLowStockAlerts: (params?: InventoryListParams): Promise<LowStockAlertResponse> => {
    return axiosClient.get(API_ENDPOINTS.ADMIN.INVENTORY_LOW_STOCK_ALERTS, { params });
  },

  // ─── Stock Adjustments ─────────────────────────────────────────────────────

  adjustStock: (variantId: number, data: AdjustStockRequest): Promise<InventoryDetailResponse> => {
    return axiosClient.post(`${API_ENDPOINTS.ADMIN.INVENTORY}/variants/${variantId}/adjust`, data);
  },
};
