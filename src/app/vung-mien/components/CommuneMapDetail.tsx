'use client';

import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  LayersControl,
  Circle,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Product } from '@/features/products/types/productTypes';
import {
  VIETNAM_MAP_BOUNDS,
  VIETNAM_MIN_ZOOM,
  VIETNAM_MAX_ZOOM,
} from '@/constants/province-coordinates';
import Link from 'next/link';
import Image from 'next/image';
import { Star, ExternalLink } from 'lucide-react';

// Fix missing Leaflet marker icons
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icon tâm Xã / Phường
const communeCenterIcon = L.divIcon({
  className: 'custom-commune-marker',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center;">
      <span style="position: absolute; width: 34px; height: 34px; background-color: rgba(16, 185, 129, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
      <div style="width: 26px; height: 26px; background-color: #059669; border: 2.5px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.3);">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      </div>
    </div>
  `,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

// Custom Icon cho Điểm sản xuất / Cơ sở OCOP
const ocopProductIcon = L.divIcon({
  className: 'custom-ocop-marker',
  html: `
    <div style="display: flex; align-items: center; justify-content: center; width: 22px; height: 22px; background-color: #d97706; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.25);">
      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    </div>
  `,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

export interface CommuneMapDetailProps {
  center: [number, number];
  zoom?: number;
  provinceName?: string;
  districtName?: string;
  wardName?: string;
  products?: Product[];
  isResolvingCoords?: boolean;
}

function MapFlyTo({ center, zoom = 13 }: { center: [number, number]; zoom?: number }) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);

  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

export default function CommuneMapDetail({
  center,
  zoom = 13,
  provinceName,
  districtName,
  wardName,
  products = [],
  isResolvingCoords = false,
}: CommuneMapDetailProps) {
  // Trích xuất các sản phẩm có tọa độ thực từ nhật ký canh tác (nếu có)
  const productPoints = React.useMemo(() => {
    const points: Array<{
      product: Product;
      lat: number;
      lng: number;
      label: string;
    }> = [];

    products.forEach((p, idx) => {
      // 1. Kiểm tra toạ độ nhật ký canh tác
      const validJournal = p.journals?.find((j) => j.latitude && j.longitude);
      if (validJournal && validJournal.latitude && validJournal.longitude) {
        points.push({
          product: p,
          lat: validJournal.latitude,
          lng: validJournal.longitude,
          label: validJournal.location || p.name,
        });
      } else if (center && wardName && idx < 5) {
        // Dự phòng: Phân bố nhẹ quanh tâm xã để biểu diễn trực quan các vùng trồng OCOP
        const angle = (idx * 2 * Math.PI) / 5;
        const radius = 0.008 + (idx % 2) * 0.004; // ~800m - 1.2km
        points.push({
          product: p,
          lat: center[0] + radius * Math.cos(angle),
          lng: center[1] + (radius * Math.sin(angle)) / Math.cos((center[0] * Math.PI) / 180),
          label: p.productionArea || p.name,
        });
      }
    });

    return points;
  }, [products, center, wardName]);

  return (
    <div className="relative w-full h-[540px] rounded-2xl overflow-hidden shadow-inner border border-emerald-200/80">
      {/* Badge Thông tin Vị trí Xã/Huyện ghim nổi trên bản đồ */}
      <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl shadow-lg border border-stone-200/80 max-w-[280px]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-stone-900 truncate">
              {wardName
                ? `Xã / Phường: ${wardName}`
                : districtName
                  ? `Huyện: ${districtName}`
                  : provinceName || 'Việt Nam'}
            </h4>
            <p className="text-[10px] text-stone-500 truncate">
              {[districtName, provinceName].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
        {center && (
          <div className="mt-1.5 pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-400">
            <span>Tọa độ tâm:</span>
            <span className="font-mono text-emerald-700 font-semibold">
              {center[0].toFixed(4)}°N, {center[1].toFixed(4)}°E
            </span>
          </div>
        )}
      </div>

      {isResolvingCoords && (
        <div className="absolute top-3 right-3 z-[1000] bg-emerald-600/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md animate-pulse">
          Đang định vị xã...
        </div>
      )}

      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={VIETNAM_MIN_ZOOM}
        maxZoom={VIETNAM_MAX_ZOOM}
        maxBounds={VIETNAM_MAP_BOUNDS}
        maxBoundsViscosity={1.0}
        style={{ width: '100%', height: '100%' }}
      >
        <MapFlyTo center={center} zoom={zoom} />

        <LayersControl position="bottomleft">
          <LayersControl.BaseLayer checked name="Bản đồ Vệ tinh (Google Hybrid)">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}"
              attribution="Google Maps Satellite"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Bản đồ Địa hình (Google Terrain)">
            <TileLayer
              url="https://mt1.google.com/vt/lyrs=p&hl=vi&x={x}&y={y}&z={z}"
              attribution="Google Maps Terrain"
              maxZoom={20}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Bản đồ Tiêu chuẩn (OpenStreetMap)">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap"
              maxZoom={19}
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {/* Bán kính ước tính khu vực xã */}
        {wardName && (
          <Circle
            center={center}
            radius={2500}
            pathOptions={{
              color: '#059669',
              fillColor: '#10b981',
              fillOpacity: 0.12,
              weight: 1.5,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* Marker Tâm Xã / Phường */}
        <Marker position={center} icon={communeCenterIcon}>
          <Tooltip direction="top" offset={[0, -10]} opacity={0.95} permanent>
            <span className="text-xs font-bold text-emerald-800">
              📍 {wardName || districtName || provinceName}
            </span>
          </Tooltip>
          <Popup>
            <div className="p-1 max-w-[200px] text-xs">
              <p className="font-bold text-stone-900 mb-1">
                📍 {wardName ? `UBND / Trung tâm ${wardName}` : districtName}
              </p>
              <p className="text-stone-500 text-[11px] mb-2">
                {[districtName, provinceName].filter(Boolean).join(', ')}
              </p>
              <div className="bg-emerald-50 text-emerald-800 px-2 py-1 rounded text-[10px] font-semibold">
                Khu vực canh tác & sản xuất OCOP
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Markers Điểm sản xuất / Sản phẩm OCOP thuộc xã */}
        {productPoints.map((pt, i) => (
          <Marker key={i} position={[pt.lat, pt.lng]} icon={ocopProductIcon}>
            <Popup>
              <div className="p-1 max-w-[220px]">
                {pt.product.thumbnailUrl && (
                  <div className="relative w-full h-24 mb-2 rounded-lg overflow-hidden bg-stone-100">
                    <Image
                      src={pt.product.thumbnailUrl}
                      alt={pt.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex items-center gap-1 mb-1">
                  <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                    {pt.product.ocopStar} Sao
                  </span>
                  <span className="text-[10px] text-stone-400 truncate">
                    {pt.product.shopName || 'Cơ sở OCOP'}
                  </span>
                </div>
                <h5 className="font-bold text-xs text-stone-900 line-clamp-2 mb-1">
                  {pt.product.name}
                </h5>
                {pt.product.minPrice ? (
                  <p className="text-xs font-extrabold text-emerald-600 mb-2">
                    {pt.product.minPrice.toLocaleString('vi-VN')} đ
                  </p>
                ) : null}
                <Link
                  href={`/san-pham/${pt.product.slug}`}
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  Xem chi tiết sản phẩm <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Chú thích góc phải */}
      <div className="absolute bottom-3 right-3 z-[1000] bg-white/95 backdrop-blur-md p-2 rounded-xl shadow-md text-[10px] text-stone-600 border border-stone-200 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0 inline-block" />
          <span className="font-medium">Trung tâm Xã / Phường</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0 inline-block" />
          <span className="font-medium">Điểm sản xuất OCOP ({productPoints.length})</span>
        </div>
      </div>
    </div>
  );
}
