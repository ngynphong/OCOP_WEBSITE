import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { eventCommerceApi } from '@/features/events/api/eventCommerceApi';
import type {
  EventFlashSale,
  EventFlashSaleApplication,
  EventFlashSaleApplicationStatus,
  EventFlashSaleReviewInput,
  EventFlashSaleSlotInput,
} from '@/features/events/types/eventCommerceTypes';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';

export const EMPTY_FORM: EventFlashSaleSlotInput = {
  name: '',
  startTime: '',
  endTime: '',
};

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Bản nháp',
  SCHEDULED: 'Đã lên lịch',
  ACTIVE: 'Đang diễn ra',
  ENDED: 'Đã kết thúc',
  CANCELLED: 'Đã hủy',
  SUBMITTED: 'Chờ duyệt',
  CHANGES_REQUESTED: 'Cần chỉnh sửa',
  PARTIALLY_APPROVED: 'Duyệt một phần',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  WITHDRAWN: 'Đã rút',
};

export const toInputDateTime = (value: string) => (value ? value.slice(0, 16) : '');
export const formatDateTime = (value: string) => new Date(value).toLocaleString('vi-VN');
export const formatPrice = (value: number) => `${Number(value).toLocaleString('vi-VN')} đ`;

interface UseEventFlashSaleManagementProps {
  event: EventDetailResponse;
  onSlotsChange?: (slots: EventFlashSale[]) => void;
}

export function useEventFlashSaleManagement({
  event,
  onSlotsChange,
}: UseEventFlashSaleManagementProps) {
  const queryClient = useQueryClient();

  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState<EventFlashSaleSlotInput>(EMPTY_FORM);
  const [slotFilter, setSlotFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<EventFlashSaleApplicationStatus | undefined>();
  const [decisions, setDecisions] = useState<
    Record<number, EventFlashSaleReviewInput['items'][number]>
  >({});

  const flashSaleQuery = useQuery({
    queryKey: ['admin-event-flash-sales', event.id, slotFilter, statusFilter],
    queryFn: async () => {
      const [slotData, applicationData] = await Promise.all([
        eventCommerceApi.getAdminFlashSaleSlots(event.id),
        eventCommerceApi.getEventFlashSaleApplications(event.id, {
          slotId: slotFilter,
          status: statusFilter,
        }),
      ]);
      onSlotsChange?.(slotData);
      return { slots: slotData, applications: applicationData };
    },
    enabled: Boolean(event.id && Number.isInteger(event.id) && event.id > 0),
    staleTime: 15 * 1000,
  });

  const slots = useMemo(() => flashSaleQuery.data?.slots ?? [], [flashSaleQuery.data?.slots]);
  const applications = useMemo(
    () => flashSaleQuery.data?.applications ?? [],
    [flashSaleQuery.data?.applications],
  );
  const loading = flashSaleQuery.isLoading;

  const eventSlots = useMemo(() => slots.filter((slot) => !slot.legacy), [slots]);
  const legacySlots = useMemo(() => slots.filter((slot) => slot.legacy), [slots]);
  const pendingItems = useMemo(
    () =>
      applications.reduce(
        (total, application) =>
          total + application.items.filter((item) => item.status === 'PENDING').length,
        0,
      ),
    [applications],
  );

  const invalidateData = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-event-flash-sales', event.id] });
    queryClient.invalidateQueries({ queryKey: ['admin-event-commerce', event.id] });
    queryClient.invalidateQueries({ queryKey: ['admin-event-preview', event.id] });
  }, [queryClient, event.id]);

  const saveSlotMutation = useMutation({
    mutationFn: async (payload: EventFlashSaleSlotInput) => {
      if (editingSlotId) {
        return eventCommerceApi.updateFlashSaleSlot(event.id, editingSlotId, payload);
      }
      return eventCommerceApi.createFlashSaleSlot(event.id, payload);
    },
    onSuccess: () => {
      toast.success(editingSlotId ? 'Đã cập nhật khung giờ' : 'Đã tạo khung giờ Flash Sale');
      setShowSlotForm(false);
      setSlotForm(EMPTY_FORM);
      setEditingSlotId(null);
      invalidateData();
    },
  });

  const deleteSlotMutation = useMutation({
    mutationFn: (slotId: number) => eventCommerceApi.deleteFlashSaleSlot(event.id, slotId),
    onSuccess: () => {
      toast.success('Đã xóa khung giờ');
      invalidateData();
    },
  });

  const unlinkLegacyMutation = useMutation({
    mutationFn: (flashSaleId: number) => eventCommerceApi.unlinkFlashSale(event.id, flashSaleId),
    onSuccess: () => {
      toast.success('Đã gỡ liên kết legacy');
      invalidateData();
    },
  });

  const reviewApplicationMutation = useMutation({
    mutationFn: ({
      applicationId,
      items,
    }: {
      applicationId: number;
      items: EventFlashSaleReviewInput['items'];
    }) => eventCommerceApi.reviewEventFlashSaleApplication(applicationId, { items }),
    onSuccess: () => {
      toast.success('Đã lưu kết quả xét duyệt');
      setDecisions({});
      invalidateData();
    },
  });

  const openCreateForm = () => {
    setEditingSlotId(null);
    setSlotForm({
      ...EMPTY_FORM,
      startTime: toInputDateTime(event.startAt),
      endTime: toInputDateTime(event.endAt),
      sortOrder: eventSlots.length,
    });
    setShowSlotForm(true);
  };

  const openEditForm = (slot: EventFlashSale) => {
    setEditingSlotId(slot.id);
    setSlotForm({
      name: slot.name,
      bannerUrl: slot.bannerUrl,
      startTime: toInputDateTime(slot.startTime),
      endTime: toInputDateTime(slot.endTime),
      sortOrder: slot.sortOrder,
    });
    setShowSlotForm(true);
  };

  const saveSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...slotForm,
      startTime: `${slotForm.startTime}:00`,
      endTime: `${slotForm.endTime}:00`,
    };
    await saveSlotMutation.mutateAsync(payload);
  };

  const deleteSlot = async (slot: EventFlashSale) => {
    if (!confirm(`Xóa khung giờ “${slot.name}”?`)) return;
    await deleteSlotMutation.mutateAsync(slot.id);
  };

  const unlinkLegacy = async (slot: EventFlashSale) => {
    if (!confirm(`Gỡ Flash Sale legacy “${slot.name}” khỏi sự kiện?`)) return;
    await unlinkLegacyMutation.mutateAsync(slot.flashSaleId);
  };

  const setDecision = (
    itemId: number,
    decision: EventFlashSaleReviewInput['items'][number]['decision'],
  ) => {
    setDecisions((current) => ({
      ...current,
      [itemId]: { applicationItemId: itemId, decision, note: current[itemId]?.note },
    }));
  };

  const reviewApplication = async (application: EventFlashSaleApplication) => {
    const reviewable = application.items.filter((item) => item.status === 'PENDING');
    const selected = reviewable.map((item) => decisions[item.id]).filter(Boolean);
    if (selected.length !== reviewable.length) {
      toast.error('Vui lòng chọn quyết định cho tất cả sản phẩm đang chờ duyệt');
      return;
    }
    await reviewApplicationMutation.mutateAsync({
      applicationId: application.id,
      items: selected,
    });
  };

  return {
    slots,
    applications,
    loading,
    saving:
      saveSlotMutation.isPending ||
      deleteSlotMutation.isPending ||
      unlinkLegacyMutation.isPending ||
      reviewApplicationMutation.isPending,
    editingSlotId,
    showSlotForm,
    setShowSlotForm,
    slotForm,
    setSlotForm,
    slotFilter,
    setSlotFilter,
    statusFilter,
    setStatusFilter,
    decisions,
    setDecision,
    eventSlots,
    legacySlots,
    pendingItems,
    openCreateForm,
    openEditForm,
    saveSlot,
    deleteSlot,
    unlinkLegacy,
    reviewApplication,
    refresh: () => void flashSaleQuery.refetch(),
  };
}
