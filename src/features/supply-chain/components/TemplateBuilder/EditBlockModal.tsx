'use client';

import React, { useState } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormGetValues } from 'react-hook-form';
import {
  FiX,
  FiZap,
  FiPlus,
  FiTrash2,
  FiCamera,
  FiMapPin,
  FiVideo,
  FiFileText,
  FiSliders,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { ProcessTemplateFormData } from '@/features/products/components/ProductDetail/ProcessTemplateTab';
import {
  IStepField,
  IEvidenceRule,
  TStepFieldType,
  TRuleRequirement,
} from '@/features/supply-chain/types/supplyChainTypes';

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

const FIELD_TYPES: { value: TStepFieldType; label: string }[] = [
  { value: 'NUMBER', label: 'Số đo (Kèm đơn vị)' },
  { value: 'TEXT', label: 'Văn bản ngắn' },
  { value: 'SELECT', label: 'Chọn từ danh sách' },
  { value: 'BOOLEAN', label: 'Bật / Tắt (Có / Không)' },
  { value: 'DATE', label: 'Ngày tháng' },
];

interface IRawStepField {
  id?: string;
  key?: string;
  name?: string;
  label?: string;
  type?: string;
  required?: boolean;
  unit?: string;
  options?: string[];
  order?: number;
}

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
  const [modalTab, setModalTab] = useState<'BASIC' | 'FORM' | 'EVIDENCE'>('BASIC');

  // ── Dynamic Form Fields State ──
  const [fields, setFields] = useState<IStepField[]>(() => {
    const raw = getValues(`steps.${index}.dynamicFieldsSchema`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return (parsed as IRawStepField[]).map((f, i) => ({
            id: f.id || String(i),
            key: f.key || f.name || `field_${i}`,
            label: f.label || f.name || `Thông số ${i + 1}`,
            type: (f.type || 'TEXT').toUpperCase() as TStepFieldType,
            required: Boolean(f.required),
            unit: f.unit || undefined,
            options: f.options || undefined,
            order: f.order ?? i + 1,
          }));
        }
        return [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // ── Evidence Rule State ──
  const [evidence, setEvidence] = useState<IEvidenceRule>(() => {
    const raw = getValues(`steps.${index}.evidenceRule`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return { photo: 'OPTIONAL', gps: 'OPTIONAL', video: 'OPTIONAL' };
      }
    }
    return { photo: 'OPTIONAL', gps: 'OPTIONAL', video: 'OPTIONAL' };
  });

  // New field input draft
  const [newLabel, setNewLabel] = useState('');
  const [newKey, setNewKey] = useState('');
  const [newType, setNewType] = useState<TStepFieldType>('NUMBER');
  const [newUnit, setNewUnit] = useState('');
  const [newRequired, setNewRequired] = useState(true);
  const [newOptionsStr, setNewOptionsStr] = useState('');

  const updateFieldsState = (newFields: IStepField[]) => {
    setFields(newFields);
    setValue(`steps.${index}.dynamicFieldsSchema`, JSON.stringify(newFields));
  };

  const updateEvidenceState = (updated: IEvidenceRule) => {
    setEvidence(updated);
    setValue(`steps.${index}.evidenceRule`, JSON.stringify(updated));
  };

  const handleAddField = () => {
    if (!newLabel.trim()) {
      toast.error('Vui lòng nhập tên trường dữ liệu!');
      return;
    }

    const key = newKey.trim() || `field_${Date.now()}`;
    const options =
      newType === 'SELECT'
        ? newOptionsStr
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        : undefined;

    const newField: IStepField = {
      id: String(Date.now()),
      key,
      label: newLabel.trim(),
      type: newType,
      required: newRequired,
      unit: newUnit.trim() || undefined,
      options,
      order: fields.length + 1,
    };

    updateFieldsState([...fields, newField]);
    setNewLabel('');
    setNewKey('');
    setNewUnit('');
    setNewOptionsStr('');
    toast.success(`Đã thêm trường "${newField.label}"`);
  };

  const handleRemoveField = (fieldKey: string) => {
    updateFieldsState(fields.filter((f) => f.key !== fieldKey));
  };

  const renderRequirementButtons = (
    value: TRuleRequirement,
    onChange: (req: TRuleRequirement) => void,
  ) => (
    <div className="grid grid-cols-3 gap-2">
      <button
        type="button"
        onClick={() => onChange('REQUIRED')}
        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
          value === 'REQUIRED'
            ? 'bg-rose-50 border-rose-500 text-rose-700 shadow-xs'
            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
        }`}
      >
        Bắt buộc
      </button>
      <button
        type="button"
        onClick={() => onChange('OPTIONAL')}
        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
          value === 'OPTIONAL'
            ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
            : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
        }`}
      >
        Tùy chọn
      </button>
      <button
        type="button"
        onClick={() => onChange('DISABLED')}
        className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
          value === 'DISABLED'
            ? 'bg-stone-100 border-stone-400 text-stone-700 shadow-xs'
            : 'bg-white border-stone-200 text-stone-400 hover:border-stone-300'
        }`}
      >
        Không yêu cầu
      </button>
    </div>
  );

  return (
    <div className="mt-2 ml-14 mr-4 bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden flex flex-col animate-in slide-in-from-top-2">
      {/* Modal Top Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-stone-100 bg-stone-50">
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

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 bg-white px-3 gap-1">
        <button
          type="button"
          onClick={() => setModalTab('BASIC')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            modalTab === 'BASIC'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FiSliders className="w-3.5 h-3.5" />
          <span>Thông tin cơ bản</span>
        </button>
        <button
          type="button"
          onClick={() => setModalTab('FORM')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            modalTab === 'FORM'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FiFileText className="w-3.5 h-3.5" />
          <span>Biểu mẫu động ({fields.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setModalTab('EVIDENCE')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
            modalTab === 'EVIDENCE'
              ? 'border-emerald-600 text-emerald-700'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FiCamera className="w-3.5 h-3.5" />
          <span>Quy tắc bằng chứng</span>
        </button>
      </div>

      {/* Tab 1: Basic Info */}
      {modalTab === 'BASIC' && (
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
              <label className="text-xs font-bold text-stone-500 uppercase">
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
      )}

      {/* Tab 2: Dynamic Form Fields */}
      {modalTab === 'FORM' && (
        <div className="p-4 flex flex-col gap-4">
          <p className="text-xs text-stone-500">
            Cấu hình các trường thông số cần ghi nhận khi người nông dân thực hiện công đoạn này
            trên ứng dụng Mobile.
          </p>

          {/* List of current fields */}
          {fields.length > 0 ? (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {fields.map((field) => (
                <div
                  key={field.key}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-200 bg-stone-50/70"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-stone-900">{field.label}</span>
                      {field.required && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">
                          Bắt buộc
                        </span>
                      )}
                      {field.unit && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                          {field.unit}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">
                      Mã: <code className="text-stone-600">{field.key}</code> • Kiểu: {field.type}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.key)}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center border border-dashed border-stone-300 rounded-xl bg-stone-50/50">
              <p className="text-xs text-stone-400 italic">
                Chưa có trường dữ liệu nào. Hãy thêm trường bên dưới.
              </p>
            </div>
          )}

          {/* Add new field form */}
          <div className="p-3.5 border border-emerald-200/80 rounded-xl bg-emerald-50/30 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-emerald-800 uppercase flex items-center gap-1.5">
              <FiPlus className="w-3.5 h-3.5 text-emerald-600" />
              Thêm trường thông số mới
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                  Tên trường (Nhãn hiển thị) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => {
                    setNewLabel(e.target.value);
                    if (!newKey) {
                      setNewKey(
                        e.target.value
                          .toLowerCase()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .replace(/[^a-z0-9]/g, '_'),
                      );
                    }
                  }}
                  placeholder="VD: Liều lượng phân bón"
                  className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                  Kiểu dữ liệu
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as TStepFieldType)}
                  className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                >
                  {FIELD_TYPES.map((ft) => (
                    <option key={ft.value} value={ft.value}>
                      {ft.label}
                    </option>
                  ))}
                </select>
              </div>

              {newType === 'NUMBER' && (
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                    Đơn vị đo
                  </label>
                  <input
                    type="text"
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="VD: kg, lít, độ Brix, °C..."
                    className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                  />
                </div>
              )}

              {newType === 'SELECT' && (
                <div className="col-span-full">
                  <label className="text-[11px] font-semibold text-stone-600 mb-1 block">
                    Các lựa chọn (ngăn cách bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={newOptionsStr}
                    onChange={(e) => setNewOptionsStr(e.target.value)}
                    placeholder="VD: Phân hữu cơ, Phân vi sinh, Phân trùn quế"
                    className="w-full border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs outline-none bg-white focus:border-emerald-500"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id="chk-req"
                  checked={newRequired}
                  onChange={(e) => setNewRequired(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="chk-req" className="text-xs font-medium text-stone-700 select-none">
                  Bắt buộc nông dân phải nhập
                </label>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddField}
              className="mt-1 py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <FiPlus size={14} /> Thêm vào biểu mẫu
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Evidence Rules */}
      {modalTab === 'EVIDENCE' && (
        <div className="p-4 flex flex-col gap-5">
          <p className="text-xs text-stone-500">
            Quy định các bằng chứng bắt buộc ngoài hiện trường mà nông dân phải cung cấp khi xác
            nhận hoàn thành công đoạn.
          </p>

          {/* Photo requirement */}
          <div className="flex flex-col gap-2 p-3.5 border border-stone-200 rounded-xl bg-stone-50/50">
            <div className="flex items-center gap-2">
              <FiCamera className="w-4 h-4 text-emerald-600" />
              <label className="text-xs font-bold text-stone-800 uppercase">
                Chụp ảnh thực địa (Camera Photo)
              </label>
            </div>
            <p className="text-[11px] text-stone-500">
              Yêu cầu nông dân chụp hình ảnh bao bì phân bón, thuốc hoặc luống cây tại thời điểm làm
              việc.
            </p>
            {renderRequirementButtons(evidence.photo, (val) =>
              updateEvidenceState({ ...evidence, photo: val }),
            )}
          </div>

          {/* GPS requirement */}
          <div className="flex flex-col gap-2 p-3.5 border border-stone-200 rounded-xl bg-stone-50/50">
            <div className="flex items-center gap-2">
              <FiMapPin className="w-4 h-4 text-blue-600" />
              <label className="text-xs font-bold text-stone-800 uppercase">
                Tọa độ vị trí thực tế (GPS Coordinate)
              </label>
            </div>
            <p className="text-[11px] text-stone-500">
              Yêu cầu thiết bị bật định vị vệ tinh để xác thực người làm đang đứng trên nương/vườn.
            </p>
            {renderRequirementButtons(evidence.gps, (val) =>
              updateEvidenceState({ ...evidence, gps: val }),
            )}
          </div>

          {/* Video requirement */}
          <div className="flex flex-col gap-2 p-3.5 border border-stone-200 rounded-xl bg-stone-50/50">
            <div className="flex items-center gap-2">
              <FiVideo className="w-4 h-4 text-purple-600" />
              <label className="text-xs font-bold text-stone-800 uppercase">
                Video quay thao tác (Video Clip)
              </label>
            </div>
            <p className="text-[11px] text-stone-500">
              Quay video ngắn (dưới 15 giây) ghi lại thao tác kỹ thuật hoặc máy móc vận hành.
            </p>
            {renderRequirementButtons(evidence.video, (val) =>
              updateEvidenceState({ ...evidence, video: val }),
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-3 border-t border-stone-100 bg-stone-50 flex justify-between items-center">
        <span className="text-xs text-stone-400 pl-2">
          {fields.length > 0
            ? `Đã cấu hình ${fields.length} trường động`
            : 'Chưa có trường động nào'}
        </span>
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
