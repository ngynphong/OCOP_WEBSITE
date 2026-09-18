'use client';

import React, { useState, memo, useCallback, useMemo } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps';
import {
  ProvinceMode,
  MacroRegionKey,
  RegionId,
  ProvinceInfo,
  findProvince,
  isProvinceInRegion,
  getRegionColor,
} from '@/constants/regions-map';

export interface VietnamMapProps {
  mode?: ProvinceMode;
  selectedProvince?: string | null;
  selectedRegionId?: RegionId | 'all';
  selectedMacroRegion?: MacroRegionKey;
  onSelectProvince?: (provinceName: string, info?: ProvinceInfo) => void;
  className?: string;
}

interface MapGeographyProperties {
  name?: string;
  NAME_1?: string;
  ten_tinh?: string;
  'woe-name'?: string;
  code?: string;
  regionId?: RegionId;
  regionName?: string;
  constituentNames?: string[];
}

interface TooltipData {
  name: string;
  regionName?: string;
  constituentNames?: string[];
  mode: ProvinceMode;
}

const VietnamMap = memo(function VietnamMap({
  mode = '63',
  selectedProvince,
  selectedRegionId = 'all',
  selectedMacroRegion = 'all',
  onSelectProvince,
  className = 'relative w-full h-[540px] mx-auto',
}: VietnamMapProps) {
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  // Chọn nguồn dữ liệu bản đồ tương ứng theo chế độ
  const geoUrl = useMemo(() => {
    return mode === '34' ? '/maps/vn-34-provinces.geojson' : '/maps/vn-topo.json';
  }, [mode]);

  // Trích xuất tên tỉnh từ thuộc tính của Geography
  const getGeoProvinceName = useCallback((properties: MapGeographyProperties): string => {
    return (
      properties.name || properties['woe-name'] || properties.NAME_1 || properties.ten_tinh || ''
    );
  }, []);

  // Xử lý khi click vào tỉnh
  const handleProvinceClick = useCallback(
    (properties: MapGeographyProperties) => {
      const rawName = getGeoProvinceName(properties);
      const info = findProvince(rawName, mode);
      const finalName = info?.name || rawName;

      if (onSelectProvince) {
        onSelectProvince(finalName, info);
      }
    },
    [getGeoProvinceName, mode, onSelectProvince],
  );

  // Xử lý hover
  const handleMouseEnter = useCallback(
    (properties: MapGeographyProperties) => {
      const rawName = getGeoProvinceName(properties);
      const info = findProvince(rawName, mode);
      const finalName = info?.name || rawName;

      setTooltip({
        name: finalName,
        regionName: info?.regionName,
        constituentNames: info?.constituentNames,
        mode,
      });
    },
    [getGeoProvinceName, mode],
  );

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  // Kiểm tra tỉnh có đang được chọn không
  const checkIsSelected = useCallback(
    (properties: MapGeographyProperties) => {
      if (!selectedProvince) return false;
      const rawName = getGeoProvinceName(properties);
      const info = findProvince(rawName, mode);

      if (info) {
        if (info.name.toLowerCase() === selectedProvince.toLowerCase()) return true;
        if (info.code === selectedProvince) return true;
      }

      return (
        rawName.toLowerCase().includes(selectedProvince.toLowerCase()) ||
        selectedProvince.toLowerCase().includes(rawName.toLowerCase())
      );
    },
    [selectedProvince, getGeoProvinceName, mode],
  );

  // Kiểm tra tỉnh có nằm trong Vùng/Miền đang lọc không
  const checkIsInRegion = useCallback(
    (properties: MapGeographyProperties) => {
      if (selectedMacroRegion === 'all' && selectedRegionId === 'all') return true;
      const rawName = getGeoProvinceName(properties);
      return isProvinceInRegion(rawName, selectedMacroRegion, selectedRegionId, mode);
    },
    [selectedMacroRegion, selectedRegionId, getGeoProvinceName, mode],
  );

  // Tên đảo Phú Quốc theo mode (63: Kiên Giang, 34: An Giang)
  const phuQuocParent = mode === '34' ? 'An Giang' : 'Kiên Giang';

  return (
    <div className={className}>
      {/* Tooltip hiển thị thông tin vùng miền khi hover */}
      {tooltip && (
        <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-md px-4 py-2.5 border border-emerald-500/50 rounded-xl shadow-xl z-20 animate-in fade-in zoom-in-95 duration-150 pointer-events-none max-w-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h4 className="font-bold text-stone-900 text-sm">{tooltip.name}</h4>
          </div>
          {tooltip.regionName && (
            <p className="text-xs text-emerald-700 font-semibold mt-0.5">{tooltip.regionName}</p>
          )}
          {tooltip.mode === '34' &&
            tooltip.constituentNames &&
            tooltip.constituentNames.length > 1 && (
              <p className="text-[11px] text-stone-500 mt-1 border-t border-stone-100 pt-1 leading-snug">
                <span className="font-medium text-stone-700">Gồm: </span>
                {tooltip.constituentNames.join(', ')}
              </p>
            )}
        </div>
      )}

      <ComposableMap
        key={`vietnam-map-${mode}`}
        projection="geoMercator"
        projectionConfig={{
          scale: 3000,
          center: [108, 16],
        }}
        className="w-full h-full outline-none"
      >
        <ZoomableGroup zoom={1} center={[108, 16]}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isSelected = checkIsSelected(geo.properties);
                const isInActiveRegion = checkIsInRegion(geo.properties);
                const rawName = getGeoProvinceName(geo.properties);
                const info = findProvince(rawName, mode);

                // Tính toán màu sắc hiển thị
                let defaultFill = '#DCFCE7';
                let defaultStroke = '#6EE7B7';

                if (isSelected) {
                  defaultFill = '#059669'; // Highlight xanh đậm khi chọn
                  defaultStroke = '#ffffff';
                } else if (!isInActiveRegion) {
                  defaultFill = '#F1F5F9'; // Mờ khi không thuộc vùng lọc
                  defaultStroke = '#E2E8F0';
                } else if (info) {
                  // Tô màu nhẹ theo vùng miền
                  defaultFill = `${getRegionColor(info.regionId)}25`;
                  defaultStroke = getRegionColor(info.regionId);
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => handleProvinceClick(geo.properties)}
                    onMouseEnter={() => handleMouseEnter(geo.properties)}
                    onMouseLeave={handleMouseLeave}
                    style={{
                      default: {
                        fill: defaultFill,
                        stroke: defaultStroke,
                        strokeWidth: isSelected ? 1.2 : 0.6,
                        outline: 'none',
                        transition: 'all 200ms ease',
                      },
                      hover: {
                        fill: '#10b981',
                        stroke: '#ffffff',
                        strokeWidth: 1.2,
                        outline: 'none',
                        cursor: 'pointer',
                      },
                      pressed: {
                        fill: '#047857',
                        outline: 'none',
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {/* Quần đảo Hoàng Sa (Đà Nẵng) */}
          {[
            [111.5, 16.8],
            [111.8, 16.6],
            [112.0, 16.5],
            [112.2, 16.4],
            [112.4, 16.7],
            [111.6, 16.3],
            [112.5, 16.2],
            [112.7, 16.5],
          ].map((coord, idx) => {
            const isActive = selectedProvince?.toLowerCase().includes('đà nẵng');
            return (
              <Marker
                key={`hs-${idx}`}
                coordinates={coord as [number, number]}
                onClick={() => handleProvinceClick({ name: 'Đà Nẵng' })}
                onMouseEnter={() =>
                  setTooltip({
                    name: 'Quần đảo Hoàng Sa (Đà Nẵng)',
                    regionName: 'Duyên hải Nam Trung Bộ',
                    mode,
                  })
                }
                onMouseLeave={handleMouseLeave}
              >
                <circle
                  r={isActive ? 1.4 : 0.9}
                  fill={isActive ? '#059669' : '#10b981'}
                  className="cursor-pointer hover:fill-emerald-700 transition-colors"
                />
              </Marker>
            );
          })}
          <Marker
            coordinates={[112.0, 16.5]}
            onClick={() => handleProvinceClick({ name: 'Đà Nẵng' })}
            onMouseEnter={() =>
              setTooltip({
                name: 'Quần đảo Hoàng Sa (Đà Nẵng)',
                regionName: 'Duyên hải Nam Trung Bộ',
                mode,
              })
            }
            onMouseLeave={handleMouseLeave}
            className="pointer-events-none"
          >
            <text
              textAnchor="middle"
              y={-5}
              style={{
                fontFamily: 'sans-serif',
                fill: '#064e3b',
                fontSize: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              QĐ. Hoàng Sa
            </text>
          </Marker>

          {/* Quần đảo Trường Sa (Khánh Hòa) */}
          {[
            [114.0, 10.0],
            [113.5, 9.7],
            [114.5, 10.3],
            [113.2, 10.5],
            [114.8, 9.5],
            [113.8, 9.1],
            [114.2, 8.8],
            [115.2, 10.2],
            [113.0, 8.5],
            [115.5, 11.0],
            [113.9, 11.2],
            [114.6, 10.8],
            [115.0, 9.0],
            [114.1, 9.5],
            [113.6, 10.1],
            [112.5, 8.8],
            [113.3, 9.3],
            [112.8, 10.1],
            [114.4, 11.3],
            [112.2, 9.5],
          ].map((coord, idx) => {
            const isActive = selectedProvince?.toLowerCase().includes('khánh hòa');
            return (
              <Marker
                key={`ts-${idx}`}
                coordinates={coord as [number, number]}
                onClick={() => handleProvinceClick({ name: 'Khánh Hòa' })}
                onMouseEnter={() =>
                  setTooltip({
                    name: 'Quần đảo Trường Sa (Khánh Hòa)',
                    regionName: 'Duyên hải Nam Trung Bộ',
                    mode,
                  })
                }
                onMouseLeave={handleMouseLeave}
              >
                <circle
                  r={isActive ? 1.4 : 0.9}
                  fill={isActive ? '#059669' : '#10b981'}
                  className="cursor-pointer hover:fill-emerald-700 transition-colors"
                />
              </Marker>
            );
          })}
          <Marker
            coordinates={[114.0, 10.0]}
            onClick={() => handleProvinceClick({ name: 'Khánh Hòa' })}
            onMouseEnter={() =>
              setTooltip({
                name: 'Quần đảo Trường Sa (Khánh Hòa)',
                regionName: 'Duyên hải Nam Trung Bộ',
                mode,
              })
            }
            onMouseLeave={handleMouseLeave}
            className="pointer-events-none"
          >
            <text
              textAnchor="middle"
              y={-5}
              style={{
                fontFamily: 'sans-serif',
                fill: '#064e3b',
                fontSize: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
                pointerEvents: 'auto',
              }}
            >
              QĐ. Trường Sa
            </text>
          </Marker>

          {/* Đảo Phú Quốc */}
          <Marker
            coordinates={[103.95, 10.21]}
            onClick={() => handleProvinceClick({ name: phuQuocParent })}
            onMouseEnter={() =>
              setTooltip({
                name: `Đảo Phú Quốc (${phuQuocParent})`,
                regionName: 'Đồng bằng sông Cửu Long',
                mode,
              })
            }
            onMouseLeave={handleMouseLeave}
          >
            <circle
              r={selectedProvince?.toLowerCase().includes(phuQuocParent.toLowerCase()) ? 2 : 1.5}
              fill={
                selectedProvince?.toLowerCase().includes(phuQuocParent.toLowerCase())
                  ? '#059669'
                  : '#10b981'
              }
              className="cursor-pointer hover:fill-emerald-700 transition-colors"
            />
            <text
              textAnchor="end"
              x={-3}
              y={1.5}
              style={{
                fontFamily: 'sans-serif',
                fill: '#064e3b',
                fontSize: '3px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              Phú Quốc
            </text>
          </Marker>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
});

export default VietnamMap;
