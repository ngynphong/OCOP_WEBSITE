'use client';

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export interface MapCenterUpdaterProps {
  center: [number, number];
  zoom: number;
  targetBounds?: [[number, number], [number, number]] | null;
}

export function MapCenterUpdater({ center, zoom, targetBounds }: MapCenterUpdaterProps) {
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

export interface MapClickHandlerProps {
  onClick: (lat: number, lng: number) => void;
  disabled: boolean;
}

export function MapClickHandler({ onClick, disabled }: MapClickHandlerProps) {
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
