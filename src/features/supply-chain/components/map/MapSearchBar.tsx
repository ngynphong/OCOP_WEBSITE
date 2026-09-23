'use client';

import React from 'react';
import { Search, MapPin, X } from 'lucide-react';
import type { ProvinceMode } from '@/constants/regions-map';
import type { ProvinceSearchResult } from '@/constants/province-coordinates';
import type { NominatimResult } from './mapUtils';

export interface MapSearchBarProps {
  searchContainerRef: React.RefObject<HTMLDivElement | null>;
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  isSearching: boolean;
  onSearch: () => void;
  onClearSearch: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
  provinceMode: ProvinceMode;
  onProvinceModeChange: (mode: ProvinceMode) => void;
  provinceSuggestions: ProvinceSearchResult[];
  searchResults: NominatimResult[];
  provinceList: { code: string; name: string }[];
  showBoundaries: boolean;
  onToggleBoundaries: (show: boolean) => void;
  onSelectProvinceMatch: (
    prov:
      | ProvinceSearchResult
      | { name: string; center: [number, number]; bbox?: [number, number, number, number] },
  ) => void;
  onSelectSearchResult: (res: NominatimResult) => void;
  onJumpToProvince: (provName: string) => void;
}

export function MapSearchBar({
  searchContainerRef,
  searchQuery,
  onSearchQueryChange,
  isSearching,
  onSearch,
  onClearSearch,
  isDropdownOpen,
  setIsDropdownOpen,
  provinceMode,
  onProvinceModeChange,
  provinceSuggestions,
  searchResults,
  provinceList,
  showBoundaries,
  onToggleBoundaries,
  onSelectProvinceMatch,
  onSelectSearchResult,
  onJumpToProvince,
}: MapSearchBarProps) {
  const hasSuggestions = provinceSuggestions.length > 0 || searchResults.length > 0;

  return (
    <div className="p-2.5 bg-stone-50 border-b border-stone-200 z-[1000] relative flex flex-col gap-2">
      <div ref={searchContainerRef} className="flex gap-2 relative">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchQueryChange(e.target.value);
              setIsDropdownOpen(true);
            }}
            onFocus={() => setIsDropdownOpen(true)}
            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
            placeholder="Tìm tỉnh thành (Hà Nội, Đắk Lắk, Lâm Đồng, TPHCM...) hoặc địa chỉ..."
            className="w-full text-sm text-gray-800 border border-stone-300 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded transition-colors cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onSearch}
          disabled={isSearching}
          className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 font-semibold transition-colors shrink-0 cursor-pointer"
        >
          {isSearching ? 'Đang tìm...' : 'Tìm'}
        </button>

        {isDropdownOpen && hasSuggestions && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 shadow-2xl rounded-xl max-h-[280px] overflow-y-auto z-[9999] divide-y divide-stone-100">
            {provinceSuggestions.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>
                      Tỉnh / Thành phố ({provinceMode === '34' ? '34 Tỉnh mới' : '63 Tỉnh thành'})
                    </span>
                  </span>
                  <span className="text-[10px] text-emerald-600">Định vị ngay</span>
                </div>
                {provinceSuggestions.map((prov) => (
                  <button
                    key={prov.code}
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-emerald-50/60 flex items-center justify-between group transition-colors cursor-pointer"
                    onClick={() => onSelectProvinceMatch(prov)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                      <span className="text-stone-800 group-hover:text-emerald-800 font-semibold">
                        {prov.displayName}
                      </span>
                    </div>
                    {prov.regionName && (
                      <span className="text-[10px] text-stone-400 font-normal group-hover:text-emerald-700">
                        {prov.regionName}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {searchResults.length > 0 && (
              <div>
                <div className="px-3 py-1.5 bg-stone-100/80 border-b border-stone-200">
                  <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1">
                    <Search className="w-3 h-3 text-stone-500 shrink-0" />
                    <span>Địa chỉ chi tiết / Xã / Thôn</span>
                  </span>
                </div>
                {searchResults.map((res, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="w-full text-left px-3.5 py-2 text-xs font-normal text-stone-700 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0 cursor-pointer"
                    onClick={() => onSelectSearchResult(res)}
                  >
                    {res.display_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60 text-xs">
        <div className="flex items-center gap-2">
          <div className="inline-flex p-0.5 bg-stone-200/70 rounded-md">
            <button
              type="button"
              onClick={() => onProvinceModeChange('63')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                provinceMode === '63'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              63 Tỉnh
            </button>
            <button
              type="button"
              onClick={() => onProvinceModeChange('34')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                provinceMode === '34'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              34 Tỉnh
            </button>
          </div>

          <select
            onChange={(e) => onJumpToProvince(e.target.value)}
            value=""
            className="border border-stone-300 rounded-md px-2 py-1 text-xs text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[180px] cursor-pointer"
          >
            <option value="">-- Đến nhanh tỉnh thành --</option>
            {provinceList.map((p) => (
              <option key={p.code} value={p.name}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 hover:text-stone-900 select-none">
          <input
            type="checkbox"
            checked={showBoundaries}
            onChange={(e) => onToggleBoundaries(e.target.checked)}
            className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
          />
          <span className="text-[11px] font-medium">
            Hiện ranh giới {provinceMode === '34' ? '34' : '63'} tỉnh
          </span>
        </label>
      </div>
    </div>
  );
}

export default MapSearchBar;
