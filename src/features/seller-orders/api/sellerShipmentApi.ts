import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import { IShipmentRes, ITrackingEventReq, ICreateShipmentReq } from '../types/sellerOrderTypes';

export const sellerShipmentApi = {
  createShipment: async (data: ICreateShipmentReq) => {
    return axiosClient.post<unknown, { data: unknown }>(API_ENDPOINTS.SELLER.SHIPMENTS, data);
  },

  addTrackingEvent: async (ref: string, data: ITrackingEventReq) => {
    return axiosClient.post<unknown, { data: IShipmentRes }>(
      buildRoute(API_ENDPOINTS.SELLER.SHIPMENTS, ref, 'tracking'),
      data,
    );
  },

  getShipmentDetails: async (shipmentId: number) => {
    return axiosClient.get<unknown, { data: IShipmentRes }>(
      buildRoute(API_ENDPOINTS.SELLER.SHIPMENTS, shipmentId),
    );
  },
};
