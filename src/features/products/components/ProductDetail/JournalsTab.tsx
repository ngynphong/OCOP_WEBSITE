'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { FiX, FiPlus, FiMic } from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-toastify';

interface JournalsTabProps {
  productId: number;
  productName?: string;
  suggestedJournal?: {
    stepType: JournalStepType;
    title: string;
    description: string;
  } | null;
  onSuggestionConsumed?: () => void;
}

export function JournalsTab({
  productId,
  suggestedJournal,
  onSuggestionConsumed,
}: JournalsTabProps) {
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const { data, isPending } = useSellerJournalsQuery(productId);
  const { createJournal, isCreating, deleteJournal, isDeleting } =
    useSellerJournalMutations(productId);

  const journals: ProductJournal[] = data?.data ?? [];

  // Logic tính missing groups
  const existingSteps = new Set(journals.map((j) => j.stepType));
  const missingGroups: string[] = [];
  const hasSource =
    existingSteps.has('RAW_MATERIAL') ||
    existingSteps.has('PLANTING') ||
    existingSteps.has('CARE') ||
    existingSteps.has('HARVESTING') ||
    existingSteps.has('OTHER');

  if (!isPending) {
    if (!hasSource) missingGroups.push('Nguồn gốc nguyên liệu (Tự trồng hoặc Thu mua)');
    if (!existingSteps.has('PROCESSING')) missingGroups.push('Chế biến');
    if (!existingSteps.has('PACKAGING')) missingGroups.push('Đóng gói');
  }

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreateJournalFormData>({
    resolver: zodResolver(createJournalSchema),
    defaultValues: { stepOrder: (journals.length ?? 0) + 1 },
  });

  const currentStepType = useWatch({ control, name: 'stepType' });

  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (suggestedJournal) {
      reset({
        stepType: suggestedJournal.stepType,
        title: suggestedJournal.title,
        description: suggestedJournal.description,
        stepOrder: journals.length + 1,
      });
      setShowForm(true);
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      toast.info('AI đã điền sẵn thông tin. Bác hãy thêm ngày, ảnh, địa điểm và lưu lại nhé!');
      if (onSuggestionConsumed) {
        onSuggestionConsumed();
      }
    }
  }, [suggestedJournal, reset, journals.length, onSuggestionConsumed]);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleUploadImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setSelectedFiles((prev) => [...prev, ...newFiles]);

    const newUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newUrls]);

    e.target.value = '';
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    setSelectedFiles([]);
    reset();
    setShowForm(false);
  };

  const onSubmit = async (formData: CreateJournalFormData) => {
    if (selectedFiles.length === 0) {
      toast.error('Vui lòng tải lên ít nhất một ảnh minh chứng');
      return;
    }

    // Auto-assign step order based on current list length
    const { ...submitData } = formData;
    await createJournal({
      data: {
        ...submitData,
        stepOrder: journals.length + 1,
      },
      files: selectedFiles,
    });
    clearForm();
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deleteJournal(deleteId);
      setDeleteId(null);
    }
  };

  if (isPending) return <div className="h-48 bg-stone-100 rounded-xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Journal steps */}
      {journals.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-xl border border-dashed border-stone-200">
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
                className="flex items-start gap-4 p-4 bg-white rounded-xl border border-stone-100"
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
                  {j.images && j.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {j.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-100 bg-stone-50"
                        >
                          <Image src={img} alt="" fill className="object-cover" />
                        </div>
                      ))}
                    </div>
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
        // ... (rest of the form remains the same, I don't need to replace it here)
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="border border-stone-100 rounded-xl p-5 space-y-4 bg-stone-50/50"
        >
          <h4 className="text-sm font-black text-stone-700">Thêm bước nhật ký</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">
                Loại bước <span className="text-red-500">*</span>
              </label>
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
            <label className="text-xs font-bold text-stone-500 block mb-1">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              {...register('title')}
              placeholder={
                currentStepType === 'RAW_MATERIAL'
                  ? 'Ví dụ: Nhập thịt gà tươi...'
                  : currentStepType === 'PROCESSING'
                    ? 'Ví dụ: Chế biến, sấy khô...'
                    : 'Ví dụ: Gieo trồng & Canh tác...'
              }
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

          <div>
            <label className="text-xs font-bold text-stone-500 block mb-2">
              Ảnh hoạt động <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-3">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded-xl overflow-hidden border border-stone-200 group bg-white"
                >
                  <Image src={url} alt="" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiX size={12} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-stone-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/30 transition text-stone-400 hover:text-emerald-600">
                <FiPlus size={20} />
                <span className="text-[10px] font-bold">Thêm ảnh</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadImages}
                />
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={clearForm}>
              Hủy
            </Button>
            <Button type="submit" variant="primary" isLoading={isCreating}>
              Thêm bước
            </Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="w-full py-4 border border-dashed border-stone-200 rounded-xl text-sm font-bold text-stone-400 hover:border-emerald-300 hover:text-emerald-600 transition cursor-pointer"
          >
            + Thêm bước nhật ký
          </button>

          <button
            onClick={() => {
              const widgetBtn = document.getElementById('ai-chat-widget-btn');
              if (widgetBtn) widgetBtn.click();
            }}
            className="w-full py-4 border border-emerald-200 bg-emerald-50 rounded-xl text-sm font-bold text-emerald-600 hover:bg-emerald-100 transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
          >
            <FiMic size={18} /> Trợ lý AI Ghi nhật ký
          </button>
        </div>
      )}
    </div>
  );
}
