import React from 'react';
import type { EventTheme, EventThemeDecorations } from '../types/eventTypes';
import { EventAtmosphereEffect } from './decorations/EventAtmosphereEffect';
import { EventCornerDecorations } from './decorations/EventCornerDecorations';

interface EventThemeProviderProps {
  theme?: EventTheme | null;
  children: React.ReactNode;
  className?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
  contained?: boolean;
}

export function EventThemeProvider({
  theme,
  children,
  className = '',
  device,
  contained = false,
}: EventThemeProviderProps) {
  if (!theme) {
    return <>{children}</>;
  }

  // Phân giải các biến màu sắc an toàn trong quá trình render
  let parsedColors: Record<string, string> = {};
  if (theme.colorsJson) {
    try {
      parsedColors = JSON.parse(theme.colorsJson);
    } catch {
      // Fallback
    }
  }

  // Phân giải cấu hình concept trang trí & hiệu ứng lễ hội
  let decorations: EventThemeDecorations | null = null;
  if (theme.decorationsJson) {
    try {
      decorations = JSON.parse(theme.decorationsJson);
    } catch {
      // Fallback
    }
  }

  // Xây dựng style inline dựa trên token thiết kế của sự kiện
  const styleVars: Record<string, string> = {
    '--event-primary': parsedColors.primary || '#D32F2F',
    '--event-secondary': parsedColors.secondary || '#FFD700',
    '--event-surface': parsedColors.surface || '#FFF8F0',
    '--event-text': parsedColors.text || '#1E1E1E',
    '--event-accent': parsedColors.accent || '#E53935',
  };

  return (
    <div
      style={styleVars as React.CSSProperties}
      className={`event-theme-wrapper transition-colors duration-300 relative ${className}`}
      data-event-theme={theme.code}
    >
      {/* 1. Hiệu ứng khí quyển rơi lất phất (Hoa mai, hoa đào, pháo giấy) */}
      {decorations && (
        <EventAtmosphereEffect
          type={decorations.atmosphereType}
          enabled={decorations.enableAtmosphere}
          contained={contained || Boolean(device)}
        />
      )}

      {/* 2. Họa tiết trang trí góc (Cành mai, lồng đèn...) */}
      {decorations && (
        <EventCornerDecorations
          conceptId={decorations.conceptId}
          enabled={decorations.enableCornerStickers}
          customStickerLeftUrl={decorations.customStickerLeftUrl}
          customStickerRightUrl={decorations.customStickerRightUrl}
          device={device}
        />
      )}

      {children}
    </div>
  );
}
