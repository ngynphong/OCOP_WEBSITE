'use client';

import React from 'react';
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
import type { EventFlashSaleApplication } from '@/features/events/types/eventCommerceTypes';
import { useSellerEventDetailManagement } from '../../hooks/useSellerEventDetailManagement';

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
            className="rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600 disabled:opacity-50 cursor-pointer hover:bg-red-50"
          >
            Rút đăng ký
          </button>
        </div>
      )}
    </section>
  );
}

export function SellerEventDetailView({ eventId }: { eventId: number }) {
  const {
    event,
    isLoading,
    isError,
    refetch,
    mutations,
    selectedSlotId,
    setSelectedSlotId,
    search,
    setSearch,
    expandedProductId,
    variants,
    loadingVariants,
    items,
    sellerNote,
    setSellerNote,
    productsLoading,
    eligibleProducts,
    selectedApplication,
    editable,
    openProduct,
    addVariant,
    updateItem,
    removeItem,
    save,
    withdraw,
  } = useSellerEventDetailManagement(eventId);

  if (isLoading) {
    return (
      <div className="flex min-h-[440px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="m-6 rounded-2xl border border-red-200 bg-white p-10 text-center">
        <p className="text-red-600">Không thể tải sự kiện.</p>
        <button
          onClick={() => void refetch()}
          className="mt-3 rounded-lg bg-gray-900 px-4 py-2 text-white cursor-pointer hover:bg-gray-800"
        >
          Thử lại
        </button>
      </div>
    );
  }

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
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                event.registrationStatus === 'OPEN'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-600'
              }`}
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
                className={`rounded-xl border p-4 text-left cursor-pointer transition ${
                  selectedSlotId === slot.id
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-100'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
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
            className={`rounded-2xl border border-gray-200 bg-white p-5 ${
              !editable ? 'pointer-events-none opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-black text-gray-900">Chọn sản phẩm đủ điều kiện</h2>
              <span className="text-xs text-gray-500">{eligibleProducts.length} sản phẩm</span>
            </div>
            <div className="relative mt-3">
              <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm sản phẩm của bạn..."
                className="w-full rounded-xl text-gray-700 border border-gray-300 py-2 pr-4 pl-9 text-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            {productsLoading ? (
              <div className="flex py-10 justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
              </div>
            ) : (
              <div className="mt-3 divide-y divide-gray-100">
                {eligibleProducts.map((product) => {
                  const selectedVariantsCount = items.filter(
                    (item) => item.productId === product.id,
                  ).length;
                  const isExpanded = expandedProductId === product.id;
                  return (
                    <div key={product.id} className="py-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          {product.thumbnailUrl && (
                            <Image
                              src={product.thumbnailUrl}
                              alt={product.name}
                              width={44}
                              height={44}
                              className="rounded-lg object-cover"
                            />
                          )}
                          <div>
                            <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                            <p className="text-xs text-gray-500">
                              OCOP {product.ocopStar || 0}★ •{' '}
                              {product.categoryName || 'Chưa phân loại'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedVariantsCount > 0 && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-800">
                              Đã chọn {selectedVariantsCount}
                            </span>
                          )}
                          <button
                            onClick={() => void openProduct(product)}
                            className="rounded-lg border border-gray-200 p-1 text-gray-600 hover:bg-gray-50 cursor-pointer"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      {isExpanded && (
                        <div className="mt-2 pl-4 border-l-2 border-amber-200">
                          {loadingVariants ? (
                            <Loader2 className="my-2 h-4 w-4 animate-spin text-amber-600" />
                          ) : (
                            variants.map((variant) => {
                              const picked = items.some((item) => item.variantId === variant.id);
                              return (
                                <div
                                  key={variant.id}
                                  className="flex items-center justify-between py-1.5 text-xs"
                                >
                                  <div>
                                    <span className="font-semibold text-gray-700">
                                      {variant.variantName || variant.sku}
                                    </span>
                                    <span className="ml-2 text-gray-500">
                                      Tồn {variant.availableQty} •{' '}
                                      {variant.price.toLocaleString('vi-VN')} đ
                                    </span>
                                  </div>
                                  <button
                                    disabled={picked}
                                    onClick={() => addVariant(product, variant)}
                                    className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-bold cursor-pointer ${
                                      picked
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                    }`}
                                  >
                                    {picked ? (
                                      <Check className="h-3 w-3" />
                                    ) : (
                                      <Plus className="h-3 w-3" />
                                    )}
                                    {picked ? 'Đã thêm' : 'Thêm'}
                                  </button>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-black text-gray-900">
                <PackagePlus className="h-5 w-5 text-amber-600" />
                Danh sách biến thể đã chọn ({items.length})
              </h2>
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
                      onClick={() => removeItem(item.variantId)}
                      className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 cursor-pointer"
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
                className="rounded-xl border text-gray-700 border-gray-300 px-4 py-2 text-sm font-bold disabled:opacity-50 cursor-pointer hover:bg-gray-50"
              >
                Lưu bản nháp
              </button>
              <button
                disabled={mutations.isPending || !editable}
                onClick={() => void save(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50 cursor-pointer hover:bg-amber-700"
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
