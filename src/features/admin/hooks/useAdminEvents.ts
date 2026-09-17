'use client';

import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventApi } from '@/features/events/api/eventApi';
import type { EventResponse, CampaignEventStatus } from '@/features/events/types/eventTypes';
import toast from 'react-hot-toast';

export interface AdminEventsQueryParams {
  status?: CampaignEventStatus;
  page?: number;
  size?: number;
}

// ─── Standalone Query Hook ──────────────────────────────────────────────────

export function useAdminEventsQuery(params: AdminEventsQueryParams = {}) {
  const { status, page = 0, size = 50 } = params;

  return useQuery({
    queryKey: ['admin-events', { status, page, size }],
    queryFn: async () => {
      const res = await eventApi.getAdminEvents({
        status,
        page,
        size,
      });
      return res.items || [];
    },
    staleTime: 30 * 1000,
  });
}

// ─── Mutation Hooks ─────────────────────────────────────────────────────────

export function useAdminEventMutations() {
  const queryClient = useQueryClient();

  const invalidateEventQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-events'] });
    queryClient.invalidateQueries({ queryKey: ['admin-event-detail'] });
  };

  const publishMutation = useMutation({
    mutationFn: (id: number) => eventApi.publishEvent(id),
    onSuccess: (data) => {
      toast.success(`Xuất bản sự kiện "${data.name}" thành công!`);
      invalidateEventQueries();
    },
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => eventApi.pauseEvent(id),
    onSuccess: (data) => {
      toast.success(`Đã tạm dừng sự kiện "${data.name}"!`);
      invalidateEventQueries();
    },
  });

  const cloneMutation = useMutation({
    mutationFn: (id: number) => eventApi.cloneEvent(id),
    onSuccess: () => {
      toast.success('Nhân bản sự kiện thành công!');
      invalidateEventQueries();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => eventApi.deleteEvent(id),
    onSuccess: () => {
      toast.success('Đã xóa sự kiện thành công!');
      invalidateEventQueries();
    },
  });

  return {
    publishMutation,
    pauseMutation,
    cloneMutation,
    deleteMutation,
    invalidateEventQueries,
  };
}

// ─── Presentation Management Hook ───────────────────────────────────────────

export function useAdminEventsManagement() {
  const [statusFilter, setStatusFilter] = useState<CampaignEventStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const queryParams = useMemo<AdminEventsQueryParams>(() => {
    return {
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      page: 0,
      size: 50,
    };
  }, [statusFilter]);

  const { data: rawEvents = [], isLoading, isError, refetch } = useAdminEventsQuery(queryParams);
  const mutations = useAdminEventMutations();

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: async () => {},
  });

  const [isActionLoading, setIsActionLoading] = useState(false);

  // Filtered Events
  const events = useMemo<EventResponse[]>(() => {
    if (!searchQuery.trim()) return rawEvents;
    const q = searchQuery.toLowerCase().trim();
    return rawEvents.filter(
      (ev) =>
        ev.name.toLowerCase().includes(q) ||
        ev.code.toLowerCase().includes(q) ||
        (ev.slug && ev.slug.toLowerCase().includes(q)),
    );
  }, [rawEvents, searchQuery]);

  const handlePublish = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xuất bản sự kiện',
      message: `Bạn có chắc chắn muốn xuất bản sự kiện "${name}"? Sự kiện sẽ được kích hoạt công khai trên toàn hệ sinh thái.`,
      confirmText: 'Xuất bản ngay',
      cancelText: 'Hủy bỏ',
      type: 'warning',
      onConfirm: async () => {
        try {
          setIsActionLoading(true);
          await mutations.publishMutation.mutateAsync(id);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const handlePause = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Tạm dừng sự kiện',
      message: `Bạn có chắc muốn tạm dừng sự kiện "${name}"? Sự kiện sẽ chuyển sang trạng thái tạm dừng và không còn hiển thị công khai.`,
      confirmText: 'Tạm dừng',
      cancelText: 'Hủy bỏ',
      type: 'warning',
      onConfirm: async () => {
        try {
          setIsActionLoading(true);
          await mutations.pauseMutation.mutateAsync(id);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const handleClone = async (id: number) => {
    await mutations.cloneMutation.mutateAsync(id);
  };

  const handleDelete = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'Xóa sự kiện',
      message: `Hành động này không thể hoàn tác! Bạn có chắc chắn muốn xóa vĩnh viễn sự kiện "${name}" khỏi hệ thống?`,
      confirmText: 'Xóa sự kiện',
      cancelText: 'Giữ lại',
      type: 'danger',
      onConfirm: async () => {
        try {
          setIsActionLoading(true);
          await mutations.deleteMutation.mutateAsync(id);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        } finally {
          setIsActionLoading(false);
        }
      },
    });
  };

  const closeConfirmModal = () => {
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    events,
    rawEvents,
    loading: isLoading,
    isError,
    refetch,
    fetchEvents: () => void refetch(),
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    confirmModal,
    closeConfirmModal,
    isActionLoading:
      isActionLoading ||
      mutations.publishMutation.isPending ||
      mutations.pauseMutation.isPending ||
      mutations.cloneMutation.isPending ||
      mutations.deleteMutation.isPending,
    handlePublish,
    handlePause,
    handleClone,
    handleDelete,
  };
}
