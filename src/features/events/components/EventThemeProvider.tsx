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

  const primary = parsedColors.primary || '#DC2626';
  const secondary = parsedColors.secondary || '#F59E0B';
  const surface = parsedColors.surface || '#FFF1F2';

  // Xây dựng style inline dựa trên token thiết kế của sự kiện
  const styleVars: Record<string, string> = {
    '--event-primary': primary,
    '--event-secondary': secondary,
    '--event-surface': surface,
    '--event-text': parsedColors.text || '#0F172A',
    '--event-text-muted': parsedColors.textMuted || '#64748B',
    '--event-accent': parsedColors.accent || primary,
    '--event-bg':
      parsedColors.pageBg || `linear-gradient(180deg, ${surface} 0%, #FFFFFF 50%, ${surface} 100%)`,
    '--event-card-bg': parsedColors.cardBg || '#FFFFFF',
    '--event-card-border': parsedColors.cardBorder || `${primary}26`,
    '--event-countdown-bg':
      parsedColors.countdownBg || `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    '--event-glow': parsedColors.glow || `${primary}26`,
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
