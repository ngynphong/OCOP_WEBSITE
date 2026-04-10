import { AuthResponseBase, PaginatedResponse } from '@/features/admin/types/adminTypes';

export type { AuthResponseBase, PaginatedResponse };

// ─── Enums ────────────────────────────────────────────────────────────────────

export type InventoryChangeType =
  | 'IMPORT'
  | 'SALE_RESERVE'
  | 'SALE_RELEASE'
  | 'SALE_COMMIT'
  | 'RETURN_STOCK'
  | 'ADJUSTMENT'
  | 'DAMAGED'
  | 'FLASH_RESERVE'
  | 'FLASH_RELEASE';

// ─── Response interfaces ──────────────────────────────────────────────────────

export interface InventoryItem {
  id: number;
  variantId: number;
  variantName: string;
  sku: string;
  stockQty: number;
  reservedQty: number;
  availableQty: number;
  soldQty: number;
  damagedQty: number;
  lowStockThreshold: number;
  lowStock: boolean;
  outOfStock: boolean;
  lastRestockedAt: string | null;
  updatedAt: string;
}

export interface InventoryLog {
  id: number;
  inventoryId: number;
  changeType: InventoryChangeType;
  refType: string;
  refId: string | null;
  delta: number;
  stockBefore: number;
  stockAfter: number;
  createdBy: string;
  note: string | null;
  createdAt: string;
}

// ─── Request interfaces ───────────────────────────────────────────────────────

export interface InventoryListParams {
  page?: number;
  size?: number;
}

export interface AddStockRequest {
  quantity: number;
  importRefId?: string;
  note?: string;
}

export interface AdjustStockRequest {
  delta: number;
  note: string;
}

export interface DamagedStockRequest {
  quantity: number;
  reason: string;
}

export interface ThresholdRequest {
  threshold: number;
}

// ─── Response type aliases ────────────────────────────────────────────────────

export type InventoryListResponse = AuthResponseBase<PaginatedResponse<InventoryItem>>;
export type InventoryDetailResponse = AuthResponseBase<InventoryItem>;
export type InventoryLogListResponse = AuthResponseBase<PaginatedResponse<InventoryLog>>;
export type LowStockAlertResponse = AuthResponseBase<InventoryItem[]>;
