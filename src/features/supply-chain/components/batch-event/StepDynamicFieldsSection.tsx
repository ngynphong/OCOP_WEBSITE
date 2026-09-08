import React from 'react';
import { FiFileText } from 'react-icons/fi';
import { IStepField } from '../../types/supplyChainTypes';

export interface StepDynamicFieldsSectionProps {
  stepDynamicFields: IStepField[];
  dynamicFieldValues: Record<string, { value: string | number | boolean; unit?: string }>;
  onFieldChange: (key: string, value: string | number | boolean, unit?: string) => void;
  isLotCodeField: (field: IStepField) => boolean;
}

export const StepDynamicFieldsSection: React.FC<StepDynamicFieldsSectionProps> = ({
  stepDynamicFields,
  dynamicFieldValues,
  onFieldChange,
  isLotCodeField,
}) => {
  if (stepDynamicFields.length === 0) return null;

  return (
    <div className="mt-5 border border-emerald-200 rounded-xl overflow-hidden bg-white shadow-xs">
      <div className="bg-emerald-50/90 px-4 py-3 flex items-center justify-between border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <FiFileText className="text-emerald-700" size={16} />
          <div>
            <h4 className="font-bold text-emerald-950 text-sm">
              Thông số kỹ thuật chuẩn ({stepDynamicFields.length})
            </h4>
            <p className="text-[11px] text-emerald-800/80">
              Tự động nạp theo quy trình tiêu chuẩn của công đoạn này
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
          Quy chuẩn OCOP
        </span>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {stepDynamicFields.map((field) => {
          const current = dynamicFieldValues[field.key];
          const rawVal = current?.value;
          const isLotCode = isLotCodeField(field);

          return (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5 flex-wrap">
                  {field.label} {field.required && <span className="text-rose-500">*</span>}
                  {isLotCode && rawVal && (
                    <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 rounded">
                      ✓ Tự động điền
                    </span>
                  )}
                </span>
                {field.unit && (
                  <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.2 rounded font-semibold">
                    {field.unit}
                  </span>
                )}
              </label>

              {field.type === 'NUMBER' && (
                <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-white focus-within:border-emerald-500">
                  <input
                    type="number"
                    step="any"
                    value={rawVal !== undefined ? String(rawVal) : ''}
                    onChange={(e) => onFieldChange(field.key, e.target.value, field.unit)}
                    placeholder={`Nhập số lượng (${field.unit || 'giá trị'})...`}
                    className="flex-1 text-sm px-3 py-2 outline-none text-stone-800"
                  />
                  {field.unit && (
                    <span className="bg-stone-50 border-l border-stone-200 px-2.5 py-2 text-xs font-semibold text-stone-500">
                      {field.unit}
                    </span>
                  )}
                </div>
              )}

              {field.type === 'TEXT' && (
                <input
                  type="text"
                  value={rawVal !== undefined ? String(rawVal) : ''}
                  onChange={(e) => onFieldChange(field.key, e.target.value, field.unit)}
                  placeholder="Nhập nội dung..."
                  className="w-full border border-stone-300 rounded-lg text-sm px-3 py-2 outline-none text-stone-800 focus:border-emerald-500"
                />
              )}

              {field.type === 'SELECT' && (
                <select
                  value={rawVal !== undefined ? String(rawVal) : ''}
                  onChange={(e) => onFieldChange(field.key, e.target.value, field.unit)}
                  className="w-full border border-stone-300 rounded-lg text-sm px-3 py-2 outline-none text-stone-800 focus:border-emerald-500 bg-white"
                >
                  <option value="">-- Chọn một tùy chọn --</option>
                  {(field.options || []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'BOOLEAN' && (
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`radio_${field.key}`}
                      checked={rawVal === true}
                      onChange={() => onFieldChange(field.key, true, field.unit)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Đã đạt / Có
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name={`radio_${field.key}`}
                      checked={rawVal === false}
                      onChange={() => onFieldChange(field.key, false, field.unit)}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    Chưa đạt / Không
                  </label>
                </div>
              )}

              {field.type === 'DATE' && (
                <input
                  type="date"
                  value={rawVal !== undefined ? String(rawVal) : ''}
                  onChange={(e) => onFieldChange(field.key, e.target.value, field.unit)}
                  className="w-full border border-stone-300 rounded-lg text-sm px-3 py-2 outline-none text-stone-800 focus:border-emerald-500 bg-white"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
