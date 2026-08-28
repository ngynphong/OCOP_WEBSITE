import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';

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
}

const DEFAULT_CENTER: [number, number] = [14.0583, 108.2772]; // Vietnam Center
const DEFAULT_ZOOM = 6;
const FOCUS_ZOOM = 15;

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
          // Clear old polygons
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
      // Cleanup is tricky with leaflet-draw in React, we keep it simple by not removing on unmount
      // as the map itself will be destroyed.
    };
  }, [map, onChangeBoundary]);

  // Handle external boundary changes (e.g. initial load)
  useEffect(() => {
    if (boundary && boundary.trim() !== '') {
      try {
        const parsed = JSON.parse(boundary);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const latLngs = parsed.map((p) => new L.LatLng(p.lat, p.lng));
          drawnItemsRef.current.clearLayers();
          const polygon = new L.Polygon(latLngs, { color: '#059669' });
          drawnItemsRef.current.addLayer(polygon);
        }
      } catch (e) {
        console.error('Lỗi parse JSON ranh giới', e);
      }
    } else {
      drawnItemsRef.current.clearLayers();
    }
  }, [boundary]);

  return null;
}

function MapClickHandler({ onClick }: { onClick: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const handleMapClick = (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    };
    map.on('click', handleMapClick);
    return () => {
      map.off('click', handleMapClick);
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
}: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>(DEFAULT_CENTER);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([]);

  useEffect(() => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      setCenter([latitude, longitude]);
      setZoom(FOCUS_ZOOM);
    }
  }, [latitude, longitude]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery,
        )}&countrycodes=vn&limit=5`,
      );
      const data = await res.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Lỗi tìm kiếm địa chỉ:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const selectSearchResult = (result: NominatimResult) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setCenter([lat, lon]);
    setZoom(16);
    setSearchResults([]);
    setSearchQuery(result.display_name);
  };

  return (
    <div className="w-full h-full min-h-[400px] relative rounded-lg overflow-hidden border border-stone-300 flex flex-col">
      {/* Thanh tìm kiếm */}
      <div className="p-2 bg-stone-50 border-b border-stone-200 z-[1000] relative">
        <div className="flex gap-2 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Tìm kiếm địa chỉ, khu vực..."
            className="flex-1 text-sm text-gray-700 border border-stone-300 rounded px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-emerald-600 text-white px-3 py-1.5 rounded text-sm hover:bg-emerald-700 disabled:opacity-50"
          >
            {isSearching ? 'Đang tìm...' : 'Tìm'}
          </button>

          {/* Dropdown kết quả */}
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-[60px] mt-1 bg-white border border-stone-200 shadow-xl rounded-md max-h-[200px] overflow-y-auto z-[9999]">
              {searchResults.map((res, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm font-medium text-stone-800 hover:bg-emerald-50 border-b border-stone-100 last:border-b-0"
                  onClick={() => selectSearchResult(res)}
                >
                  {res.display_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer center={center} zoom={zoom} style={{ width: '100%', height: '100%' }}>
          {/* Component tự cập nhật Center khi state center thay đổi */}
          <MapCenterUpdater center={center} zoom={zoom} />

          <LayersControl position="bottomleft">
            <LayersControl.BaseLayer checked name="Bản đồ đường phố (OSM)">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Bản đồ vệ tinh (Google Hybrid)">
              <TileLayer
                url="http://mt0.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}"
                attribution="Google Maps"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Bản đồ vệ tinh (Esri)">
              <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {latitude && longitude && !isNaN(latitude) && !isNaN(longitude) && (
            <Marker position={[latitude, longitude]} />
          )}

          <MapClickHandler onClick={onChangeLocation} />
          <DrawControl boundary={boundary} onChangeBoundary={onChangeBoundary} />
        </MapContainer>

        <div className="absolute top-2 right-2 bg-white/90 p-2 rounded shadow text-[10px] text-stone-600 z-[400] max-w-[200px] border border-stone-200">
          <p className="font-bold text-emerald-700 mb-1">Hướng dẫn sử dụng:</p>
          <ul className="list-disc pl-3 space-y-1">
            <li>
              <b>Click vào bản đồ:</b> Chọn toạ độ Vĩ độ/Kinh độ (Thả ghim).
            </li>
            <li>
              <b>Công cụ Polygon:</b> Vẽ ranh giới vùng trồng.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Component phụ giúp React Leaflet bay đến toạ độ mới khi state thay đổi
function MapCenterUpdater({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}
