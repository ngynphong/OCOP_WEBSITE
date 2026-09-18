'use client';

import React from 'react';
import { MapPin, Satellite, Globe, CheckCircle2, Package, X } from 'lucide-react';
import { District, Ward } from '@/features/admin/types/locationTypes';
import { ProvinceInfo } from '@/constants/regions-map';

export interface CommuneInfoCardProps {
  provinceName?: string | null;
  provinceInfo?: ProvinceInfo;
  district?: District | null;
  ward?: Ward | null;
  isTwoTierMode?: boolean;
  communeCoords: [number, number];
  productCount: number;
  isFilteredByCommune: boolean;
  activeMapView: 'overview' | 'satellite';
  onToggleMapView: (view: 'overview' | 'satellite') => void;
  onClearWard: () => void;
  onClearHierarchy: () => void;
}

export function CommuneInfoCard({
  provinceName,
  provinceInfo,
  district,
  ward,
  isTwoTierMode = false,
  communeCoords,
  productCount,
  isFilteredByCommune,
  activeMapView,
  onToggleMapView,
  onClearWard,
  onClearHierarchy,
}: CommuneInfoCardProps) {
  if (!ward && !district) return null;

  return (
    <div className="w-full mt-4 p-4.5 bg-gradient-to-br from-emerald-50/90 via-white to-stone-50/80 rounded-2xl border border-emerald-200/90 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 bg-emerald-100/80 text-emerald-800 rounded-md">
                {isTwoTierMode
                  ? 'Phường / Xã trực thuộc Tỉnh (Không qua cấp Huyện)'
                  : ward
                    ? 'Địa bàn cấp Xã / Phường'
                    : 'Địa bàn cấp Quận / Huyện'}
              </span>
              {provinceInfo && (
                <span className="text-[10px] text-stone-500 font-medium">
                  {provinceInfo.macroRegionName} &bull; {provinceInfo.regionName}
                </span>
              )}
            </div>

            <h3 className="text-base md:text-lg font-extrabold text-stone-900 mt-1 flex items-center gap-2">
              {ward ? `Xã / Phường: ${ward.name}` : `Quận / Huyện: ${district?.name}`}
            </h3>

            <p className="text-xs text-stone-600 mt-0.5">
              {isTwoTierMode
                ? `Tỉnh ${provinceName}`
                : [district && ward ? district.name : undefined, provinceName]
                    .filter(Boolean)
                    .join(', ')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={ward ? onClearWard : onClearHierarchy}
          className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors"
          title="Bỏ chọn cấp hành chính này"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Thông số tọa độ và sản phẩm */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3.5 pt-3 border-t border-emerald-100 text-xs">
        <div className="bg-white/80 p-2 rounded-xl border border-emerald-100/60">
          <span className="text-[10px] text-stone-400 uppercase font-bold block">Tọa độ tâm</span>
          <span className="font-mono text-emerald-800 font-bold text-[11px]">
            {communeCoords[0].toFixed(4)}°N, {communeCoords[1].toFixed(4)}°E
          </span>
        </div>

        <div className="bg-white/80 p-2 rounded-xl border border-emerald-100/60">
          <span className="text-[10px] text-stone-400 uppercase font-bold block">
            Sản phẩm OCOP
          </span>
          <span className="font-bold text-stone-800 flex items-center gap-1 text-[11px]">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            {productCount} sản phẩm
          </span>
        </div>

        <div className="col-span-2 sm:col-span-1 bg-white/80 p-2 rounded-xl border border-emerald-100/60 flex items-center justify-between sm:flex-col sm:items-start">
          <span className="text-[10px] text-stone-400 uppercase font-bold block">
            Chế độ bản đồ
          </span>
          <button
            type="button"
            onClick={() =>
              onToggleMapView(activeMapView === 'satellite' ? 'overview' : 'satellite')
            }
            className="text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 mt-0.5"
          >
            {activeMapView === 'satellite' ? (
              <>
                <Globe className="w-3 h-3 text-emerald-600" />
                Về toàn quốc
              </>
            ) : (
              <>
                <Satellite className="w-3 h-3 text-emerald-600" />
                Mở ảnh vệ tinh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ghi chú về sản phẩm OCOP tại xã */}
      <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-100/40 px-3 py-1.5 rounded-xl">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>
          {isFilteredByCommune
            ? isTwoTierMode
              ? `Đang hiển thị đặc sản OCOP có xuất xứ trực tiếp từ địa bàn ${ward?.name} (trực thuộc Tỉnh ${provinceName}).`
              : `Đang hiển thị đặc sản OCOP có xuất xứ trực tiếp từ địa bàn ${ward?.name}.`
            : `Đang hiển thị các đặc sản OCOP tiêu biểu đạt chuẩn thuộc khu vực ${district?.name || provinceName}.`}
        </span>
      </div>
    </div>
  );
}
