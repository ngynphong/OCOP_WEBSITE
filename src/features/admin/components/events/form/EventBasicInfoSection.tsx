'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { EVENT_TYPE_CONFIG, type EventType } from '@/features/events/types/eventTypes';

export interface EventBasicInfoSectionProps {
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
  isHomeFeatured: boolean;
  onIsHomeFeaturedChange: (val: boolean) => void;
}

export function EventBasicInfoSection({
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
  isHomeFeatured,
  onIsHomeFeaturedChange,
}: EventBasicInfoSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold text-gray-900">
            1. Thông Tin Chung & Lịch Trình Tổ Chức
          </h2>
          <p className="text-xs text-gray-500">
            Đặt tên, phân loại, đường dẫn truy cập và thời gian diễn ra chiến dịch
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tên sự kiện */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Tên Sự Kiện <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ví dụ: Tết Nguyên Đán 2026 - Tinh Hoa Nông Sản Việt"
            className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium transition"
            required
          />
        </div>

        {/* Loại sự kiện */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Phân Loại Sự Kiện <span className="text-red-500">*</span>
          </label>
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as EventType)}
            className="w-full px-4 py-2.5 rounded-xl text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white font-medium"
          >
            {Object.values(EVENT_TYPE_CONFIG).map((cfg) => (
              <option key={cfg.id} value={cfg.id}>
                {cfg.description}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-[11px] text-gray-400">
            Hệ thống phân bổ danh mục và huy hiệu phù hợp với phân loại này.
          </p>
        </div>

        {/* Mã code */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Mã Sự Kiện (Unique Code) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => onCodeChange(e.target.value.toUpperCase())}
            placeholder="TET_OCOP_2026"
            className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-mono font-bold uppercase"
            required
          />
          <p className="mt-1.5 text-[11px] text-gray-400">
            Mã định danh nội bộ để đối soát doanh thu và vận hành.
          </p>
        </div>

        {/* Đường dẫn URL Slug */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Đường Dẫn Công Khai<span className="text-red-500">*</span>
          </label>
          <div className="flex items-center rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 bg-white overflow-hidden">
            <span className="px-3.5 py-2.5 bg-gray-100 text-gray-500 text-xs font-mono border-r border-gray-200 select-none">
              https://ocop.iesconnect.vn/events/
            </span>
            <input
              type="text"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value.toLowerCase())}
              placeholder="tet-ocop-2026"
              className="flex-1 px-3.5 py-2.5 text-gray-800 focus:outline-none text-sm font-mono font-semibold"
              required
            />
          </div>
        </div>

        {/* Thời gian bắt đầu */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Thời Gian Bắt Đầu <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => onStartAtChange(e.target.value)}
            className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            required
          />
        </div>

        {/* Thời gian kết thúc */}
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Thời Gian Kết Thúc <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => onEndAtChange(e.target.value)}
            className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            required
          />
        </div>

        {/* Mô tả chiến dịch */}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Mô Tả & Thông Điệp Chiến Dịch
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            placeholder="Thông điệp truyền thông chính giới thiệu sự kiện đến người tiêu dùng..."
            className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Tùy chọn hiển thị Trang chủ */}
        <div className="md:col-span-2">
          <label className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 transition cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isHomeFeatured}
              onChange={(e) => onIsHomeFeaturedChange(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
            />
            <div>
              <span className="text-sm font-bold text-gray-800 block">
                Kích hoạt thay thế Hero Banner & Theme trên Trang chủ khi sự kiện LIVE
              </span>
              <span className="text-xs text-gray-500 block">
                Khi đến giờ diễn ra, sự kiện sẽ xuất hiện trang trọng trên toàn bộ trang chủ OCOP.
              </span>
            </div>
          </label>
        </div>
      </div>
    </section>
  );
}
