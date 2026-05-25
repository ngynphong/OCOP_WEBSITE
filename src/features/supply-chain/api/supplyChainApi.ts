import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
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
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS,
      data,
    );
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
    >(API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS, { params });
  },

  getSellerLotDetail: async (id: number) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}`,
    );
  },

  updateLotStatus: async (id: number, status: TLotStatus) => {
    return axiosClient.patch<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/status`,
      null,
      { params: { status } },
    );
  },

  // Step Recording APIs
  recordProduction: async (id: number, data: IProductionStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/steps/production`,
      data,
    );
  },

  recordProcessing: async (id: number, data: IProcessingStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/steps/processing`,
      data,
    );
  },

  recordStorage: async (id: number, data: IStorageStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/steps/storage`,
      data,
    );
  },

  recordTransport: async (id: number, data: ITransportStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/steps/transport`,
      data,
    );
  },

  recordDistribution: async (id: number, data: IDistributionStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/steps/distribution`,
      data,
    );
  },

  // Public APIs
  getLotByCode: async (lotCode: string) => {
    return publicAxiosClient.get<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.PUBLIC.SUPPLY_CHAIN_LOTS}/by-code/${lotCode}`,
    );
  },

  getPublicLotDetail: async (id: number) => {
    return publicAxiosClient.get<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.PUBLIC.SUPPLY_CHAIN_LOTS}/${id}`,
    );
  },

  getPublicLots: async (params: IPublicLotListReq) => {
    return publicAxiosClient.get<
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
    >(API_ENDPOINTS.PUBLIC.SUPPLY_CHAIN_LOTS, { params });
  },
};
