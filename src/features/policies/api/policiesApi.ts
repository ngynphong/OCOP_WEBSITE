import { axiosClient } from '@/lib/axios';
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
    const response = (await axiosClient.get(`/policies/${id}`)) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  getPendingPolicies: async (): Promise<IPolicy[]> => {
    const response = (await axiosClient.get('/policies/pending')) as IPolicyApiResponse<IPolicy[]>;
    return response.data;
  },

  consentPolicy: async (id: number, data: IPolicyConsentRequest): Promise<string> => {
    const response = (await axiosClient.post(
      `/policies/${id}/consent`,
      data,
    )) as IPolicyApiResponse<string>;
    return response.data;
  },

  // Admin APIs
  getAdminPolicies: async (): Promise<IPolicy[]> => {
    const response = (await axiosClient.get('/admin/policies')) as IPolicyApiResponse<IPolicy[]>;
    return response.data;
  },

  createPolicy: async (data: ICreatePolicyRequest): Promise<IPolicy> => {
    const response = (await axiosClient.post(
      '/admin/policies',
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
      `/admin/policies/${id}`,
      data,
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  deactivatePolicy: async (id: number): Promise<IPolicy> => {
    const response = (await axiosClient.post(
      `/admin/policies/${id}/deactivate`,
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },

  activatePolicy: async (id: number): Promise<IPolicy> => {
    const response = (await axiosClient.post(
      `/admin/policies/${id}/activate`,
    )) as IPolicyApiResponse<IPolicy>;
    return response.data;
  },
};
