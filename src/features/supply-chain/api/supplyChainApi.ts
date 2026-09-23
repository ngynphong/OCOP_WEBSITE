import { axiosClient, publicAxiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  ISupplyChainLot,
  ICreateLotReq,
  ILotListReq,
  IPublicLotListReq,
  TLotStatus,
  ILotQrCode,
  ILotAuditLog,
  IProcessTemplate,
  ICreateProcessTemplateReq,
  ICreateBatchEventReq,
  ILotTaskResponse,
  ILotAssignment,
  ICreateLotAssignmentReq,
  IUpdateQrStatusReq,
} from '../types/supplyChainTypes';

export const supplyChainApi = {
  getUpcomingTasks: async () => {
    return axiosClient.get<unknown, { data: ILotTaskResponse[] }>(
      '/seller/supply-chain/lots/tasks',
      { headers: { 'X-Silent-Loading': 'true' } },
    );
  },

  getLotAssignments: async (lotId: number) => {
    return axiosClient.get<unknown, { data: ILotAssignment[] }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/assignments`,
      { headers: { 'X-Silent-Loading': 'true' } },
    );
  },

  assignUserToLot: async (lotId: number, data: ICreateLotAssignmentReq) => {
    return axiosClient.post<unknown, { data: ILotAssignment }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/assignments`,
      data,
    );
  },

  revokeLotAssignment: async (lotId: number, assignmentId: number) => {
    return axiosClient.delete<unknown, { data: void }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/assignments/${assignmentId}`,
    );
  },

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
    >(API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS, {
      headers: { 'X-Silent-Loading': 'true' },
      params: springParams,
    });
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

  updateLotQrStatus: async (lotId: number, data: IUpdateQrStatusReq) => {
    return axiosClient.patch<unknown, { data: void }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/qrs/status`,
      data,
    );
  },

  resolveLotByQr: async (code: string) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/resolve-qr`,
      { params: { code } },
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

  getTemplateById: async (templateId: number) => {
    return axiosClient.get<unknown, { data: IProcessTemplate }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/templates/${templateId}`,
      { headers: { 'X-Silent-Loading': 'true' } },
    );
  },

  getSystemTemplates: async (categoryId?: number) => {
    return axiosClient.get<unknown, { data: IProcessTemplate[] }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/templates/system`,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { categoryId },
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

  harvestAndLink: async (
    lotId: number,
    data: {
      cycleId: number;
      harvestDate: string;
      quantity: number;
      unit: string;
      qualityGrade?: string;
      harvestArea?: number;
      description?: string;
    },
  ) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_LOTS}/${lotId}/harvest-and-link`,
      data,
    );
  },

  verifyBatchEvent: async (data: { templateDesc: string; eventData: string }) => {
    return axiosClient.post<
      unknown,
      {
        data: {
          hasViolation: boolean;
          violationMessage: string;
          isDivergent: boolean;
          divergenceMessage: string;
        };
      }
    >('/seller/ai/verify-event', data, { headers: { 'X-Silent-Loading': 'true' } });
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
