import L from 'leaflet';
import {
  VIETNAM_CENTER,
  VIETNAM_DEFAULT_ZOOM,
  PROVINCE_FOCUS_ZOOM,
} from '@/constants/province-coordinates';

export const DEFAULT_CENTER: [number, number] = VIETNAM_CENTER;
export const DEFAULT_ZOOM = VIETNAM_DEFAULT_ZOOM;
export const FOCUS_ZOOM = 15;
export const PROVINCE_ZOOM = PROVINCE_FOCUS_ZOOM;

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export function setupLeafletIcons() {
  if (typeof window === 'undefined') return;
  const iconDefaultPrototype = L.Icon.Default.prototype as unknown as {
    _getIconUrl?: unknown;
  };
  delete iconDefaultPrototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

setupLeafletIcons();

interface LeafletWithGeometryUtil {
  GeometryUtil?: {
    geodesicArea: (latLngs: L.LatLng[]) => number;
  };
}

export function computePolygonArea(coords: { lat: number; lng: number }[]): number {
  if (!coords || coords.length < 3) return 0;

  const geomUtil =
    typeof L !== 'undefined' ? (L as unknown as LeafletWithGeometryUtil).GeometryUtil : undefined;
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
