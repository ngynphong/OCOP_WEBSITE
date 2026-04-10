import { axiosClient } from '@/lib/axios';
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
  // ─── Inventory List ────────────────────────────────────────────────────────

  getInventory: (params?: InventoryListParams): Promise<InventoryListResponse> => {
    return axiosClient.get('/seller/inventory', { params });
  },

  // ─── Variant Inventory ─────────────────────────────────────────────────────

  getInventoryByVariant: (variantId: number): Promise<InventoryDetailResponse> => {
    return axiosClient.get(`/seller/inventory/variants/${variantId}`);
  },

  getInventoryLogs: (
    variantId: number,
    params?: InventoryListParams,
  ): Promise<InventoryLogListResponse> => {
    return axiosClient.get(`/seller/inventory/variants/${variantId}/logs`, { params });
  },

  // ─── Stock Actions ─────────────────────────────────────────────────────────

  addStock: (variantId: number, data: AddStockRequest): Promise<InventoryDetailResponse> => {
    return axiosClient.post(`/seller/inventory/variants/${variantId}/add-stock`, data);
  },

  adjustStock: (variantId: number, data: AdjustStockRequest): Promise<InventoryDetailResponse> => {
    return axiosClient.post(`/seller/inventory/variants/${variantId}/adjust`, data);
  },

  reportDamaged: (
    variantId: number,
    data: DamagedStockRequest,
  ): Promise<InventoryDetailResponse> => {
    return axiosClient.post(`/seller/inventory/variants/${variantId}/damaged`, data);
  },

  updateThreshold: (
    variantId: number,
    data: ThresholdRequest,
  ): Promise<InventoryDetailResponse> => {
    return axiosClient.patch(`/seller/inventory/variants/${variantId}/threshold`, data);
  },

  // ─── Alerts ────────────────────────────────────────────────────────────────

  getLowStockAlerts: (): Promise<LowStockAlertResponse> => {
    return axiosClient.get('/seller/inventory/alerts/low-stock');
  },
};
