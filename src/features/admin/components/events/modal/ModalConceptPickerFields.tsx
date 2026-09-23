'use client';

import React from 'react';
import { Sparkles, Eye, Check } from 'lucide-react';
import { CONCEPT_PACKS, type ConceptPack } from '@/features/events/constants/decorationPacks';
import type { ConceptPackId } from '@/features/events/types/eventTypes';
import { CONCEPT_ICONS } from '@/features/events/constants/themePresets';

export interface ModalConceptPickerFieldsProps {
  conceptId: ConceptPackId;
  onSelectConcept: (pack: ConceptPack) => void;
  enableAtmosphere: boolean;
  onEnableAtmosphereChange: (val: boolean) => void;
  enableCornerStickers: boolean;
  onEnableCornerStickersChange: (val: boolean) => void;
  onOpenSvgGallery: () => void;
}

export function ModalConceptPickerFields({
  conceptId,
  onSelectConcept,
  enableAtmosphere,
  onEnableAtmosphereChange,
  enableCornerStickers,
  onEnableCornerStickersChange,
  onOpenSvgGallery,
}: ModalConceptPickerFieldsProps) {
  return (
    <div className="p-4 bg-red-50/40 rounded-2xl border border-red-200/60 space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-red-600" />
          <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Gói Concept Trang Trí & Hiệu Ứng Lễ Hội
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSvgGallery}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300/80 shadow-2xs cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-700" />
            <span>Xem trước các SVG có sẵn</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CONCEPT_PACKS.map((pack) => {
          const isSelected = conceptId === pack.id;
          return (
            <button
              key={pack.id}
              type="button"
              onClick={() => onSelectConcept(pack)}
              className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between cursor-pointer ${
                isSelected
                  ? 'border-red-500 bg-red-50/70 shadow-sm ring-2 ring-red-500/20'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  {(() => {
                    const ConceptIcon = CONCEPT_ICONS[pack.id] || Sparkles;
                    return (
                      <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                        <ConceptIcon className="w-3 h-3" />
                      </div>
                    );
                  })()}
                  <span className="text-xs font-bold text-gray-800 line-clamp-1">{pack.name}</span>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 leading-tight">
                  {pack.subtitle}
                </p>
              </div>

              <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800">
                  {pack.badge}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {conceptId !== 'NONE' && (
        <div className="pt-3 border-t border-red-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={enableAtmosphere}
              onChange={(e) => onEnableAtmosphereChange(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-gray-300"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                Hiệu ứng rơi lất phất trên trang
              </span>
              <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                {CONCEPT_PACKS.find((p) => p.id === conceptId)?.atmosphereLabel ||
                  'Cánh hoa rơi nhẹ nhàng'}
              </span>
            </div>
          </label>

          <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
            <input
              type="checkbox"
              checked={enableCornerStickers}
              onChange={(e) => onEnableCornerStickersChange(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-gray-300"
            />
            <div>
              <span className="text-xs font-bold text-gray-800 block">
                Họa tiết trang trí góc & Hero
              </span>
              <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                {CONCEPT_PACKS.find((p) => p.id === conceptId)?.cornerLabel ||
                  'Cành mai rủ & Bánh chưng xanh'}
              </span>
            </div>
          </label>
        </div>
      )}
    </div>
  );
}

export default ModalConceptPickerFields;
