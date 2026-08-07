import { axiosClient } from '@/lib/axios';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import { PaginatedResponse } from '../types/adminTypes';

const ADMIN_SUPPLY_CHAIN_API = '/api/v1/admin/supply-chain/lots';

export interface GetAdminLotsParams {
  shopId?: number;
  productId?: number;
  status?: string;
  verificationStatus?: string;
  page?: number;
  size?: number;
}

export const adminSupplyChainApi = {
  getLots: async (params: GetAdminLotsParams) => {
    const springParams = {
      ...params,
      page: params.page ? params.page - 1 : 0,
    };
    return axiosClient.get<unknown, { data: PaginatedResponse<ISupplyChainLot> }>(
      ADMIN_SUPPLY_CHAIN_API,
      { params: springParams },
    );
  },

  getLotDetail: async (id: number) => {
    return axiosClient.get<unknown, { data: ISupplyChainLot }>(`${ADMIN_SUPPLY_CHAIN_API}/${id}`);
  },

  verifyLot: async (
    id: number,
    data: { newStatus: string; newLevel?: string; comment?: string },
  ) => {
    return axiosClient.put<unknown, { data: ISupplyChainLot }>(
      `${ADMIN_SUPPLY_CHAIN_API}/${id}/verify`,
      data,
    );
  },
};
