'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  PackagePlus,
  Plus,
  Search,
  Send,
  Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';
import { useSellerEvent, useSellerEventMutations } from '@/features/events/hooks/useSellerEvents';
import { useSellerProductsQuery } from '@/features/products/hooks/useSellerProducts';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';
import type { Product, ProductVariant } from '@/features/products/types/productTypes';
import type { EventFlashSaleApplication } from '@/features/events/types/eventCommerceTypes';

type DraftItem = {
  variantId: number;
  productId: number;
  productName: string;
  variantName: string;
  originalPrice: number;
  availableQty: number;
  salePrice: number;
  qtyLimit: number;
  thumbnailUrl?: string;
};

export interface StatusMeta {
  label: string;
  badgeClass: string;
  dotClass: string;
}

export const STATUS_CONFIG: Record<string, StatusMeta> = {
  DRAFT: {
    label: 'Bản nháp',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    dotClass: 'bg-slate-400',
  },
  SUBMITTED: {
    label: 'Đang chờ duyệt',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  PENDING: {
    label: 'Chờ duyệt',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClass: 'bg-blue-500',
  },
  CHANGES_REQUESTED: {
    label: 'Cần chỉnh sửa',
    badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    dotClass: 'bg-amber-500',
  },
  PARTIALLY_APPROVED: {
    label: 'Duyệt một phần',
    badgeClass: 'bg-teal-50 text-teal-800 border-teal-200',
    dotClass: 'bg-teal-500',
  },
  APPROVED: {
    label: 'Đã duyệt',
    badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  REJECTED: {
    label: 'Bị từ chối',
    badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    dotClass: 'bg-rose-500',
  },
  WITHDRAWN: {
    label: 'Đã rút',
    badgeClass: 'bg-gray-100 text-gray-600 border-gray-200',
    dotClass: 'bg-gray-400',
  },
};

const STATUS_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_CONFIG).map(([k, v]) => [k, v.label]),
);

export function StatusBadge({
  status,
  size = 'sm',
  showDot = false,
}: {
  status: string;
  size?: 'xs' | 'sm' | 'md';
  showDot?: boolean;
}) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    badgeClass: 'bg-gray-100 text-gray-700 border-gray-200',
    dotClass: 'bg-gray-400',
  };

  const sizeClasses = {
    xs: 'px-2 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-bold ${config.badgeClass} ${sizeClasses}`}
    >
      {showDot && <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${config.dotClass}`} />}
      {config.label}
    </span>
  );
}

export default function SellerEventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const eventId = Number(id);
  const { data: event, isLoading, isError, refetch } = useSellerEvent(eventId);
  const mutations = useSellerEventMutations(eventId);
  const [selectedSlotId, setSelectedSlotId] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [loadingVariants, setLoadingVariants] = useState(false);
  const [items, setItems] = useState<DraftItem[]>([]);
  const [sellerNote, setSellerNote] = useState('');

  const { data: productResponse, isLoading: productsLoading } = useSellerProductsQuery({
    pageNo: 1,
    pageSize: 30,
    status: 'APPROVED',
    search: debouncedSearch || undefined,
  });
  const products = (productResponse?.data?.items || []) as Product[];
  const eligibleProducts = useMemo(
    () => products.filter((product) => !event || (product.ocopStar || 0) >= event.minOcopStar),
    [event, products],
  );
  const selectedApplication = event?.applications.find(
    (application) => application.eventFlashSaleId === selectedSlotId,
  );

  useEffect(() => {
    if (!selectedSlotId && event?.slots.length) setSelectedSlotId(event.slots[0].id);
  }, [event, selectedSlotId]);

  useEffect(() => {
    if (
      !selectedApplication ||
      !['DRAFT', 'CHANGES_REQUESTED'].includes(selectedApplication.status)
    ) {
      setItems([]);
      setSellerNote('');
      return;
    }
    setSellerNote(selectedApplication.sellerNote || '');
    setItems(
      selectedApplication.items.map((item) => ({
        variantId: item.variantId,
        productId: item.productId,
        productName: item.productName,
        variantName: item.variantName || item.sku || `Variant #${item.variantId}`,
        originalPrice: item.originalPrice,
        availableQty: item.availableQty,
        salePrice: item.salePrice,
        qtyLimit: item.qtyLimit,
        thumbnailUrl: item.thumbnailUrl,
      })),
    );
  }, [selectedApplication]);

  const openProduct = async (product: Product) => {
    if (expandedProductId === product.id) {
      setExpandedProductId(null);
      return;
    }
    try {
      setExpandedProductId(product.id);
      setLoadingVariants(true);
      const response = await sellerProductApi.getVariants(product.id);
      setVariants(response.data || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải biến thể');
    } finally {
      setLoadingVariants(false);
    }
  };

  const addVariant = (product: Product, variant: ProductVariant) => {
    if (!event || items.some((item) => item.variantId === variant.id)) return;
    if (
      new Set([...items.map((item) => item.productId), product.id]).size > event.maxProductsPerShop
    ) {
      toast.error(`Sự kiện giới hạn ${event.maxProductsPerShop} sản phẩm cho mỗi shop`);
      return;
    }
    const suggestedPrice = Math.floor((variant.price * (100 - event.minDiscountPercent)) / 100);
    setItems((current) => [
      ...current,
      {
        variantId: variant.id,
        productId: product.id,
        productName: product.name,
        variantName: variant.variantName || variant.sku || `Variant #${variant.id}`,
        originalPrice: variant.price,
        availableQty: variant.availableQty,
        salePrice: suggestedPrice,
        qtyLimit: Math.min(1, variant.availableQty),
        thumbnailUrl: product.thumbnailUrl || product.images?.find((image) => image.isPrimary)?.url,
      },
    ]);
  };

  const updateItem = (variantId: number, change: Partial<DraftItem>) =>
    setItems((current) =>
      current.map((item) => (item.variantId === variantId ? { ...item, ...change } : item)),
    );

  const save = async (submit: boolean) => {
    if (!event || !selectedSlotId || items.length === 0) {
      toast.error('Hãy chọn khung giờ và ít nhất một biến thể');
      return;
    }
    try {
      const payload = {
        eventFlashSaleId: selectedSlotId,
        sellerNote: sellerNote || undefined,
        items: items.map(({ variantId, salePrice, qtyLimit }) => ({
          variantId,
          salePrice: Number(salePrice),
          qtyLimit: Number(qtyLimit),
        })),
      };
      const application = selectedApplication
        ? await mutations.update.mutateAsync({ id: selectedApplication.id, data: payload })
        : await mutations.create.mutateAsync(payload);
      if (submit) await mutations.submit.mutateAsync(application.id);
      toast.success(submit ? 'Đã gửi đăng ký đến Admin' : 'Đã lưu bản nháp');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu đăng ký');
    }
  };

  const withdraw = async (application: EventFlashSaleApplication) => {
    if (!confirm('Rút hồ sơ đăng ký này?')) return;
    try {
      await mutations.withdraw.mutateAsync(application.id);
      toast.success('Đã rút hồ sơ');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể rút hồ sơ');
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-[440px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  if (isError || !event)
    return (
      <div className="m-6 rounded-2xl border border-red-200 bg-white p-10 text-center">
        <p className="text-red-600">Không thể tải sự kiện.</p>
        <button
          onClick={() => void refetch()}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-white"
        >
          Thử lại
        </button>
      </div>
    );

  const editable =
    event.registrationStatus === 'OPEN' &&
    (!selectedApplication || ['DRAFT', 'CHANGES_REQUESTED'].includes(selectedApplication.status));

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <Link
        href="/dashboard/su-kien"
        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Tất cả sự kiện
      </Link>
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div
          className="h-44 bg-linear-to-br from-amber-100 to-red-100 bg-cover bg-center"
          style={
            event.bannerDesktopUrl
              ? { backgroundImage: `url(${event.bannerDesktopUrl})` }
              : undefined
          }
        />
        <div className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-black text-gray-900">{event.name}</h1>
              <p className="mt-2 max-w-3xl text-sm text-gray-600">{event.description}</p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${event.registrationStatus === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {event.registrationStatus === 'OPEN'
                ? 'Đang mở đăng ký'
                : event.registrationStatus === 'UPCOMING'
                  ? 'Sắp mở đăng ký'
                  : 'Đã đóng đăng ký'}
            </span>
          </div>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <Rule title="Điều kiện OCOP" value={`Từ ${event.minOcopStar} sao`} />
            <Rule title="Mức giảm tối thiểu" value={`${event.minDiscountPercent}%`} />
            <Rule title="Giới hạn" value={`${event.maxProductsPerShop} sản phẩm/shop`} />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="font-black text-gray-900">Chọn khung giờ</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {event.slots.map((slot) => {
            const application = event.applications.find(
              (item) => item.eventFlashSaleId === slot.id,
            );
            return (
              <button
                key={slot.id}
                onClick={() => setSelectedSlotId(slot.id)}
                className={`rounded-xl border p-4 text-left ${selectedSlotId === slot.id ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100' : 'border-gray-200'}`}
              >
                <div className="flex justify-between gap-2">
                  <strong className="text-sm text-gray-700">{slot.name}</strong>
                  {application && <StatusBadge status={application.status} size="xs" showDot />}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {new Date(slot.startTime).toLocaleString('vi-VN')} –{' '}
                  {new Date(slot.endTime).toLocaleString('vi-VN')}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {selectedApplication && !editable ? (
        <ApplicationResult
          application={selectedApplication}
          onWithdraw={() => void withdraw(selectedApplication)}
          pending={mutations.isPending}
        />
      ) : (
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(380px,0.8fr)]">
          <div
            className={`rounded-2xl border border-gray-200 bg-white p-5 ${!editable ? 'pointer-events-none opacity-60' : ''}`}
          >
            <h2 className="font-black text-gray-900">Chọn sản phẩm và biến thể</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm đã được duyệt..."
                className="w-full rounded-xl border text-gray-700 border-gray-300 py-2.5 pl-10 pr-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="mt-3 max-h-[520px] space-y-2 overflow-y-auto">
              {productsLoading ? (
                <Loader2 className="mx-auto my-8 h-6 w-6 animate-spin" />
              ) : (
                eligibleProducts.map((product) => {
                  const isExpanded = expandedProductId === product.id;
                  return (
                    <div
                      key={product.id}
                      className="overflow-hidden rounded-xl border border-gray-200 transition"
                    >
                      <button
                        type="button"
                        onClick={() => void openProduct(product)}
                        className={`flex w-full items-center gap-3 p-3 text-left transition cursor-pointer ${
                          isExpanded ? 'bg-amber-50/60' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-gray-100 border border-gray-200">
                          {(product.thumbnailUrl || product.images?.[0]?.url) && (
                            <Image
                              src={product.thumbnailUrl || product.images?.[0]?.url || ''}
                              alt=""
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            OCOP {product.ocopStar} sao • từ{' '}
                            {product.minPrice.toLocaleString('vi-VN')} đ
                          </p>
                        </div>
                        <div className="flex items-center gap-1.5 text-amber-600">
                          <PackagePlus className="h-4 w-4" />
                          {isExpanded ? (
                            <ChevronUp className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/40 p-3">
                          {loadingVariants ? (
                            <div className="flex items-center justify-center py-4">
                              <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                            </div>
                          ) : variants.filter((v) => v.isActive && v.availableQty > 0).length ===
                            0 ? (
                            <p className="py-2 text-center text-xs text-gray-500">
                              Không có biến thể khả dụng còn hàng
                            </p>
                          ) : (
                            <div className="space-y-2">
                              <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                                Biến thể:
                              </p>
                              {variants
                                .filter((variant) => variant.isActive && variant.availableQty > 0)
                                .map((variant) => {
                                  const isAdded = items.some(
                                    (item) => item.variantId === variant.id,
                                  );
                                  return (
                                    <div
                                      key={variant.id}
                                      className={`flex items-center justify-between rounded-xl border bg-white p-2.5 transition ${
                                        isAdded
                                          ? 'border-emerald-200 bg-emerald-50/40'
                                          : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50/30 shadow-xs'
                                      }`}
                                    >
                                      <div className="min-w-0 flex-1 pr-2">
                                        <p className="text-xs font-semibold text-gray-800">
                                          {variant.variantName || variant.sku}
                                        </p>
                                        <p className="mt-0.5 text-[11px] text-gray-500">
                                          còn{' '}
                                          <span className="font-semibold text-gray-700">
                                            {variant.availableQty}
                                          </span>
                                          {' • '}
                                          <span className="font-bold text-red-500">
                                            {variant.price.toLocaleString('vi-VN')} đ
                                          </span>
                                        </p>
                                      </div>
                                      {isAdded ? (
                                        <span className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                          Đã thêm
                                        </span>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => addVariant(product, variant)}
                                          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-amber-500 hover:bg-amber-600 active:scale-95 text-white px-2.5 py-1.5 text-xs font-bold shadow-xs transition cursor-pointer"
                                          title="Thêm biến thể này vào hồ sơ đăng ký"
                                        >
                                          <Plus className="h-4 w-4 stroke-[2.5]" />
                                          Thêm
                                        </button>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-900">Sản phẩm đăng ký</h2>
              <span className="text-xs text-gray-500">
                {new Set(items.map((item) => item.productId)).size}/{event.maxProductsPerShop} sản
                phẩm
              </span>
            </div>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.variantId} className="rounded-xl border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-700">{item.productName}</p>
                      <p className="text-xs text-gray-500">
                        {item.variantName} • Giá gốc {item.originalPrice.toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setItems((current) =>
                          current.filter((value) => value.variantId !== item.variantId),
                        )
                      }
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <label className="text-[11px] font-semibold text-gray-600">
                      Giá Flash Sale
                      <input
                        type="number"
                        min={1}
                        max={item.originalPrice - 1}
                        value={item.salePrice}
                        onChange={(e) =>
                          updateItem(item.variantId, { salePrice: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-lg text-gray-700 border border-gray-300 px-2 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </label>
                    <label className="text-[11px] font-semibold text-gray-600">
                      Số lượng (tối đa {item.availableQty})
                      <input
                        type="number"
                        min={1}
                        max={item.availableQty}
                        value={item.qtyLimit}
                        onChange={(e) =>
                          updateItem(item.variantId, { qtyLimit: Number(e.target.value) })
                        }
                        className="mt-1 w-full rounded-lg text-gray-700 border border-gray-300 px-2 py-2 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                    </label>
                  </div>
                </div>
              ))}
              {items.length === 0 && (
                <p className="rounded-xl border border-dashed border-gray-300 py-10 text-center text-xs text-gray-500">
                  Chọn sản phẩm ở cột bên trái.
                </p>
              )}
            </div>
            <textarea
              value={sellerNote}
              onChange={(e) => setSellerNote(e.target.value)}
              rows={3}
              placeholder="Ghi chú cho Admin (không bắt buộc)"
              className="mt-3 w-full rounded-xl text-gray-700 border border-gray-300 p-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            <div className="mt-3 flex flex-wrap justify-end gap-2">
              <button
                disabled={mutations.isPending || !editable}
                onClick={() => void save(false)}
                className="rounded-xl border text-gray-700 border-gray-300 px-4 py-2 text-sm font-bold disabled:opacity-50"
              >
                Lưu bản nháp
              </button>
              <button
                disabled={mutations.isPending || !editable}
                onClick={() => void save(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                <Send className="h-4 w-4" /> Gửi đăng ký
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function Rule({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-xl bg-gray-50 p-3">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="mt-1 font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ApplicationResult({
  application,
  onWithdraw,
  pending,
}: {
  application: EventFlashSaleApplication;
  onWithdraw: () => void;
  pending: boolean;
}) {
  const canWithdraw = ['DRAFT', 'SUBMITTED', 'CHANGES_REQUESTED'].includes(application.status);
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 font-black text-gray-900">
            <CheckCircle2 className="h-5 w-5 text-amber-600" />
            Trạng thái đăng ký
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {application.slotName} • {application.items.length} biến thể
          </p>
        </div>
        <StatusBadge status={application.status} size="sm" showDot />
      </div>
      <div className="mt-4 divide-y divide-gray-100 rounded-xl border border-gray-200">
        {application.items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {item.productName} — {item.variantName || item.sku}
              </p>
              <p className="text-xs text-gray-500">
                {item.salePrice.toLocaleString('vi-VN')} đ • SL {item.qtyLimit}
              </p>
              {item.reviewNote && (
                <p className="mt-1 text-xs text-amber-700">Admin: {item.reviewNote}</p>
              )}
            </div>
            <StatusBadge status={item.status} size="xs" showDot />
          </div>
        ))}
      </div>
      {canWithdraw && (
        <div className="mt-4 flex justify-end">
          <button
            disabled={pending}
            onClick={onWithdraw}
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-50"
          >
            Rút đăng ký
          </button>
        </div>
      )}
    </section>
  );
}
