import React from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import { FiX, FiZap } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { ProcessTemplateFormData } from '@/features/products/components/ProductDetail/ProcessTemplateTab';

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

interface EditBlockModalProps {
  index: number;
  onClose: () => void;
  register: UseFormRegister<ProcessTemplateFormData>;
  errors: FieldErrors<ProcessTemplateFormData>;
  setValue: UseFormSetValue<ProcessTemplateFormData>;
  getValues: UseFormGetValues<ProcessTemplateFormData>;
  isGenerating: boolean;
  onGenerateDesc: (prompt: string, cb: (desc: string) => void) => void;
  previousStepTitle?: string;
}

export function EditBlockModal({
  index,
  onClose,
  register,
  errors,
  setValue,
  getValues,
  isGenerating,
  onGenerateDesc,
  previousStepTitle,
}: EditBlockModalProps) {
  const stepErrors = errors?.steps?.[index];

  return (
    <div className="mt-2 ml-14 mr-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col animate-in slide-in-from-top-2">
      <div className="flex items-center justify-between p-3 border-b border-stone-100 bg-stone-50">
        <h3 className="font-bold text-stone-800 text-sm">Cài đặt Khối Công Việc #{index + 1}</h3>
        <button
          id="tour-edit-block-close"
          type="button"
          onClick={onClose}
          className="p-1.5 text-stone-400 hover:text-stone-600 rounded-lg hover:bg-stone-200 transition"
        >
          <FiX size={16} />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-500 uppercase">
            Loại công việc <span className="text-red-500">*</span>
          </label>
          <select
            {...register(`steps.${index}.stepType`)}
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white shadow-sm"
          >
            {STEP_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          {stepErrors?.stepType && (
            <p className="text-xs text-red-500">{stepErrors.stepType.message as string}</p>
          )}
        </div>

        <div id="tour-edit-block-title" className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-500 uppercase">
            Tên công việc <span className="text-red-500">*</span>
          </label>
          <input
            {...register(`steps.${index}.title`)}
            placeholder="Ví dụ: Cày xới đất..."
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white shadow-sm"
          />
          {stepErrors?.title && (
            <p className="text-xs text-red-500">{stepErrors.title.message as string}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-stone-500 uppercase">Thời gian chờ</label>
          <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl overflow-hidden pr-2 focus-within:border-emerald-400 shadow-sm">
            <span className="bg-stone-50 border-r border-stone-200 px-3 py-2.5 text-sm font-medium text-stone-500">
              Sau
            </span>
            <input
              type="number"
              min="0"
              {...register(`steps.${index}.estimatedDays`, { valueAsNumber: true })}
              placeholder="0"
              className="flex-1 w-full min-w-[50px] text-gray-700 px-3 py-2 text-sm outline-none bg-transparent"
            />
            <span className="text-sm font-medium text-stone-500 pr-2">ngày</span>
          </div>
          <p className="text-[10px] text-stone-500 mt-0.5">
            {index === 0
              ? '*Kể từ lúc bắt đầu tạo lô'
              : `*Kể từ sau bước "${previousStepTitle || 'trước'}"`}
          </p>
        </div>

        <div id="tour-edit-block-ai" className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-stone-500 uppercase">Hướng dẫn cách làm</label>
            <button
              type="button"
              onClick={() => {
                const currentTitle = getValues(`steps.${index}.title`);
                const currentType = getValues(`steps.${index}.stepType`);
                const typeLabel =
                  STEP_TYPES.find((t) => t.value === currentType)?.label || currentType;

                if (!currentTitle) {
                  toast.error('Vui lòng nhập "Tên công việc" trước khi tự động tạo nhé!');
                  return;
                }

                onGenerateDesc(
                  `Viết mô tả ngắn gọn khoảng 2 câu hướng dẫn người nông dân cách thực hiện công việc "${currentTitle}" (Loại công việc: ${typeLabel}). Giọng văn mộc mạc, gần gũi, đi thẳng vào nội dung hướng dẫn.`,
                  (desc) => setValue(`steps.${index}.description`, desc),
                );
              }}
              disabled={isGenerating}
              className="flex items-center gap-1 text-[10px] font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded transition disabled:opacity-50"
            >
              <FiZap size={14} />
              {isGenerating ? 'Đang viết...' : 'Tự động tạo'}
            </button>
          </div>
          <textarea
            {...register(`steps.${index}.description`)}
            rows={3}
            placeholder="Mô tả kỹ hơn để người làm theo dễ hiểu..."
            className="w-full border border-stone-200 text-gray-700 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-emerald-400 bg-white resize-none shadow-sm"
          />
        </div>
      </div>

      <div className="p-3 border-t border-stone-100 bg-stone-50 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="px-5 py-2 bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-sm hover:bg-emerald-700 transition"
        >
          Hoàn tất
        </button>
      </div>
    </div>
  );
}
