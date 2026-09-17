'use client';

import React from 'react';
import { Palette, Sparkles, Check } from 'lucide-react';
import {
  THEME_PRESETS,
  PRESET_ICONS,
  type ThemePreset,
} from '@/features/events/constants/themePresets';

export interface EventThemeSectionProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: ThemePreset) => void;
  primaryColor: string;
  onPrimaryColorChange: (val: string) => void;
  secondaryColor: string;
  onSecondaryColorChange: (val: string) => void;
  surfaceColor: string;
  onSurfaceColorChange: (val: string) => void;
  eventName?: string;
}

export function EventThemeSection({
  selectedPresetId,
  onSelectPreset,
  primaryColor,
  onPrimaryColorChange,
  secondaryColor,
  onSecondaryColorChange,
  surfaceColor,
  onSurfaceColorChange,
  eventName,
}: EventThemeSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              3. Bảng Màu Theme & Nhận Diện Lễ Hội
            </h2>
            <p className="text-xs text-gray-500">
              Chọn nhanh Theme Preset chuẩn hóa hoặc tùy biến mã màu nhận diện chiến dịch
            </p>
          </div>
        </div>
      </div>

      {/* Presets Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Chọn Bộ Theme Lễ Hội Có Sẵn (Presets)
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {THEME_PRESETS.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            const IconComponent = PRESET_ICONS[preset.id] || Sparkles;

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: preset.surface, color: preset.primary }}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {preset.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {preset.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-1 leading-relaxed">
                    {preset.subtitle}
                  </p>
                </div>

                {/* Color dots preview */}
                <div className="flex items-center gap-1.5 mt-3 pt-2.5 border-t border-gray-100">
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: preset.primary }}
                    title={`Primary: ${preset.primary}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: preset.secondary }}
                    title={`Secondary: ${preset.secondary}`}
                  />
                  <span
                    className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: preset.surface }}
                    title={`Surface: ${preset.surface}`}
                  />
                </div>

                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Pickers */}
      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Tùy Chỉnh Mã Màu Nhận Diện
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Primary */}
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">
              Màu Chủ Đạo (Primary)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-9 h-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono font-bold text-gray-800"
              />
            </div>
          </div>

          {/* Secondary */}
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">
              Màu Phụ / Nhấn (Secondary)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => onSecondaryColorChange(e.target.value)}
                className="w-9 h-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => onSecondaryColorChange(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono font-bold text-gray-800"
              />
            </div>
          </div>

          {/* Surface */}
          <div className="p-3.5 bg-white rounded-xl border border-gray-200 shadow-2xs space-y-2">
            <label className="text-xs font-semibold text-gray-700 block">
              Màu Nền Bề Mặt (Surface)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={surfaceColor}
                onChange={(e) => onSurfaceColorChange(e.target.value)}
                className="w-9 h-9 rounded-lg border border-gray-300 p-0.5 cursor-pointer"
              />
              <input
                type="text"
                value={surfaceColor}
                onChange={(e) => onSurfaceColorChange(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs font-mono font-bold text-gray-800"
              />
            </div>
          </div>
        </div>

        {/* Live Preview Strip */}
        <div
          className="h-10 rounded-xl shadow-inner border border-black/10 flex items-center justify-between px-4 text-xs font-bold text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
          }}
        >
          <span>Preview Dải Màu Sự Kiện</span>
          <span className="opacity-90">{eventName || 'Tên sự kiện'}</span>
        </div>
      </div>
    </section>
  );
}
