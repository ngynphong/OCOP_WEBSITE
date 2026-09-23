'use client';

import React from 'react';
import { EVENT_TYPE_CONFIG, type EventType } from '@/features/events/types/eventTypes';

export interface ModalBasicInfoFieldsProps {
  name: string;
  onNameChange: (val: string) => void;
  type: EventType;
  onTypeChange: (val: EventType) => void;
  code: string;
  onCodeChange: (val: string) => void;
  slug: string;
  onSlugChange: (val: string) => void;
  startAt: string;
  onStartAtChange: (val: string) => void;
  endAt: string;
  onEndAtChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
}

export function ModalBasicInfoFields({
  name,
  onNameChange,
  type,
  onTypeChange,
  code,
  onCodeChange,
  slug,
  onSlugChange,
  startAt,
  onStartAtChange,
  endAt,
  onEndAtChange,
  description,
  onDescriptionChange,
}: ModalBasicInfoFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Tên sự kiện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="VD: Tết OCOP 2026 - Xuân Sum Vầy"
            className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Loại sự kiện <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as EventType)}
            className="w-full px-3.5 py-2 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
          >
            {Object.values(EVENT_TYPE_CONFIG).map((cfg) => (
              <option key={cfg.id} value={cfg.id}>
                {cfg.description}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-gray-400">
            Phân loại để hệ thống áp dụng cấu hình và phân bổ vị trí hiển thị phù hợp.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Mã sự kiện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="TET_OCOP_2026"
            className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
            required
          />
          <p className="mt-1 text-[11px] text-gray-400">
            Mã nội bộ duy nhất dùng để đối soát dữ liệu.
          </p>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Đường dẫn (Slug) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => onSlugChange(e.target.value.toLowerCase())}
            placeholder="tet-ocop-2026"
            className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
            required
          />
          <p className="mt-1 text-[11px] text-gray-500 truncate">
            🔗 URL sự kiện:{' '}
            <span className="text-amber-600 font-medium">/events/{slug || 'slug-su-kien'}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Thời gian bắt đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => onStartAtChange(e.target.value)}
            className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
            Thời gian kết thúc <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => onEndAtChange(e.target.value)}
            className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
          Mô tả chiến dịch
        </label>
        <textarea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          rows={2}
          placeholder="Thông điệp chính của sự kiện..."
          className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
        />
      </div>
    </>
  );
}

export default ModalBasicInfoFields;
