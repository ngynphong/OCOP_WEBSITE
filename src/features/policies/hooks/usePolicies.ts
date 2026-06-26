import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { policiesApi } from '../api/policiesApi';
import {
  ICreatePolicyRequest,
  IUpdatePolicyRequest,
  IPolicyConsentRequest,
} from '../types/policies';

const POLICIES_KEYS = {
  all: ['policies'] as const,
  admin: () => [...POLICIES_KEYS.all, 'admin'] as const,
  pending: () => [...POLICIES_KEYS.all, 'pending'] as const,
  detail: (id: number) => [...POLICIES_KEYS.all, 'detail', id] as const,
  detailBySlug: (slug: string) => [...POLICIES_KEYS.all, 'detail-slug', slug] as const,
};

// ========================
// PUBLIC / USER HOOKS
// ========================

export const usePolicyDetail = (id: number, enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.detail(id),
    queryFn: () => policiesApi.getPolicy(id),
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const usePolicyDetailBySlug = (slug: string, enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.detailBySlug(slug),
    queryFn: () => policiesApi.getPolicyBySlug(slug),
    enabled: !!slug && enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1, // Don't retry too much if 404
  });
};

export const usePendingPolicies = (enabled = true) => {
  return useQuery({
    queryKey: POLICIES_KEYS.pending(),
    queryFn: policiesApi.getPendingPolicies,
    enabled,
    staleTime: 1000 * 60 * 5, // 5 mins
  });
};

export const useConsentPolicy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: IPolicyConsentRequest }) =>
      policiesApi.consentPolicy(id, data),
    onSuccess: () => {
      // Invalidate pending policies so it refetches and removes the accepted one
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.pending() });
    },
  });
};

// ========================
// ADMIN HOOKS
// ========================

export const useAdminPolicies = () => {
  return useQuery({
    queryKey: POLICIES_KEYS.admin(),
    queryFn: policiesApi.getAdminPolicies,
    staleTime: 1000 * 60 * 2, // 2 mins
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
      // If we activate a policy, it might affect pending policies for the current user
      queryClient.invalidateQueries({ queryKey: POLICIES_KEYS.pending() });
    },
  });
};
