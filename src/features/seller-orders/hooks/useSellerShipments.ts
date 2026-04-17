import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { sellerShipmentApi } from '../api/sellerShipmentApi';
import { ITrackingEventReq } from '../types/sellerOrderTypes';
import { sellerOrderKeys } from './useSellerOrders';

export const shipmentKeys = {
  all: ['shipments'] as const,
  detail: (id: number) => [...shipmentKeys.all, id] as const,
};

export const useSellerShipmentQuery = (shipmentId?: number) => {
  return useQuery({
    queryKey: shipmentKeys.detail(shipmentId!),
    queryFn: () => sellerShipmentApi.getShipmentDetails(shipmentId!),
    enabled: !!shipmentId,
  });
};

export const useUpdateTrackingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ ref, data }: { ref: string; data: ITrackingEventReq }) =>
      sellerShipmentApi.addTrackingEvent(ref, data),
    onSuccess: () => {
      toast.success('Đã thêm dòng biến cố lộ trình.');
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.lists() });
      queryClient.invalidateQueries({ queryKey: sellerOrderKeys.details() });
    },
  });
};
