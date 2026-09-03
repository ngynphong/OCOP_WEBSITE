'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiPlus, FiSave, FiZap, FiAlertCircle } from 'react-icons/fi';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import {
  IProcessTemplate,
  IProcessTemplateStep,
} from '@/features/supply-chain/types/supplyChainTypes';
import { useAiGeneration } from '@/features/products/hooks/useAiGeneration';
import { TemplateBuilder } from '@/features/supply-chain/components/TemplateBuilder/TemplateBuilder';
import { EditBlockModal } from '@/features/supply-chain/components/TemplateBuilder/EditBlockModal';
import { TemplateBlock } from '@/features/supply-chain/components/TemplateBuilder/LegoBlock';

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
        dynamicFieldsSchema: z.string().optional(),
        evidenceRule: z.string().optional(),
      }),
    )
    .min(1, 'Quy trình phải có ít nhất 1 bước'),
});

export type ProcessTemplateFormData = z.infer<typeof processTemplateSchema>;

export function ProcessTemplateTab({
  productId,
}: {
  productId: number;
  onNextTab?: (
    tab: 'info' | 'variants' | 'images' | 'process_templates' | 'lots' | 'journals',
  ) => void;
}) {
  const { useGetProcessTemplates, useGetSystemTemplates, useCreateProcessTemplate } =
    useProductionBatch();
  const { data: templatesData, isLoading } = useGetProcessTemplates(productId);
  const { data: systemTemplatesData, isLoading: isLoadingSystem } = useGetSystemTemplates();
  const { mutate: createTemplate, isPending } = useCreateProcessTemplate();

  const [isCreating, setIsCreating] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
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

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'steps',
  });

  useEffect(() => {
    if (isCreating) {
      const hasSeen = localStorage.getItem('tour_process_create_form_seen');
      if (!hasSeen) {
        setTimeout(() => {
          window.dispatchEvent(new Event('trigger-onboarding-tour-auto'));
        }, 200);
      }
    }
  }, [isCreating]);

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

        window.dispatchEvent(
          new CustomEvent('trigger-tour-next-step', {
            detail: {
              elementId: 'tour-lots-tab',
              title: 'Tạo quy trình thành công',
              description:
                'Bây giờ bạn đã có quy trình chuẩn! Hãy chuyển sang thẻ "Lô hàng" để bắt đầu tạo các đợt sản xuất thực tế nhé.',
              nextTabId: 'lots',
            },
          }),
        );
      },
    });
  };

  if (isLoading || isLoadingSystem) {
    return <div className="p-8 text-center text-stone-500">Đang tải danh sách quy trình...</div>;
  }

  const templates = templatesData || [];
  const systemTemplates = systemTemplatesData || [];

  const handleCloneSystemTemplate = (template: IProcessTemplate) => {
    reset({
      name: `${template.name} (Copy)`,
      description: template.description || '',
      steps:
        template.steps?.map((step: IProcessTemplateStep) => ({
          stepOrder: step.stepOrder,
          stepType: step.stepType,
          title: step.title,
          description: step.description,
          estimatedDays: step.estimatedDays || 0,
          dynamicFieldsSchema: step.dynamicFieldsSchema || '',
          evidenceRule: step.evidenceRule || '',
        })) || [],
    });
    setIsCreating(true);
  };

  return (
    <div
      id="tour-process-tab-content"
      className="flex flex-col gap-8 w-full max-w-4xl mx-auto pb-20"
    >
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
            id="tour-process-create"
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition shadow-sm hover:shadow-md"
          >
            <FiPlus size={16} />
            Thêm quy trình mẫu
          </button>
        )}
      </div>
      {systemTemplates.length > 0 && !isCreating && (
        <div className="mt-8">
          <h3 className="text-lg font-black text-stone-900 mb-4">Mẫu quy trình hệ thống gợi ý</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-stone-50 p-5 rounded-2xl border border-stone-200 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-stone-800 text-base">{template.name}</h4>
                  <p className="text-xs text-stone-500 mt-1 mb-3 line-clamp-2">
                    {template.description || 'Quy trình chuẩn được hệ thống đề xuất.'}
                  </p>
                  <div className="flex flex-col gap-2 mb-4">
                    {template.steps?.slice(0, 3).map((step, idx) => {
                      let fieldCount = 0;
                      let parsedFields: Array<{ label?: string; name?: string; unit?: string }> =
                        [];
                      if (step.dynamicFieldsSchema) {
                        try {
                          const p: unknown = JSON.parse(step.dynamicFieldsSchema);
                          if (Array.isArray(p)) {
                            parsedFields = p as Array<{
                              label?: string;
                              name?: string;
                              unit?: string;
                            }>;
                            fieldCount = parsedFields.length;
                          }
                        } catch {}
                      }

                      let ruleObj: { photo?: string; gps?: string } | null = null;
                      if (step.evidenceRule) {
                        try {
                          ruleObj = JSON.parse(step.evidenceRule) as {
                            photo?: string;
                            gps?: string;
                          };
                        } catch {}
                      }

                      return (
                        <div
                          key={idx}
                          className="bg-white p-2.5 rounded-xl border border-stone-200/80"
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                            <span>
                              {idx + 1}. {step.title}
                            </span>
                            {fieldCount > 0 && (
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                                📋 {fieldCount} thông số
                              </span>
                            )}
                          </div>
                          {(parsedFields.length > 0 ||
                            ruleObj?.photo === 'REQUIRED' ||
                            ruleObj?.gps === 'REQUIRED') && (
                            <div className="flex flex-wrap items-center gap-1 mt-1.5 pt-1.5 border-t border-stone-100">
                              {parsedFields.slice(0, 3).map((f, fIdx) => (
                                <span
                                  key={fIdx}
                                  className="text-[10px] bg-stone-50 text-stone-600 px-1.5 py-0.5 rounded border border-stone-200/70"
                                >
                                  {f.label || f.name}
                                  {f.unit ? ` (${f.unit})` : ''}
                                </span>
                              ))}
                              {parsedFields.length > 3 && (
                                <span className="text-[10px] text-stone-400 font-semibold">
                                  +{parsedFields.length - 3}
                                </span>
                              )}
                              {ruleObj?.photo === 'REQUIRED' && (
                                <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-bold ml-auto">
                                  📷 Ảnh
                                </span>
                              )}
                              {ruleObj?.gps === 'REQUIRED' && (
                                <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-bold">
                                  📍 GPS
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {template.steps && template.steps.length > 3 && (
                      <span className="text-[11px] text-stone-400 font-medium pl-1">
                        ... và còn {template.steps.length - 3} bước nữa
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleCloneSystemTemplate(template)}
                  className="w-full py-2 bg-white border border-emerald-300 text-emerald-700 font-bold text-sm rounded-xl hover:bg-emerald-50 transition"
                >
                  Sử dụng mẫu này
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

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
            <div id="tour-process-form-name">
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

          <div id="tour-process-form-builder" className="pt-4 border-t border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-stone-800">Cấu trúc Quy trình (Kéo thả để sắp xếp)</h4>
            </div>

            {errors.steps?.root && (
              <p className="text-xs text-red-500 mb-3">{errors.steps.root.message}</p>
            )}

            <TemplateBuilder
              fields={fields}
              move={move}
              remove={remove}
              onAdd={() =>
                append({
                  stepOrder: fields.length + 1,
                  stepType: 'OTHER',
                  title: '',
                  description: '',
                  estimatedDays: 0,
                })
              }
              onEdit={(index) => setEditingIndex(index === editingIndex ? null : index)}
              getValues={(index) => getValues().steps[index] as unknown as TemplateBlock}
              renderEditForm={(index) =>
                editingIndex === index ? (
                  <EditBlockModal
                    index={index}
                    onClose={() => setEditingIndex(null)}
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    getValues={getValues}
                    isGenerating={isGenerating}
                    onGenerateDesc={(prompt, cb) => {
                      generateDesc(
                        { prompt },
                        {
                          onSuccess: (res) => cb(res.replyMessage),
                        },
                      );
                    }}
                    previousStepTitle={
                      index > 0 ? getValues(`steps.${index - 1}.title`) : undefined
                    }
                  />
                ) : null
              }
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-5 py-2.5 text-stone-500 hover:bg-stone-100 rounded-xl font-bold text-sm transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              id="tour-process-form-submit"
              type="submit"
              disabled={isPending}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold rounded-xl text-sm transition shadow-sm hover:shadow flex items-center gap-2 cursor-pointer"
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
                    {template.steps?.map((step, idx) => {
                      let fieldCount = 0;
                      let parsedFields: Array<{
                        label?: string;
                        name?: string;
                        unit?: string;
                        required?: boolean;
                      }> = [];
                      if (step.dynamicFieldsSchema) {
                        try {
                          const p: unknown = JSON.parse(step.dynamicFieldsSchema);
                          if (Array.isArray(p)) {
                            parsedFields = p as Array<{
                              label?: string;
                              name?: string;
                              unit?: string;
                              required?: boolean;
                            }>;
                            fieldCount = parsedFields.length;
                          }
                        } catch {}
                      }

                      let ruleObj: { photo?: string; gps?: string } | null = null;
                      if (step.evidenceRule) {
                        try {
                          ruleObj = JSON.parse(step.evidenceRule) as {
                            photo?: string;
                            gps?: string;
                          };
                        } catch {}
                      }

                      return (
                        <div
                          key={step.id || idx}
                          className="flex flex-col gap-1.5 px-3 py-2.5 bg-stone-50 border border-stone-200/80 rounded-xl min-w-[240px] max-w-sm"
                        >
                          <div className="flex items-center justify-between gap-2 text-xs font-bold text-stone-800">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-black text-stone-500 border border-stone-200 shadow-xs">
                                {idx + 1}
                              </span>
                              <span>{step.title}</span>
                            </div>
                            {fieldCount > 0 && (
                              <span className="text-[10px] bg-emerald-100/80 text-emerald-800 font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                                📋 {fieldCount}
                              </span>
                            )}
                          </div>

                          {step.estimatedDays !== undefined && step.estimatedDays !== null && (
                            <span className="text-[10px] text-emerald-600 font-medium pl-7">
                              <FiZap className="inline mr-0.5" />
                              {idx === 0
                                ? `Sau khi tạo lô: ${step.estimatedDays} ngày`
                                : `Sau bước "${template.steps![idx - 1]?.title || 'trước'}": ${step.estimatedDays} ngày`}
                            </span>
                          )}

                          {parsedFields.length > 0 && (
                            <div className="flex flex-wrap gap-1 pl-7 pt-1 border-t border-stone-200/60">
                              {parsedFields.map((f, fIdx) => (
                                <span
                                  key={fIdx}
                                  className="text-[10px] font-medium bg-white text-stone-700 px-1.5 py-0.5 rounded border border-stone-200"
                                >
                                  {f.label || f.name}
                                  {f.unit ? ` (${f.unit})` : ''}
                                  {f.required ? ' *' : ''}
                                </span>
                              ))}
                            </div>
                          )}

                          {(ruleObj?.photo === 'REQUIRED' || ruleObj?.gps === 'REQUIRED') && (
                            <div className="flex items-center gap-1.5 pl-7 text-[10px] font-bold">
                              {ruleObj?.photo === 'REQUIRED' && (
                                <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                  📷 Ảnh bắt buộc
                                </span>
                              )}
                              {ruleObj?.gps === 'REQUIRED' && (
                                <span className="text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                  📍 GPS bắt buộc
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
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
