'use client';

import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { CONCEPT_PACKS, type ConceptPack } from '@/features/events/constants/decorationPacks';
import { CONCEPT_ICONS } from '@/features/events/constants/themePresets';
import type { ConceptPackId, AtmosphereEffectType } from '@/features/events/types/eventTypes';

export interface EventConceptSectionProps {
  conceptId: ConceptPackId;
  onSelectConcept: (pack: ConceptPack) => void;
  enableAtmosphere: boolean;
  onEnableAtmosphereChange: (val: boolean) => void;
  atmosphereType: AtmosphereEffectType;
  onAtmosphereTypeChange: (val: AtmosphereEffectType) => void;
  enableCornerStickers: boolean;
  onEnableCornerStickersChange: (val: boolean) => void;
  onOpenSvgGallery: (target: 'left' | 'right') => void;
}

export function EventConceptSection({
  conceptId,
  onSelectConcept,
  enableAtmosphere,
  onEnableAtmosphereChange,
  atmosphereType,
  onAtmosphereTypeChange,
  enableCornerStickers,
  onEnableCornerStickersChange,
  onOpenSvgGallery,
}: EventConceptSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">4. Concept Trang Trí & Hiệu Ứng</h2>
            <p className="text-xs text-gray-500">
              Cấu hình hiệu ứng rơi lất phất và họa tiết trang trí góc theo chủ đề văn hóa
            </p>
          </div>
        </div>
      </div>

      {/* Concept Packs Grid */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
          Chọn Gói Concept Mỹ Thuật
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {CONCEPT_PACKS.map((pack) => {
            const isSelected = conceptId === pack.id;
            const IconComp = CONCEPT_ICONS[pack.id] || Sparkles;

            return (
              <button
                key={pack.id}
                type="button"
                onClick={() => onSelectConcept(pack)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-sm ring-2 ring-emerald-500/20'
                    : 'border-gray-200 hover:border-emerald-300 bg-white hover:bg-gray-50/50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {pack.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                    {pack.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                    {pack.subtitle}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 text-[10px] text-gray-400 space-y-1">
                  <div>
                    ✨ Hiệu ứng:{' '}
                    <span className="text-gray-700 font-medium">{pack.atmosphereLabel}</span>
                  </div>
                  <div>
                    🎨 Trang trí:{' '}
                    <span className="text-gray-700 font-medium">{pack.cornerLabel}</span>
                  </div>
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

      {/* Atmosphere & Corner Stickers Controls */}
      <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-4">
        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
          Tùy Biến Hiệu Ứng Động
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Atmosphere Toggle */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-2xs">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-xs font-bold text-gray-800">Hiệu Ứng Động</span>
              <input
                type="checkbox"
                checked={enableAtmosphere}
                onChange={(e) => onEnableAtmosphereChange(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
            <select
              value={atmosphereType}
              disabled={!enableAtmosphere}
              onChange={(e) => onAtmosphereTypeChange(e.target.value as AtmosphereEffectType)}
              className="w-full px-3 py-2 rounded-lg text-xs text-gray-700 border border-gray-300 focus:ring-2 focus:ring-emerald-500 bg-white disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              <option value="apricot_petals">🌸 Cánh hoa mai / hoa đào rơi</option>
              <option value="golden_leaves">🌾 Lá lúa vàng bay nhẹ</option>
              <option value="starlight">✨ Ánh sao đêm thu & đom đóm</option>
              <option value="confetti">🎉 Pháo giấy lễ hội chúc mừng</option>
              <option value="snowflakes">❄️ Bông tuyết trắng mùa đông</option>
            </select>
          </div>

          {/* Corner Stickers Toggle */}
          <div className="p-4 bg-white rounded-xl border border-gray-200 space-y-3 shadow-2xs">
            <label className="flex items-center justify-between cursor-pointer select-none">
              <span className="text-xs font-bold text-gray-800">
                Họa Tiết Trang Trí Góc (Corner Stickers)
              </span>
              <input
                type="checkbox"
                checked={enableCornerStickers}
                onChange={(e) => onEnableCornerStickersChange(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!enableCornerStickers}
                onClick={() => onOpenSvgGallery('left')}
                className="flex-1"
              >
                Họa tiết góc Trái
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!enableCornerStickers}
                onClick={() => onOpenSvgGallery('right')}
                className="flex-1"
              >
                Họa tiết góc Phải
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
