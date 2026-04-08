import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

import { adminApi } from '../api/adminApi';
import { CreateSubscriptionPlanRequest, UpdateSubscriptionPlanRequest } from '../types/adminTypes';

const SUBSCRIPTION_PLANS_QUERY_KEY = ['admin-subscription-plans'] as const;

// ─── Standalone Query Hook ─────────────────────────────────────────────────────

export const useSubscriptionPlansQuery = () => {
  return useQuery({
    queryKey: SUBSCRIPTION_PLANS_QUERY_KEY,
    queryFn: () => adminApi.getSubscriptionPlans(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubscriptionPlanQuery = (planId: string | null | undefined) => {
  return useQuery({
    queryKey: ['admin-subscription-plan', planId],
    queryFn: () => adminApi.getSubscriptionPlanDetail(planId!),
    enabled: !!planId,
    staleTime: 60 * 1000,
  });
};

// ─── Mutation Hook ─────────────────────────────────────────────────────────────

export const useAdminSubscriptionMutations = () => {
  const queryClient = useQueryClient();

  const createSubscriptionPlanMutation = useMutation({
    mutationFn: (data: CreateSubscriptionPlanRequest) => adminApi.createSubscriptionPlan(data),
    onSuccess: () => {
      toast.success('Tạo gói dịch vụ thành công');
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_PLANS_QUERY_KEY });
    },
  });

  const updateSubscriptionPlanMutation = useMutation({
    mutationFn: ({ planId, data }: { planId: string; data: UpdateSubscriptionPlanRequest }) =>
      adminApi.updateSubscriptionPlan(planId, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật gói dịch vụ thành công');
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plan', variables.planId] });
    },
  });

  const toggleSubscriptionPlanMutation = useMutation({
    mutationFn: (planId: string) => adminApi.toggleSubscriptionPlan(planId),
    onSuccess: (response, planId) => {
      const plan = response?.data;
      const statusLabel = plan?.isActive ? 'kích hoạt' : 'vô hiệu hóa';
      toast.success(`Đã ${statusLabel} gói "${plan?.name ?? ''}"`);
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_PLANS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-subscription-plan', planId] });
    },
  });

  return {
    createSubscriptionPlan: createSubscriptionPlanMutation.mutateAsync,
    isCreatingPlan: createSubscriptionPlanMutation.isPending,
    updateSubscriptionPlan: updateSubscriptionPlanMutation.mutateAsync,
    isUpdatingPlan: updateSubscriptionPlanMutation.isPending,
    toggleSubscriptionPlan: toggleSubscriptionPlanMutation.mutateAsync,
    isTogglingPlan: toggleSubscriptionPlanMutation.isPending,
  };
};

/**
 * @deprecated Dùng `useSubscriptionPlansQuery` và `useAdminSubscriptionMutations` riêng lẻ.
 */
export const useAdminSubscriptions = () => useAdminSubscriptionMutations();
