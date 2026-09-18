'use client';

import React from 'react';
import { District } from '@/features/admin/types/locationTypes';
import { WardWithMeta } from '../hooks/useVungMien';
import {
  ProvinceMode,
  PROVINCES_63_MAP,
  PROVINCES_34_MAP,
  MacroRegionKey,
  MacroRegion,
  RegionId,
  AdministrativeRegion,
} from '@/constants/regions-map';
import { Building2, Landmark, MapPin, Layers, RotateCcw, Sparkles } from 'lucide-react';

export interface ConstituentOption {
  code: string;
  name: string;
  backendId?: number;
}

export interface AdministrativeHierarchyFilterProps {
  mode: ProvinceMode;
  isTwoTierMode: boolean;
  onSelectMode: (mode: ProvinceMode) => void;
  // Vùng miền lớn
  macroRegion: MacroRegionKey;
  macroRegionsList: MacroRegion[];
  onSelectMacroRegion: (key: MacroRegionKey) => void;
  // Vùng sinh thái 8 vùng
  availableRegions: AdministrativeRegion[];
  selectedRegionId: RegionId | 'all';
  onSelectRegion: (id: RegionId | 'all') => void;
  // Tỉnh / Thành
  selectedProvince: string | null;
  onSelectProvince: (provName: string) => void;
  onClearProvince: () => void;
  // Cấp sáp nhập cho 34 tỉnh
  constituentProvinces: ConstituentOption[];
  selectedConstituentCode: string | null;
  onSelectConstituent: (code: string | null) => void;
  // Cấp Huyện (chỉ dùng cho 63 tỉnh)
  districts: District[];
  selectedDistrictId: number | null;
  isLoadingDistricts: boolean;
  onSelectDistrict: (districtId: number | null) => void;
  // Cấp Xã
  wards: WardWithMeta[];
  selectedWardCode: string | null;
  isLoadingWards: boolean;
  onSelectWard: (wardCode: string | null) => void;
  onResetHierarchy: () => void;
}

export function AdministrativeHierarchyFilter({
  mode,
  isTwoTierMode,
  onSelectMode,
  macroRegion,
  macroRegionsList,
  onSelectMacroRegion,
  availableRegions,
  selectedRegionId,
  onSelectRegion,
  selectedProvince,
  onSelectProvince,
  onClearProvince,
  constituentProvinces,
  selectedConstituentCode,
  onSelectConstituent,
  districts,
  selectedDistrictId,
  isLoadingDistricts,
  onSelectDistrict,
  wards,
  selectedWardCode,
  isLoadingWards,
  onSelectWard,
  onResetHierarchy,
}: AdministrativeHierarchyFilterProps) {
  const provinceList = React.useMemo(() => {
    const map = mode === '34' ? PROVINCES_34_MAP : PROVINCES_63_MAP;
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [mode]);

  const hasAnyFilter =
    !!selectedProvince ||
    !!selectedDistrictId ||
    !!selectedWardCode ||
    !!selectedConstituentCode ||
    macroRegion !== 'all' ||
    selectedRegionId !== 'all';

  const hasConstituents = isTwoTierMode && constituentProvinces.length > 1;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-stone-200/80 space-y-4 transition-all">
      {/* ─── DÒNG 1: BỘ CHUYỂN CHẾ ĐỘ & BỘ LỌC MIỀN LỚN (GỌN GÀNG, CHUYÊN NGHIỆP) ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3.5 border-b border-stone-100">
        {/* Toggle 63 vs 34 Tỉnh Thành */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            Chế độ:
          </span>
          <div className="inline-flex p-1 bg-stone-100/90 rounded-xl border border-stone-200/80">
            <button
              type="button"
              onClick={() => onSelectMode('63')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === '63'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              63 Tỉnh Thành
            </button>
            <button
              type="button"
              onClick={() => onSelectMode('34')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                mode === '34'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              34 Tỉnh Mới
              <span className="text-[10px] px-1.5 py-0.2 bg-amber-400 text-stone-900 font-extrabold rounded-full">
                2 Cấp
              </span>
            </button>
          </div>
        </div>

        {/* Lọc nhanh theo Miền lớn (Bắc - Trung - Nam) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 mr-1 hidden sm:inline">Khu vực:</span>
          {macroRegionsList.map((mr) => {
            const isActive = macroRegion === mr.key;
            return (
              <button
                key={mr.key}
                type="button"
                onClick={() => onSelectMacroRegion(mr.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                {mr.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── DÒNG 2: BỘ CHỌN ĐỊA GIỚI PHÂN CẤP (TỈNH ➔ [HUYỆN] ➔ XÃ) ─── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-stone-900 uppercase tracking-wide">
              Địa giới hành chính
            </span>
            {isTwoTierMode ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" />
                Mô hình 2 cấp (Không qua cấp Huyện)
              </span>
            ) : (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Mô hình 3 cấp (Tỉnh ➔ Huyện ➔ Xã)
              </span>
            )}
          </div>

          {/* Quick reset */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={onResetHierarchy}
              className="text-[11px] font-bold text-stone-400 hover:text-red-600 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Đặt lại tất cả
            </button>
          )}
        </div>

        <div
          className={`grid gap-3 items-center ${
            isTwoTierMode
              ? hasConstituents
                ? 'grid-cols-1 md:grid-cols-3'
                : 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-3'
          }`}
        >
          {/* CỘT 1: TỈNH / THÀNH PHỐ */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              1. Tỉnh / Thành phố
            </label>
            <select
              value={selectedProvince || ''}
              onChange={(e) => {
                if (e.target.value) {
                  onSelectProvince(e.target.value);
                } else {
                  onClearProvince();
                }
              }}
              className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer shadow-2xs"
            >
              <option value="">-- Chọn {isTwoTierMode ? '34 Tỉnh mới' : '63 Tỉnh thành'} --</option>
              {provinceList.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* CỘT 2 (CHẾ ĐỘ 63 TỈNH): QUẬN / HUYỆN / THỊ XÃ */}
          {!isTwoTierMode && (
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-emerald-600" />
                2. Quận / Huyện
                {districts.length > 0 && (
                  <span className="text-[10px] text-stone-400 font-normal">
                    ({districts.length})
                  </span>
                )}
              </label>
              <select
                value={selectedDistrictId || ''}
                disabled={!selectedProvince || isLoadingDistricts}
                onChange={(e) => {
                  const val = e.target.value ? Number(e.target.value) : null;
                  onSelectDistrict(val);
                }}
                className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
              >
                <option value="">
                  {!selectedProvince
                    ? '-- Chọn Tỉnh trước --'
                    : isLoadingDistricts
                      ? '-- Đang tải danh sách... --'
                      : '-- Tất cả Quận / Huyện --'}
                </option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CỘT 2 (CHẾ ĐỘ 34 TỈNH SÁP NHẬP): KHU VỰC THÀNH PHẦN */}
          {isTwoTierMode && hasConstituents && (
            <div>
              <label className="block text-[11px] font-bold text-amber-800 mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                2. Khu vực sáp nhập (Tùy chọn)
              </label>
              <select
                value={selectedConstituentCode || ''}
                disabled={!selectedProvince}
                onChange={(e) => {
                  onSelectConstituent(e.target.value || null);
                }}
                className="w-full border border-amber-300 bg-amber-50/30 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all cursor-pointer shadow-2xs"
              >
                <option value="">-- Toàn tỉnh {selectedProvince} --</option>
                {constituentProvinces.map((c) => (
                  <option key={c.code} value={c.code}>
                    Khu vực: {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* CỘT 3: PHƯỜNG / XÃ TRỰC THUỘC */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              {isTwoTierMode
                ? hasConstituents
                  ? '3. Phường / Xã trực thuộc'
                  : '2. Phường / Xã trực thuộc'
                : '3. Phường / Xã'}
              {wards.length > 0 && (
                <span className="text-[10px] text-stone-400 font-normal">({wards.length})</span>
              )}
            </label>
            <select
              value={selectedWardCode || ''}
              disabled={
                !selectedProvince || (!isTwoTierMode && !selectedDistrictId) || isLoadingWards
              }
              onChange={(e) => {
                onSelectWard(e.target.value || null);
              }}
              className="w-full border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-800 bg-white hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all disabled:bg-stone-50 disabled:text-stone-400 disabled:cursor-not-allowed cursor-pointer shadow-2xs"
            >
              <option value="">
                {!selectedProvince
                  ? '-- Chọn Tỉnh trước --'
                  : !isTwoTierMode && !selectedDistrictId
                    ? '-- Chọn Huyện trước --'
                    : isLoadingWards
                      ? '-- Đang tải danh sách xã... --'
                      : isTwoTierMode
                        ? '-- Tất cả Phường / Xã trực thuộc Tỉnh --'
                        : '-- Tất cả Phường / Xã --'}
              </option>
              {wards.map((w) => (
                <option key={w.code || w.id} value={w.code || String(w.id)}>
                  {w.name} {isTwoTierMode && w.districtName ? `(${w.districtName})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ─── DÒNG 3: SUB-REGION PILLS (8 VÙNG SINH THÁI NHẸ NHÀNG, KHÔNG RỐI) ─── */}
      {availableRegions.length > 0 && (
        <div className="pt-2 border-t border-stone-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-[11px] font-semibold text-stone-400 whitespace-nowrap mr-1">
            Tiểu vùng:
          </span>
          <button
            type="button"
            onClick={() => onSelectRegion('all')}
            className={`px-2.5 py-0.5 rounded-full font-semibold transition-all ${
              selectedRegionId === 'all'
                ? 'bg-stone-800 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Tất cả
          </button>
          {availableRegions.map((region) => {
            const isSelected = selectedRegionId === region.id;
            return (
              <button
                key={region.id}
                type="button"
                onClick={() => onSelectRegion(region.id)}
                className={`px-2.5 py-0.5 rounded-full font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-2xs'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {region.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
