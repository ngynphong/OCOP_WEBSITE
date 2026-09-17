import { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { eventCommerceApi } from '@/features/events/api/eventCommerceApi';
import type {
  EventCollection,
  EventFlashSale,
  EventVoucher,
} from '@/features/events/types/eventCommerceTypes';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';
import type { Voucher, VoucherFormValues } from '@/features/vouchers/types';
import { useAdminVouchers, useAdminVoucherMutations } from '@/features/vouchers/hooks/useVouchers';
import type { EventResourceOption } from '../components/events/EventResourcePicker';

export const VOUCHER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  PAUSED: 'Tạm dừng',
  EXPIRED: 'Đã hết hạn',
  USED_UP: 'Đã hết lượt',
};

export const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

export const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

export const getVoucherDiscountLabel = (voucher: Voucher) => {
  if (voucher.type === 'FREE_SHIPPING') return 'Miễn phí vận chuyển';
  if (voucher.type === 'PERCENT') {
    const maxDiscount = voucher.maxDiscount
      ? `, tối đa ${formatCurrency(voucher.maxDiscount)}`
      : '';
    return `Giảm ${voucher.discountValue}%${maxDiscount}`;
  }
  return `Giảm ${formatCurrency(voucher.discountValue)}`;
};

export function useEventCommerceQuery(eventId: number) {
  return useQuery({
    queryKey: ['admin-event-commerce', eventId],
    queryFn: async () => {
      const [collections, flashSales, vouchers] = await Promise.all([
        eventCommerceApi.getAdminCollections(eventId),
        eventCommerceApi.getAdminFlashSales(eventId),
        eventCommerceApi.getAdminVouchers(eventId),
      ]);
      return { collections, flashSales, vouchers };
    },
    enabled: Boolean(eventId && Number.isInteger(eventId) && eventId > 0),
    staleTime: 15 * 1000,
  });
}

export function useEventCommerceManagement(event: EventDetailResponse) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'collections' | 'flashSales' | 'vouchers'>(
    'collections',
  );

  const commerceQuery = useEventCommerceQuery(event.id);
  const collections: EventCollection[] = useMemo(
    () => commerceQuery.data?.collections ?? [],
    [commerceQuery.data?.collections],
  );
  const flashSales: EventFlashSale[] = useMemo(
    () => commerceQuery.data?.flashSales ?? [],
    [commerceQuery.data?.flashSales],
  );
  const vouchers: EventVoucher[] = useMemo(
    () => commerceQuery.data?.vouchers ?? [],
    [commerceQuery.data?.vouchers],
  );
  const loading = commerceQuery.isLoading;

  // Selected collection
  const [selectedColId, setSelectedColId] = useState<number | null>(null);

  // Auto pick first collection if none selected or deleted
  const effectiveSelectedColId = useMemo(() => {
    if (selectedColId !== null && collections.some((c) => c.id === selectedColId)) {
      return selectedColId;
    }
    return collections[0]?.id || null;
  }, [collections, selectedColId]);

  // Form states for creating collection
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  // Product Picker state
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [reorderingProductId, setReorderingProductId] = useState<number | null>(null);

  // Voucher state
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [isVoucherDrawerOpen, setIsVoucherDrawerOpen] = useState(false);
  const { createVoucher } = useAdminVoucherMutations();
  const voucherOptionsQuery = useAdminVouchers(1, 100, activeTab === 'vouchers');

  const invalidateCommerce = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['admin-event-commerce', event.id] });
    queryClient.invalidateQueries({ queryKey: ['admin-event-preview', event.id] });
  }, [queryClient, event.id]);

  // Mutations
  const createCollectionMutation = useMutation({
    mutationFn: (data: { name: string; description?: string; sortOrder: number }) =>
      eventCommerceApi.createCollection(event.id, data),
    onSuccess: (created) => {
      toast.success('Tạo bộ sưu tập thành công');
      setNewCollectionName('');
      setNewCollectionDesc('');
      setSelectedColId(created.id);
      invalidateCommerce();
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: (colId: number) => eventCommerceApi.deleteCollection(event.id, colId),
    onSuccess: () => {
      toast.success('Đã xóa bộ sưu tập');
      invalidateCommerce();
    },
  });

  const addProductsMutation = useMutation({
    mutationFn: ({ colId, ids }: { colId: number; ids: number[] }) =>
      eventCommerceApi.addProductsToCollection(event.id, colId, ids),
    onSuccess: (_, variables) => {
      toast.success(`Đã thêm ${variables.ids.length} sản phẩm vào bộ sưu tập`);
      setIsProductPickerOpen(false);
      invalidateCommerce();
    },
  });

  const removeProductMutation = useMutation({
    mutationFn: ({ colId, productId }: { colId: number; productId: number }) =>
      eventCommerceApi.removeProductFromCollection(event.id, colId, productId),
    onSuccess: () => {
      toast.success('Đã gỡ sản phẩm khỏi bộ sưu tập');
      invalidateCommerce();
    },
  });

  const reorderProductsMutation = useMutation({
    mutationFn: ({ colId, productIds }: { colId: number; productIds: number[] }) =>
      eventCommerceApi.reorderCollectionProducts(event.id, colId, productIds),
    onSuccess: () => {
      invalidateCommerce();
    },
  });

  const linkVoucherMutation = useMutation({
    mutationFn: (data: { voucherId: number; sortOrder: number }) =>
      eventCommerceApi.linkVoucher(event.id, data),
    onSuccess: () => {
      toast.success('Liên kết Voucher thành công');
      setSelectedVoucherId(null);
      invalidateCommerce();
    },
  });

  const unlinkVoucherMutation = useMutation({
    mutationFn: (voucherId: number) => eventCommerceApi.unlinkVoucher(event.id, voucherId),
    onSuccess: () => {
      toast.success('Đã gỡ Voucher');
      invalidateCommerce();
    },
  });

  // Handlers
  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    await createCollectionMutation.mutateAsync({
      name: newCollectionName.trim(),
      description: newCollectionDesc.trim() || undefined,
      sortOrder: collections.length,
    });
  };

  const handleDeleteCollection = async (colId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) return;
    await deleteCollectionMutation.mutateAsync(colId);
  };

  const handleAddProducts = async (ids: number[]) => {
    if (!effectiveSelectedColId) return;
    if (ids.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }
    await addProductsMutation.mutateAsync({ colId: effectiveSelectedColId, ids });
  };

  const handleRemoveProduct = async (colId: number, productId: number) => {
    await removeProductMutation.mutateAsync({ colId, productId });
  };

  const handleMoveProduct = async (
    collection: EventCollection,
    productId: number,
    direction: -1 | 1,
  ) => {
    const currentIndex = collection.products.findIndex((product) => product.id === productId);
    const targetIndex = currentIndex + direction;
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= collection.products.length) return;

    const reorderedProducts = [...collection.products];
    [reorderedProducts[currentIndex], reorderedProducts[targetIndex]] = [
      reorderedProducts[targetIndex],
      reorderedProducts[currentIndex],
    ];

    try {
      setReorderingProductId(productId);
      await reorderProductsMutation.mutateAsync({
        colId: collection.id,
        productIds: reorderedProducts.map((p) => p.id),
      });
    } finally {
      setReorderingProductId(null);
    }
  };

  const handleLinkVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVoucherId) {
      toast.error('Vui lòng chọn một Voucher');
      return;
    }
    await linkVoucherMutation.mutateAsync({
      voucherId: selectedVoucherId,
      sortOrder: vouchers.length,
    });
  };

  const handleUnlinkVoucher = async (voucherId: number) => {
    if (!confirm('Gỡ Voucher này khỏi sự kiện?')) return;
    await unlinkVoucherMutation.mutateAsync(voucherId);
  };

  const handleCreateVoucherSubmit = (data: VoucherFormValues) => {
    createVoucher.mutate(data, {
      onSuccess: async (createdRes) => {
        setIsVoucherDrawerOpen(false);
        await voucherOptionsQuery.refetch();
        const newVoucher = createdRes?.data;
        if (newVoucher?.id) {
          setSelectedVoucherId(newVoucher.id);
        }
      },
    });
  };

  const voucherOptions = useMemo<EventResourceOption[]>(() => {
    const linkedIds = new Set(vouchers.map((voucher) => voucher.voucherId));
    const candidates = voucherOptionsQuery.data?.data?.content || [];

    return candidates.map((voucher: Voucher) => {
      const remainingUses = Math.max(0, voucher.usageLimit - voucher.usedCount);
      return {
        id: voucher.id,
        title: `${voucher.code} — ${voucher.name}`,
        badge: VOUCHER_STATUS_LABELS[voucher.status] || voucher.status,
        description: `${getVoucherDiscountLabel(voucher)} • Đơn tối thiểu ${formatCurrency(voucher.minOrderValue)} • Còn ${remainingUses.toLocaleString('vi-VN')} lượt • Hạn ${formatDateTime(voucher.expiredAt)}`,
        keywords: `${voucher.type} ${voucher.status} ${voucher.shopName || ''} ${voucher.id}`,
        disabled: linkedIds.has(voucher.id),
        disabledReason: linkedIds.has(voucher.id) ? 'Đã gán' : undefined,
      };
    });
  }, [voucherOptionsQuery.data, vouchers]);

  const currentCollection = collections.find((c) => c.id === effectiveSelectedColId);

  return {
    activeTab,
    setActiveTab,
    loading,
    collections,
    flashSales,
    vouchers,
    selectedColId: effectiveSelectedColId,
    setSelectedColId,
    currentCollection,
    newCollectionName,
    setNewCollectionName,
    newCollectionDesc,
    setNewCollectionDesc,
    isSubmittingCol: createCollectionMutation.isPending,
    isProductPickerOpen,
    setIsProductPickerOpen,
    isAddingProducts: addProductsMutation.isPending,
    reorderingProductId,
    selectedVoucherId,
    setSelectedVoucherId,
    isLinking: linkVoucherMutation.isPending,
    isVoucherDrawerOpen,
    setIsVoucherDrawerOpen,
    isCreatingVoucher: createVoucher.isPending,
    voucherOptions,
    isVoucherOptionsLoading: voucherOptionsQuery.isLoading,
    isVoucherOptionsError: voucherOptionsQuery.isError,
    refetchVoucherOptions: () => void voucherOptionsQuery.refetch(),
    handleCreateCollection,
    handleDeleteCollection,
    handleAddProducts,
    handleRemoveProduct,
    handleMoveProduct,
    handleLinkVoucher,
    handleUnlinkVoucher,
    handleCreateVoucherSubmit,
    refresh: () => void commerceQuery.refetch(),
  };
}
