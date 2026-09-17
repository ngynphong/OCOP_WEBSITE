'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { eventApi } from '@/features/events/api/eventApi';
import { eventCommerceApi } from '@/features/events/api/eventCommerceApi';
import type {
  EventDetailResponse,
  EventTheme,
  EventThemeDecorations,
  AtmosphereEffectType,
  ConceptPackId,
  CampaignEventStatus,
} from '@/features/events/types/eventTypes';
import type {
  EventCollection,
  EventFlashSale,
  EventVoucher,
} from '@/features/events/types/eventCommerceTypes';
import { THEME_PRESETS } from '@/features/events/constants/themePresets';
import { CONCEPT_PACKS } from '@/features/events/constants/decorationPacks';

export type PreviewDevice = 'desktop' | 'tablet' | 'mobile';
export type PreviewZoom = 50 | 75 | 100 | 125 | 'fit';
export type TimeScenario = 'UPCOMING' | 'LIVE' | 'ENDED';
export type SidebarTab = 'simulator' | 'theme' | 'qa';

export interface QACheckItem {
  id: string;
  label: string;
  status: 'PASSED' | 'WARNING' | 'FAILED';
  description: string;
  recommendation?: string;
}

export interface ThemeDesignTokens {
  primary: string;
  secondary: string;
  surface: string;
  text: string;
  textMuted: string;
  accent: string;
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  countdownBg: string;
  glow: string;
}

export const THEME_DESIGN_TOKENS: Record<string, ThemeDesignTokens> = {
  tet_xuan: {
    primary: '#DC2626',
    secondary: '#D97706',
    surface: '#FFF1F2',
    text: '#0F172A',
    textMuted: '#64748B',
    accent: '#EF4444',
    pageBg: 'linear-gradient(180deg, #FFF1F2 0%, #FFFBEB 30%, #FEF2F2 70%, #FFF5F5 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(220, 38, 38, 0.15)',
    countdownBg: 'linear-gradient(135deg, #DC2626 0%, #E11D48 50%, #F59E0B 100%)',
    glow: 'rgba(220, 38, 38, 0.12)',
  },
  trung_thu: {
    primary: '#4F46E5',
    secondary: '#D97706',
    surface: '#FEFCE8',
    text: '#0F172A',
    textMuted: '#64748B',
    accent: '#6366F1',
    pageBg: 'linear-gradient(180deg, #FEFCE8 0%, #F5F3FF 35%, #EFF6FF 70%, #FFFBEB 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(79, 70, 229, 0.15)',
    countdownBg: 'linear-gradient(135deg, #4338CA 0%, #6366F1 50%, #D97706 100%)',
    glow: 'rgba(217, 119, 6, 0.15)',
  },
  mua_vang: {
    primary: '#D97706',
    secondary: '#16A34A',
    surface: '#FFFBEB',
    text: '#1C1917',
    textMuted: '#78716C',
    accent: '#F59E0B',
    pageBg: 'linear-gradient(180deg, #FFFBEB 0%, #FEFCE8 35%, #F0FDF4 70%, #FFFBEB 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(217, 119, 6, 0.16)',
    countdownBg: 'linear-gradient(135deg, #D97706 0%, #B45309 50%, #15803D 100%)',
    glow: 'rgba(217, 119, 6, 0.15)',
  },
  ocop_xanh: {
    primary: '#16A34A',
    secondary: '#65A30D',
    surface: '#F0FDF4',
    text: '#0F172A',
    textMuted: '#64748B',
    accent: '#22C55E',
    pageBg: 'linear-gradient(180deg, #F0FDF4 0%, #ECFDF5 35%, #F7FEE7 70%, #F0FDF4 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(22, 163, 74, 0.16)',
    countdownBg: 'linear-gradient(135deg, #15803D 0%, #16A34A 50%, #65A30D 100%)',
    glow: 'rgba(22, 163, 74, 0.14)',
  },
  le_hoi_viet: {
    primary: '#B91C1C',
    secondary: '#D97706',
    surface: '#FFF1F2',
    text: '#1E293B',
    textMuted: '#64748B',
    accent: '#DC2626',
    pageBg: 'linear-gradient(180deg, #FFF1F2 0%, #FEF2F2 35%, #FFFBEB 70%, #FFF5F5 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(185, 28, 28, 0.15)',
    countdownBg: 'linear-gradient(135deg, #B91C1C 0%, #DC2626 50%, #D97706 100%)',
    glow: 'rgba(185, 28, 28, 0.12)',
  },
  sieu_sale: {
    primary: '#7C3AED',
    secondary: '#E11D48',
    surface: '#FAF5FF',
    text: '#0F172A',
    textMuted: '#64748B',
    accent: '#EC4899',
    pageBg: 'linear-gradient(180deg, #FAF5FF 0%, #FFF1F2 35%, #FDF4FF 70%, #F5F3FF 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(124, 58, 237, 0.15)',
    countdownBg: 'linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #E11D48 100%)',
    glow: 'rgba(124, 58, 237, 0.14)',
  },
  tay_bac: {
    primary: '#C2410C',
    secondary: '#0284C7',
    surface: '#FFF7ED',
    text: '#1C1917',
    textMuted: '#78716C',
    accent: '#EA580C',
    pageBg: 'linear-gradient(180deg, #FFF7ED 0%, #FFFBEB 35%, #F0F9FF 70%, #FFF7ED 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(194, 65, 12, 0.15)',
    countdownBg: 'linear-gradient(135deg, #9A3412 0%, #C2410C 50%, #0284C7 100%)',
    glow: 'rgba(194, 65, 12, 0.14)',
  },
  miet_vuon: {
    primary: '#0F766E',
    secondary: '#EA580C',
    surface: '#F0FDFA',
    text: '#0F172A',
    textMuted: '#64748B',
    accent: '#14B8A6',
    pageBg: 'linear-gradient(180deg, #F0FDFA 0%, #FFFBEB 35%, #ECFDF5 70%, #F0FDFA 100%)',
    cardBg: '#FFFFFF',
    cardBorder: 'rgba(15, 118, 110, 0.15)',
    countdownBg: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #EA580C 100%)',
    glow: 'rgba(15, 118, 110, 0.14)',
  },
};

export function resolveBasePresetId(theme?: EventTheme | null): string {
  if (!theme) return 'tet_xuan';
  const validPresetIds = Object.keys(THEME_DESIGN_TOKENS);

  if (theme.decorationsJson) {
    try {
      const decs = JSON.parse(theme.decorationsJson);
      if (decs?.conceptId) {
        const foundConcept = CONCEPT_PACKS.find((c) => c.id === decs.conceptId);
        if (
          foundConcept?.suggestedThemePresetId &&
          validPresetIds.includes(foundConcept.suggestedThemePresetId)
        ) {
          return foundConcept.suggestedThemePresetId;
        }
        const normalized = String(decs.conceptId).toLowerCase();
        if (validPresetIds.includes(normalized)) {
          return normalized;
        }
      }
    } catch {
      // ignore json error
    }
  }

  const rawCode = theme.code?.trim().toLowerCase();
  if (rawCode) {
    if (validPresetIds.includes(rawCode)) {
      return rawCode;
    }
    const stripped = rawCode.replace(/^theme_/i, '');
    if (validPresetIds.includes(stripped)) {
      return stripped;
    }
  }

  return 'tet_xuan';
}

export function useAdminEventPreviewQuery(eventId: number) {
  return useQuery({
    queryKey: ['admin-event-preview', eventId],
    queryFn: async () => {
      if (!eventId || !Number.isInteger(eventId) || eventId <= 0) {
        throw new Error('Mã sự kiện không hợp lệ');
      }
      const [previewData, cols, fs, vcs] = await Promise.all([
        eventApi.getPreview(eventId),
        eventCommerceApi.getAdminCollections(eventId).catch(() => [] as EventCollection[]),
        eventCommerceApi.getAdminFlashSales(eventId).catch(() => [] as EventFlashSale[]),
        eventCommerceApi.getAdminVouchers(eventId).catch(() => [] as EventVoucher[]),
      ]);
      return { previewData, cols, fs, vcs };
    },
    enabled: Boolean(eventId && Number.isInteger(eventId) && eventId > 0),
    staleTime: 30 * 1000,
  });
}

export function useAdminEventPreview(eventId: number) {
  const queryClient = useQueryClient();

  // ── 1. React Query Data Fetching ──────────────────────────────────────────
  const previewQuery = useAdminEventPreviewQuery(eventId);

  const event = previewQuery.data?.previewData ?? null;
  const collections = useMemo(() => previewQuery.data?.cols ?? [], [previewQuery.data?.cols]);
  const flashSales = useMemo(() => previewQuery.data?.fs ?? [], [previewQuery.data?.fs]);
  const vouchers = useMemo(() => previewQuery.data?.vcs ?? [], [previewQuery.data?.vcs]);
  const loading = previewQuery.isLoading;
  const refreshing = previewQuery.isRefetching;
  const error =
    previewQuery.error instanceof Error
      ? previewQuery.error.message
      : previewQuery.isError
        ? 'Không thể tải dữ liệu xem trước sự kiện'
        : null;

  // ── 2. Viewport & Canvas Controls ───────────────────────────────────────────
  const [device, setDevice] = useState<PreviewDevice>('desktop');
  const [zoom, setZoom] = useState<PreviewZoom>(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ── 3. Simulator Sidebar State ──────────────────────────────────────────────
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('simulator');
  const [isCustomerView, setIsCustomerView] = useState(false);

  // Time Simulator (Derived state with user override)
  const [customTimeScenario, setCustomTimeScenario] = useState<TimeScenario | null>(null);
  const [customSelectedSlotId, setCustomSelectedSlotId] = useState<number | null>(null);

  const defaultTimeScenario: TimeScenario = useMemo(() => {
    if (!event) return 'LIVE';
    if (event.status === 'SCHEDULED' || event.status === 'DRAFT') {
      return 'UPCOMING';
    }
    if (event.status === 'ENDED' || event.status === 'ARCHIVED') {
      return 'ENDED';
    }
    return 'LIVE';
  }, [event]);

  const timeScenario: TimeScenario = customTimeScenario ?? defaultTimeScenario;
  const setTimeScenario = useCallback((scenario: TimeScenario) => {
    setCustomTimeScenario(scenario);
  }, []);

  const defaultSlotId = flashSales.length > 0 ? flashSales[0].id : null;
  const selectedSlotId = customSelectedSlotId ?? defaultSlotId;
  const setSelectedSlotId = useCallback((slotId: number | null) => {
    setCustomSelectedSlotId(slotId);
  }, []);

  // Live Theme Tester
  const [customThemePresetId, setCustomThemePresetId] = useState<string | null>(null);
  const [enableAtmosphereOverride, setEnableAtmosphereOverride] = useState<boolean | null>(null);
  const [atmosphereTypeOverride, setAtmosphereTypeOverride] = useState<AtmosphereEffectType | null>(
    null,
  );
  const [enableStickersOverride, setEnableStickersOverride] = useState<boolean | null>(null);

  // Publish Flow
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  // ── 4. Effective Theme Computation ──────────────────────────────────────────
  const defaultThemePresetId = useMemo(() => {
    return resolveBasePresetId(event?.theme);
  }, [event]);

  const effectiveTheme = useMemo<EventTheme | undefined>(() => {
    if (!event) return undefined;
    const baseTheme = event.theme || {
      name: 'Default Theme',
      code: defaultThemePresetId,
    };

    const activeThemeCode = customThemePresetId || defaultThemePresetId;
    const tokens = THEME_DESIGN_TOKENS[activeThemeCode] || THEME_DESIGN_TOKENS.tet_xuan;
    const preset = THEME_PRESETS.find((p) => p.id === activeThemeCode);
    const concept = CONCEPT_PACKS.find((c) => c.suggestedThemePresetId === activeThemeCode);
    const isCustomPreset = Boolean(customThemePresetId);

    // 1. Phân giải màu sắc
    let baseColors: Record<string, string> = {};
    if (baseTheme.colorsJson) {
      try {
        baseColors = JSON.parse(baseTheme.colorsJson);
      } catch {
        // ignore
      }
    }

    const primary = isCustomPreset
      ? preset?.primary || tokens.primary
      : baseColors.primary && baseColors.primary.toLowerCase() !== '#1e1b4b'
        ? baseColors.primary
        : tokens.primary;
    const secondary = isCustomPreset
      ? preset?.secondary || tokens.secondary
      : baseColors.secondary || tokens.secondary;
    const surface = isCustomPreset
      ? preset?.surface || tokens.surface
      : baseColors.surface || tokens.surface;

    const enrichedColors = {
      ...tokens,
      ...baseColors,
      primary,
      secondary,
      surface,
      pageBg:
        baseColors.pageBg &&
        !baseColors.pageBg.includes('#0B0204') &&
        !baseColors.pageBg.includes('#050102')
          ? baseColors.pageBg
          : tokens.pageBg,
      cardBg: baseColors.cardBg || tokens.cardBg,
      cardBorder: baseColors.cardBorder || tokens.cardBorder,
      countdownBg: baseColors.countdownBg || tokens.countdownBg,
      glow: baseColors.glow || tokens.glow,
    };

    // 2. Phân giải cấu hình trang trí (conceptId, atmosphereType, cornerStickers)
    let baseDecorations: Partial<EventThemeDecorations> = {};
    if (baseTheme.decorationsJson) {
      try {
        baseDecorations = JSON.parse(baseTheme.decorationsJson);
      } catch {
        // ignore
      }
    }

    const resolvedConceptId =
      baseDecorations.conceptId &&
      baseDecorations.conceptId !== 'NONE' &&
      (baseDecorations.conceptId !== 'TET_NGUYEN_DAN' || activeThemeCode === 'tet_xuan')
        ? baseDecorations.conceptId
        : concept?.id || 'CUSTOM';

    const defaultAtmosphere = concept?.atmosphereType || 'starlight';
    const effectiveAtmosphere =
      atmosphereTypeOverride ??
      (isCustomPreset
        ? defaultAtmosphere
        : baseDecorations.atmosphereType &&
            (baseDecorations.atmosphereType !== 'apricot_petals' || activeThemeCode === 'tet_xuan')
          ? baseDecorations.atmosphereType
          : defaultAtmosphere);

    const decorations: EventThemeDecorations = {
      conceptId: (isCustomPreset ? concept?.id || 'CUSTOM' : resolvedConceptId) as ConceptPackId,
      enableAtmosphere:
        enableAtmosphereOverride ?? baseDecorations.enableAtmosphere ?? concept?.id !== 'NONE',
      atmosphereType: effectiveAtmosphere,
      enableCornerStickers:
        enableStickersOverride ?? baseDecorations.enableCornerStickers ?? concept?.id !== 'NONE',
      customStickerLeftUrl: baseDecorations.customStickerLeftUrl,
      customStickerRightUrl: baseDecorations.customStickerRightUrl,
    };

    return {
      ...baseTheme,
      name: isCustomPreset ? preset?.name || baseTheme.name : baseTheme.name,
      code: activeThemeCode,
      colorsJson: JSON.stringify(enrichedColors),
      decorationsJson: JSON.stringify(decorations),
    };
  }, [
    event,
    defaultThemePresetId,
    customThemePresetId,
    enableAtmosphereOverride,
    atmosphereTypeOverride,
    enableStickersOverride,
  ]);

  // ── 5. Effective Simulated Event ────────────────────────────────────────────
  const simulatedEvent = useMemo<EventDetailResponse | null>(() => {
    if (!event) return null;

    let simulatedStatus: CampaignEventStatus = event.status;
    let simulatedStartAt = event.startAt;
    let simulatedEndAt = event.endAt;

    const now = new Date();

    if (timeScenario === 'UPCOMING') {
      simulatedStatus = 'SCHEDULED';
      const futureStart = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
      const futureEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      simulatedStartAt = futureStart.toISOString();
      simulatedEndAt = futureEnd.toISOString();
    } else if (timeScenario === 'LIVE') {
      simulatedStatus = 'LIVE';
      const pastStart = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      const futureEnd = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
      simulatedStartAt = pastStart.toISOString();
      simulatedEndAt = futureEnd.toISOString();
    } else if (timeScenario === 'ENDED') {
      simulatedStatus = 'ENDED';
      const pastStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const pastEnd = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);
      simulatedStartAt = pastStart.toISOString();
      simulatedEndAt = pastEnd.toISOString();
    }

    return {
      ...event,
      status: simulatedStatus,
      startAt: simulatedStartAt,
      endAt: simulatedEndAt,
      theme: effectiveTheme,
    };
  }, [event, timeScenario, effectiveTheme]);

  // ── 6. QA Checklist Evaluation ──────────────────────────────────────────────
  const qaChecklist = useMemo<QACheckItem[]>(() => {
    if (!event) return [];

    const items: QACheckItem[] = [];

    // 1. Desktop Banner
    if (event.bannerDesktopUrl) {
      items.push({
        id: 'banner_desktop',
        label: 'Banner Desktop (1920×600)',
        status: 'PASSED',
        description: 'Đã thiết lập ảnh banner chính hiển thị sắc nét trên màn hình rộng.',
      });
    } else {
      items.push({
        id: 'banner_desktop',
        label: 'Banner Desktop (1920×600)',
        status: 'FAILED',
        description: 'Chưa có ảnh banner máy tính.',
        recommendation: 'Cần tải lên banner kích thước tối thiểu 1920×600px để tránh mất thẩm mỹ.',
      });
    }

    // 2. Mobile Banner
    if (event.bannerMobileUrl) {
      items.push({
        id: 'banner_mobile',
        label: 'Banner Mobile Tối Ưu (800×800)',
        status: 'PASSED',
        description: 'Đã có banner dọc riêng biệt cho điện thoại di động.',
      });
    } else if (event.bannerDesktopUrl) {
      items.push({
        id: 'banner_mobile',
        label: 'Banner Mobile Tối Ưu (800×800)',
        status: 'WARNING',
        description: 'Đang dùng ảnh Desktop co giãn thu nhỏ trên điện thoại.',
        recommendation: 'Nên bổ sung banner vuông/dọc 800×800px để người dùng di động đọc rõ chữ.',
      });
    } else {
      items.push({
        id: 'banner_mobile',
        label: 'Banner Mobile (800×800)',
        status: 'FAILED',
        description: 'Chưa có banner nào cho thiết bị di động.',
        recommendation: 'Cần tải lên banner mobile.',
      });
    }

    // 3. Flash Sale Slots
    if (flashSales.length > 0) {
      items.push({
        id: 'flash_sale',
        label: 'Khung giờ Flash Sale',
        status: 'PASSED',
        description: `Đã thiết lập ${flashSales.length} khung giờ Flash Sale giảm sốc.`,
      });
    } else {
      items.push({
        id: 'flash_sale',
        label: 'Khung giờ Flash Sale',
        status: 'WARNING',
        description: 'Chưa có khung giờ Flash Sale nào trong sự kiện.',
        recommendation: 'Thêm ít nhất 1 khung giờ Flash Sale để tăng tính hấp dẫn kích cầu.',
      });
    }

    // 4. Vouchers
    if (vouchers.length > 0) {
      items.push({
        id: 'vouchers',
        label: 'Mã Giảm Giá & Voucher',
        status: 'PASSED',
        description: `Đã phát hành ${vouchers.length} loại voucher ưu đãi sự kiện.`,
      });
    } else {
      items.push({
        id: 'vouchers',
        label: 'Mã Giảm Giá & Voucher',
        status: 'WARNING',
        description: 'Chưa có voucher ưu đãi cho sự kiện này.',
        recommendation: 'Tạo mã voucher sự kiện (vd: Giảm 10K-20K, Freeship) để tăng chuyển đổi.',
      });
    }

    // 5. Product Collections
    if (collections.length > 0) {
      items.push({
        id: 'collections',
        label: 'Bộ sưu tập Sản phẩm Trưng bày',
        status: 'PASSED',
        description: `Có ${collections.length} bộ sưu tập sản phẩm đã được phân bổ.`,
      });
    } else {
      items.push({
        id: 'collections',
        label: 'Bộ sưu tập Sản phẩm Trưng bày',
        status: 'WARNING',
        description: 'Chưa có bộ sưu tập nông sản nào được gom nhóm.',
        recommendation: 'Tạo bộ sưu tập (ví dụ: Nông sản tiêu biểu, Đặc sản quà tặng).',
      });
    }

    // 6. Time Validity
    const startDate = new Date(event.startAt);
    const endDate = new Date(event.endAt);
    if (startDate < endDate) {
      items.push({
        id: 'timeline',
        label: 'Khung thời gian tổ chức',
        status: 'PASSED',
        description: 'Thời điểm bắt đầu và kết thúc sự kiện hợp lệ.',
      });
    } else {
      items.push({
        id: 'timeline',
        label: 'Khung thời gian tổ chức',
        status: 'FAILED',
        description: 'Thời gian kết thúc sự kiện nhỏ hơn hoặc bằng thời gian bắt đầu.',
        recommendation: 'Chỉnh sửa lại ngày kết thúc sự kiện.',
      });
    }

    return items;
  }, [event, flashSales, vouchers, collections]);

  const qaStats = useMemo(() => {
    const total = qaChecklist.length;
    if (total === 0)
      return { total: 0, passed: 0, warnings: 0, failed: 0, score: 0, isReady: false };

    const passed = qaChecklist.filter((i) => i.status === 'PASSED').length;
    const warnings = qaChecklist.filter((i) => i.status === 'WARNING').length;
    const failed = qaChecklist.filter((i) => i.status === 'FAILED').length;

    const score = Math.round((passed / total) * 100);
    const isReady = failed === 0;

    return { total, passed, warnings, failed, score, isReady };
  }, [qaChecklist]);

  // ── 7. Actions & Mutations ──────────────────────────────────────────────────
  const publishMutation = useMutation({
    mutationFn: (id: number) => eventApi.publishEvent(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['admin-event-preview', eventId] });
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setIsPublishModalOpen(false);
      toast.success(`Sự kiện "${updated.name}" đã được xuất bản thành công!`);
    },
  });

  const resetThemeOverrides = useCallback(() => {
    setCustomThemePresetId(null);
    setEnableAtmosphereOverride(null);
    setAtmosphereTypeOverride(null);
    setEnableStickersOverride(null);
    toast.success('Đã khôi phục Theme và hiệu ứng gốc của sự kiện');
  }, []);

  const handlePublishEvent = useCallback(async () => {
    if (!event) return;

    if (!qaStats.isReady) {
      toast.error(
        'Sự kiện còn lỗi cấu hình bắt buộc (FAILED). Vui lòng khắc phục trước khi xuất bản.',
      );
      return;
    }

    await publishMutation.mutateAsync(event.id);
  }, [event, qaStats.isReady, publishMutation]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      void document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return {
    // Data
    event: simulatedEvent,
    rawEvent: event,
    collections,
    flashSales,
    vouchers,
    loading,
    refreshing,
    error,

    // Viewport & Canvas
    device,
    zoom,
    isFullscreen,
    setDevice,
    setZoom,
    toggleFullscreen,

    // Sidebar & Simulator
    isSidebarOpen,
    setIsSidebarOpen,
    activeSidebarTab,
    setActiveSidebarTab,
    isCustomerView,
    setIsCustomerView,

    // Time Simulator
    timeScenario,
    setTimeScenario,
    selectedSlotId,
    setSelectedSlotId,

    // Live Theme Tester
    customThemePresetId,
    defaultThemePresetId,
    activeThemePresetId: customThemePresetId || defaultThemePresetId,
    setCustomThemePresetId,
    enableAtmosphereOverride,
    setEnableAtmosphereOverride,
    atmosphereTypeOverride,
    setAtmosphereTypeOverride,
    enableStickersOverride,
    setEnableStickersOverride,
    resetThemeOverrides,

    // QA Checklist
    qaChecklist,
    qaStats,

    // Publish Flow
    isPublishModalOpen,
    setIsPublishModalOpen,
    isPublishing: publishMutation.isPending,
    handlePublishEvent,

    // Refresh
    handleRefresh: () => void previewQuery.refetch(),
  };
}
