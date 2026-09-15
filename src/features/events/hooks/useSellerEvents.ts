'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { sellerEventApi } from '../api/sellerEventApi';
import type { EventFlashSaleApplicationInput } from '../types/eventCommerceTypes';

export const sellerEventKeys = {
  all: ['seller-events'] as const,
  detail: (eventId: number) => ['seller-events', eventId] as const,
};

export function useSellerEvents() {
  return useQuery({
    queryKey: sellerEventKeys.all,
    queryFn: sellerEventApi.getEvents,
    staleTime: 30_000,
  });
}

export function useSellerEvent(eventId: number) {
  return useQuery({
    queryKey: sellerEventKeys.detail(eventId),
    queryFn: () => sellerEventApi.getEvent(eventId),
    enabled: eventId > 0,
    staleTime: 15_000,
  });
}

export function useSellerEventMutations(eventId: number) {
  const queryClient = useQueryClient();
  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.all }),
      queryClient.invalidateQueries({ queryKey: sellerEventKeys.detail(eventId) }),
    ]);
  };
  const create = useMutation({
    mutationFn: (data: EventFlashSaleApplicationInput) =>
      sellerEventApi.createApplication(eventId, data),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: EventFlashSaleApplicationInput }) =>
      sellerEventApi.updateApplication(id, data),
    onSuccess: invalidate,
  });
  const submit = useMutation({
    mutationFn: sellerEventApi.submitApplication,
    onSuccess: invalidate,
  });
  const withdraw = useMutation({
    mutationFn: sellerEventApi.withdrawApplication,
    onSuccess: invalidate,
  });
  return {
    create,
    update,
    submit,
    withdraw,
    isPending: create.isPending || update.isPending || submit.isPending || withdraw.isPending,
  };
}
