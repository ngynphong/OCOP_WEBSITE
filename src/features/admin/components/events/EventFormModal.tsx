'use client';

import React, { useState } from 'react';
import { X, Loader2, Sparkles } from 'lucide-react';
import { eventApi } from '@/features/events/api/eventApi';
import { EventSvgGalleryModal } from '@/features/events/components/decorations/EventSvgGalleryModal';
import type {
  EventDetailResponse,
  EventType,
  CreateEventInput,
  ConceptPackId,
  AtmosphereEffectType,
  EventThemeDecorations,
} from '@/features/events/types/eventTypes';
import { type ConceptPack } from '@/features/events/constants/decorationPacks';
import { slugify } from '@/utils/slugify';
import toast from 'react-hot-toast';

import {
  type ThemePreset,
  THEME_PRESETS,
  PRESET_ICONS,
  CONCEPT_ICONS,
} from '@/features/events/constants/themePresets';

import {
  ModalBasicInfoFields,
  ModalBannerUploadFields,
  ModalThemePickerFields,
  ModalConceptPickerFields,
  ModalSellerPortalFields,
} from './modal';

export type { ThemePreset };
export { THEME_PRESETS, PRESET_ICONS, CONCEPT_ICONS };

export interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: EventDetailResponse | null;
}

export function EventFormModal({ isOpen, onClose, onSuccess, initialData }: EventFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

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
  const [bannerDesktopUrl, setBannerDesktopUrl] = useState(initialData?.bannerDesktopUrl || '');
  const [bannerMobileUrl, setBannerMobileUrl] = useState(initialData?.bannerMobileUrl || '');
  const [isHomeFeatured, setIsHomeFeatured] = useState(initialData?.isHomeFeatured ?? true);
  const [sellerPortalVisible, setSellerPortalVisible] = useState(
    initialData?.sellerPortalVisible ?? false,
  );
  const [registrationStartAt, setRegistrationStartAt] = useState(
    initialData?.registrationStartAt?.slice(0, 16) || new Date().toISOString().slice(0, 16),
  );
  const [registrationEndAt, setRegistrationEndAt] = useState(
    initialData?.registrationEndAt?.slice(0, 16) || startAt,
  );
  const [minOcopStar, setMinOcopStar] = useState(initialData?.minOcopStar ?? 3);
  const [minDiscountPercent, setMinDiscountPercent] = useState(
    initialData?.minDiscountPercent ?? 10,
  );
  const [maxProductsPerShop, setMaxProductsPerShop] = useState(
    initialData?.maxProductsPerShop ?? 20,
  );
  const [showSvgGallery, setShowSvgGallery] = useState(false);

  const getInitialColors = () => {
    if (initialData?.theme?.colorsJson) {
      try {
        const parsed = JSON.parse(initialData.theme.colorsJson);
        return {
          primary: parsed.primary || '#DC2626',
          secondary: parsed.secondary || '#F59E0B',
          surface: parsed.surface || '#FEF2F2',
        };
      } catch {}
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
    if (initialData?.theme?.code) {
      const directCode = initialData.theme.code.replace(/^THEME_/i, '').toLowerCase();
      const match = THEME_PRESETS.find(
        (p) => p.id === directCode || p.id === initialData.theme?.code,
      );
      if (match) return match.id;
    }
    const found = THEME_PRESETS.find(
      (p) =>
        p.primary.toLowerCase() === initialColors.primary.toLowerCase() &&
        p.secondary.toLowerCase() === initialColors.secondary.toLowerCase(),
    );
    return found ? found.id : 'tet_xuan';
  });

  const handleSelectPreset = (preset: ThemePreset) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setSurfaceColor(preset.surface);
    setSelectedPresetId(preset.id);
  };

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
      } catch {}
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

  const handleSelectConcept = (pack: ConceptPack) => {
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
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData) {
      const generatedSlug = slugify(val);
      setSlug(generatedSlug);
      setCode(generatedSlug.replace(/-/g, '_').toUpperCase());
    }
  };

  const handleUpload = async (file: File, target: 'desktop' | 'mobile') => {
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !code || !slug || !startAt || !endAt) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }
    if (
      sellerPortalVisible &&
      (!registrationStartAt ||
        !registrationEndAt ||
        registrationStartAt >= registrationEndAt ||
        registrationEndAt > startAt)
    ) {
      toast.error('Thời gian đăng ký Seller phải kết thúc trước khi sự kiện bắt đầu');
      return;
    }

    try {
      setSubmitting(true);

      const decorationsPayload: EventThemeDecorations = {
        conceptId,
        enableAtmosphere,
        atmosphereType,
        enableCornerStickers,
      };

      const payload: CreateEventInput = {
        name,
        code,
        slug,
        description,
        type,
        startAt: `${startAt}:00`,
        endAt: `${endAt}:00`,
        sellerPortalVisible,
        registrationStartAt: registrationStartAt ? `${registrationStartAt}:00` : undefined,
        registrationEndAt: registrationEndAt ? `${registrationEndAt}:00` : undefined,
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
      };

      if (initialData?.id) {
        await eventApi.updateEvent(initialData.id, payload);
        toast.success('Cập nhật sự kiện thành công!');
      } else {
        await eventApi.createEvent(payload);
        toast.success('Tạo sự kiện mới thành công!');
      }

      onSuccess();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu sự kiện';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              {initialData ? 'Chỉnh sửa sự kiện' : 'Tạo sự kiện OCOP mới'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <ModalBasicInfoFields
            name={name}
            onNameChange={handleNameChange}
            type={type}
            onTypeChange={setType}
            code={code}
            onCodeChange={setCode}
            slug={slug}
            onSlugChange={setSlug}
            startAt={startAt}
            onStartAtChange={setStartAt}
            endAt={endAt}
            onEndAtChange={setEndAt}
            description={description}
            onDescriptionChange={setDescription}
          />

          <ModalBannerUploadFields
            bannerDesktopUrl={bannerDesktopUrl}
            onBannerDesktopUrlChange={setBannerDesktopUrl}
            bannerMobileUrl={bannerMobileUrl}
            onBannerMobileUrlChange={setBannerMobileUrl}
            uploadingDesktop={uploadingDesktop}
            uploadingMobile={uploadingMobile}
            onUpload={handleUpload}
          />

          <ModalThemePickerFields
            selectedPresetId={selectedPresetId}
            onSelectPreset={handleSelectPreset}
            primaryColor={primaryColor}
            onPrimaryColorChange={(c) => {
              setPrimaryColor(c);
              setSelectedPresetId(null);
            }}
            secondaryColor={secondaryColor}
            onSecondaryColorChange={(c) => {
              setSecondaryColor(c);
              setSelectedPresetId(null);
            }}
            surfaceColor={surfaceColor}
            onSurfaceColorChange={(c) => {
              setSurfaceColor(c);
              setSelectedPresetId(null);
            }}
          />

          <ModalConceptPickerFields
            conceptId={conceptId}
            onSelectConcept={handleSelectConcept}
            enableAtmosphere={enableAtmosphere}
            onEnableAtmosphereChange={setEnableAtmosphere}
            enableCornerStickers={enableCornerStickers}
            onEnableCornerStickersChange={setEnableCornerStickers}
            onOpenSvgGallery={() => setShowSvgGallery(true)}
          />

          <ModalSellerPortalFields
            sellerPortalVisible={sellerPortalVisible}
            onSellerPortalVisibleChange={setSellerPortalVisible}
            registrationStartAt={registrationStartAt}
            onRegistrationStartAtChange={setRegistrationStartAt}
            registrationEndAt={registrationEndAt}
            onRegistrationEndAtChange={setRegistrationEndAt}
            startAt={startAt}
            minOcopStar={minOcopStar}
            onMinOcopStarChange={setMinOcopStar}
            minDiscountPercent={minDiscountPercent}
            onMinDiscountPercentChange={setMinDiscountPercent}
            maxProductsPerShop={maxProductsPerShop}
            onMaxProductsPerShopChange={setMaxProductsPerShop}
          />

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isHomeFeatured"
              checked={isHomeFeatured}
              onChange={(e) => setIsHomeFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300 cursor-pointer"
            />
            <label
              htmlFor="isHomeFeatured"
              className="text-sm font-medium text-gray-800 cursor-pointer"
            >
              Kích hoạt hiển thị ưu tiên trên Trang chủ
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialData ? 'Lưu thay đổi' : 'Tạo sự kiện'}</span>
            </button>
          </div>
        </form>
      </div>

      <EventSvgGalleryModal isOpen={showSvgGallery} onClose={() => setShowSvgGallery(false)} />
    </div>
  );
}

export default EventFormModal;
