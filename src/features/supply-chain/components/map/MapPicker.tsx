'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { toast } from 'react-hot-toast';
import { ProvinceMode, PROVINCES_34_MAP, PROVINCES_63_MAP } from '@/constants/regions-map';
import {
  VIETNAM_MAP_BOUNDS,
  VIETNAM_CENTER,
  VIETNAM_DEFAULT_ZOOM,
  VIETNAM_MIN_ZOOM,
  VIETNAM_MAX_ZOOM,
  PROVINCE_FOCUS_ZOOM,
  getProvinceGeo,
  searchProvinces,
  ProvinceSearchResult,
} from '@/constants/province-coordinates';

// Fix missing marker icons in leaflet with webpack/nextjs
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  boundary?: string;
  onChangeLocation: (lat: number, lng: number) => void;
  onChangeBoundary: (boundaryJson: string) => void;
  initialProvinceName?: string;
}

const DEFAULT_CENTER: [number, number] = VIETNAM_CENTER;
const DEFAULT_ZOOM = VIETNAM_DEFAULT_ZOOM;
const FOCUS_ZOOM = 15;
const PROVINCE_ZOOM = PROVINCE_FOCUS_ZOOM;

function DrawControl({
  boundary,
  onChangeBoundary,
}: {
  boundary?: string;
  onChangeBoundary: (boundaryJson: string) => void;
}) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const drawControlRef = useRef<L.Control.Draw | null>(null);

  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (!map.hasLayer(drawnItems)) {
      map.addLayer(drawnItems);
    }

    if (!drawControlRef.current) {
      const drawControl = new L.Control.Draw({
        draw: {
          polyline: false,
          polygon: {
            allowIntersection: false,
            drawError: {
              color: '#e1e100',
              message: '<strong>Lỗi:</strong> Không được vẽ các đường cắt nhau!',
            },
            shapeOptions: {
              color: '#059669', // emerald-600
            },
          },
          circle: false,
          rectangle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
          remove: true,
        },
      });

      map.addControl(drawControl);
      drawControlRef.current = drawControl;

      map.on(L.Draw.Event.CREATED, (e: L.LeafletEvent) => {
        const event = e as unknown as L.DrawEvents.Created;
        const type = event.layerType;
        const layer = event.layer;

        if (type === 'polygon') {
          drawnItems.clearLayers();
          drawnItems.addLayer(layer);

          const polygonLayer = layer as L.Polygon;
          const latLngs = polygonLayer.getLatLngs()[0] as L.LatLng[];
          const mapped = latLngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
          onChangeBoundary(JSON.stringify(mapped));
        }
      });

      map.on(L.Draw.Event.DELETED, () => {
        onChangeBoundary('');
      });

      map.on(L.Draw.Event.EDITED, (e: L.LeafletEvent) => {
        const event = e as unknown as L.DrawEvents.Edited;
        const layers = event.layers;
        layers.eachLayer((layer: L.Layer) => {
          if (layer instanceof L.Polygon) {
            const latLngs = layer.getLatLngs()[0] as L.LatLng[];
            const mapped = latLngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
            onChangeBoundary(JSON.stringify(mapped));
          }
        });
      });
    }

    return () => {
      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
    };
  }, [map, onChangeBoundary]);

  // Load existing boundary if provided
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (boundary) {
      try {
        const parsed = JSON.parse(boundary);
        if (Array.isArray(parsed) && parsed.length >= 3) {
          drawnItems.clearLayers();
          const latLngs = parsed.map((p: { lat: number; lng: number }) => [p.lat, p.lng]) as [
            number,
            number,
          ][];
          const polygon = L.polygon(latLngs, { color: '#059669' });
          drawnItems.addLayer(polygon);
          map.fitBounds(polygon.getBounds(), { padding: [20, 20] });
        }
      } catch (e) {
        console.error('Lỗi phân tích ranh giới:', e);
      }
    } else {
      drawnItems.clearLayers();
    }
  }, [boundary, map]);

  return null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleClick = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick]);
  return null;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export default function MapPicker({
  latitude,
  longitude,
  boundary,
  onChangeLocation,
  onChangeBoundary,
  initialProvinceName,
}: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [targetBounds, setTargetBounds] = useState<[[number, number], [number, number]] | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Tùy chọn hiển thị chế độ tỉnh thành (63 vs 34)
  const [provinceMode, setProvinceMode] = useState<ProvinceMode>('63');
  const [showBoundaries, setShowBoundaries] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Nạp ranh giới GeoJSON tương ứng (34 hoặc 63) khi bật layer
  useEffect(() => {
    if (showBoundaries) {
      const geoFile =
        provinceMode === '34' ? '/maps/vn-34-provinces.geojson' : '/maps/vn-63-provinces.geojson';
      fetch(geoFile)
        .then((res) => res.json())
        .then((data) => setGeoJsonData(data))
        .catch((err) => console.error('Lỗi nạp GeoJSON ranh giới:', err));
    }
  }, [showBoundaries, provinceMode]);

  // Cập nhật vị trí khi latitude/longitude thay đổi từ props
  useEffect(() => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      setCenter([latitude, longitude]);
      setZoom(FOCUS_ZOOM);
      setTargetBounds(null);
    }
  }, [latitude, longitude]);

  // Danh sách tỉnh thành theo chế độ đang chọn
  const provinceList = useMemo(() => {
    const map = provinceMode === '34' ? PROVINCES_34_MAP : PROVINCES_63_MAP;
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [provinceMode]);

  // Tìm kiếm tức thì trong danh mục tỉnh thành nội bộ (0ms latency, không phụ thuộc mạng)
  const provinceSuggestions = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchProvinces(q, provinceMode, 5);
  }, [searchQuery, provinceMode]);

  // Chọn tỉnh thành từ gợi ý nội bộ
  const handleSelectProvinceMatch = useCallback(
    (
      prov:
        | ProvinceSearchResult
        | { name: string; center: [number, number]; bbox?: [number, number, number, number] },
    ) => {
      setSearchQuery(prov.name);
      setCenter(prov.center);
      setZoom(PROVINCE_ZOOM);
      if (prov.bbox) {
        setTargetBounds([
          [prov.bbox[1], prov.bbox[0]],
          [prov.bbox[3], prov.bbox[2]],
        ]);
      } else {
        setTargetBounds(null);
      }
      setIsDropdownOpen(false);
      setSearchResults([]);
    },
    [],
  );

  // Định vị nhanh đến tỉnh thành được chọn từ dropdown
  const handleJumpToProvince = useCallback(
    (provName: string) => {
      if (!provName) return;
      // 1. Tra cứu toạ độ chính xác từ từ điển nội bộ
      const geo = getProvinceGeo(provName, provinceMode);
      if (geo) {
        handleSelectProvinceMatch(geo);
        return;
      }

      // 2. Dự phòng geocoding nếu không tìm thấy
      fetch(`/api/geocoding/search?q=${encodeURIComponent(provName)}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data[0]) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            if (!isNaN(lat) && !isNaN(lon)) {
              setCenter([lat, lon]);
              setZoom(PROVINCE_ZOOM);
              setTargetBounds(null);
            }
          }
        })
        .catch((err) => console.warn('Lỗi định vị tỉnh thành:', err));
    },
    [provinceMode, handleSelectProvinceMatch],
  );

  // Tự động định vị nếu có initialProvinceName
  useEffect(() => {
    if (initialProvinceName && !latitude && !longitude) {
      handleJumpToProvince(initialProvinceName);
    }
  }, [initialProvinceName, latitude, longitude, handleJumpToProvince]);

  // Tìm kiếm địa chỉ: kết hợp dữ liệu tỉnh nội bộ và geocoding chi tiết
  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    // 1. Kiểm tra khớp nhanh tỉnh thành ngay lập tức
    const provMatches = searchProvinces(q, provinceMode, 3);
    if (provMatches.length > 0) {
      handleSelectProvinceMatch(provMatches[0]);
    }

    // 2. Tìm kiếm địa chỉ chi tiết (xã, huyện, đường phố)
    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocoding/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSearchResults(data);
          setIsDropdownOpen(true);
          return;
        }
      }
      if (provMatches.length === 0) {
        toast.error('Không tìm thấy địa điểm hoặc tỉnh thành phù hợp');
      }
    } catch (error) {
      console.error('Lỗi tìm kiếm địa chỉ:', error);
      if (provMatches.length === 0) {
        toast.error('Có lỗi xảy ra khi tìm kiếm địa chỉ');
      }
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    if (!isNaN(lat) && !isNaN(lon)) {
      setCenter([lat, lon]);
      setZoom(FOCUS_ZOOM);
      setTargetBounds(null);
      onChangeLocation(lat, lon);
      setSearchResults([]);
      setIsDropdownOpen(false);
      setSearchQuery(result.display_name);
    }
  };

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasSuggestions = provinceSuggestions.length > 0 || searchResults.length > 0;

  return (
    <div className="w-full h-full min-h-[420px] relative rounded-xl overflow-hidden border border-stone-300 flex flex-col shadow-xs bg-white">
      {/* Thanh điều khiển trên cùng: Tìm kiếm & Định vị Tỉnh thành */}
      <div className="p-2.5 bg-stone-50 border-b border-stone-200 z-[1000] relative flex flex-col gap-2">
        <div ref={searchContainerRef} className="flex gap-2 relative">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsDropdownOpen(true);
              }}
              onFocus={() => setIsDropdownOpen(true)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Tìm tỉnh thành (Hà Nội, Đắk Lắk, Lâm Đồng, TPHCM...) hoặc địa chỉ..."
              className="w-full text-sm text-gray-800 border border-stone-300 rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsDropdownOpen(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 font-semibold transition-colors shrink-0"
          >
            {isSearching ? 'Đang tìm...' : 'Tìm'}
          </button>

          {/* Dropdown gợi ý tức thì: Tỉnh thành & Địa chỉ chi tiết */}
          {isDropdownOpen && hasSuggestions && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-stone-200 shadow-2xl rounded-xl max-h-[280px] overflow-y-auto z-[9999] divide-y divide-stone-100">
              {/* Mục 1: Khớp tỉnh thành nội bộ (Chính xác 100%) */}
              {provinceSuggestions.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-emerald-50/80 border-b border-emerald-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                      📍 Tỉnh / Thành phố ({provinceMode === '34' ? '34 Tỉnh mới' : '63 Tỉnh thành'}
                      )
                    </span>
                    <span className="text-[10px] text-emerald-600">Định vị ngay</span>
                  </div>
                  {provinceSuggestions.map((prov) => (
                    <button
                      key={prov.code}
                      type="button"
                      className="w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-emerald-50/60 flex items-center justify-between group transition-colors cursor-pointer"
                      onClick={() => handleSelectProvinceMatch(prov)}
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

              {/* Mục 2: Kết quả Geocoding địa chỉ chi tiết */}
              {searchResults.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-stone-100/80 border-b border-stone-200">
                    <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider">
                      🔍 Địa chỉ chi tiết / Xã / Thôn
                    </span>
                  </div>
                  {searchResults.map((res, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="w-full text-left px-3.5 py-2 text-xs font-normal text-stone-700 hover:bg-stone-50 transition-colors border-b border-stone-100 last:border-b-0 cursor-pointer"
                      onClick={() => selectSearchResult(res)}
                    >
                      {res.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thanh công cụ định vị nhanh theo chế độ 63 / 34 tỉnh */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200/60 text-xs">
          <div className="flex items-center gap-2">
            {/* Toggle 63 vs 34 */}
            <div className="inline-flex p-0.5 bg-stone-200/70 rounded-md">
              <button
                type="button"
                onClick={() => {
                  setProvinceMode('63');
                  setGeoJsonData(null);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  provinceMode === '63'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                63 Tỉnh
              </button>
              <button
                type="button"
                onClick={() => {
                  setProvinceMode('34');
                  setGeoJsonData(null);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                  provinceMode === '34'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                34 Tỉnh
              </button>
            </div>

            {/* Quick Province Selector */}
            <select
              onChange={(e) => handleJumpToProvince(e.target.value)}
              value=""
              className="border border-stone-300 rounded-md px-2 py-1 text-xs text-stone-700 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[180px]"
            >
              <option value="">-- Đến nhanh tỉnh thành --</option>
              {provinceList.map((p) => (
                <option key={p.code} value={p.name}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Ranh giới tỉnh */}
          <label className="flex items-center gap-1.5 cursor-pointer text-stone-600 hover:text-stone-900 select-none">
            <input
              type="checkbox"
              checked={showBoundaries}
              onChange={(e) => setShowBoundaries(e.target.checked)}
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">
              Hiện ranh giới {provinceMode === '34' ? '34' : '63'} tỉnh
            </span>
          </label>
        </div>
      </div>

      {/* Bản đồ Leaflet - Giới hạn hoàn toàn trong lãnh thổ Việt Nam */}
      <div className="flex-1 relative z-0">
        <MapContainer
          center={center}
          zoom={zoom}
          minZoom={VIETNAM_MIN_ZOOM}
          maxZoom={VIETNAM_MAX_ZOOM}
          maxBounds={VIETNAM_MAP_BOUNDS}
          maxBoundsViscosity={1.0}
          worldCopyJump={false}
          style={{ width: '100%', height: '100%' }}
        >
          <MapCenterUpdater center={center} zoom={zoom} targetBounds={targetBounds} />

          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Bản đồ vệ tinh (Google Hybrid)">
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}"
                attribution="Google Maps"
                maxZoom={20}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Bản đồ đường phố (Google)">
              <TileLayer
                url="https://mt1.google.com/vt/lyrs=m&hl=vi&x={x}&y={y}&z={z}"
                attribution="Google Maps"
                maxZoom={20}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Bản đồ đường phố (CartoDB OSM)">
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                subdomains="abcd"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Bản đồ vệ tinh (Esri)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {/* Layer ranh giới GeoJSON khi người dùng bật (hỗ trợ cả 34 và 63 tỉnh) */}
          {showBoundaries && geoJsonData && (
            <GeoJSON
              key={`boundaries-${provinceMode}-${geoJsonData.features?.length}`}
              data={geoJsonData}
              style={() => ({
                color: '#10b981',
                weight: 1.5,
                dashArray: '3, 3',
                fillColor: '#059669',
                fillOpacity: 0.04,
              })}
              onEachFeature={(feature, layer) => {
                if (feature.properties?.name) {
                  const constNames = feature.properties.constituentNames;
                  const constText =
                    constNames && constNames.length > 1
                      ? `<br/><span style="font-size:10px; color:#666">Bao gồm: ${constNames.join(', ')}</span>`
                      : '';
                  layer.bindTooltip(
                    `<b>${feature.properties.name}</b><br/><span style="font-size:10px">${feature.properties.regionName || ''}</span>${constText}`,
                    { sticky: true },
                  );
                }
              }}
            />
          )}

          {latitude && longitude && !isNaN(latitude) && !isNaN(longitude) && (
            <Marker position={[latitude, longitude]} />
          )}

          <MapClickHandler onClick={onChangeLocation} />
          <DrawControl boundary={boundary} onChangeBoundary={onChangeBoundary} />
        </MapContainer>

        <div className="absolute top-2 right-2 bg-white/95 p-2 rounded-xl shadow-md text-[10px] text-stone-600 z-[400] max-w-[200px] border border-stone-200">
          <p className="font-bold text-emerald-700 mb-1">Hướng dẫn thao tác:</p>
          <ul className="list-disc pl-3 space-y-0.5">
            <li>
              <b>Click bản đồ:</b> Chọn toạ độ ghim vị trí.
            </li>
            <li>
              <b>Công cụ Polygon:</b> Vẽ đường ranh giới vùng trồng.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function MapCenterUpdater({
  center,
  zoom,
  targetBounds,
}: {
  center: [number, number];
  zoom: number;
  targetBounds?: [[number, number], [number, number]] | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (targetBounds) {
      map.fitBounds(targetBounds, { padding: [30, 30], maxZoom: 13 });
    } else {
      map.flyTo(center, zoom, { duration: 1.0 });
    }
  }, [center, zoom, targetBounds, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}
