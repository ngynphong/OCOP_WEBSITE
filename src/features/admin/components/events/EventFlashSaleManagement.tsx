'use client';

import React from 'react';
import Image from 'next/image';
import { Check, Clock3, Loader2, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type {
  EventFlashSale,
  EventFlashSaleApplicationStatus,
} from '@/features/events/types/eventCommerceTypes';
import type { EventDetailResponse } from '@/features/events/types/eventTypes';
import {
  useEventFlashSaleManagement,
  STATUS_LABELS,
  formatDateTime,
  formatPrice,
  toInputDateTime,
} from '@/features/admin/hooks/useEventFlashSaleManagement';

interface Props {
  event: EventDetailResponse;
  onSlotsChange?: (slots: EventFlashSale[]) => void;
}

export function EventFlashSaleManagement({ event, onSlotsChange }: Props) {
  const {
    applications,
    loading,
    saving,
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
    refresh,
  } = useEventFlashSaleManagement({ event, onSlotsChange });

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Khung giờ sự kiện" value={eventSlots.length} />
        <Stat
          label="Shop đã đăng ký"
          value={new Set(applications.map((item) => item.shopId)).size}
        />
        <Stat label="Sản phẩm chờ duyệt" value={pendingItems} accent />
      </div>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">Khung giờ Flash Sale của sự kiện</h3>
            <p className="mt-1 text-xs text-gray-600">
              Seller đăng ký sản phẩm trực tiếp vào các khung giờ này.
            </p>
          </div>
          <Button
            type="button"
            onClick={openCreateForm}
            variant="primary"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Tạo khung giờ
          </Button>
        </div>

        {showSlotForm && (
          <form
            onSubmit={saveSlot}
            className="mt-4 grid gap-3 rounded-xl border border-emerald-200 bg-white p-4 md:grid-cols-2"
          >
            <label className="text-xs font-semibold text-gray-700">
              Tên khung giờ
              <input
                required
                value={slotForm.name}
                onChange={(e) => setSlotForm({ ...slotForm, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Giờ vàng buổi tối"
              />
            </label>
            <label className="text-xs font-semibold text-gray-700">
              Banner (không bắt buộc)
              <input
                value={slotForm.bannerUrl || ''}
                onChange={(e) => setSlotForm({ ...slotForm, bannerUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            <label className="text-xs font-semibold text-gray-700">
              Bắt đầu
              <input
                required
                type="datetime-local"
                value={slotForm.startTime}
                min={toInputDateTime(event.startAt)}
                max={toInputDateTime(event.endAt)}
                onChange={(e) => setSlotForm({ ...slotForm, startTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            <label className="text-xs font-semibold text-gray-700">
              Kết thúc
              <input
                required
                type="datetime-local"
                value={slotForm.endTime}
                min={toInputDateTime(event.startAt)}
                max={toInputDateTime(event.endAt)}
                onChange={(e) => setSlotForm({ ...slotForm, endTime: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <Button
                type="button"
                onClick={() => setShowSlotForm(false)}
                variant="ghost"
                size="sm"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={saving}
                isLoading={saving}
                variant="primary"
                size="sm"
              >
                Lưu khung giờ
              </Button>
            </div>
          </form>
        )}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {eventSlots.map((slot) => (
            <div key={slot.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-emerald-600" />
                    <strong className="text-sm text-gray-700">{slot.name}</strong>
                    <Badge>{STATUS_LABELS[slot.status] || slot.status}</Badge>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {formatDateTime(slot.startTime)} – {formatDateTime(slot.endTime)}
                  </p>
                  <p className="mt-1 text-xs text-gray-600">
                    {slot.applicationCount} hồ sơ • {slot.pendingItemCount} sản phẩm chờ duyệt •{' '}
                    {slot.items.length} đã duyệt
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => openEditForm(slot)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteSlot(slot)}
                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {eventSlots.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500 lg:col-span-2">
              Chưa có khung giờ. Hãy tạo khung giờ trước khi mở đăng ký cho Seller.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">Xét duyệt đăng ký</h3>
            <p className="mt-1 text-xs text-gray-500">Quyết định độc lập cho từng sản phẩm.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={slotFilter || ''}
              onChange={(e) => setSlotFilter(e.target.value ? Number(e.target.value) : undefined)}
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600"
            >
              <option value="">Tất cả khung giờ</option>
              {eventSlots.map((slot) => (
                <option key={slot.id} value={slot.id}>
                  {slot.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter || ''}
              onChange={(e) =>
                setStatusFilter(
                  (e.target.value || undefined) as EventFlashSaleApplicationStatus | undefined,
                )
              }
              className="rounded-lg border border-gray-300 px-3 py-2 text-xs text-gray-600"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="SUBMITTED">Chờ duyệt</option>
              <option value="CHANGES_REQUESTED">Cần chỉnh sửa</option>
              <option value="PARTIALLY_APPROVED">Duyệt một phần</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
            <button
              type="button"
              onClick={refresh}
              className="rounded-lg border border-gray-300 p-2 text-gray-500 cursor-pointer hover:bg-gray-50"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 space-y-4">
          {applications.map((application) => {
            const canReview = application.status === 'SUBMITTED';
            return (
              <article
                key={application.id}
                className="overflow-hidden rounded-xl border border-gray-200"
              >
                <header className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 px-4 py-3">
                  <div>
                    <strong className="text-sm text-gray-900">{application.shopName}</strong>
                    <p className="text-xs text-gray-500">
                      {application.slotName} • {application.items.length} sản phẩm
                    </p>
                  </div>
                  <Badge>{STATUS_LABELS[application.status] || application.status}</Badge>
                </header>
                <div className="divide-y divide-gray-100">
                  {application.items.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100 relative">
                          {item.thumbnailUrl ? (
                            <Image
                              src={item.thumbnailUrl}
                              alt={item.productName || ''}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.variantName || item.sku || `Variant #${item.variantId}`} •{' '}
                            {formatPrice(item.originalPrice)} →{' '}
                            <b className="text-red-600">{formatPrice(item.salePrice)}</b> • -
                            {item.discountPercent}% • SL {item.qtyLimit}/{item.availableQty}
                          </p>
                          {item.reviewNote && (
                            <p className="mt-1 text-xs text-amber-700">{item.reviewNote}</p>
                          )}
                        </div>
                      </div>
                      {canReview && item.status === 'PENDING' ? (
                        <div className="flex flex-wrap gap-1.5">
                          <DecisionButton
                            active={decisions[item.id]?.decision === 'APPROVE'}
                            onClick={() => setDecision(item.id, 'APPROVE')}
                            tone="green"
                          >
                            <Check className="h-3.5 w-3.5" /> Duyệt
                          </DecisionButton>
                          <DecisionButton
                            active={decisions[item.id]?.decision === 'REQUEST_CHANGES'}
                            onClick={() => setDecision(item.id, 'REQUEST_CHANGES')}
                            tone="amber"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Yêu cầu sửa
                          </DecisionButton>
                          <DecisionButton
                            active={decisions[item.id]?.decision === 'REJECT'}
                            onClick={() => setDecision(item.id, 'REJECT')}
                            tone="red"
                          >
                            <X className="h-3.5 w-3.5" /> Từ chối
                          </DecisionButton>
                        </div>
                      ) : (
                        <Badge>{STATUS_LABELS[item.status] || item.status}</Badge>
                      )}
                    </div>
                  ))}
                </div>
                {canReview && (
                  <footer className="flex justify-end border-t border-gray-100 bg-gray-50 px-4 py-3">
                    <Button
                      disabled={saving}
                      isLoading={saving}
                      onClick={() => void reviewApplication(application)}
                      variant="primary"
                      size="sm"
                    >
                      Lưu kết quả xét duyệt
                    </Button>
                  </footer>
                )}
              </article>
            );
          })}
          {applications.length === 0 && (
            <p className="py-10 text-center text-sm text-gray-500">Chưa có hồ sơ phù hợp bộ lọc.</p>
          )}
        </div>
      </section>

      {legacySlots.length > 0 && (
        <section className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <h3 className="font-bold text-gray-800">Flash Sale legacy — chỉ đọc</h3>
          <p className="mt-1 text-xs text-gray-500">
            Liên kết cũ được giữ nguyên đến khi kết thúc; không thể tạo thêm liên kết kiểu này.
          </p>
          <div className="mt-3 space-y-2">
            {legacySlots.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-3"
              >
                <div>
                  <p className="text-sm font-semibold">{slot.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(slot.startTime)} – {formatDateTime(slot.endTime)} •{' '}
                    {slot.items.length} sản phẩm
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void unlinkLegacy(slot)}
                  className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                  title="Gỡ liên kết"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${accent ? 'border-emerald-200 bg-emerald-50' : 'border-gray-200 bg-white'}`}
    >
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-gray-900">{value}</p>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
      {children}
    </span>
  );
}

function DecisionButton({
  active,
  onClick,
  tone,
  children,
}: {
  active: boolean;
  onClick: () => void;
  tone: 'green' | 'amber' | 'red';
  children: React.ReactNode;
}) {
  const styles = {
    green: 'border-green-300 text-green-700 bg-green-50',
    amber: 'border-amber-300 text-amber-700 bg-amber-50',
    red: 'border-red-300 text-red-700 bg-red-50',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold cursor-pointer ${active ? styles[tone] : 'border-gray-200 bg-white text-gray-500'}`}
    >
      {children}
    </button>
  );
}
