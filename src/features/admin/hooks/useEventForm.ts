'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { eventApi } from '@/features/events/api/eventApi';
import type {
  EventDetailResponse,
  EventType,
  CreateEventInput,
  ConceptPackId,
  AtmosphereEffectType,
  EventThemeDecorations,
} from '@/features/events/types/eventTypes';
import { THEME_PRESETS, type ThemePreset } from '@/features/events/constants/themePresets';
import { CONCEPT_PACKS, type ConceptPack } from '@/features/events/constants/decorationPacks';
import {
  LUCKY_WHEEL_REWARDS,
  LUCKY_ENVELOPE_REWARDS,
  resolveMysteryPickConcept,
} from '@/features/events/constants/minigamePresets';
import type {
  MinigameReward,
  MysteryPickConceptId,
  MysteryPickItem,
} from '@/features/events/types/eventMinigameTypes';
import { slugify } from '@/utils/slugify';
import { eventFormSchema } from '@/features/admin/types/eventSchema';
import toast from 'react-hot-toast';

export interface UseEventFormOptions {
  initialData?: EventDetailResponse | null;
  onSuccess?: (event: EventDetailResponse) => void;
}

export function useEventForm({ initialData, onSuccess }: UseEventFormOptions = {}) {
  const router = useRouter();
  const isEdit = Boolean(initialData?.id);

  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  // 1. Basic Info
  const [name, setName] = useState(initialData?.name || '');
  const [code, setCode] = useState(initialData?.code || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [type, setType] = useState<EventType>(initialData?.type || 'SEASONAL');
  const [startAt, setStartAt] = useState(
    initialData?.startAt ? initialData.startAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
  );
  const [endAt, setEndAt] = useState(
    initialData?.endAt
      ? initialData.endAt.slice(0, 16)
      : new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );
  const [isHomeFeatured, setIsHomeFeatured] = useState(initialData?.isHomeFeatured ?? true);

  // 2. Banners
  const [bannerDesktopUrl, setBannerDesktopUrl] = useState(initialData?.bannerDesktopUrl || '');
  const [bannerMobileUrl, setBannerMobileUrl] = useState(initialData?.bannerMobileUrl || '');

  // 3. Seller Registration
  const [sellerPortalVisible, setSellerPortalVisible] = useState(
    initialData?.sellerPortalVisible ?? false,
  );
  const [registrationStartAt, setRegistrationStartAt] = useState(
    initialData?.registrationStartAt?.slice(0, 16) || new Date().toISOString().slice(0, 16),
  );
  const [registrationEndAt, setRegistrationEndAt] = useState(
    initialData?.registrationEndAt?.slice(0, 16) ||
      (initialData?.startAt ? initialData.startAt.slice(0, 16) : startAt),
  );
  const [minOcopStar, setMinOcopStar] = useState(initialData?.minOcopStar ?? 3);
  const [minDiscountPercent, setMinDiscountPercent] = useState(
    initialData?.minDiscountPercent ?? 10,
  );
  const [maxProductsPerShop, setMaxProductsPerShop] = useState(
    initialData?.maxProductsPerShop ?? 20,
  );

  // 4. Colors
  const getInitialColors = () => {
    if (initialData?.theme?.colorsJson) {
      try {
        const parsed = JSON.parse(initialData.theme.colorsJson);
        return {
          primary: parsed.primary || '#DC2626',
          secondary: parsed.secondary || '#F59E0B',
          surface: parsed.surface || '#FEF2F2',
        };
      } catch {
        // ignore
      }
    }
    return {
      primary: '#DC2626',
      secondary: '#F59E0B',
      surface: '#FEF2F2',
    };
  };

  const initialColors = getInitialColors();
  const [primaryColor, setPrimaryColor] = useState(initialColors.primary);
  const [secondaryColor, setSecondaryColor] = useState(initialColors.secondary);
  const [surfaceColor, setSurfaceColor] = useState(initialColors.surface);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(() => {
    // 1. So khớp trực tiếp theo theme.code
    if (initialData?.theme?.code) {
      const rawCode = initialData.theme.code.trim();
      const directCode = rawCode.replace(/^THEME_/i, '').toLowerCase();
      const match = THEME_PRESETS.find(
        (p) =>
          p.id === directCode ||
          p.id.toLowerCase() === directCode ||
          p.id.toUpperCase() === rawCode.toUpperCase(),
      );
      if (match) return match.id;
    }

    // 2. So khớp thông qua conceptId trong decorationsJson (VD: conceptId = 'TRUNG_THU' -> preset = 'trung_thu')
    if (initialData?.theme?.decorationsJson) {
      try {
        const decs = JSON.parse(initialData.theme.decorationsJson);
        if (decs?.conceptId) {
          const pack = CONCEPT_PACKS.find((c) => c.id === decs.conceptId);
          if (pack?.suggestedThemePresetId) {
            const match = THEME_PRESETS.find((p) => p.id === pack.suggestedThemePresetId);
            if (match) return match.id;
          }
        }
      } catch {
        // ignore json parse error
      }
    }

    // 3. So khớp theo cặp mã màu primary & secondary
    const found = THEME_PRESETS.find(
      (p) =>
        p.primary.toLowerCase() === initialColors.primary.toLowerCase() &&
        p.secondary.toLowerCase() === initialColors.secondary.toLowerCase(),
    );
    if (found) return found.id;

    // 4. Nếu là chỉnh sửa sự kiện đã có mà không khớp preset có sẵn nào -> null (Tùy chỉnh), không ép về tet_xuan
    return isEdit ? null : 'tet_xuan';
  });

  const handleSelectPreset = useCallback((preset: ThemePreset) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setSurfaceColor(preset.surface);
    setSelectedPresetId(preset.id);
  }, []);

  // 5. Decorations
  const getInitialDecorations = (): EventThemeDecorations => {
    if (initialData?.theme?.decorationsJson) {
      try {
        const parsed = JSON.parse(initialData.theme.decorationsJson);
        return {
          conceptId: parsed.conceptId || 'TET_NGUYEN_DAN',
          enableAtmosphere: parsed.enableAtmosphere ?? true,
          atmosphereType: parsed.atmosphereType || 'apricot_petals',
          enableCornerStickers: parsed.enableCornerStickers ?? true,
          customStickerLeftUrl: parsed.customStickerLeftUrl || '',
          customStickerRightUrl: parsed.customStickerRightUrl || '',
        };
      } catch {
        // ignore
      }
    }
    return {
      conceptId: 'TET_NGUYEN_DAN',
      enableAtmosphere: true,
      atmosphereType: 'apricot_petals',
      enableCornerStickers: true,
      customStickerLeftUrl: '',
      customStickerRightUrl: '',
    };
  };

  const initialDeco = getInitialDecorations();
  const [conceptId, setConceptId] = useState<ConceptPackId>(initialDeco.conceptId);
  const [enableAtmosphere, setEnableAtmosphere] = useState(initialDeco.enableAtmosphere);
  const [atmosphereType, setAtmosphereType] = useState<AtmosphereEffectType>(
    initialDeco.atmosphereType || 'apricot_petals',
  );
  const [enableCornerStickers, setEnableCornerStickers] = useState(
    initialDeco.enableCornerStickers,
  );
  const [customStickerLeftUrl, setCustomStickerLeftUrl] = useState(
    initialDeco.customStickerLeftUrl || '',
  );
  const [customStickerRightUrl, setCustomStickerRightUrl] = useState(
    initialDeco.customStickerRightUrl || '',
  );

  // SVG Gallery picker state
  const [showSvgGallery, setShowSvgGallery] = useState(false);
  const [svgGalleryTarget, setSvgGalleryTarget] = useState<'left' | 'right'>('left');

  const handleOpenSvgGallery = useCallback((target: 'left' | 'right') => {
    setSvgGalleryTarget(target);
    setShowSvgGallery(true);
  }, []);

  const handleSelectSvg = useCallback(
    (svgCode: string) => {
      const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgCode)}`;
      if (svgGalleryTarget === 'left') {
        setCustomStickerLeftUrl(dataUri);
      } else {
        setCustomStickerRightUrl(dataUri);
      }
      setShowSvgGallery(false);
      toast.success(`Đã gán họa tiết cho góc ${svgGalleryTarget === 'left' ? 'trái' : 'phải'}!`);
    },
    [svgGalleryTarget],
  );

  const handleSelectConcept = useCallback(
    (pack: ConceptPack) => {
      setConceptId(pack.id);
      setAtmosphereType(pack.atmosphereType);
      if (pack.id === 'NONE') {
        setEnableAtmosphere(false);
        setEnableCornerStickers(false);
      } else {
        setEnableAtmosphere(true);
        setEnableCornerStickers(true);
      }
      const matchingPreset = THEME_PRESETS.find((p) => p.id === pack.suggestedThemePresetId);
      if (matchingPreset) {
        handleSelectPreset(matchingPreset);
      }
    },
    [handleSelectPreset],
  );

  // 6. Minigame Configuration
  const [minigameActive, setMinigameActive] = useState(
    initialData?.minigameConfig?.isActive ?? true,
  );
  const [minigameType, setMinigameType] = useState<'WHEEL_SPIN' | 'LUCKY_ENVELOPE'>(
    initialData?.minigameConfig?.gameType ?? 'WHEEL_SPIN',
  );
  const [minOrderValueForBonusSpin, setMinOrderValueForBonusSpin] = useState(
    initialData?.minigameConfig?.minOrderValueForBonusSpin ?? 300000,
  );
  const [freeSpinsPerDay, setFreeSpinsPerDay] = useState(
    initialData?.minigameConfig?.freeSpinsPerDay ?? 1,
  );
  const [spinsPerOrder, setSpinsPerOrder] = useState(
    initialData?.minigameConfig?.spinsPerOrder ?? 1,
  );
  const [minigameBudgetLimit, setMinigameBudgetLimit] = useState(
    initialData?.minigameConfig?.budgetLimit ?? 50000000,
  );
  const minigameTotalClaimed = initialData?.minigameConfig?.totalClaimedValue ?? 0;

  // Rewards Configuration
  const getInitialWheelRewards = (): MinigameReward[] => {
    if (initialData?.minigameConfig?.rewardsJson) {
      try {
        const parsed: MinigameReward[] = JSON.parse(initialData.minigameConfig.rewardsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge toàn bộ fields từ DB (name, description, value, voucherCode, weight, ...)
          // Dùng LUCKY_WHEEL_REWARDS làm fallback cấu trúc cho các id mới
          const mergedMap = new Map<string, MinigameReward>(
            LUCKY_WHEEL_REWARDS.map((r) => [r.id, r]),
          );
          parsed.forEach((p) => {
            if (p.id) {
              const base = mergedMap.get(p.id) ?? LUCKY_WHEEL_REWARDS[0];
              mergedMap.set(p.id, { ...base, ...p });
            }
          });
          // Giữ đúng thứ tự ban đầu theo parsed
          const result: MinigameReward[] = parsed
            .filter((p) => p.id)
            .map((p) => mergedMap.get(p.id)!);
          return result.length > 0 ? result : LUCKY_WHEEL_REWARDS;
        }
      } catch {
        // ignore
      }
    }
    return LUCKY_WHEEL_REWARDS;
  };

  const getInitialEnvelopeRewards = (): MinigameReward[] => {
    if (initialData?.minigameConfig?.rewardsJson) {
      try {
        const parsed: MinigameReward[] = JSON.parse(initialData.minigameConfig.rewardsJson);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const mergedMap = new Map<string, MinigameReward>(
            LUCKY_ENVELOPE_REWARDS.map((r) => [r.id, r]),
          );
          parsed.forEach((p) => {
            if (p.id) {
              const base = mergedMap.get(p.id) ?? LUCKY_ENVELOPE_REWARDS[0];
              mergedMap.set(p.id, { ...base, ...p });
            }
          });
          const result: MinigameReward[] = parsed
            .filter((p) => p.id)
            .map((p) => mergedMap.get(p.id)!);
          return result.length > 0 ? result : LUCKY_ENVELOPE_REWARDS;
        }
      } catch {
        // ignore
      }
    }
    return LUCKY_ENVELOPE_REWARDS;
  };

  const [wheelRewards, setWheelRewards] = useState<MinigameReward[]>(getInitialWheelRewards);
  const [envelopeRewards, setEnvelopeRewards] =
    useState<MinigameReward[]>(getInitialEnvelopeRewards);

  const activeRewards = minigameType === 'WHEEL_SPIN' ? wheelRewards : envelopeRewards;
  const totalRewardWeight = activeRewards.reduce((sum, r) => sum + (Number(r.weight) || 0), 0);

  /** Điều chỉnh bất kỳ field nào của một phần thưởng theo id */
  const handleRewardFieldChange = useCallback(
    <K extends keyof MinigameReward>(id: string, field: K, value: MinigameReward[K]) => {
      const updater = (prev: MinigameReward[]) =>
        prev.map((r) => (r.id === id ? { ...r, [field]: value } : r));
      if (minigameType === 'WHEEL_SPIN') {
        setWheelRewards(updater);
      } else {
        setEnvelopeRewards(updater);
      }
    },
    [minigameType],
  );

  const handleRewardWeightChange = useCallback(
    (id: string, weight: number) => {
      const parsed = isNaN(weight) ? 0 : Math.max(0, weight);
      const currentList = minigameType === 'WHEEL_SPIN' ? wheelRewards : envelopeRewards;
      const otherTotal = currentList
        .filter((r) => r.id !== id)
        .reduce((sum, r) => sum + (Number(r.weight) || 0), 0);
      const maxAllowed = Math.max(0, 100 - otherTotal);

      if (parsed > maxAllowed) {
        toast.error(
          `Tổng tỷ lệ không được vượt quá 100%! Ô này chỉ được nhập tối đa ${maxAllowed}%.`,
          {
            id: 'reward-weight-limit',
          },
        );
      }

      const validWeight = Math.min(parsed, maxAllowed);
      handleRewardFieldChange(id, 'weight', validWeight);
    },
    [minigameType, wheelRewards, envelopeRewards, handleRewardFieldChange],
  );

  const handleResetDefaultRewards = useCallback(() => {
    if (minigameType === 'WHEEL_SPIN') {
      setWheelRewards(LUCKY_WHEEL_REWARDS);
      toast.success('Đã khôi phục tỷ lệ mặc định cho Vòng quay!');
    } else {
      setEnvelopeRewards(LUCKY_ENVELOPE_REWARDS);
      toast.success('Đã khôi phục tỷ lệ mặc định cho Bao lì xì!');
    }
  }, [minigameType]);

  // Mystery Pick Concept Configuration (Bánh trung thu, Bao lì xì, Nông sản, Hộp quà...)
  const [mysteryPickConcept, setMysteryPickConcept] = useState<MysteryPickConceptId>(
    initialData?.minigameConfig?.mysteryPickConcept ?? 'AUTO',
  );
  const [customPickTitle, setCustomPickTitle] = useState<string>(
    initialData?.minigameConfig?.customPickTitle ?? '',
  );
  const [customPickSubtitle, setCustomPickSubtitle] = useState<string>(
    initialData?.minigameConfig?.customPickSubtitle ?? '',
  );

  const getInitialPickItems = (): MysteryPickItem[] => {
    if (initialData?.minigameConfig?.customPickItemsJson) {
      try {
        const parsed = JSON.parse(initialData.minigameConfig.customPickItemsJson);
        if (Array.isArray(parsed) && parsed.length === 6) {
          return parsed;
        }
      } catch {
        // ignore
      }
    }
    const resolved = resolveMysteryPickConcept({
      minigameConcept: initialData?.minigameConfig?.mysteryPickConcept,
      conceptId: initialDeco.conceptId,
      themeCode: initialData?.theme?.code,
      eventType: initialData?.type,
      slug: initialData?.slug,
    });
    return resolved.defaultItems;
  };

  const [customPickItems, setCustomPickItems] = useState<MysteryPickItem[]>(getInitialPickItems);

  // Suy luận Concept thực tế đang áp dụng (kể cả khi chọn 'AUTO')
  const effectiveMysteryPickConcept = useMemo(() => {
    return resolveMysteryPickConcept({
      minigameConcept: mysteryPickConcept,
      conceptId,
      themeCode: selectedPresetId,
      eventType: type,
      slug,
    });
  }, [mysteryPickConcept, conceptId, selectedPresetId, type, slug]);

  const handleSelectMysteryConcept = useCallback(
    (conceptKey: MysteryPickConceptId) => {
      setMysteryPickConcept(conceptKey);
      const resolved = resolveMysteryPickConcept({
        minigameConcept: conceptKey,
        conceptId,
        themeCode: selectedPresetId,
        eventType: type,
        slug,
      });
      setCustomPickItems(resolved.defaultItems);
      if (resolved.defaultRewards) {
        setEnvelopeRewards(resolved.defaultRewards);
      }
    },
    [conceptId, selectedPresetId, type, slug],
  );

  const handlePickItemChange = useCallback(
    (index: number, field: keyof MysteryPickItem, val: string) => {
      setCustomPickItems((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [field]: val };
        return next;
      });
    },
    [],
  );

  const handleResetPickItemsToConcept = useCallback(() => {
    const resolved = resolveMysteryPickConcept({
      minigameConcept: mysteryPickConcept,
      conceptId,
      themeCode: selectedPresetId,
      eventType: type,
      slug,
    });
    setCustomPickItems(resolved.defaultItems);
    setCustomPickTitle('');
    setCustomPickSubtitle('');
    if (resolved.defaultRewards) {
      setEnvelopeRewards(resolved.defaultRewards);
    }
    toast.success(`Đã khôi phục 6 món mặc định theo chủ đề "${resolved.tabLabel}"!`);
  }, [mysteryPickConcept, conceptId, selectedPresetId, type, slug]);

  // Auto generate code and slug when name changes for new events
  const handleNameChange = useCallback(
    (val: string) => {
      setName(val);
      if (!initialData) {
        const generatedSlug = slugify(val);
        setSlug(generatedSlug);
        setCode(generatedSlug.replace(/-/g, '_').toUpperCase());
      }
    },
    [initialData],
  );

  // Upload handlers
  const handleUpload = useCallback(
    async (file: File, target: 'desktop' | 'mobile') => {
      try {
        if (target === 'desktop') setUploadingDesktop(true);
        else setUploadingMobile(true);

        const url = await eventApi.uploadAsset(file, 'banners', initialData?.id);
        if (target === 'desktop') setBannerDesktopUrl(url);
        else setBannerMobileUrl(url);

        toast.success('Upload ảnh thành công!');
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upload ảnh thất bại';
        toast.error(message);
      } finally {
        if (target === 'desktop') setUploadingDesktop(false);
        else setUploadingMobile(false);
      }
    },
    [initialData?.id],
  );

  // Submit Handler
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();

      const validation = eventFormSchema.safeParse({
        name,
        code,
        slug,
        description,
        type,
        startAt,
        endAt,
        isHomeFeatured,
        bannerDesktopUrl: bannerDesktopUrl || '',
        bannerMobileUrl: bannerMobileUrl || '',
        sellerPortalVisible,
        registrationStartAt: registrationStartAt || undefined,
        registrationEndAt: registrationEndAt || undefined,
        minOcopStar: Number(minOcopStar),
        minDiscountPercent: Number(minDiscountPercent),
        maxProductsPerShop: Number(maxProductsPerShop),
      });

      if (!validation.success) {
        const firstIssue = validation.error.issues[0];
        toast.error(firstIssue?.message || 'Dữ liệu form sự kiện chưa hợp lệ');
        return;
      }

      if (sellerPortalVisible && registrationEndAt && startAt && registrationEndAt > startAt) {
        toast.error('Thời gian đăng ký Seller phải kết thúc trước khi sự kiện bắt đầu');
        return;
      }

      if (minigameActive && totalRewardWeight > 100) {
        toast.error(
          `Tổng tỷ lệ trúng thưởng minigame đang là ${totalRewardWeight}% (vượt quá 100%). Vui lòng hạ bớt tỷ lệ trước khi lưu.`,
        );
        return;
      }

      try {
        setSubmitting(true);

        const decorationsPayload: EventThemeDecorations = {
          conceptId,
          enableAtmosphere,
          atmosphereType,
          enableCornerStickers,
          customStickerLeftUrl,
          customStickerRightUrl,
        };

        const payload: CreateEventInput = {
          name,
          code,
          slug,
          description,
          type,
          startAt: startAt.length === 16 ? `${startAt}:00` : startAt,
          endAt: endAt.length === 16 ? `${endAt}:00` : endAt,
          sellerPortalVisible,
          registrationStartAt: registrationStartAt
            ? registrationStartAt.length === 16
              ? `${registrationStartAt}:00`
              : registrationStartAt
            : undefined,
          registrationEndAt: registrationEndAt
            ? registrationEndAt.length === 16
              ? `${registrationEndAt}:00`
              : registrationEndAt
            : undefined,
          minOcopStar,
          minDiscountPercent,
          maxProductsPerShop,
          isHomeFeatured,
          bannerDesktopUrl,
          bannerMobileUrl,
          theme: {
            name: `Theme ${name}`,
            code: selectedPresetId || (code ? `THEME_${code}` : 'tet_xuan'),
            colorsJson: JSON.stringify({
              primary: primaryColor,
              secondary: secondaryColor,
              surface: surfaceColor,
            }),
            decorationsJson: JSON.stringify(decorationsPayload),
          },
          sections: [
            { type: 'HERO', sortOrder: 1, title: 'Hero Banner', isVisible: true },
            { type: 'COUNTDOWN', sortOrder: 2, title: 'Đếm ngược sự kiện', isVisible: true },
          ],
          minigameConfig: {
            gameType: minigameType,
            isActive: minigameActive,
            freeSpinsPerDay: Number(freeSpinsPerDay),
            minOrderValueForBonusSpin: Number(minOrderValueForBonusSpin),
            spinsPerOrder: Number(spinsPerOrder),
            budgetLimit: Number(minigameBudgetLimit),
            rewardsJson: JSON.stringify(activeRewards),
            mysteryPickConcept,
            customPickTitle: customPickTitle.trim() || undefined,
            customPickSubtitle: customPickSubtitle.trim() || undefined,
            customPickItemsJson: JSON.stringify(customPickItems),
          },
        };

        let result: EventDetailResponse;
        if (initialData?.id) {
          result = await eventApi.updateEvent(initialData.id, payload);
          toast.success(`Cập nhật sự kiện "${result.name}" thành công!`);
        } else {
          result = await eventApi.createEvent(payload);
          toast.success(`Tạo sự kiện "${result.name}" thành công!`);
        }

        if (onSuccess) {
          onSuccess(result);
        } else {
          router.push('/admin/events');
        }
      } catch {
        // API error toast is already handled by axios interceptor
      } finally {
        setSubmitting(false);
      }
    },
    [
      name,
      code,
      slug,
      description,
      type,
      startAt,
      endAt,
      sellerPortalVisible,
      registrationStartAt,
      registrationEndAt,
      minOcopStar,
      minDiscountPercent,
      maxProductsPerShop,
      isHomeFeatured,
      bannerDesktopUrl,
      bannerMobileUrl,
      selectedPresetId,
      primaryColor,
      secondaryColor,
      surfaceColor,
      conceptId,
      enableAtmosphere,
      atmosphereType,
      enableCornerStickers,
      customStickerLeftUrl,
      customStickerRightUrl,
      minigameType,
      minigameActive,
      freeSpinsPerDay,
      minOrderValueForBonusSpin,
      spinsPerOrder,
      minigameBudgetLimit,
      activeRewards,
      totalRewardWeight,
      mysteryPickConcept,
      customPickTitle,
      customPickSubtitle,
      customPickItems,
      initialData?.id,
      onSuccess,
      router,
    ],
  );

  return {
    isEdit,
    submitting,
    uploadingDesktop,
    uploadingMobile,
    // Fields
    name,
    setName,
    handleNameChange,
    code,
    setCode,
    slug,
    setSlug,
    description,
    setDescription,
    type,
    setType,
    startAt,
    setStartAt,
    endAt,
    setEndAt,
    isHomeFeatured,
    setIsHomeFeatured,
    // Banners
    bannerDesktopUrl,
    setBannerDesktopUrl,
    bannerMobileUrl,
    setBannerMobileUrl,
    handleUpload,
    // Seller Portal
    sellerPortalVisible,
    setSellerPortalVisible,
    registrationStartAt,
    setRegistrationStartAt,
    registrationEndAt,
    setRegistrationEndAt,
    minOcopStar,
    setMinOcopStar,
    minDiscountPercent,
    setMinDiscountPercent,
    maxProductsPerShop,
    setMaxProductsPerShop,
    // Theme Colors
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    surfaceColor,
    setSurfaceColor,
    selectedPresetId,
    handleSelectPreset,
    // Decorations
    conceptId,
    enableAtmosphere,
    setEnableAtmosphere,
    atmosphereType,
    setAtmosphereType,
    enableCornerStickers,
    setEnableCornerStickers,
    customStickerLeftUrl,
    setCustomStickerLeftUrl,
    customStickerRightUrl,
    setCustomStickerRightUrl,
    handleSelectConcept,
    // SVG Gallery
    showSvgGallery,
    setShowSvgGallery,
    svgGalleryTarget,
    handleOpenSvgGallery,
    handleSelectSvg,
    // Minigame
    minigameActive,
    setMinigameActive,
    minigameType,
    setMinigameType,
    minOrderValueForBonusSpin,
    setMinOrderValueForBonusSpin,
    freeSpinsPerDay,
    setFreeSpinsPerDay,
    spinsPerOrder,
    setSpinsPerOrder,
    minigameBudgetLimit,
    setMinigameBudgetLimit,
    minigameTotalClaimed,
    // Rewards Configuration
    wheelRewards,
    envelopeRewards,
    activeRewards,
    totalRewardWeight,
    handleRewardFieldChange,
    handleRewardWeightChange,
    handleResetDefaultRewards,
    // Mystery Pick Concept
    mysteryPickConcept,
    setMysteryPickConcept,
    customPickTitle,
    setCustomPickTitle,
    customPickSubtitle,
    setCustomPickSubtitle,
    customPickItems,
    setCustomPickItems,
    effectiveMysteryPickConcept,
    handleSelectMysteryConcept,
    handlePickItemChange,
    handleResetPickItemsToConcept,
    // Submit
    handleSubmit,
  };
}

export type UseEventFormReturn = ReturnType<typeof useEventForm>;
