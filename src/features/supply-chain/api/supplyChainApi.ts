import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

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
  ITestingStepReq,
  TLotStatus,
  ILotQrCode,
  ILotAuditLog,
  IProcessTemplate,
  ICreateProcessTemplateReq,
  ICreateBatchEventReq,
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
    const springParams = {
      ...params,
      page: params.page ? params.page - 1 : 0,
    };
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
    >(API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS, { params: springParams });
  },

  getSellerLotDetail: async (id: number) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(
      buildRoute(API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS, id),
    );
  },

  updateLotStatus: async (id: number, status: TLotStatus) => {
    return axiosClient.patch<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/status`,
      null,
      { params: { status } },
    );
  },

  submitLotForVerification: async (id: number) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/submit-verification`,
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

  recordTestingLog: async (id: number, data: ITestingStepReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${id}/steps/testing`,
      data,
    );
  },

  // QR Serialization
  generateItemQrCodes: async (lotId: number, count: number) => {
    return axiosClient.post<unknown, { data: string }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/qrs/generate`,
      null,
      { params: { count } },
    );
  },

  getLotQrCodes: async (lotId: number) => {
    return axiosClient.get<unknown, { data: ILotQrCode[] }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/qrs`,
    );
  },

  getProcessTemplates: async (productId: number) => {
    return axiosClient.get<unknown, { data: IProcessTemplate[] }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/templates`,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { productId },
      },
    );
  },

  createProcessTemplate: async (data: ICreateProcessTemplateReq) => {
    return axiosClient.post<unknown, { data: IProcessTemplate }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/templates`,
      data,
    );
  },

  addBatchEvent: async (lotId: number, data: ICreateBatchEventReq) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/events`,
      data,
    );
  },

  getLotAuditLogs: async (lotId: number, params: { page?: number; size?: number } = {}) => {
    return axiosClient.get<
      unknown,
      {
        data: {
          page: number;
          size: number;
          totalPages: number;
          totalElements: number;
          content: ILotAuditLog[];
        };
      }
    >(`${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/audit-logs`, { params });
  },

  // Public APIs
  getLotByCode: async (lotCode: string) => {
    return publicAxiosClient.get<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.PUBLIC.SUPPLY_CHAIN_LOTS}/by-code/${lotCode}`,
    );
  },

  getLotByQrToken: async (qrToken: string) => {
    return publicAxiosClient.get<unknown, { data: ISupplyChainLot }>(
      `/api/public/traceability/${qrToken}`,
    );
  },

  getPublicLotDetail: async (id: number) => {
    return publicAxiosClient.get<unknown, { data: ISupplyChainLot }>(
      buildRoute(API_ENDPOINTS.PUBLIC.SUPPLY_CHAIN_LOTS, id),
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
