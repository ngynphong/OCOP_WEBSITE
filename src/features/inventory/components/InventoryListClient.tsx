'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiBox, FiMinus, FiPackage, FiPlus, FiSettings } from 'react-icons/fi';
import {
  useInventoryListQuery,
  useLowStockAlertsQuery,
  useAddStockMutation,
  useAdjustStockMutation,
  useDamagedStockMutation,
  useUpdateThresholdMutation,
} from '@/features/inventory/hooks/useSellerInventory';
import { InventoryItem, InventoryListParams } from '@/features/inventory/types/inventoryTypes';

// ─── Static config ─────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Stock status badge ────────────────────────────────────────────────────────

function StockBadge({ item }: { item: InventoryItem }) {
  if (item.outOfStock) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600 border border-red-200">
        Hết hàng
      </span>
    );
  }
  if (item.lowStock) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600 border border-amber-200">
        <FiAlertTriangle className="size-3" />
        Sắp hết
      </span>
    );
  }
  return (
    <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 border border-emerald-200">
      Còn hàng
    </span>
  );
}

// ─── Action modal state ────────────────────────────────────────────────────────

type ActionType = 'add' | 'adjust' | 'damaged' | 'threshold' | null;

interface ActionState {
  type: ActionType;
  variantId: number;
  variantName: string;
}

// ─── Simple inline action form ─────────────────────────────────────────────────

function ActionModal({ action, onClose }: { action: ActionState; onClose: () => void }) {
  const [qty, setQty] = useState('');
  const [delta, setDelta] = useState('');
  const [note, setNote] = useState('');
  const [importRefId, setImportRefId] = useState('');
  const [reason, setReason] = useState('');
  const [threshold, setThreshold] = useState('');

  const addMutation = useAddStockMutation(action.variantId);
  const adjustMutation = useAdjustStockMutation(action.variantId);
  const damagedMutation = useDamagedStockMutation(action.variantId);
  const thresholdMutation = useUpdateThresholdMutation(action.variantId);

  const isPending =
    addMutation.isPending ||
    adjustMutation.isPending ||
    damagedMutation.isPending ||
    thresholdMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (action.type === 'add') {
      await addMutation.mutateAsync({
        quantity: Number(qty),
        importRefId: importRefId || undefined,
        note: note || undefined,
      });
    } else if (action.type === 'adjust') {
      await adjustMutation.mutateAsync({ delta: Number(delta), note });
    } else if (action.type === 'damaged') {
      await damagedMutation.mutateAsync({ quantity: Number(qty), reason });
    } else if (action.type === 'threshold') {
      await thresholdMutation.mutateAsync({ threshold: Number(threshold) });
    }
    onClose();
  };

  const titles: Record<NonNullable<ActionType>, string> = {
    add: 'Nhập hàng',
    adjust: 'Điều chỉnh tồn kho',
    damaged: 'Báo hàng hỏng',
    threshold: 'Ngưỡng cảnh báo',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h3 className="mb-1 text-base font-semibold text-stone-800">{titles[action.type!]}</h3>
        <p className="mb-4 text-sm text-stone-500">{action.variantName}</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {action.type === 'add' && (
            <>
              <input
                type="number"
                min={1}
                required
                placeholder="Số lượng nhập *"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                placeholder="Mã phiếu nhập (tuỳ chọn)"
                value={importRefId}
                onChange={(e) => setImportRefId(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                placeholder="Ghi chú (tuỳ chọn)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </>
          )}

          {action.type === 'adjust' && (
            <>
              <input
                type="number"
                required
                placeholder="Delta (dương=tăng, âm=giảm) *"
                value={delta}
                onChange={(e) => setDelta(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                required
                placeholder="Ghi chú *"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </>
          )}

          {action.type === 'damaged' && (
            <>
              <input
                type="number"
                min={1}
                required
                placeholder="Số lượng hỏng *"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              <input
                type="text"
                required
                placeholder="Lý do *"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </>
          )}

          {action.type === 'threshold' && (
            <input
              type="number"
              min={0}
              required
              placeholder="Ngưỡng cảnh báo (>= 0) *"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
          )}

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-stone-200 px-4 py-2 text-sm text-stone-600 hover:bg-stone-50"
            >
              Huỷ
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-60"
            >
              {isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Loading skeleton ──────────────────────────────────────────────────────────

function TableSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-12 rounded-lg bg-stone-100" />
      ))}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InventoryListClient() {
  const [pageNo, setPageNo] = useState(1);
  const [action, setAction] = useState<ActionState | null>(null);

  const params: InventoryListParams = { pageNo: pageNo, pageSize: PAGE_SIZE };
  const { data, isPending, isError } = useInventoryListQuery(params);
  const { data: lowStockData } = useLowStockAlertsQuery();

  const items: InventoryItem[] = data?.data?.items ?? [];
  const total = data?.data?.totalElement ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const lowStockCount = lowStockData?.data?.length ?? 0;

  const openAction = (type: NonNullable<ActionType>, item: InventoryItem) => {
    setAction({ type, variantId: item.variantId, variantName: item.variantName });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Quản lý tồn kho</h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Theo dõi và cập nhật tồn kho các biến thể sản phẩm
          </p>
        </div>
        {lowStockCount > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700 border border-amber-200">
            <FiAlertTriangle className="size-4" />
            {lowStockCount} biến thể sắp hết hàng
          </span>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
        {isPending ? (
          <div className="p-6">
            <TableSkeleton />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <FiBox className="mb-2 size-8" />
            <p className="text-sm">Không thể tải dữ liệu tồn kho</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400">
            <FiPackage className="mb-2 size-8" />
            <p className="text-sm">Chưa có dữ liệu tồn kho</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100 bg-stone-50 text-left text-xs font-medium text-stone-500">
                  <th className="px-4 py-3">Biến thể</th>
                  <th className="px-4 py-3">SKU</th>
                  <th className="px-4 py-3 text-right">Tổng kho</th>
                  <th className="px-4 py-3 text-right">Đặt trước</th>
                  <th className="px-4 py-3 text-right">Khả dụng</th>
                  <th className="px-4 py-3 text-right">Đã bán</th>
                  <th className="px-4 py-3 text-right">Hỏng</th>
                  <th className="px-4 py-3">Trạng thái</th>
                  <th className="px-4 py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-medium text-stone-700">{item.variantName}</td>
                    <td className="px-4 py-3 font-mono text-stone-500">{item.sku || '—'}</td>
                    <td className="px-4 py-3 text-right text-stone-700">{item.stockQty}</td>
                    <td className="px-4 py-3 text-right text-stone-500">{item.reservedQty}</td>
                    <td className="px-4 py-3 text-right font-medium text-stone-800">
                      {item.availableQty}
                    </td>
                    <td className="px-4 py-3 text-right text-stone-500">{item.soldQty}</td>
                    <td className="px-4 py-3 text-right text-red-400">{item.damagedQty}</td>
                    <td className="px-4 py-3">
                      <StockBadge item={item} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openAction('add', item)}
                          title="Nhập hàng"
                          className="rounded-md p-1.5 text-stone-400 hover:bg-emerald-50 hover:text-emerald-600"
                        >
                          <FiPlus className="size-4" />
                        </button>
                        <button
                          onClick={() => openAction('adjust', item)}
                          title="Điều chỉnh"
                          className="rounded-md p-1.5 text-stone-400 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <FiMinus className="size-4" />
                        </button>
                        <button
                          onClick={() => openAction('damaged', item)}
                          title="Báo hỏng"
                          className="rounded-md p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-500"
                        >
                          <FiAlertTriangle className="size-4" />
                        </button>
                        <button
                          onClick={() => openAction('threshold', item)}
                          title="Ngưỡng cảnh báo"
                          className="rounded-md p-1.5 text-stone-400 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <FiSettings className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-stone-500">
          <span>
            Hiển thị {items.length} / {total} biến thể
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPageNo((p) => Math.max(1, p - 1))}
              disabled={pageNo === 1}
              className="rounded-lg border border-stone-200 px-3 py-1.5 hover:bg-stone-50 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="rounded-lg border border-stone-200 px-3 py-1.5 bg-stone-50">
              {pageNo + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPageNo((p) => Math.min(totalPages - 1, p + 1))}
              disabled={pageNo >= totalPages - 1}
              className="rounded-lg border border-stone-200 px-3 py-1.5 hover:bg-stone-50 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Action modal */}
      {action && <ActionModal action={action} onClose={() => setAction(null)} />}
    </div>
  );
}
