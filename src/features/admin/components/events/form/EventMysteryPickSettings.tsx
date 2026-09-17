'use client';

import React from 'react';
import {
  Sparkles,
  Moon,
  Gift,
  Wheat,
  Zap,
  Snowflake,
  Award,
  Palette,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type {
  MysteryPickConceptId,
  MysteryPickItem,
  MysteryPickConceptConfig,
} from '@/features/events/types/eventMinigameTypes';

export interface EventMysteryPickSettingsProps {
  effectiveMysteryPickConcept: MysteryPickConceptConfig;
  mysteryPickConcept: MysteryPickConceptId;
  onSelectMysteryConcept: (conceptId: MysteryPickConceptId) => void;
  customPickTitle: string;
  onCustomPickTitleChange: (val: string) => void;
  customPickSubtitle: string;
  onCustomPickSubtitleChange: (val: string) => void;
  customPickItems: MysteryPickItem[];
  onPickItemChange: (index: number, field: keyof MysteryPickItem, val: string) => void;
  onResetPickItemsToConcept: () => void;
}

const MYSTERY_CONCEPT_OPTIONS: Array<{
  id: MysteryPickConceptId;
  label: string;
  sub: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'AUTO', label: 'Tự Động Theo Theme', sub: 'Khuyên Dùng', icon: Sparkles },
  { id: 'TRUNG_THU', label: 'Bánh Trung Thu', sub: 'Tết Trung Thu', icon: Moon },
  { id: 'TET_NGUYEN_DAN', label: 'Bao Lì Xì Đỏ', sub: 'Tết & Xuân', icon: Gift },
  { id: 'MUA_VANG', label: 'Nông Sản Vàng', sub: 'Mùa Vàng / OCOP', icon: Wheat },
  { id: 'MEGA_SALE', label: 'Hộp Quà Bí Ẩn', sub: 'Mega Sale / Deal', icon: Zap },
  { id: 'GIANG_SINH', label: 'Quà Giáng Sinh', sub: 'Noel / Năm Mới', icon: Snowflake },
  { id: 'DAI_LE', label: 'Hộp Quà Bản Sắc', sub: 'Đại Lễ & Văn Hóa', icon: Award },
  { id: 'CUSTOM', label: 'Tùy Chỉnh Riêng', sub: 'Tự Thiết Kế', icon: Palette },
];

export function EventMysteryPickSettings({
  effectiveMysteryPickConcept,
  mysteryPickConcept,
  onSelectMysteryConcept,
  customPickTitle,
  onCustomPickTitleChange,
  customPickSubtitle,
  onCustomPickSubtitleChange,
  customPickItems,
  onPickItemChange,
  onResetPickItemsToConcept,
}: EventMysteryPickSettingsProps) {
  return (
    <div className="pt-4 border-t border-gray-100 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
            Chủ Đề & Concept Trò Chơi Bốc Quà
          </label>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Tự động thay đổi phong cách (Bánh Trung Thu, Bao Lì Xì, Nông Sản...) hoặc tùy biến theo
            ý muốn.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span className="font-semibold">
            Đang áp dụng:{' '}
            <span className="font-bold text-amber-900">{effectiveMysteryPickConcept.tabLabel}</span>{' '}
            ({effectiveMysteryPickConcept.badgeText})
          </span>
        </div>
      </div>

      {/* Grid chọn Concept Preset */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MYSTERY_CONCEPT_OPTIONS.map((c) => {
          const isSelected = mysteryPickConcept === c.id;
          const IconComp = c.icon;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelectMysteryConcept(c.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    isSelected ? 'bg-amber-500 text-white shadow-xs' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                </div>
                {isSelected && <span className="w-2 h-2 rounded-full bg-amber-500" />}
              </div>
              <div>
                <span className="block text-xs font-bold text-gray-900 leading-tight">
                  {c.label}
                </span>
                <span className="block text-[10px] text-gray-500 mt-0.5">{c.sub}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tùy chỉnh Tiêu đề & Hướng dẫn khi chọn concept CUSTOM */}
      {mysteryPickConcept === 'CUSTOM' && (
        <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Tiêu Đề Trò Chơi Tùy Biến
            </label>
            <input
              type="text"
              value={customPickTitle}
              onChange={(e) => onCustomPickTitleChange(e.target.value)}
              placeholder="VD: Hộp Quà May Mắn"
              className="w-full px-3 py-2 text-xs font-bold text-gray-900 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Phụ Đề / Hướng Dẫn
            </label>
            <input
              type="text"
              value={customPickSubtitle}
              onChange={(e) => onCustomPickSubtitleChange(e.target.value)}
              placeholder="VD: Chọn 1 trong 6 phần quà may mắn bên dưới"
              className="w-full px-3 py-2 text-xs text-gray-800 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>
      )}

      {/* Chi tiết 6 ô bốc thăm có thể tinh chỉnh tên & mô tả */}
      <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              Tùy Chỉnh 6 Món Bốc Quà ({effectiveMysteryPickConcept.tabLabel})
            </span>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Admin có thể điều chỉnh tên gọi, đặc tính của từng món để phù hợp nhất với sản phẩm
              chiến dịch.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetPickItemsToConcept}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-gray-500" />}
            className="text-xs text-gray-600 hover:text-gray-900 border-gray-300 shrink-0 cursor-pointer"
          >
            Khôi phục mẫu chuẩn
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {customPickItems.map((item, idx) => (
            <div
              key={item.id ?? idx}
              className="p-3 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  Ô #{idx + 1}
                </span>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="Huy hiệu"
                  value={item.badge || ''}
                  onChange={(e) => onPickItemChange(idx, 'badge', e.target.value)}
                  className="text-[10px] text-right font-semibold text-gray-600 focus:outline-none border-b border-transparent focus:border-amber-400 max-w-[80px]"
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                  Tên món / phần quà
                </label>
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => onPickItemChange(idx, 'name', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder={`Món số ${idx + 1}`}
                />
              </div>

              <div>
                <label className="text-[10px] font-semibold text-gray-500 block mb-0.5">
                  Mô tả nhân / đặc tính
                </label>
                <input
                  type="text"
                  value={item.subTitle}
                  onChange={(e) => onPickItemChange(idx, 'subTitle', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-[11px] text-gray-600 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="Mô tả phụ..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
