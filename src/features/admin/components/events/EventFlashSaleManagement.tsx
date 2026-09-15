'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Clock3, Loader2, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react';
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

const EMPTY_FORM: EventFlashSaleSlotInput = {
  name: '',
  startTime: '',
  endTime: '',
};

const STATUS_LABELS: Record<string, string> = {
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

const toInputDateTime = (value: string) => (value ? value.slice(0, 16) : '');
const formatDateTime = (value: string) => new Date(value).toLocaleString('vi-VN');
const formatPrice = (value: number) => `${Number(value).toLocaleString('vi-VN')} đ`;

interface Props {
  event: EventDetailResponse;
  onSlotsChange?: (slots: EventFlashSale[]) => void;
}

export function EventFlashSaleManagement({ event, onSlotsChange }: Props) {
  const [slots, setSlots] = useState<EventFlashSale[]>([]);
  const [applications, setApplications] = useState<EventFlashSaleApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSlotId, setEditingSlotId] = useState<number | null>(null);
  const [showSlotForm, setShowSlotForm] = useState(false);
  const [slotForm, setSlotForm] = useState<EventFlashSaleSlotInput>(EMPTY_FORM);
  const [slotFilter, setSlotFilter] = useState<number | undefined>();
  const [statusFilter, setStatusFilter] = useState<EventFlashSaleApplicationStatus | undefined>();
  const [decisions, setDecisions] = useState<
    Record<number, EventFlashSaleReviewInput['items'][number]>
  >({});

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [slotData, applicationData] = await Promise.all([
        eventCommerceApi.getAdminFlashSaleSlots(event.id),
        eventCommerceApi.getEventFlashSaleApplications(event.id, {
          slotId: slotFilter,
          status: statusFilter,
        }),
      ]);
      setSlots(slotData);
      setApplications(applicationData);
      onSlotsChange?.(slotData);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể tải dữ liệu Flash Sale');
    } finally {
      setLoading(false);
    }
  }, [event.id, onSlotsChange, slotFilter, statusFilter]);

  useEffect(() => {
    void load();
  }, [load]);

  const eventSlots = useMemo(() => slots.filter((slot) => !slot.legacy), [slots]);
  const legacySlots = useMemo(() => slots.filter((slot) => slot.legacy), [slots]);
  const pendingItems = applications.reduce(
    (total, application) =>
      total + application.items.filter((item) => item.status === 'PENDING').length,
    0,
  );

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

  const saveSlot = async (eventForm: React.FormEvent) => {
    eventForm.preventDefault();
    try {
      setSaving(true);
      const payload = {
        ...slotForm,
        startTime: `${slotForm.startTime}:00`,
        endTime: `${slotForm.endTime}:00`,
      };
      if (editingSlotId) {
        await eventCommerceApi.updateFlashSaleSlot(event.id, editingSlotId, payload);
        toast.success('Đã cập nhật khung giờ');
      } else {
        await eventCommerceApi.createFlashSaleSlot(event.id, payload);
        toast.success('Đã tạo khung giờ Flash Sale');
      }
      setShowSlotForm(false);
      setSlotForm(EMPTY_FORM);
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể lưu khung giờ');
    } finally {
      setSaving(false);
    }
  };

  const deleteSlot = async (slot: EventFlashSale) => {
    if (!confirm(`Xóa khung giờ “${slot.name}”?`)) return;
    try {
      await eventCommerceApi.deleteFlashSaleSlot(event.id, slot.id);
      toast.success('Đã xóa khung giờ');
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xóa khung giờ đã có đăng ký');
    }
  };

  const unlinkLegacy = async (slot: EventFlashSale) => {
    if (!confirm(`Gỡ Flash Sale legacy “${slot.name}” khỏi sự kiện?`)) return;
    try {
      await eventCommerceApi.unlinkFlashSale(event.id, slot.flashSaleId);
      toast.success('Đã gỡ liên kết legacy');
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể gỡ liên kết');
    }
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
    try {
      setSaving(true);
      await eventCommerceApi.reviewEventFlashSaleApplication(application.id, { items: selected });
      toast.success('Đã lưu kết quả xét duyệt');
      setDecisions({});
      await load();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Không thể xét duyệt hồ sơ');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-amber-600" />
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

      <section className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-bold text-gray-900">Khung giờ Flash Sale của sự kiện</h3>
            <p className="mt-1 text-xs text-gray-600">
              Seller đăng ký sản phẩm trực tiếp vào các khung giờ này.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white hover:bg-amber-700"
          >
            <Plus className="h-4 w-4" /> Tạo khung giờ
          </button>
        </div>

        {showSlotForm && (
          <form
            onSubmit={saveSlot}
            className="mt-4 grid gap-3 rounded-xl border border-amber-200 bg-white p-4 md:grid-cols-2"
          >
            <label className="text-xs font-semibold text-gray-700">
              Tên khung giờ
              <input
                required
                value={slotForm.name}
                onChange={(e) => setSlotForm({ ...slotForm, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                placeholder="Giờ vàng buổi tối"
              />
            </label>
            <label className="text-xs font-semibold text-gray-700">
              Banner (không bắt buộc)
              <input
                value={slotForm.bannerUrl || ''}
                onChange={(e) => setSlotForm({ ...slotForm, bannerUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
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
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="flex justify-end gap-2 md:col-span-2">
              <button
                type="button"
                onClick={() => setShowSlotForm(false)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                Hủy
              </button>
              <button
                disabled={saving}
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu khung giờ'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-4 grid gap-3 lg:grid-cols-2">
          {eventSlots.map((slot) => (
            <div key={slot.id} className="rounded-xl border border-gray-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Clock3 className="h-4 w-4 text-amber-600" />
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
              onClick={() => void load()}
              className="rounded-lg border border-gray-300 p-2 text-gray-500"
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
                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              className="h-full w-full object-cover"
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
                    <button
                      disabled={saving}
                      onClick={() => void reviewApplication(application)}
                      className="cursor-pointer rounded-lg bg-gray-900 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                    >
                      Lưu kết quả xét duyệt
                    </button>
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
      className={`rounded-xl border p-4 ${accent ? 'border-amber-200 bg-amber-50' : 'border-gray-200 bg-white'}`}
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
