'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import { toast } from 'react-hot-toast';
import { Hexagon, Maximize2, Pencil, Trash2, Copy, Check, X } from 'lucide-react';
import { computePolygonArea } from './mapUtils';

export interface DrawControlProps {
  boundary?: string;
  onChangeBoundary: (boundaryJson: string) => void;
  onChangeLocation: (lat: number, lng: number) => void;
  onAreaCalculated?: (areaM2: number) => void;
  hasLocationPin: boolean;
  onDrawStateChange: (active: boolean) => void;
}

export function DrawControl({
  boundary,
  onChangeBoundary,
  onChangeLocation,
  onAreaCalculated,
  hasLocationPin,
  onDrawStateChange,
}: DrawControlProps) {
  const map = useMap();
  const drawnItemsRef = useRef<L.FeatureGroup>(new L.FeatureGroup());
  const drawControlRef = useRef<L.Control.Draw | null>(null);
  const polygonDrawerRef = useRef<L.Draw.Polygon | null>(null);
  const editHandlerRef = useRef<L.EditToolbar.Edit | null>(null);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

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
    } catch {}
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

  useEffect(() => {
    const drawnItems = drawnItemsRef.current;
    if (!map.hasLayer(drawnItems)) {
      map.addLayer(drawnItems);
    }
  }, [map]);

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

export default DrawControl;
