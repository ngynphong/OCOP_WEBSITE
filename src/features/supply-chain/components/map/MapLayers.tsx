'use client';

import React from 'react';
import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet';
import type { ProvinceMode } from '@/constants/regions-map';

export interface MapLayersProps {
  nationalBoundary: GeoJSON.GeoJsonObject | null;
  showBoundaries: boolean;
  geoJsonData: GeoJSON.FeatureCollection | null;
  provinceMode: ProvinceMode;
}

export function MapLayers({
  nationalBoundary,
  showBoundaries,
  geoJsonData,
  provinceMode,
}: MapLayersProps) {
  return (
    <>
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
    </>
  );
}

export default MapLayers;
