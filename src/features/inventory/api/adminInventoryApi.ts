import { axiosClient } from '@/lib/axios';
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
    return axiosClient.get('/admin/inventory', { params });
  },

  getLowStockAlerts: (params?: InventoryListParams): Promise<LowStockAlertResponse> => {
    return axiosClient.get('/admin/inventory/alerts/low-stock', { params });
  },

  // ─── Stock Adjustments ─────────────────────────────────────────────────────

  adjustStock: (variantId: number, data: AdjustStockRequest): Promise<InventoryDetailResponse> => {
    return axiosClient.post(`/admin/inventory/variants/${variantId}/adjust`, data);
  },
};
