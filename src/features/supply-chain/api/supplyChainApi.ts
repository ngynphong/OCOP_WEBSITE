import { axiosClient } from '@/lib/axios';
import {
  ISupplyChainLot,
  ICreateLotReq,
  ILotListReq,
  IPublicLotListReq,
  IProductionStepReq,
  IProcessingStepReq,
  IStorageStepReq,
  ITransportStepReq,
  IDistributionStepReq,
  TLotStatus,
} from '../types/supplyChainTypes';

export const supplyChainApi = {
  // Seller APIs
  createLot: async (data: ICreateLotReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>('/seller/supply-chain/lots', data);
  },

  getSellerLots: async (params: ILotListReq) => {
    return axiosClient.get<
      unknown,
      {
        data: {
          page: number;
          size: number;
          totalPages: number;
          totalElements: number;
          content: ISupplyChainLot[];
        };
      }
    >('/seller/supply-chain/lots', { params });
  },

  getSellerLotDetail: async (id: number) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(`/seller/supply-chain/lots/${id}`);
  },

  updateLotStatus: async (id: number, status: TLotStatus) => {
    return axiosClient.patch<unknown, { data: ISupplyChainLot }>(
      `/seller/supply-chain/lots/${id}/status`,
      null,
      { params: { status } },
    );
  },

  // Step Recording APIs
  recordProduction: async (id: number, data: IProductionStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `/seller/supply-chain/lots/${id}/steps/production`,
      data,
    );
  },

  recordProcessing: async (id: number, data: IProcessingStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `/seller/supply-chain/lots/${id}/steps/processing`,
      data,
    );
  },

  recordStorage: async (id: number, data: IStorageStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `/seller/supply-chain/lots/${id}/steps/storage`,
      data,
    );
  },

  recordTransport: async (id: number, data: ITransportStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `/seller/supply-chain/lots/${id}/steps/transport`,
      data,
    );
  },

  recordDistribution: async (id: number, data: IDistributionStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `/seller/supply-chain/lots/${id}/steps/distribution`,
      data,
    );
  },

  // Public APIs
  getLotByCode: async (lotCode: string) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(
      `/supply-chain/lots/by-code/${lotCode}`,
    );
  },

  getPublicLotDetail: async (id: number) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(`/supply-chain/lots/${id}`);
  },

  getPublicLots: async (params: IPublicLotListReq) => {
    return axiosClient.get<
      unknown,
      {
        data: {
          page: number;
          size: number;
          totalPages: number;
          totalElements: number;
          content: ISupplyChainLot[];
        };
      }
    >('/supply-chain/lots', { params });
  },
};
