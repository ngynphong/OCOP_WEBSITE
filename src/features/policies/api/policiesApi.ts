import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { buildRoute } from '@/lib/routeBuilder';

import {
  IPolicy,
  ICreatePolicyRequest,
  IUpdatePolicyRequest,
  IPolicyConsentRequest,
  IPolicyApiResponse,
} from '../types/policies';

export const policiesApi = {
  // Public/User APIs
  getPolicy: async (id: number): Promise<IPolicy> => {
    const response = (await axiosClient.get(
      buildRoute(API_ENDPOINTS.POLICIES, id),
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  getPolicyBySlug: async (slug: string): Promise<IPolicy> => {
    const response = (await axiosClient.get(
      `${API_ENDPOINTS.POLICIES}/slug/${slug}`,
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  getPendingPolicies: async (): Promise<IPolicy[]> => {
    const response = (await axiosClient.get(
      `${API_ENDPOINTS.POLICIES}/pending`,
    )) as IPolicyApiResponse<IPolicy[]>;
    return response.data;
  },

  consentPolicy: async (id: number, data: IPolicyConsentRequest): Promise<string> => {
    const response = (await axiosClient.post(
      buildRoute(API_ENDPOINTS.POLICIES, id, 'consent'),
      data,
      { headers: { 'X-Silent-Loading': 'true' } },
    )) as IPolicyApiResponse<string>;
    return response.data;
  },

  // Admin APIs
  getAdminPolicies: async (): Promise<IPolicy[]> => {
    const response = (await axiosClient.get(API_ENDPOINTS.ADMIN.POLICIES)) as IPolicyApiResponse<
      IPolicy[]
    >;
    return response.data;
  },

  createPolicy: async (data: ICreatePolicyRequest): Promise<IPolicy> => {
    const response = (await axiosClient.post(
      API_ENDPOINTS.ADMIN.POLICIES,
      data,
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  updatePolicy: async ({
    id,
    data,
  }: {
    id: number;
    data: IUpdatePolicyRequest;
  }): Promise<IPolicy> => {
    const response = (await axiosClient.put(
      buildRoute(API_ENDPOINTS.ADMIN.POLICIES, id),
      data,
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  deactivatePolicy: async (id: number): Promise<IPolicy> => {
    const response = (await axiosClient.post(
      buildRoute(API_ENDPOINTS.ADMIN.POLICIES, id, 'deactivate'),
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  activatePolicy: async (id: number): Promise<IPolicy> => {
    const response = (await axiosClient.post(
      buildRoute(API_ENDPOINTS.ADMIN.POLICIES, id, 'activate'),
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },
};
