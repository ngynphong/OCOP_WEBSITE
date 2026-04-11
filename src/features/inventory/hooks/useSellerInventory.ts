import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { sellerInventoryApi } from '@/features/inventory/api/sellerInventoryApi';
import {
  AddStockRequest,
  AdjustStockRequest,
  DamagedStockRequest,
  InventoryListParams,
  ThresholdRequest,
} from '@/features/inventory/types/inventoryTypes';
import toast from 'react-hot-toast';

// ─── Query Keys ────────────────────────────────────────────────────────────────

const INVENTORY_KEY = 'seller-inventory';
const INVENTORY_LOGS_KEY = 'seller-inventory-logs';
const LOW_STOCK_KEY = 'seller-inventory-low-stock';

// ─── Query Hooks ───────────────────────────────────────────────────────────────

export const useInventoryListQuery = (params?: InventoryListParams) => {
  return useQuery({
    queryKey: [INVENTORY_KEY, params],
    queryFn: () => sellerInventoryApi.getInventory(params),
    staleTime: 30_000,
  });
};

export const useInventoryByVariantQuery = (variantId: number | null | undefined) => {
  return useQuery({
    queryKey: [INVENTORY_KEY, variantId],
    queryFn: () => sellerInventoryApi.getInventoryByVariant(variantId!),
    enabled: !!variantId,
    staleTime: 30_000,
  });
};

export const useInventoryLogsQuery = (
  variantId: number | null | undefined,
  params?: InventoryListParams,
) => {
  return useQuery({
    queryKey: [INVENTORY_LOGS_KEY, variantId, params],
    queryFn: () => sellerInventoryApi.getInventoryLogs(variantId!, params),
    enabled: !!variantId,
    staleTime: 30_000,
  });
};

export const useLowStockAlertsQuery = () => {
  return useQuery({
    queryKey: [LOW_STOCK_KEY],
    queryFn: () => sellerInventoryApi.getLowStockAlerts(),
    staleTime: 30_000,
  });
};

// ─── Mutation Hooks ────────────────────────────────────────────────────────────

export const useAddStockMutation = (variantId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddStockRequest) => sellerInventoryApi.addStock(variantId, data),
    onSuccess: () => {
      toast.success('Nhập hàng thành công');
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LOW_STOCK_KEY] });
    },
  });
};

export const useAdjustStockMutation = (variantId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AdjustStockRequest) => sellerInventoryApi.adjustStock(variantId, data),
    onSuccess: () => {
      toast.success('Điều chỉnh tồn kho thành công');
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LOW_STOCK_KEY] });
    },
  });
};

export const useDamagedStockMutation = (variantId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DamagedStockRequest) => sellerInventoryApi.reportDamaged(variantId, data),
    onSuccess: () => {
      toast.success('Ghi nhận hàng hỏng thành công');
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LOW_STOCK_KEY] });
    },
  });
};

export const useUpdateThresholdMutation = (variantId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ThresholdRequest) => sellerInventoryApi.updateThreshold(variantId, data),
    onSuccess: () => {
      toast.success('Cập nhật ngưỡng cảnh báo thành công');
      queryClient.invalidateQueries({ queryKey: [INVENTORY_KEY] });
      queryClient.invalidateQueries({ queryKey: [LOW_STOCK_KEY] });
    },
  });
};
