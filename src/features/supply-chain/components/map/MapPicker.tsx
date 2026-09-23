'use client';

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { MapContainer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { toast } from 'react-hot-toast';
import { ProvinceMode, PROVINCES_34_MAP, PROVINCES_63_MAP } from '@/constants/regions-map';
import {
  VIETNAM_MAP_BOUNDS,
  VIETNAM_MIN_ZOOM,
  VIETNAM_MAX_ZOOM,
  getProvinceGeo,
  searchProvinces,
  ProvinceSearchResult,
} from '@/constants/province-coordinates';
import {
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  FOCUS_ZOOM,
  PROVINCE_ZOOM,
  NominatimResult,
  computePolygonArea,
} from './mapUtils';
import { MapCenterUpdater, MapClickHandler } from './MapCenterUpdater';
import { MapGuideOverlay } from './MapGuideOverlay';
import { MapLayers } from './MapLayers';
import { MapSearchBar } from './MapSearchBar';
import { DrawControl } from './DrawControl';

export { computePolygonArea };

export interface MapPickerProps {
  latitude?: number;
  longitude?: number;
  boundary?: string;
  onChangeLocation: (lat: number, lng: number) => void;
  onChangeBoundary: (boundaryJson: string) => void;
  initialProvinceName?: string;
  onAreaCalculated?: (areaM2: number) => void;
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

  const [provinceMode, setProvinceMode] = useState<ProvinceMode>('63');
  const [showBoundaries, setShowBoundaries] = useState(false);
  const [geoJsonData, setGeoJsonData] = useState<GeoJSON.FeatureCollection | null>(null);
  const [nationalBoundary, setNationalBoundary] = useState<GeoJSON.GeoJsonObject | null>(null);

  useEffect(() => {
    fetch('/maps/vn-boundary.geojson')
      .then((res) => res.json())
      .then((data: GeoJSON.GeoJsonObject) => setNationalBoundary(data))
      .catch((err) => console.error('Lỗi nạp GeoJSON ranh giới quốc gia:', err));
  }, []);

  const [showGuide, setShowGuide] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('map_hide_guide');
      if (saved === 'true') {
        setShowGuide(false);
      }
    } catch {}
  }, []);

  const handleToggleGuide = useCallback((show: boolean) => {
    setShowGuide(show);
    try {
      localStorage.setItem('map_hide_guide', show ? 'false' : 'true');
    } catch {}
  }, []);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (showBoundaries) {
      const geoFile =
        provinceMode === '34' ? '/maps/vn-34-provinces.geojson' : '/maps/vn-63-provinces.geojson';
      fetch(geoFile)
        .then((res) => res.json())
        .then((data: GeoJSON.FeatureCollection) => setGeoJsonData(data))
        .catch((err) => console.error('Lỗi nạp GeoJSON ranh giới:', err));
    }
  }, [showBoundaries, provinceMode]);

  useEffect(() => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      setCenter([latitude, longitude]);
      setZoom(FOCUS_ZOOM);
      setTargetBounds(null);
    }
  }, [latitude, longitude]);

  const provinceList = useMemo(() => {
    const map = provinceMode === '34' ? PROVINCES_34_MAP : PROVINCES_63_MAP;
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  }, [provinceMode]);

  const provinceSuggestions = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    return searchProvinces(q, provinceMode, 5);
  }, [searchQuery, provinceMode]);

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

  const handleJumpToProvince = useCallback(
    (provName: string) => {
      if (!provName) return;
      const geo = getProvinceGeo(provName, provinceMode);
      if (geo) {
        handleSelectProvinceMatch(geo);
        return;
      }

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

  useEffect(() => {
    if (initialProvinceName && !latitude && !longitude) {
      handleJumpToProvince(initialProvinceName);
    }
  }, [initialProvinceName, latitude, longitude, handleJumpToProvince]);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;

    const provMatches = searchProvinces(q, provinceMode, 3);
    if (provMatches.length > 0) {
      handleSelectProvinceMatch(provMatches[0]);
    }

    setIsSearching(true);
    try {
      const res = await fetch(`/api/geocoding/search?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data = (await res.json()) as NominatimResult[];
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

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      const isInsideVN = lat >= 8.2 && lat <= 23.5 && lng >= 102.1 && lng <= 118.5;
      if (!isInsideVN) {
        toast.error('Vui lòng chọn vị trí trong lãnh thổ Việt Nam');
        return;
      }
      onChangeLocation(lat, lng);
    },
    [onChangeLocation],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="w-full h-full min-h-[420px] relative rounded-xl overflow-hidden border border-stone-300 flex flex-col shadow-xs bg-white">
      <MapSearchBar
        searchContainerRef={searchContainerRef}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        isSearching={isSearching}
        onSearch={handleSearch}
        onClearSearch={() => {
          setSearchQuery('');
          setSearchResults([]);
          setIsDropdownOpen(false);
        }}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        provinceMode={provinceMode}
        onProvinceModeChange={(mode) => {
          setProvinceMode(mode);
          setGeoJsonData(null);
        }}
        provinceSuggestions={provinceSuggestions}
        searchResults={searchResults}
        provinceList={provinceList}
        showBoundaries={showBoundaries}
        onToggleBoundaries={setShowBoundaries}
        onSelectProvinceMatch={handleSelectProvinceMatch}
        onSelectSearchResult={selectSearchResult}
        onJumpToProvince={handleJumpToProvince}
      />

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

          <MapLayers
            nationalBoundary={nationalBoundary}
            showBoundaries={showBoundaries}
            geoJsonData={geoJsonData}
            provinceMode={provinceMode}
          />

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

        <MapGuideOverlay showGuide={showGuide} onToggleGuide={handleToggleGuide} />
      </div>
    </div>
  );
}
