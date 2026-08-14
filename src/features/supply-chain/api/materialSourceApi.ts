import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  ISupplier,
  ISupplierReq,
  ISourceFacility,
  ISourceFacilityReq,
  ISourceCycle,
  ISourceCycleReq,
  IMaterialLot,
  IMaterialLotReq,
  IPageResponse,
  ISourceCycleLog,
  ISourceCycleLogReq,
  IMaterialLotUsage,
} from '../types/materialSourceTypes';

export const materialSourceApi = {
  // --- Suppliers ---
  getSuppliers: async (page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<ISupplier> }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_SUPPLIERS,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { page, size },
      },
    );
  },
  createSupplier: async (data: ISupplierReq) => {
    return axiosClient.post<unknown, { data: ISupplier }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_SUPPLIERS,
      data,
    );
  },
  updateSupplier: async (id: number, data: ISupplierReq) => {
    return axiosClient.put<unknown, { data: ISupplier }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_SUPPLIERS}/${id}`,
      data,
    );
  },
  deleteSupplier: async (id: number) => {
    return axiosClient.delete(`${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_SUPPLIERS}/${id}`);
  },

  // --- Source Facilities ---
  getFacilities: async (page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<ISourceFacility> }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES,
      { headers: { 'X-Silent-Loading': 'true' }, params: { page, size } },
    );
  },
  createFacility: async (data: ISourceFacilityReq) => {
    return axiosClient.post<unknown, { data: ISourceFacility }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES,
      data,
    );
  },
  updateFacility: async (id: number, data: ISourceFacilityReq) => {
    return axiosClient.put<unknown, { data: ISourceFacility }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES}/${id}`,
      data,
    );
  },
  deleteFacility: async (id: number) => {
    return axiosClient.delete(`${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES}/${id}`);
  },

  // --- Source Cycles ---
  getCyclesByFacility: async (facilityId: number, page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<ISourceCycle> }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES}/${facilityId}/cycles`,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { page, size },
      },
    );
  },
  getCycles: async (facilityId: number, page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<ISourceCycle> }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES}/${facilityId}/cycles`,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { page, size },
      },
    );
  },
  createCycle: async (facilityId: number, data: ISourceCycleReq) => {
    return axiosClient.post<unknown, { data: ISourceCycle }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_FACILITIES}/${facilityId}/cycles`,
      data,
    );
  },
  updateCycle: async (id: number, data: ISourceCycleReq) => {
    return axiosClient.put<unknown, { data: ISourceCycle }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_CYCLES}/${id}`,
      data,
    );
  },
  deleteCycle: async (id: number) => {
    return axiosClient.delete(`${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_CYCLES}/${id}`);
  },

  // --- Source Cycle Logs ---
  getCycleLogs: async (cycleId: number, page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<ISourceCycleLog> }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_CYCLES}/${cycleId}/logs`,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { page, size },
      },
    );
  },
  createCycleLog: async (cycleId: number, data: ISourceCycleLogReq) => {
    return axiosClient.post<unknown, { data: ISourceCycleLog }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_CYCLES}/${cycleId}/logs`,
      data,
    );
  },
  updateCycleLog: async (id: number, data: ISourceCycleLogReq) => {
    return axiosClient.put<unknown, { data: ISourceCycleLog }>(
      `/api/v1/seller/source-cycles/logs/${id}`,
      data,
    );
  },
  deleteCycleLog: async (id: number) => {
    return axiosClient.delete(`/api/v1/seller/source-cycles/logs/${id}`);
  },

  // --- Material Lots ---
  getMaterialLots: async (page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<IMaterialLot> }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_MATERIAL_LOTS,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { page, size },
      },
    );
  },
  createMaterialLot: async (data: IMaterialLotReq) => {
    return axiosClient.post<unknown, { data: IMaterialLot }>(
      API_ENDPOINTS.SELLER.SUPPLY_CHAIN_MATERIAL_LOTS,
      data,
    );
  },
  updateMaterialLot: async (id: number, data: IMaterialLotReq) => {
    return axiosClient.put<unknown, { data: IMaterialLot }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_MATERIAL_LOTS}/${id}`,
      data,
    );
  },
  deleteMaterialLot: async (id: number) => {
    return axiosClient.delete(`${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_MATERIAL_LOTS}/${id}`);
  },
  getMaterialLotUsages: async (id: number, page = 0, size = 10) => {
    return axiosClient.get<unknown, { data: IPageResponse<IMaterialLotUsage> }>(
      `${API_ENDPOINTS.SELLER.SUPPLY_CHAIN_MATERIAL_LOTS}/${id}/usages`,
      {
        headers: { 'X-Silent-Loading': 'true' },
        params: { page, size },
      },
    );
  },
};
