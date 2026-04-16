import { axiosClient } from '@/lib/axios';
import { IShipmentRes, ITrackingEventReq, ICreateShipmentReq } from '../types/sellerOrderTypes';

export const sellerShipmentApi = {
  createShipment: async (data: ICreateShipmentReq) => {
    return axiosClient.post<unknown, { data: unknown }>('/seller/shipments', data);
  },

  addTrackingEvent: async (ref: string, data: ITrackingEventReq) => {
    return axiosClient.post<unknown, { data: IShipmentRes }>(
      `/seller/shipments/${ref}/tracking`,
      data,
    );
  },

  getShipmentDetails: async (shipmentId: number) => {
    return axiosClient.get<unknown, { data: IShipmentRes }>(`/seller/shipments/${shipmentId}`);
  },
};
