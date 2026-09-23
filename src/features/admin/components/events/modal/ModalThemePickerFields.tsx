'use client';

import React from 'react';
import { Palette, Check, Sparkles } from 'lucide-react';
import {
  THEME_PRESETS,
  PRESET_ICONS,
  type ThemePreset,
} from '@/features/events/constants/themePresets';

export interface ModalThemePickerFieldsProps {
  selectedPresetId: string | null;
  onSelectPreset: (preset: ThemePreset) => void;
  primaryColor: string;
  onPrimaryColorChange: (val: string) => void;
  secondaryColor: string;
  onSecondaryColorChange: (val: string) => void;
  surfaceColor: string;
  onSurfaceColorChange: (val: string) => void;
}

export function ModalThemePickerFields({
  selectedPresetId,
  onSelectPreset,
  primaryColor,
  onPrimaryColorChange,
  secondaryColor,
  onSecondaryColorChange,
  surfaceColor,
  onSurfaceColorChange,
}: ModalThemePickerFieldsProps) {
  return (
    <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-amber-600" />
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Kho Bảng Màu Theme Mẫu
          </h4>
        </div>
        <span className="text-[11px] text-gray-500 hidden sm:inline">
          Nhấp chọn nhóm màu phù hợp với sự kiện
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {THEME_PRESETS.map((preset) => {
          const isSelected = selectedPresetId === preset.id;
          return (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {(() => {
                    const PresetIcon = PRESET_ICONS[preset.id] || Sparkles;
                    return (
                      <div
                        className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs"
                        style={{ backgroundColor: preset.primary }}
                      >
                        <PresetIcon className="w-3 h-3" />
                      </div>
                    );
                  })()}
                  <span className="text-xs font-bold text-gray-800 line-clamp-1">
                    {preset.name}
                  </span>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">{preset.subtitle}</p>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: preset.primary }}
                    title={`Màu chính: ${preset.primary}`}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: preset.secondary }}
                    title={`Màu phụ: ${preset.secondary}`}
                  />
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                    style={{ backgroundColor: preset.surface }}
                    title={`Màu nền: ${preset.surface}`}
                  />
                </div>
                <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                  {preset.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div
        className="p-3.5 rounded-xl border transition-colors shadow-xs"
        style={{
          backgroundColor: surfaceColor,
          borderColor: `${primaryColor}40`,
        }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-12 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-xs"
              style={{ backgroundColor: primaryColor }}
            >
              OCOP
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <span>Xem trước giao diện sự kiện</span>
                <span
                  className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  Đang áp dụng
                </span>
              </p>
              <p className="text-[11px] text-gray-600">
                Nền: <span className="font-mono">{surfaceColor}</span> • Màu chính:{' '}
                <span className="font-mono">{primaryColor}</span> • Màu phụ:{' '}
                <span className="font-mono">{secondaryColor}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs"
              style={{ backgroundColor: secondaryColor, color: '#111827' }}
            >
              Voucher 50K
            </span>
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-2xs"
              style={{ backgroundColor: primaryColor }}
            >
              Mua Ngay
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-gray-200/80">
        <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
          Tùy chỉnh mã màu thủ công
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] text-gray-600 mb-1">Màu chính</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-7 h-7 rounded text-gray-700 border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => onPrimaryColorChange(e.target.value)}
                className="w-20 px-2 py-1 text-xs text-gray-700 font-mono border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-600 mb-1">Màu phụ</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => onSecondaryColorChange(e.target.value)}
                className="w-7 h-7 rounded text-gray-700 border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={secondaryColor}
                onChange={(e) => onSecondaryColorChange(e.target.value)}
                className="w-20 px-2 py-1 text-xs text-gray-700 font-mono border border-gray-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-gray-600 mb-1">Màu nền thẻ</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={surfaceColor}
                onChange={(e) => onSurfaceColorChange(e.target.value)}
                className="w-7 h-7 rounded text-gray-700 border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={surfaceColor}
                onChange={(e) => onSurfaceColorChange(e.target.value)}
                className="w-20 px-2 py-1 text-xs text-gray-700 font-mono border border-gray-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalThemePickerFields;
