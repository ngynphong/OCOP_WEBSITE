'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Trash2,
  Package,
  Zap,
  Ticket,
  ExternalLink,
  Loader2,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Eye,
} from 'lucide-react';
import { eventCommerceApi } from '@/features/events/api/eventCommerceApi';
import type {
  EventCollection,
  EventFlashSale,
  EventVoucher,
} from '@/features/events/types/eventCommerceTypes';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';
import type { Voucher, VoucherFormValues } from '@/features/vouchers/types';
import { useAdminVouchers, useAdminVoucherMutations } from '@/features/vouchers/hooks/useVouchers';
import { VoucherFormDrawer } from '@/features/vouchers/components/VoucherFormDrawer';
import { EventResourcePicker, type EventResourceOption } from './EventResourcePicker';
import { EventProductPicker } from './EventProductPicker';
import { EventFlashSaleManagement } from './EventFlashSaleManagement';
import toast from 'react-hot-toast';

const VOUCHER_STATUS_LABELS: Record<string, string> = {
  ACTIVE: 'Đang hoạt động',
  PAUSED: 'Tạm dừng',
  EXPIRED: 'Đã hết hạn',
  USED_UP: 'Đã hết lượt',
};

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const formatCurrency = (value: number) => `${value.toLocaleString('vi-VN')} đ`;

const getVoucherDiscountLabel = (voucher: Voucher) => {
  if (voucher.type === 'FREE_SHIPPING') return 'Miễn phí vận chuyển';
  if (voucher.type === 'PERCENT') {
    const maxDiscount = voucher.maxDiscount
      ? `, tối đa ${formatCurrency(voucher.maxDiscount)}`
      : '';
    return `Giảm ${voucher.discountValue}%${maxDiscount}`;
  }
  return `Giảm ${formatCurrency(voucher.discountValue)}`;
};

interface EventCommerceManagementProps {
  event: EventDetailResponse;
}

export function EventCommerceManagement({ event }: EventCommerceManagementProps) {
  const [activeTab, setActiveTab] = useState<'collections' | 'flashSales' | 'vouchers'>(
    'collections',
  );
  const [loading, setLoading] = useState<boolean>(true);

  // Data states
  const [collections, setCollections] = useState<EventCollection[]>([]);
  const [flashSales, setFlashSales] = useState<EventFlashSale[]>([]);
  const [vouchers, setVouchers] = useState<EventVoucher[]>([]);

  // Form states for creating collection
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');
  const [isSubmittingCol, setIsSubmittingCol] = useState(false);

  // Form states for adding product to collection
  const [selectedColId, setSelectedColId] = useState<number | null>(null);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [reorderingProductId, setReorderingProductId] = useState<number | null>(null);

  // Form states for linking Voucher
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const [isVoucherDrawerOpen, setIsVoucherDrawerOpen] = useState(false);
  const { createVoucher } = useAdminVoucherMutations();

  const voucherOptionsQuery = useAdminVouchers(1, 100, activeTab === 'vouchers');

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

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [cols, fs, vcs] = await Promise.all([
        eventCommerceApi.getAdminCollections(event.id),
        eventCommerceApi.getAdminFlashSales(event.id),
        eventCommerceApi.getAdminVouchers(event.id),
      ]);
      setCollections(cols);
      setFlashSales(fs);
      setVouchers(vcs);
      setSelectedColId((currentId) =>
        cols.some((collection) => collection.id === currentId) ? currentId : cols[0]?.id || null,
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải dữ liệu thương mại';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [event.id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;

    try {
      setIsSubmittingCol(true);
      const created = await eventCommerceApi.createCollection(event.id, {
        name: newCollectionName.trim(),
        description: newCollectionDesc.trim() || undefined,
        sortOrder: collections.length,
      });
      toast.success('Tạo bộ sưu tập thành công');
      setNewCollectionName('');
      setNewCollectionDesc('');
      setCollections((prev) => [...prev, created]);
      setSelectedColId(created.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi tạo bộ sưu tập';
      toast.error(msg);
    } finally {
      setIsSubmittingCol(false);
    }
  };

  const handleDeleteCollection = async (colId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bộ sưu tập này?')) return;
    try {
      await eventCommerceApi.deleteCollection(event.id, colId);
      toast.success('Đã xóa bộ sưu tập');
      setCollections((prev) => prev.filter((c) => c.id !== colId));
      if (selectedColId === colId) {
        setSelectedColId(collections.find((c) => c.id !== colId)?.id || null);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi xóa bộ sưu tập';
      toast.error(msg);
    }
  };

  const handleAddProducts = async (ids: number[]) => {
    if (!selectedColId) return;

    if (ids.length === 0) {
      toast.error('Vui lòng chọn ít nhất một sản phẩm');
      return;
    }

    try {
      setIsAddingProducts(true);
      const updated = await eventCommerceApi.addProductsToCollection(event.id, selectedColId, ids);
      toast.success(`Đã thêm ${ids.length} sản phẩm vào bộ sưu tập`);
      setCollections((prev) => prev.map((c) => (c.id === selectedColId ? updated : c)));
      setIsProductPickerOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi thêm sản phẩm';
      toast.error(msg);
    } finally {
      setIsAddingProducts(false);
    }
  };

  const handleRemoveProduct = async (colId: number, productId: number) => {
    try {
      const updated = await eventCommerceApi.removeProductFromCollection(
        event.id,
        colId,
        productId,
      );
      toast.success('Đã gỡ sản phẩm khỏi bộ sưu tập');
      setCollections((prev) => prev.map((c) => (c.id === colId ? updated : c)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi gỡ sản phẩm';
      toast.error(msg);
    }
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
      const updated = await eventCommerceApi.reorderCollectionProducts(
        event.id,
        collection.id,
        reorderedProducts.map((product) => product.id),
      );
      setCollections((previous) =>
        previous.map((item) => (item.id === collection.id ? updated : item)),
      );
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể sắp xếp sản phẩm';
      toast.error(message);
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

    try {
      setIsLinking(true);
      const linked = await eventCommerceApi.linkVoucher(event.id, {
        voucherId: selectedVoucherId,
        sortOrder: vouchers.length,
      });
      toast.success('Liên kết Voucher thành công');
      setSelectedVoucherId(null);
      setVouchers((prev) => [...prev, linked]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi liên kết Voucher';
      toast.error(msg);
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkVoucher = async (voucherId: number) => {
    if (!confirm('Gỡ Voucher này khỏi sự kiện?')) return;
    try {
      await eventCommerceApi.unlinkVoucher(event.id, voucherId);
      toast.success('Đã gỡ Voucher');
      setVouchers((prev) => prev.filter((v) => v.voucherId !== voucherId));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi gỡ Voucher';
      toast.error(msg);
    }
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

  const currentCollection = collections.find((c) => c.id === selectedColId);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <Link
              href="/admin/events"
              className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
              aria-label="Quay lại danh sách sự kiện"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-gray-900 sm:text-2xl">
                  Quản lý thương mại sự kiện
                </h1>
                <span className="rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 font-mono text-xs font-semibold text-gray-700">
                  {event.code}
                </span>
                <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                  {event.status}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-gray-500">{event.name}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pl-[52px] lg:pl-0">
            <Link
              href={`/admin/events/${event.id}/preview`}
              className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-2xs transition hover:bg-gray-50"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Xem trước</span>
            </Link>
            <a
              href={`/events/${event.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-red-200/60 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 shadow-2xs transition hover:bg-red-100"
            >
              <span>Xem Landing Page</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-gray-100 bg-gray-50/70 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('collections')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-bold transition cursor-pointer ${
              activeTab === 'collections'
                ? 'border-red-600 text-red-600 bg-white rounded-t-lg -mb-[1px] shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Bộ Sưu Tập Sản Phẩm ({collections.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('flashSales')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-bold transition cursor-pointer ${
              activeTab === 'flashSales'
                ? 'border-red-600 text-red-600 bg-white rounded-t-lg -mb-[1px] shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Flash Sale Giờ Vàng ({flashSales.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vouchers')}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 text-sm font-bold transition cursor-pointer ${
              activeTab === 'vouchers'
                ? 'border-red-600 text-red-600 bg-white rounded-t-lg -mb-[1px] shadow-2xs'
                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
            }`}
          >
            <Ticket className="w-4 h-4" />
            <span>Mã Giảm Giá Voucher ({vouchers.length})</span>
          </button>
        </div>
      </section>

      <section className="relative z-10 overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="bg-white p-4 sm:p-6 lg:p-8">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-red-600 mb-2" />
              <p className="text-sm font-medium">Đang tải cấu hình thương mại...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: COLLECTIONS */}
              {activeTab === 'collections' && (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                  {/* Left Column: List & Add Collection */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 shadow-2xs">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                        Thêm Bộ Sưu Tập Mới
                      </h4>
                      <form onSubmit={handleCreateCollection} className="space-y-3">
                        <input
                          type="text"
                          placeholder="VD: Mâm Cỗ Ngày Tết..."
                          value={newCollectionName}
                          onChange={(e) => setNewCollectionName(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg text-xs bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 shadow-2xs"
                          required
                        />
                        <textarea
                          placeholder="Mô tả bộ sưu tập..."
                          value={newCollectionDesc}
                          onChange={(e) => setNewCollectionDesc(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 rounded-lg text-xs bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none shadow-2xs"
                        />
                        <button
                          type="submit"
                          disabled={isSubmittingCol}
                          className="w-full py-2 px-3 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
                        >
                          {isSubmittingCol ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Plus className="w-3.5 h-3.5" />
                          )}
                          <span>Tạo Bộ Sưu Tập</span>
                        </button>
                      </form>
                    </div>

                    {/* Collection List items */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Danh sách bộ sưu tập ({collections.length})
                      </h4>
                      {collections.length === 0 ? (
                        <p className="text-xs text-gray-400 italic py-2">Chưa có bộ sưu tập nào.</p>
                      ) : (
                        collections.map((col) => (
                          <div
                            key={col.id}
                            onClick={() => setSelectedColId(col.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                              selectedColId === col.id
                                ? 'bg-red-50/80 border-red-300 text-red-900 shadow-2xs'
                                : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-800'
                            }`}
                          >
                            <div className="truncate mr-2">
                              <p className="text-xs font-bold text-gray-900 truncate">{col.name}</p>
                              <p className="text-[11px] text-gray-500">
                                {col.products.length} sản phẩm
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCollection(col.id);
                              }}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                              title="Xóa bộ sưu tập"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right 2 Columns: Products in Selected Collection */}
                  <div className="min-w-0 space-y-4">
                    {currentCollection ? (
                      <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-2xs">
                        <div className="mb-4 flex flex-col gap-3 border-b border-gray-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <h3 className="text-sm font-bold text-gray-900">
                              {currentCollection.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {currentCollection.products.length} sản phẩm OCOP đang tham gia
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => setIsProductPickerOpen(true)}
                            disabled={isAddingProducts}
                            className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-bold text-white shadow-2xs transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {isAddingProducts ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                            <span>Chọn sản phẩm</span>
                          </button>
                        </div>

                        {/* Product list */}
                        {currentCollection.products.length === 0 ? (
                          <div className="py-12 text-center text-gray-400">
                            <Package className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                            <p className="text-xs font-medium text-gray-600">
                              Chưa có sản phẩm nào trong bộ sưu tập này.
                            </p>
                            <p className="mt-1 text-[11px] text-gray-400">
                              Dùng nút “Chọn sản phẩm” để tìm theo tên và thêm nhiều sản phẩm cùng
                              lúc.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {currentCollection.products.map((p, index) => (
                              <div
                                key={p.id}
                                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-200 bg-gray-50/50 hover:bg-amber-50/30 transition shadow-2xs"
                              >
                                <div className="flex min-w-0 items-center gap-3">
                                  <span
                                    role="img"
                                    aria-label={`Ảnh sản phẩm ${p.name}`}
                                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white bg-cover bg-center text-gray-300"
                                    style={
                                      p.mainImageUrl
                                        ? {
                                            backgroundImage: `url(${JSON.stringify(p.mainImageUrl)})`,
                                          }
                                        : undefined
                                    }
                                  >
                                    {!p.mainImageUrl && <Package className="h-5 w-5" />}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="flex min-w-0 items-center gap-2">
                                      <p className="max-w-sm truncate text-xs font-bold text-gray-900">
                                        {p.name}
                                      </p>
                                      {p.ocopStar && (
                                        <span className="shrink-0 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                                          OCOP {p.ocopStar}★
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] text-gray-500">
                                      <span>ID: {p.id}</span>
                                      <span>•</span>
                                      <span className="text-red-600 font-bold">
                                        {p.minPrice.toLocaleString('vi-VN')} đ
                                      </span>
                                      {p.provinceName && <span>• {p.provinceName}</span>}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleMoveProduct(currentCollection, p.id, -1)
                                    }
                                    disabled={index === 0 || reorderingProductId !== null}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Đưa sản phẩm lên"
                                    aria-label={`Đưa ${p.name} lên`}
                                  >
                                    {reorderingProductId === p.id ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      void handleMoveProduct(currentCollection, p.id, 1)
                                    }
                                    disabled={
                                      index === currentCollection.products.length - 1 ||
                                      reorderingProductId !== null
                                    }
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Đưa sản phẩm xuống"
                                    aria-label={`Đưa ${p.name} xuống`}
                                  >
                                    <ArrowDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(currentCollection.id, p.id)}
                                    disabled={reorderingProductId !== null}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                                    title="Gỡ sản phẩm"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="py-20 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <p className="text-xs font-medium text-gray-600">
                          Chọn hoặc tạo mới một bộ sưu tập ở cột bên trái để quản lý sản phẩm.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: FLASH SALES */}
              {activeTab === 'flashSales' && (
                <EventFlashSaleManagement event={event} onSlotsChange={setFlashSales} />
              )}

              {/* TAB 3: VOUCHERS */}
              {activeTab === 'vouchers' && (
                <div className="space-y-6">
                  {/* Link Form */}
                  <form
                    onSubmit={handleLinkVoucher}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-end gap-3 shadow-2xs"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <label className="block text-xs font-bold uppercase text-gray-700">
                          Gán mã Voucher vào sự kiện
                        </label>
                        <button
                          type="button"
                          onClick={() => setIsVoucherDrawerOpen(true)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tạo nhanh Voucher</span>
                        </button>
                      </div>
                      <p className="mb-2 text-[11px] text-gray-500">
                        Tìm theo mã, tên Voucher, mức giảm hoặc trạng thái.
                      </p>
                      <EventResourcePicker
                        value={selectedVoucherId}
                        onChange={setSelectedVoucherId}
                        options={voucherOptions}
                        placeholder="Chọn Voucher áp dụng"
                        searchPlaceholder="Tìm mã hoặc tên Voucher..."
                        emptyMessage="Chưa có Voucher nào trong hệ thống."
                        noResultsMessage="Không tìm thấy Voucher phù hợp."
                        icon={<Ticket className="h-4 w-4" />}
                        accent="red"
                        isLoading={voucherOptionsQuery.isLoading}
                        isError={voucherOptionsQuery.isError}
                        disabled={isLinking}
                        onRetry={() => void voucherOptionsQuery.refetch()}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={
                        isLinking ||
                        !selectedVoucherId ||
                        voucherOptionsQuery.isLoading ||
                        voucherOptionsQuery.isError
                      }
                      className="h-12 w-full sm:w-auto py-2 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 shadow-2xs"
                    >
                      {isLinking ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Ticket className="w-3.5 h-3.5" />
                      )}
                      <span>Gán Voucher</span>
                    </button>
                  </form>

                  {/* Vouchers list */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600">
                        Các Voucher chiến dịch đã gán ({vouchers.length})
                      </h4>
                      {vouchers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setIsVoucherDrawerOpen(true)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tạo thêm Voucher</span>
                        </button>
                      )}
                    </div>

                    {vouchers.length === 0 ? (
                      <div className="py-12 text-center text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                        <Ticket className="w-8 h-8 mx-auto mb-1 text-red-500" />
                        <p className="text-xs font-medium text-gray-600">
                          Chưa có mã Voucher nào được gán vào sự kiện này.
                        </p>
                        <button
                          type="button"
                          onClick={() => setIsVoucherDrawerOpen(true)}
                          className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition cursor-pointer"
                        >
                          <Plus className="w-4 h-4" />
                          <span>Tạo nhanh Voucher</span>
                        </button>
                      </div>
                    ) : (
                      vouchers.map((v) => (
                        <div
                          key={v.id}
                          className="flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-white shadow-2xs"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                                {v.code}
                              </span>
                              <span className="text-xs font-bold text-gray-900">- {v.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              ID: {v.voucherId} • Giảm {v.discountValue} (Đơn tối thiểu{' '}
                              {v.minOrderValue.toLocaleString('vi-VN')} đ)
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleUnlinkVoucher(v.voucherId)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                            title="Gỡ khỏi sự kiện"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-1.5 border-t border-gray-200 bg-gray-50 px-5 py-3.5 text-xs text-gray-600 sm:px-6">
          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              Tự động cập nhật đồng bộ với Landing Page và Trang chủ khi sự kiện kích hoạt
            </span>
          </div>
        </div>
      </section>

      {currentCollection && isProductPickerOpen && (
        <EventProductPicker
          isOpen={isProductPickerOpen}
          collectionName={currentCollection.name}
          linkedProductIds={currentCollection.products.map((product) => product.id)}
          isSubmitting={isAddingProducts}
          onClose={() => setIsProductPickerOpen(false)}
          onConfirm={handleAddProducts}
        />
      )}

      <VoucherFormDrawer
        isOpen={isVoucherDrawerOpen}
        onClose={() => setIsVoucherDrawerOpen(false)}
        onSubmit={handleCreateVoucherSubmit}
        isLoading={createVoucher.isPending}
      />
    </div>
  );
}
