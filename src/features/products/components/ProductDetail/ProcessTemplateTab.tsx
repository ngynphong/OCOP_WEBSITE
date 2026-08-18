'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiPlus, FiTrash2, FiSave, FiZap, FiAlertCircle } from 'react-icons/fi';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { toast } from 'react-hot-toast';
import { useAiGeneration } from '@/features/products/hooks/useAiGeneration';

// Schema Validation
const processTemplateSchema = z.object({
  name: z.string().min(3, 'Tên quy trình mẫu phải có ít nhất 3 ký tự'),
  description: z.string().optional(),
  steps: z
    .array(
      z.object({
        stepOrder: z.number().min(1),
        stepType: z.string().min(1, 'Vui lòng chọn loại công việc'),
        title: z.string().min(1, 'Tên công việc không được để trống'),
        description: z.string().optional(),
        estimatedDays: z.number().min(0, 'Ngày dự kiến >= 0').optional(),
      }),
    )
    .min(1, 'Quy trình phải có ít nhất 1 bước'),
});

type ProcessTemplateFormData = z.infer<typeof processTemplateSchema>;

const STEP_TYPES = [
  { value: 'RAW_MATERIAL', label: 'Nguyên liệu/Nguồn gốc' },
  { value: 'PLANTING', label: 'Gieo trồng' },
  { value: 'CARE', label: 'Chăm sóc' },
  { value: 'HARVESTING', label: 'Thu hoạch' },
  { value: 'PROCESSING', label: 'Chế biến' },
  { value: 'QUALITY_CHECK', label: 'Kiểm định chất lượng' },
  { value: 'PACKAGING', label: 'Đóng gói' },
  { value: 'CERTIFICATION', label: 'Chứng nhận' },
  { value: 'OTHER', label: 'Khác' },
];

export function ProcessTemplateTab({ productId }: { productId: number }) {
  const { useGetProcessTemplates, useCreateProcessTemplate } = useProductionBatch();
  const { data: templatesData, isLoading } = useGetProcessTemplates(productId);
  const { mutate: createTemplate, isPending } = useCreateProcessTemplate();

  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<ProcessTemplateFormData>({
    resolver: zodResolver(processTemplateSchema),
    defaultValues: {
      name: '',
      description: '',
      steps: [
        { stepOrder: 1, stepType: 'RAW_MATERIAL', title: '', description: '', estimatedDays: 0 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'steps',
  });

  const watchSteps = watch('steps');

  const { generateDesc, isGenerating } = useAiGeneration();

  const onSubmit = (data: ProcessTemplateFormData) => {
    // Make sure step orders are correct
    const formattedData = {
      productId,
      name: data.name,
      description: data.description,
      steps: data.steps.map((step, index) => ({
        ...step,
        stepOrder: index + 1,
      })),
    };
    createTemplate(formattedData, {
      onSuccess: () => {
        setIsCreating(false);
        reset();
      },
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-stone-500">Đang tải danh sách quy trình...</div>;
  }

  const templates = templatesData || [];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight mb-1">Quy trình mẫu</h2>
          <p className="text-sm font-medium text-stone-500">
            Lên danh sách các bước làm sẵn để sau này ghi nhật ký cho nhanh.
          </p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md"
          >
            <FiPlus size={16} />
            Thêm quy trình mẫu
          </button>
        )}
      </div>

      {isCreating ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 flex flex-col gap-6"
        >
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <h3 className="font-bold text-lg text-stone-800">Soạn quy trình mẫu mới</h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-stone-400 hover:text-stone-600 font-medium text-sm transition"
            >
              Hủy bỏ
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 animate-in fade-in slide-in-from-top-2">
            <FiAlertCircle className="shrink-0 mt-0.5 text-amber-600" size={18} />
            <div>
              <p className="text-sm font-bold mb-0.5">Lưu ý quan trọng</p>
              <p className="text-xs text-amber-700/90 leading-relaxed">
                Mỗi sản phẩm chỉ nên tạo một Quy trình chuẩn. Khi đã áp dụng Quy trình này vào lô
                sản xuất, bạn sẽ <strong>không thể thay đổi hoặc xóa bỏ</strong> vì nó ảnh hưởng
                trực tiếp đến dữ liệu Nhật ký Truy xuất nguồn gốc của các lô hàng.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">
                Tên quy trình mẫu <span className="text-red-500">*</span>
              </label>
              <input
                {...register('name')}
                placeholder="Ví dụ: Quy trình trồng chè vụ Đông Xuân..."
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1">Ghi chú thêm</label>
              <textarea
                {...register('description')}
                rows={2}
                placeholder="Ví dụ: Áp dụng cho các vườn chè trên đồi..."
                className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2 text-sm outline-none focus:border-emerald-400 transition resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-stone-800">Danh sách các bước</h4>
              <button
                type="button"
                onClick={() =>
                  append({
                    stepOrder: fields.length + 1,
                    stepType: 'OTHER',
                    title: '',
                    description: '',
                    estimatedDays: 0,
                  })
                }
                className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-bold text-xs"
              >
                <FiPlus size={14} /> Thêm bước mới
              </button>
            </div>

            {errors.steps?.root && (
              <p className="text-xs text-red-500 mb-3">{errors.steps.root.message}</p>
            )}

            <div className="flex flex-col gap-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 relative group"
                >
                  <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black border-2 border-white shadow-sm">
                    {index + 1}
                  </div>

                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-stone-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="flex flex-col gap-1 md:col-span-3">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">
                        Loại công việc <span className="text-red-500">*</span>
                      </label>
                      <select
                        {...register(`steps.${index}.stepType` as const)}
                        className="w-full border border-stone-200 text-gray-700 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-emerald-400 bg-white"
                      >
                        {STEP_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      {errors.steps?.[index]?.stepType && (
                        <p className="text-xs text-red-500">
                          {errors.steps[index]?.stepType?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-6">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">
                        Tên công việc <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register(`steps.${index}.title` as const)}
                        placeholder="Ví dụ: Cày xới đất..."
                        className="w-full border border-stone-200 text-gray-700 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-emerald-400 bg-white"
                      />
                      {errors.steps?.[index]?.title && (
                        <p className="text-xs text-red-500">
                          {errors.steps[index]?.title?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-3">
                      <label className="text-[10px] font-bold text-stone-500 uppercase">
                        Thời gian chờ
                      </label>
                      <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-lg overflow-hidden pr-1 focus-within:border-emerald-400">
                        <span className="bg-stone-50 border-r border-stone-200 px-3 py-1.5 text-sm font-medium text-stone-500">
                          Sau
                        </span>
                        <input
                          type="number"
                          min="0"
                          {...register(`steps.${index}.estimatedDays` as const, {
                            valueAsNumber: true,
                          })}
                          placeholder="0"
                          className="flex-1 w-full min-w-[50px] text-gray-700 px-2 py-1.5 text-sm outline-none bg-transparent"
                        />
                        <span className="text-sm font-medium text-stone-500 pr-2">ngày</span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-0.5">
                        {index === 0
                          ? '*Kể từ lúc bắt đầu tạo lô'
                          : `*Kể từ sau bước "${watchSteps[index - 1]?.title || 'trước'}"`}
                      </p>
                      {errors.steps?.[index]?.estimatedDays && (
                        <p className="text-xs text-red-500">
                          {errors.steps[index]?.estimatedDays?.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-12">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-stone-500 uppercase">
                          Hướng dẫn cách làm
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const currentTitle = getValues(`steps.${index}.title`);
                            const currentType = getValues(`steps.${index}.stepType`);
                            const typeLabel =
                              STEP_TYPES.find((t) => t.value === currentType)?.label || currentType;
                            if (!currentTitle) {
                              toast.error(
                                'Vui lòng nhập "Tên công việc" trước khi tự động tạo nhé!',
                              );
                              return;
                            }
                            generateDesc(
                              {
                                prompt: `Viết mô tả ngắn gọn khoảng 2 câu hướng dẫn người nông dân cách thực hiện công việc "${currentTitle}" (Loại công việc: ${typeLabel}). Giọng văn mộc mạc, gần gũi, đi thẳng vào nội dung hướng dẫn.`,
                              },
                              {
                                onSuccess: (response) => {
                                  setValue(`steps.${index}.description`, response.replyMessage);
                                },
                              },
                            );
                          }}
                          disabled={isGenerating}
                          className="flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded transition disabled:opacity-50"
                        >
                          <FiZap size={12} />
                          {isGenerating ? 'Đang viết...' : 'Tự động tạo'}
                        </button>
                      </div>
                      <textarea
                        {...register(`steps.${index}.description` as const)}
                        rows={2}
                        placeholder="Mô tả kỹ hơn để người làm theo dễ hiểu..."
                        className="w-full border border-stone-200 text-gray-700 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-emerald-400 bg-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() =>
                  append({
                    stepOrder: fields.length + 1,
                    stepType: 'OTHER',
                    title: '',
                    description: '',
                    estimatedDays: 0,
                  })
                }
                className="w-full mt-2 py-4 border-2 border-dashed border-stone-200 hover:border-emerald-400 hover:bg-emerald-50 rounded-xl text-stone-500 hover:text-emerald-700 font-bold text-sm flex items-center justify-center gap-2 transition"
              >
                <FiPlus size={18} /> Thêm bước tiếp theo
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl font-bold text-sm transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition disabled:opacity-50"
            >
              <FiSave size={16} />
              {isPending ? 'Đang lưu...' : 'Lưu quy trình mẫu'}
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-4">
          {templates.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center text-center bg-stone-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <FiPlus className="w-8 h-8 text-stone-300" />
              </div>
              <h3 className="text-lg font-bold text-stone-800 mb-1">
                Bạn chưa có Quy trình mẫu nào
              </h3>
              <p className="text-sm font-medium text-stone-500 max-w-sm mb-6">
                Bạn hãy soạn một vài bước làm nháp trước, để sau này tạo lô hàng và ghi nhật ký cho
                nhanh nhé.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="px-5 py-2.5 bg-white border border-emerald-400 text-emerald-600 rounded-xl font-bold text-sm transition shadow-sm"
              >
                Soạn quy trình mẫu đầu tiên
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col gap-4 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg">{template.name}</h3>
                    <p className="text-xs font-medium text-stone-500 mt-1">
                      {template.steps?.length || 0} bước • Bản lưu thứ {template.versionNumber}
                    </p>
                  </div>
                </div>

                {template.description && (
                  <p className="text-sm text-stone-600 bg-stone-50 p-3 rounded-lg border border-stone-100">
                    {template.description}
                  </p>
                )}

                <div className="flex flex-col gap-2 mt-2">
                  <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Các bước sẽ làm
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {template.steps?.map((step, idx) => (
                      <div
                        key={step.id}
                        className="flex flex-col gap-1 px-2.5 py-2 bg-stone-50 border border-stone-100 rounded-lg"
                      >
                        <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
                          <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-stone-400 border border-stone-200 shadow-xs">
                            {idx + 1}
                          </span>
                          {step.title}
                        </div>
                        {step.estimatedDays !== undefined && step.estimatedDays !== null && (
                          <span className="text-[10px] text-emerald-600 font-medium pl-7">
                            <FiZap className="inline mr-0.5" />
                            {idx === 0
                              ? `Sau khi tạo lô: ${step.estimatedDays} ngày`
                              : `Sau bước "${template.steps![idx - 1]?.title || 'trước'}": ${step.estimatedDays} ngày`}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
