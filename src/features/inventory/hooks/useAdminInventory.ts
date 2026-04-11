import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { adminInventoryApi } from '../api/adminInventoryApi';
import { AdjustStockRequest, InventoryListParams } from '../types/inventoryTypes';

/**
 * Hook fetch danh sách tồn kho cho Admin
 */
export const useAdminInventory = (params?: InventoryListParams) => {
  return useQuery({
    queryKey: ['admin-inventory', params],
    queryFn: () => adminInventoryApi.getInventory(params),
    placeholderData: (previousData) => previousData, // Giữ data cũ khi đang fetch data mới (phân trang)
  });
};

/**
 * Hook fetch danh sách cảnh báo tồn kho thấp cho Admin
 */
export const useAdminLowStockAlerts = (params?: InventoryListParams) => {
  return useQuery({
    queryKey: ['admin-inventory-alerts', params],
    queryFn: () => adminInventoryApi.getLowStockAlerts(params),
  });
};

/**
 * Hook thực hiện điều chỉnh tồn kho (Admin)
 */
export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ variantId, data }: { variantId: number; data: AdjustStockRequest }) =>
      adminInventoryApi.adjustStock(variantId, data),
    onSuccess: () => {
      toast.success('Điều chỉnh tồn kho thành công!');
      // Invalidate queries để cập nhật dữ liệu mới nhất
      queryClient.invalidateQueries({ queryKey: ['admin-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['admin-inventory-alerts'] });
    },
  });
};
