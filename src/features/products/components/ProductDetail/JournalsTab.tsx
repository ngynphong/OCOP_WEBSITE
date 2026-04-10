'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useSellerJournalsQuery,
  useSellerJournalMutations,
} from '@/features/products/hooks/useSellerJournals';
import {
  createJournalSchema,
  CreateJournalFormData,
} from '@/features/products/types/productSchema';
import { ProductJournal, JournalStepType } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import {
  JOURNAL_STEP_LABELS,
  BLOCKCHAIN_COLORS,
  BLOCKCHAIN_LABELS,
} from '../../utils/ProductConstants';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

interface JournalsTabProps {
  productId: number;
}

export function JournalsTab({ productId }: JournalsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data, isPending } = useSellerJournalsQuery(productId);
  const { createJournal, isCreating, deleteJournal, isDeleting } =
    useSellerJournalMutations(productId);

  const journals: ProductJournal[] = data?.data ?? [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateJournalFormData>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: { stepOrder: (journals.length ?? 0) + 1 },
  });

  const onSubmit = async (formData: CreateJournalFormData) => {
    // Auto-assign step order based on current list length
    await createJournal({
      ...formData,
      stepOrder: journals.length + 1,
    });
    reset();
    setShowForm(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteJournal(deleteId);
      setDeleteId(null);
    }
  };

  if (isPending) return <div className="h-48 bg-stone-100 rounded-2xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Journal steps */}
      {journals.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-sm">Chưa có bước nhật ký nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {journals
            .slice()
            .sort((a, b) => a.stepOrder - b.stepOrder)
            .map((j) => (
              <div
                key={j.id}
                className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-stone-100"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                  <span className="text-emerald-600 font-black text-xs">{j.stepOrder}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">
                      {JOURNAL_STEP_LABELS[j.stepType]}
                    </span>
                    <span className={`text-xs font-bold ${BLOCKCHAIN_COLORS[j.blockchainStatus]}`}>
                      ⬡ {BLOCKCHAIN_LABELS[j.blockchainStatus]}
                    </span>
                  </div>
                  <p className="font-bold text-stone-800 mt-1">{j.title}</p>
                  {j.description && (
                    <p className="text-xs text-stone-400 mt-0.5 line-clamp-2">{j.description}</p>
                  )}
                  {j.location && <p className="text-xs text-stone-400 mt-0.5">📍 {j.location}</p>}
                  {j.activityDate && (
                    <p className="text-xs text-stone-400 mt-0.5">
                      {new Date(j.activityDate).toLocaleDateString('vi-VN')}
                    </p>
                  )}
                </div>
                {j.blockchainStatus === 'NOT_SUBMITTED' && (
                  <button
                    onClick={() => setDeleteId(j.id)}
                    className="text-xs text-red-400 hover:text-red-600 font-bold shrink-0 cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa bước nhật ký"
        message="Bạn có chắc chắn muốn xóa bước nhật ký này không? Hành động này không thể hoàn tác."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />

      {/* Add journal form */}
      {showForm ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-stone-100 rounded-2xl p-5 space-y-4 bg-stone-50/50"
        >
          <h4 className="text-sm font-black text-stone-700">Thêm bước nhật ký</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Loại bước *</label>
              <select
                {...register('stepType')}
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition bg-white"
              >
                <option value="">-- Chọn loại --</option>
                {(Object.keys(JOURNAL_STEP_LABELS) as JournalStepType[]).map((k) => (
                  <option key={k} value={k}>
                    {JOURNAL_STEP_LABELS[k]}
                  </option>
                ))}
              </select>
              {errors.stepType && (
                <p className="text-xs text-red-500 mt-1">{errors.stepType.message}</p>
              )}
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1 opacity-50">
                Thứ tự bước (Tự động)
              </label>
              <input
                type="number"
                disabled
                value={journals.length + 1}
                className="w-full border border-stone-200 text-stone-400 bg-stone-50 rounded-xl px-3 py-2 text-sm outline-none transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1">Tiêu đề *</label>
            <input
              {...register('title')}
              placeholder="Gieo trồng & Canh tác"
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Địa điểm</label>
              <input
                {...register('location')}
                placeholder="Đồi Thẩm Mã, Lũng Cú, Hà Giang"
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Ngày hoạt động</label>
              <input
                type="date"
                {...register('activityDate')}
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1">Mô tả</label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Hủy
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Thêm bước
            </Button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-3 border border-dashed border-stone-200 rounded-2xl text-sm font-bold text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition cursor-pointer"
        >
          + Thêm bước nhật ký
        </button>
      )}
    </div>
  );
}
