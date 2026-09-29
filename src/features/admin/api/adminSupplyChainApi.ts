import { axiosClient } from '@/lib/axios';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

const ADMIN_SUPPLY_CHAIN_API = '/api/v1/admin/supply-chain/lots';

export interface GetAdminLotsParams {
  shopId?: number;
  productId?: number;
  status?: string;
  flaggedByAi?: boolean;
  page?: number;
  size?: number;
}

export interface SpringPagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export interface RecallLotPayload {
  reason: string;
  severity: 'MINOR' | 'MAJOR' | 'CRITICAL';
  instructions?: string;
  publicNotice?: string;
}

export const adminSupplyChainApi = {
  getLots: async (params: GetAdminLotsParams) => {
    const springParams = {
      ...params,
      page: params.page ? params.page - 1 : 0,
    };
    return axiosClient.get<unknown, { data: SpringPagedResponse<ISupplyChainLot> }>(
      ADMIN_SUPPLY_CHAIN_API,
      { params: springParams },
    );
  },

  getLotDetail: async (id: number) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(`${ADMIN_SUPPLY_CHAIN_API}/${id}`);
  },

  suspendLot: async (id: number, reason?: string) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${ADMIN_SUPPLY_CHAIN_API}/${id}/suspend`,
      null,
      { params: reason ? { reason } : undefined },
    );
  },

  reactivateLot: async (id: number) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${ADMIN_SUPPLY_CHAIN_API}/${id}/reactivate`,
    );
  },

  recallLot: async (id: number, payload: RecallLotPayload) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${ADMIN_SUPPLY_CHAIN_API}/${id}/recall`,
      payload,
    );
  },

  expireLot: async (id: number, reason?: string) => {
    return axiosClient.post<unknown, { data: ISupplyChainLot }>(
      `${ADMIN_SUPPLY_CHAIN_API}/${id}/expire`,
      null,
      { params: reason ? { reason } : undefined },
    );
  },
};
