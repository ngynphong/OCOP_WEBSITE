import React from 'react';
import { FiEdit2, FiPlus, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';

export interface MetadataField {
  key: string;
  value: string;
  unit: string;
}

export interface MetadataFieldsSectionProps {
  metadataFields: MetadataField[];
  availableTags: string[];
  onAddField: () => void;
  onAddTag: (tag: string) => void;
  onUpdateField: (index: number, field: 'key' | 'value' | 'unit', value: string) => void;
  onRemoveField: (index: number) => void;
  isAiChecking: boolean;
  aiWarning: string | null;
}

export const MetadataFieldsSection: React.FC<MetadataFieldsSectionProps> = ({
  metadataFields,
  availableTags,
  onAddField,
  onAddTag,
  onUpdateField,
  onRemoveField,
  isAiChecking,
  aiWarning,
}) => {
  return (
    <div className="mt-6 border border-stone-200 rounded-xl overflow-hidden">
      <div className="bg-stone-50 px-4 py-3 flex justify-between items-start border-b border-stone-200">
        <div>
          <h4 className="font-semibold text-stone-800 text-sm">Dữ liệu mở rộng</h4>
          <p className="text-xs text-stone-500 mt-0.5 max-w-[200px] md:max-w-none">
            Ghi nhận thêm thông số đo đạc thực tế
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAddField}
          leftIcon={<FiEdit2 />}
        >
          Tự nhập tay
        </Button>
      </div>

      {availableTags.length > 0 && (
        <div className="bg-white px-4 pt-3 pb-1 flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => onAddTag(tag)}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100 rounded-lg text-xs font-medium transition-colors"
            >
              <FiPlus size={12} /> {tag}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 space-y-3 bg-white">
        {metadataFields.length === 0 ? (
          <div className="text-center py-4 text-sm text-stone-400 italic">
            Chưa có thông số nào được thêm.
          </div>
        ) : (
          metadataFields.map((field, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Tên thông số (vd: Nhiệt độ)"
                value={field.key}
                onChange={(e) => onUpdateField(idx, 'key', e.target.value)}
                className="flex-1 border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              <span className="text-stone-400">:</span>
              <input
                type="text"
                placeholder="Giá trị (vd: 25)"
                value={field.value}
                onChange={(e) => onUpdateField(idx, 'value', e.target.value)}
                className="flex-1 min-w-0 border border-stone-300 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              />
              <select
                value={field.unit}
                onChange={(e) => onUpdateField(idx, 'unit', e.target.value)}
                className="w-[100px] border border-stone-300 text-gray-700 text-sm rounded-lg px-2 py-2 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="">- Đơn vị -</option>
                <option value="°C">°C</option>
                <option value="kg">kg</option>
                <option value="g">gram (g)</option>
                <option value="lít">lít (l)</option>
                <option value="ml">ml</option>
                <option value="giờ">giờ</option>
                <option value="phút">phút</option>
                <option value="ngày">ngày</option>
                <option value="%">%</option>
                <option value="cái">cái</option>
              </select>
              <button
                type="button"
                onClick={() => onRemoveField(idx)}
                className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          ))
        )}

        {isAiChecking && (
          <div className="text-xs text-stone-500 animate-pulse mt-2">
            Đang kiểm tra tiêu chuẩn OCOP...
          </div>
        )}

        {aiWarning && !isAiChecking && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <FiAlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
            <div>
              <h4 className="text-sm font-semibold text-red-800">Phát hiện vi phạm</h4>
              <p className="text-sm text-red-700 mt-1">{aiWarning}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
