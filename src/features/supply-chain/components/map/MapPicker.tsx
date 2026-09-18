'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMap, LayersControl, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { toast } from 'react-hot-toast';
import {
  Hexagon,
  Maximize2,
  Pencil,
  Trash2,
  Copy,
  Check,
  X,
  MapPin,
  Search,
  HelpCircle,
} from 'lucide-react';
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
  onAreaCalculated?: (areaM2: number) => void;
}

const DEFAULT_CENTER: [number, number] = VIETNAM_CENTER;
const DEFAULT_ZOOM = VIETNAM_DEFAULT_ZOOM;
const FOCUS_ZOOM = 15;
const PROVINCE_ZOOM = PROVINCE_FOCUS_ZOOM;

export function computePolygonArea(coords: { lat: number; lng: number }[]): number {
  if (!coords || coords.length < 3) return 0;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const geomUtil = typeof L !== 'undefined' ? (L as any).GeometryUtil : undefined;
  if (geomUtil?.geodesicArea) {
    const latLngs = coords.map((c) => L.latLng(c.lat, c.lng));
    return Math.round(geomUtil.geodesicArea(latLngs));
  }
  const R = 6378137;
  let area = 0;
  const n = coords.length;
  for (let i = 0; i < n; i++) {
    const p1 = coords[i];
    const p2 = coords[(i + 1) % n];
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const lat1 = (p1.lat * Math.PI) / 180;
    const lat2 = (p2.lat * Math.PI) / 180;
    area += dLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }
  area = Math.abs((area * R * R) / 4);
  return Math.round(area);
}

function DrawControl({
  boundary,
  onChangeBoundary,
  onChangeLocation,
  onAreaCalculated,
  hasLocationPin,
  onDrawStateChange,
}: {
  boundary?: string;
  onChangeBoundary: (boundaryJson: string) => void;
  onChangeLocation: (lat: number, lng: number) => void;
  onAreaCalculated?: (areaM2: number) => void;
  hasLocationPin: boolean;
  onDrawStateChange: (active: boolean) => void;
}) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const polygonDrawerRef = useRef<L.Draw.Polygon | null>(null);
  const editHandlerRef = useRef<L.EditToolbar.Edit | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Suy xuất thông tin ranh giới hoàn toàn đồng bộ từ prop boundary
  const boundaryInfo = useMemo(() => {
    if (!boundary) {
      return {
        hasBoundary: false,
        vertexCount: 0,
        areaM2: null as number | null,
        coords: [] as { lat: number; lng: number }[],
      };
    }
    try {
      const parsed = JSON.parse(boundary);
      if (Array.isArray(parsed) && parsed.length >= 3) {
        const area = computePolygonArea(parsed);
        return {
          hasBoundary: true,
          vertexCount: parsed.length,
          areaM2: area,
          coords: parsed as { lat: number; lng: number }[],
        };
      }
    } catch {
      // ignore
    }
    return {
      hasBoundary: false,
      vertexCount: 0,
      areaM2: null as number | null,
      coords: [] as { lat: number; lng: number }[],
    };
  }, [boundary]);

  const { hasBoundary, vertexCount, areaM2, coords } = boundaryInfo;

  const onChangeBoundaryRef = useRef(onChangeBoundary);
  const onChangeLocationRef = useRef(onChangeLocation);
  const onAreaCalculatedRef = useRef(onAreaCalculated);
  const hasLocationPinRef = useRef(hasLocationPin);
  const onDrawStateChangeRef = useRef(onDrawStateChange);

  useEffect(() => {
    onChangeBoundaryRef.current = onChangeBoundary;
    onChangeLocationRef.current = onChangeLocation;
    onAreaCalculatedRef.current = onAreaCalculated;
    hasLocationPinRef.current = hasLocationPin;
    onDrawStateChangeRef.current = onDrawStateChange;
  });

  useEffect(() => {
    onDrawStateChangeRef.current(isDrawing || isEditing);
  }, [isDrawing, isEditing]);

  // Nạp drawnItems vào map
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (!map.hasLayer(drawnItems)) {
      map.addLayer(drawnItems);
    }
  }, [map]);

  // Đồng bộ layer Leaflet khi dữ liệu ranh giới thay đổi
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    drawnItems.clearLayers();
    if (coords.length >= 3) {
      const latLngs = coords.map((p) => [p.lat, p.lng]) as [number, number][];
      const polygon = L.polygon(latLngs, {
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.3,
        weight: 2.5,
      });
      drawnItems.addLayer(polygon);
    }
  }, [coords]);

  // Cấu hình Leaflet Draw và các listener sự kiện
  useEffect(() => {
    const drawnItems = drawnItemsRef.current;

    const drawControl = new L.Control.Draw({
      position: 'topleft',
      draw: {
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: '#e11d48',
            message: '<strong>Lỗi:</strong> Đường ranh giới không được cắt chéo nhau!',
          },
          shapeOptions: {
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.35,
            weight: 2.5,
          },
        },
        rectangle: {
          shapeOptions: {
            color: '#059669',
            fillColor: '#10b981',
            fillOpacity: 0.35,
            weight: 2.5,
          },
        },
        circle: false,
        circlemarker: false,
        marker: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: true,
      },
    });

    map.addControl(drawControl);
    drawControlRef.current = drawControl;

    const handleCreated = (e: L.LeafletEvent) => {
      const event = e as unknown as L.DrawEvents.Created;
      const layer = event.layer;

      drawnItems.clearLayers();
      drawnItems.addLayer(layer);

      let latLngs: L.LatLng[] = [];
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        const rawLatLngs = layer.getLatLngs()[0];
        if (Array.isArray(rawLatLngs)) {
          latLngs = rawLatLngs as L.LatLng[];
        }
      }

      if (latLngs.length >= 3) {
        const mapped = latLngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
        onChangeBoundaryRef.current(JSON.stringify(mapped));
        const area = computePolygonArea(mapped);

        if (onAreaCalculatedRef.current && area > 0) {
          onAreaCalculatedRef.current(area);
        }

        if (!hasLocationPinRef.current) {
          let sumLat = 0;
          let sumLng = 0;
          for (const p of mapped) {
            sumLat += p.lat;
            sumLng += p.lng;
          }
          onChangeLocationRef.current(sumLat / mapped.length, sumLng / mapped.length);
        }

        toast.success(`Đã lưu ranh giới vùng trồng (${area.toLocaleString('vi-VN')} m²)`);
      }

      setIsDrawing(false);
      polygonDrawerRef.current = null;
    };

    const handleEdited = (e: L.LeafletEvent) => {
      const event = e as unknown as L.DrawEvents.Edited;
      event.layers.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          const rawLatLngs = layer.getLatLngs()[0];
          if (Array.isArray(rawLatLngs)) {
            const latLngs = rawLatLngs as L.LatLng[];
            const mapped = latLngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
            onChangeBoundaryRef.current(JSON.stringify(mapped));
            const area = computePolygonArea(mapped);

            if (onAreaCalculatedRef.current && area > 0) {
              onAreaCalculatedRef.current(area);
            }
            toast.success(`Đã cập nhật ranh giới (${area.toLocaleString('vi-VN')} m²)`);
          }
        }
      });
      setIsEditing(false);
      editHandlerRef.current = null;
    };

    const handleDeleted = () => {
      onChangeBoundaryRef.current('');
      toast('Đã xóa ranh giới vùng trồng');
    };

    const handleDrawStart = () => {
      setIsDrawing(true);
    };

    const handleDrawStop = () => {
      setIsDrawing(false);
      polygonDrawerRef.current = null;
    };

    map.on(L.Draw.Event.CREATED, handleCreated);
    map.on(L.Draw.Event.EDITED, handleEdited);
    map.on(L.Draw.Event.DELETED, handleDeleted);
    map.on(L.Draw.Event.DRAWSTART, handleDrawStart);
    map.on(L.Draw.Event.DRAWSTOP, handleDrawStop);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreated);
      map.off(L.Draw.Event.EDITED, handleEdited);
      map.off(L.Draw.Event.DELETED, handleDeleted);
      map.off(L.Draw.Event.DRAWSTART, handleDrawStart);
      map.off(L.Draw.Event.DRAWSTOP, handleDrawStop);

      if (drawControlRef.current) {
        map.removeControl(drawControlRef.current);
        drawControlRef.current = null;
      }
    };
  }, [map]);

  const handleStartDrawPolygon = () => {
    if (isDrawing) return;
    if (editHandlerRef.current) {
      editHandlerRef.current.disable();
      editHandlerRef.current = null;
      setIsEditing(false);
    }

    const drawer = new L.Draw.Polygon(map as unknown as L.DrawMap, {
      allowIntersection: false,
      showArea: true,
      guidelineDistance: 15,
      shapeOptions: {
        color: '#059669',
        fillColor: '#10b981',
        fillOpacity: 0.35,
        weight: 2.5,
      },
    });
    drawer.enable();
    polygonDrawerRef.current = drawer;
    setIsDrawing(true);
    toast('Bắt đầu vẽ: Click các điểm trên bản đồ để tạo ranh giới');
  };

  const handleCompletePolygon = () => {
    if (polygonDrawerRef.current) {
      polygonDrawerRef.current.completeShape();
    }
  };

  const handleCancelDraw = () => {
    if (polygonDrawerRef.current) {
      polygonDrawerRef.current.disable();
      polygonDrawerRef.current = null;
    }
    setIsDrawing(false);
    toast('Đã hủy thao tác vẽ');
  };

  const handleStartEdit = () => {
    if (isEditing) return;
    if (polygonDrawerRef.current) {
      polygonDrawerRef.current.disable();
      polygonDrawerRef.current = null;
      setIsDrawing(false);
    }
    const editHandler = new L.EditToolbar.Edit(map as unknown as L.DrawMap, {
      featureGroup: drawnItemsRef.current,
      selectedPathOptions: {
        dashArray: '8, 8',
        fillColor: '#10b981',
        fillOpacity: 0.25,
      },
    });
    editHandler.enable();
    editHandlerRef.current = editHandler;
    setIsEditing(true);
    toast('Chế độ sửa: Kéo thả các đỉnh màu trắng để chỉnh ranh giới');
  };

  const handleSaveEdit = () => {
    if (editHandlerRef.current) {
      editHandlerRef.current.save();
      editHandlerRef.current.disable();
      editHandlerRef.current = null;
      setIsEditing(false);

      drawnItemsRef.current.eachLayer((layer) => {
        if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
          const rawLatLngs = layer.getLatLngs()[0];
          if (Array.isArray(rawLatLngs)) {
            const latLngs = rawLatLngs as L.LatLng[];
            const mapped = latLngs.map((ll) => ({ lat: ll.lat, lng: ll.lng }));
            onChangeBoundaryRef.current(JSON.stringify(mapped));
            const area = computePolygonArea(mapped);

            if (onAreaCalculatedRef.current && area > 0) {
              onAreaCalculatedRef.current(area);
            }
            toast.success(`Đã lưu ranh giới sau chỉnh sửa (${area.toLocaleString('vi-VN')} m²)`);
          }
        }
      });
    }
  };

  const handleCancelEdit = () => {
    if (editHandlerRef.current) {
      editHandlerRef.current.revertLayers();
      editHandlerRef.current.disable();
      editHandlerRef.current = null;
      setIsEditing(false);
    }
    toast('Đã hủy chỉnh sửa ranh giới');
  };

  const handleDeleteBoundary = () => {
    if (editHandlerRef.current) {
      editHandlerRef.current.disable();
      editHandlerRef.current = null;
      setIsEditing(false);
    }
    drawnItemsRef.current.clearLayers();
    onChangeBoundaryRef.current('');
    toast('Đã xóa ranh giới vùng trồng');
  };

  const handleZoomToBoundary = () => {
    drawnItemsRef.current.eachLayer((layer) => {
      if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
        map.fitBounds(layer.getBounds(), { padding: [40, 40] });
      }
    });
  };

  return (
    <>
      {/* Floating Custom Polygon Toolbar on Map */}
      <div className="absolute top-2 left-12 sm:left-14 z-[400] flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 px-2 rounded-xl shadow-lg border border-stone-200 pointer-events-auto max-w-[calc(100%-4rem)]">
        {!isDrawing && !isEditing ? (
          <>
            <button
              type="button"
              onClick={handleStartDrawPolygon}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Vẽ đa giác ranh giới vùng trồng trên bản đồ"
            >
              <Hexagon className="w-3.5 h-3.5" />
              <span>{hasBoundary ? 'Vẽ lại vùng trồng' : 'Vẽ vùng trồng'}</span>
            </button>

            {hasBoundary && (
              <>
                <div
                  className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-[11px] font-semibold cursor-pointer hover:bg-emerald-100 transition-colors"
                  onClick={handleZoomToBoundary}
                  title="Click để phóng to đến trọn vẹn vùng trồng"
                >
                  <span>{vertexCount} đỉnh</span>
                  {areaM2 !== null && (
                    <>
                      <span className="text-emerald-400">•</span>
                      <span>{areaM2.toLocaleString('vi-VN')} m²</span>
                      <span className="text-emerald-500 font-normal">
                        (~{(areaM2 / 10000).toFixed(2)} ha)
                      </span>
                    </>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleZoomToBoundary}
                  className="p-1 hover:bg-stone-100 text-stone-600 rounded-md transition-colors text-xs cursor-pointer"
                  title="Phóng to đến vùng trồng"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  title="Kéo thả điều chỉnh các đỉnh ranh giới"
                >
                  <Pencil className="w-3 h-3" />
                  <span>Sửa</span>
                </button>

                <button
                  type="button"
                  onClick={handleDeleteBoundary}
                  className="p-1 hover:bg-red-50 text-stone-400 hover:text-red-600 rounded-md transition-colors text-xs cursor-pointer"
                  title="Xóa ranh giới"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {onAreaCalculated && areaM2 !== null && areaM2 > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      if (onAreaCalculated && areaM2) {
                        onAreaCalculated(areaM2);
                        toast.success(
                          `Đã điền ${areaM2.toLocaleString('vi-VN')} m² vào ô diện tích!`,
                        );
                      }
                    }}
                    className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    title="Tự động điền diện tích này vào ô Diện tích / Quy mô của form"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Lấy m²</span>
                  </button>
                )}
              </>
            )}
          </>
        ) : isDrawing ? (
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              Đang vẽ: Click các điểm...
            </span>
            <button
              type="button"
              onClick={handleCompletePolygon}
              className="flex items-center gap-1 px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
              title="Khép kín đa giác và lưu vùng trồng"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Hoàn tất</span>
            </button>
            <button
              type="button"
              onClick={handleCancelDraw}
              className="flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hủy</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-800 flex items-center gap-1">
              <Pencil className="w-3 h-3" />
              <span>Kéo thả đỉnh để sửa:</span>
            </span>
            <button
              type="button"
              onClick={handleSaveEdit}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Lưu</span>
            </button>
            <button
              type="button"
              onClick={handleCancelEdit}
              className="flex items-center gap-1 px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Hủy</span>
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .leaflet-draw-toolbar a {
          background-image: url('/images/spritesheet.png') !important;
          background-repeat: no-repeat !important;
        }
        .leaflet-retina .leaflet-draw-toolbar a {
          background-image: url('/images/spritesheet-2x.png') !important;
          background-size: 300px 30px !important;
        }
        .leaflet-draw-actions {
          left: 32px !important;
        }
        .leaflet-draw-actions a {
          background-color: #059669 !important;
          color: #fff !important;
          font-size: 11px !important;
          font-weight: 600 !important;
          padding-left: 8px !important;
          padding-right: 8px !important;
        }
        .leaflet-draw-actions a:hover {
          background-color: #047857 !important;
        }
      `}</style>
    </>
  );
}

function MapClickHandler({
  onClick,
  disabled,
}: {
  onClick: (lat: number, lng: number) => void;
  disabled: boolean;
}) {
  const map = useMap();
  useEffect(() => {
    if (disabled) return;
    const handleClick = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleClick);
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onClick, disabled]);
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
  onAreaCalculated,
}: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [isDrawingOrEditing, setIsDrawingOrEditing] = useState(false);
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

  // Đường viền ranh giới quốc gia Việt Nam (nổi bật dải đất hình chữ S tự nhiên)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nationalBoundary, setNationalBoundary] = useState<any>(null);

  // Tự động tải ranh giới quốc gia Việt Nam
  useEffect(() => {
    fetch('/maps/vn-boundary.geojson')
      .then((res) => res.json())
      .then((data) => setNationalBoundary(data))
      .catch((err) => console.error('Lỗi nạp GeoJSON ranh giới quốc gia:', err));
  }, []);

  // Trạng thái hiển thị hướng dẫn thao tác bản đồ (có nút ẩn / hiện)
  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('map_hide_guide');
      if (saved === 'true') {
        setShowGuide(false);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleGuide = useCallback((show: boolean) => {
    setShowGuide(show);
    try {
      localStorage.setItem('map_hide_guide', show ? 'false' : 'true');
    } catch {
      // ignore
    }
  }, []);

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

  // Xử lý khi click vào bản đồ để chọn toạ độ ghim cơ sở
  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      // Kiểm tra xem toạ độ có nằm trong lãnh thổ / hải đảo Việt Nam không
      const isInsideVN = lat >= 8.2 && lat <= 23.5 && lng >= 102.1 && lng <= 118.5;
      if (!isInsideVN) {
        toast.error('Vui lòng chọn vị trí trong lãnh thổ Việt Nam');
        return;
      }
      onChangeLocation(lat, lng);
    },
    [onChangeLocation],
  );

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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded transition-colors cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 font-semibold transition-colors shrink-0 cursor-pointer"
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
              className="rounded text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer"
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

          {/* Đường viền ranh giới quốc gia Việt Nam (nổi bật dải đất hình chữ S, không che phủ ảnh vệ tinh) */}
          {nationalBoundary && (
            <GeoJSON
              key="vietnam-national-boundary"
              data={nationalBoundary}
              interactive={false}
              style={() => ({
                fill: false,
                color: '#059669',
                weight: 2,
                opacity: 0.85,
                dashArray: '6, 4',
              })}
            />
          )}

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

          <MapClickHandler onClick={handleMapClick} disabled={isDrawingOrEditing} />
          <DrawControl
            boundary={boundary}
            onChangeBoundary={onChangeBoundary}
            onChangeLocation={onChangeLocation}
            onAreaCalculated={onAreaCalculated}
            hasLocationPin={!!latitude && !isNaN(latitude)}
            onDrawStateChange={setIsDrawingOrEditing}
          />
        </MapContainer>

        {/* Hướng dẫn thao tác bản đồ (có nút ẩn / hiện để không che bản đồ) */}
        {showGuide ? (
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md text-[11px] text-stone-600 z-[400] max-w-[260px] border border-stone-200 pointer-events-auto">
            <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-100">
              <div className="font-bold text-emerald-700 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Hướng dẫn thao tác</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleGuide(false)}
                className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
                title="Ẩn hướng dẫn để nhìn rõ bản đồ"
              >
                <X className="w-3 h-3" />
                <span>Ẩn</span>
              </button>
            </div>
            <ul className="list-disc pl-3.5 space-y-1 text-stone-600">
              <li>
                <b>Click bản đồ:</b> Chọn toạ độ ghim cơ sở.
              </li>
              <li>
                <b>Vẽ vùng trồng:</b> Click liên tiếp các điểm để tạo đa giác ranh giới.
              </li>
              <li>
                <b>Khép kín:</b> Click lại điểm đầu tiên hoặc bấm &quot;Hoàn tất&quot;.
              </li>
            </ul>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleToggleGuide(true)}
            className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md text-xs font-semibold text-stone-600 hover:text-emerald-700 z-[400] border border-stone-200 flex items-center gap-1.5 cursor-pointer pointer-events-auto transition-colors"
            title="Hiện bảng hướng dẫn thao tác"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Hướng dẫn</span>
          </button>
        )}
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
