import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesApi } from '../api/policiesApi';
import {
  ICreatePolicyRequest,
  IUpdatePolicyRequest,
  IPolicyConsentRequest,
  IPolicyBatchConsentRequest,
} from '../types/policies';

const POLICIES_KEYS = {
  all: ['policies'] as const,
  admin: () => [...POLICIES_KEYS.all, 'admin'] as const,
  pending: () => [...POLICIES_KEYS.all, 'pending'] as const,
  registration: () => [...POLICIES_KEYS.all, 'registration'] as const,
  detail: (id: number) => [...POLICIES_KEYS.all, 'detail', id] as const,
  detailBySlug: (slug: string) => [...POLICIES_KEYS.all, 'detail-slug', slug] as const,
};

export const usePolicyDetail = (id: number, enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.detail(id),
    queryFn: () => policiesApi.getPolicy(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePolicyDetailBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.detailBySlug(slug),
    queryFn: () => policiesApi.getPolicyBySlug(slug),
    enabled: !!slug && enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const usePendingPolicies = (enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.pending(),
    queryFn: policiesApi.getPendingPolicies,
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};

export const useRegistrationPolicies = (enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.registration(),
    queryFn: policiesApi.getRegistrationPolicies,
    enabled,
    staleTime: 1000 * 60,
  });
};

export const useConsentPolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IPolicyConsentRequest }) =>
      policiesApi.consentPolicy(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.pending() });
    },
  });
};

export const useConsentRequiredPolicies = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: IPolicyBatchConsentRequest) => policiesApi.consentRequiredPolicies(data),
    onSuccess: () => {
      queryClient.setQueryData(POLICIES_KEYS.pending(), []);
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.pending() });
    },
  });
};

export const useAdminPolicies = () => {
  return useQuery({
    queryKey: POLICIES_KEYS.admin(),
    queryFn: policiesApi.getAdminPolicies,
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ICreatePolicyRequest) => policiesApi.createPolicy(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.admin() });
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IUpdatePolicyRequest }) =>
      policiesApi.updatePolicy({ id, data }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.detail(variables.id) });
    },
  });
};

export const useDeactivatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => policiesApi.deactivatePolicy(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.detail(id) });
    },
  });
};

export const useActivatePolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => policiesApi.activatePolicy(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.admin() });
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.detail(id) });
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.pending() });
    },
  });
};
