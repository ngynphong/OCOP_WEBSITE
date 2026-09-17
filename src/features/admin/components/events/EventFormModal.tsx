'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Upload,
  Loader2,
  Sparkles,
  Image as ImageIcon,
  Palette,
  Check,
  Eye,
  Trash2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';
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
import { EVENT_TYPE_CONFIG } from '@/features/events/types/eventTypes';
import { CONCEPT_PACKS, type ConceptPack } from '@/features/events/constants/decorationPacks';
import { slugify } from '@/utils/slugify';
import toast from 'react-hot-toast';

import {
  type ThemePreset,
  THEME_PRESETS,
  PRESET_ICONS,
  CONCEPT_ICONS,
} from '@/features/events/constants/themePresets';

export type { ThemePreset };
export { THEME_PRESETS, PRESET_ICONS, CONCEPT_ICONS };

interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: EventDetailResponse | null;
}

export function EventFormModal({ isOpen, onClose, onSuccess, initialData }: EventFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const [uploadingDesktop, setUploadingDesktop] = useState(false);
  const [uploadingMobile, setUploadingMobile] = useState(false);

  // Form states
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

  // Parse initial theme colors
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
        // ignore parse error
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

  // Parse initial decorations
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
    // Gợi ý đồng bộ sang bảng màu tương ứng
    const matchingPreset = THEME_PRESETS.find((p) => p.id === pack.suggestedThemePresetId);
    if (matchingPreset) {
      handleSelectPreset(matchingPreset);
    }
  };

  // Auto generate code and slug when name changes for new events
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
        {/* Header */}
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
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Tên & Loại sự kiện */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Tên sự kiện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="VD: Tết OCOP 2026 - Xuân Sum Vầy"
                className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Loại sự kiện <span className="text-red-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-3.5 py-2 rounded-xl text-gray-700 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
              >
                {Object.values(EVENT_TYPE_CONFIG).map((cfg) => (
                  <option key={cfg.id} value={cfg.id}>
                    {cfg.description}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-[11px] text-gray-400">
                Phân loại để hệ thống áp dụng cấu hình và phân bổ vị trí hiển thị phù hợp.
              </p>
            </div>
          </div>

          {/* Mã & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Mã sự kiện <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="TET_OCOP_2026"
                className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                required
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Mã nội bộ duy nhất dùng để đối soát dữ liệu.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Đường dẫn (Slug) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                placeholder="tet-ocop-2026"
                className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono"
                required
              />
              <p className="mt-1 text-[11px] text-gray-500 truncate">
                🔗 URL sự kiện:{' '}
                <span className="text-amber-600 font-medium">/events/{slug || 'slug-su-kien'}</span>
              </p>
            </div>
          </div>

          {/* Thời gian */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Thời gian bắt đầu <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={startAt}
                onChange={(e) => setStartAt(e.target.value)}
                className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Thời gian kết thúc <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                value={endAt}
                onChange={(e) => setEndAt(e.target.value)}
                className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                required
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Mô tả chiến dịch
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Thông điệp chính của sự kiện..."
              className="w-full px-3.5 py-2 text-gray-700 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* Upload Banner Media qua MinIO */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                <span>Asset Banner Media</span>
              </h4>
              <span className="text-[11px] text-gray-500">
                Tải banner hiển thị trên trang chủ và trang sự kiện
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Banner Desktop */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Banner Desktop <span className="text-gray-400 font-normal">(1920×600)</span>
                  </label>
                  {bannerDesktopUrl && (
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã tải lên
                    </span>
                  )}
                </div>

                {bannerDesktopUrl ? (
                  <div className="relative group w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-stone-900 shadow-xs">
                    <Image
                      src={bannerDesktopUrl}
                      alt="Banner Desktop Preview"
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Uploading Overlay */}
                    {uploadingDesktop && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white z-10">
                        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                        <span className="text-xs font-medium">Đang tải ảnh lên...</span>
                      </div>
                    )}

                    {/* Hover Action Bar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                      <a
                        href={bannerDesktopUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem ảnh</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition">
                          <RefreshCw className="w-3 h-3" />
                          <span>Đổi ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingDesktop}
                            onChange={(e) =>
                              e.target.files?.[0] && handleUpload(e.target.files[0], 'desktop')
                            }
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setBannerDesktopUrl('')}
                          className="px-2 py-1 bg-red-600/85 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs transition"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-xl bg-white hover:bg-amber-50/40 cursor-pointer transition-all group">
                    {uploadingDesktop ? (
                      <div className="flex flex-col items-center gap-2 text-amber-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-medium">Đang tải lên MinIO...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-center p-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">
                          Tải ảnh Banner Desktop
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Khuyến nghị 1920×600 px (PNG, JPG, WebP)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingDesktop}
                      onChange={(e) =>
                        e.target.files?.[0] && handleUpload(e.target.files[0], 'desktop')
                      }
                    />
                  </label>
                )}
              </div>

              {/* Banner Mobile */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700">
                    Banner Mobile <span className="text-gray-400 font-normal">(800×800)</span>
                  </label>
                  {bannerMobileUrl && (
                    <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Đã tải lên
                    </span>
                  )}
                </div>

                {bannerMobileUrl ? (
                  <div className="relative group w-full h-36 rounded-xl overflow-hidden border border-gray-200 bg-stone-900 shadow-xs flex items-center justify-center">
                    <Image
                      src={bannerMobileUrl}
                      alt="Banner Mobile Preview"
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Uploading Overlay */}
                    {uploadingMobile && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-1.5 text-white z-10">
                        <Loader2 className="w-5 h-5 animate-spin text-amber-400" />
                        <span className="text-xs font-medium">Đang tải ảnh lên...</span>
                      </div>
                    )}

                    {/* Hover Action Bar */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
                      <a
                        href={bannerMobileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white rounded-lg text-xs font-medium flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Xem ảnh</span>
                      </a>

                      <div className="flex items-center gap-1.5">
                        <label className="cursor-pointer px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs transition">
                          <RefreshCw className="w-3 h-3" />
                          <span>Đổi ảnh</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingMobile}
                            onChange={(e) =>
                              e.target.files?.[0] && handleUpload(e.target.files[0], 'mobile')
                            }
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => setBannerMobileUrl('')}
                          className="px-2 py-1 bg-red-600/85 hover:bg-red-600 text-white rounded-lg text-xs font-medium flex items-center gap-1 shadow-xs transition"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-xl bg-white hover:bg-amber-50/40 cursor-pointer transition-all group">
                    {uploadingMobile ? (
                      <div className="flex flex-col items-center gap-2 text-amber-600">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span className="text-xs font-medium">Đang tải lên MinIO...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-1.5 text-center p-3">
                        <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700 group-hover:text-amber-700">
                          Tải ảnh Banner Mobile
                        </span>
                        <p className="text-[11px] text-gray-400">
                          Khuyến nghị 800×800 px (PNG, JPG, WebP)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploadingMobile}
                      onChange={(e) =>
                        e.target.files?.[0] && handleUpload(e.target.files[0], 'mobile')
                      }
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Theme Colors */}
          {/* Theme Colors & Presets */}
          <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-amber-600" />
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Kho Bảng Màu Theme Mẫu
                </h4>
              </div>
              <span className="text-[11px] text-gray-500 hidden sm:inline">
                Nhấp chọn nhóm màu phù hợp với sự kiện
              </span>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {THEME_PRESETS.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/60 shadow-sm ring-2 ring-amber-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-amber-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {(() => {
                          const PresetIcon = PRESET_ICONS[preset.id] || Sparkles;
                          return (
                            <div
                              className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs"
                              style={{ backgroundColor: preset.primary }}
                            >
                              <PresetIcon className="w-3 h-3" />
                            </div>
                          );
                        })()}
                        <span className="text-xs font-bold text-gray-800 line-clamp-1">
                          {preset.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 line-clamp-1 mb-2">
                        {preset.subtitle}
                      </p>
                    </div>

                    {/* Color Swatch dots */}
                    <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                      <div className="flex items-center gap-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.primary }}
                          title={`Màu chính: ${preset.primary}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.secondary }}
                          title={`Màu phụ: ${preset.secondary}`}
                        />
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                          style={{ backgroundColor: preset.surface }}
                          title={`Màu nền: ${preset.surface}`}
                        />
                      </div>
                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                        {preset.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Live Preview Mini Card */}
            <div
              className="p-3.5 rounded-xl border transition-colors shadow-xs"
              style={{
                backgroundColor: surfaceColor,
                borderColor: `${primaryColor}40`,
              }}
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-12 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black shadow-xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    OCOP
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <span>Xem trước giao diện sự kiện</span>
                      <span
                        className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold"
                        style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                      >
                        Đang áp dụng
                      </span>
                    </p>
                    <p className="text-[11px] text-gray-600">
                      Nền: <span className="font-mono">{surfaceColor}</span> • Màu chính:{' '}
                      <span className="font-mono">{primaryColor}</span> • Màu phụ:{' '}
                      <span className="font-mono">{secondaryColor}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold shadow-2xs"
                    style={{ backgroundColor: secondaryColor, color: '#111827' }}
                  >
                    Voucher 50K
                  </span>
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-2xs"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Mua Ngay
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Color Fine-tuning */}
            <div className="pt-2 border-t border-gray-200/80">
              <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-2">
                Tùy chỉnh mã màu thủ công
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Màu chính</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        setSelectedPresetId(null);
                      }}
                      className="w-7 h-7 rounded text-gray-700 border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={primaryColor}
                      onChange={(e) => {
                        setPrimaryColor(e.target.value);
                        setSelectedPresetId(null);
                      }}
                      className="w-20 px-2 py-1 text-xs text-gray-700 font-mono border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Màu phụ</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => {
                        setSecondaryColor(e.target.value);
                        setSelectedPresetId(null);
                      }}
                      className="w-7 h-7 rounded text-gray-700 border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={secondaryColor}
                      onChange={(e) => {
                        setSecondaryColor(e.target.value);
                        setSelectedPresetId(null);
                      }}
                      className="w-20 px-2 py-1 text-xs text-gray-700 font-mono border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-gray-600 mb-1">Màu nền thẻ</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={surfaceColor}
                      onChange={(e) => {
                        setSurfaceColor(e.target.value);
                        setSelectedPresetId(null);
                      }}
                      className="w-7 h-7 rounded text-gray-700 border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={surfaceColor}
                      onChange={(e) => {
                        setSurfaceColor(e.target.value);
                        setSelectedPresetId(null);
                      }}
                      className="w-20 px-2 py-1 text-xs text-gray-700 font-mono border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gói Concept Trang Trí & Hiệu Ứng Lễ Hội */}
          <div className="p-4 bg-red-50/40 rounded-2xl border border-red-200/60 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-600" />
                <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  Gói Concept Trang Trí & Hiệu Ứng Lễ Hội
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowSvgGallery(true)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded-lg transition-colors border border-amber-300/80 shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Xem trước các SVG có sẵn</span>
                </button>
              </div>
            </div>

            {/* Concept Packs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {CONCEPT_PACKS.map((pack) => {
                const isSelected = conceptId === pack.id;
                return (
                  <button
                    key={pack.id}
                    type="button"
                    onClick={() => handleSelectConcept(pack)}
                    className={`text-left p-2.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-red-500 bg-red-50/70 shadow-sm ring-2 ring-red-500/20'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-red-600 text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        {(() => {
                          const ConceptIcon = CONCEPT_ICONS[pack.id] || Sparkles;
                          return (
                            <div className="w-5 h-5 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
                              <ConceptIcon className="w-3 h-3" />
                            </div>
                          );
                        })()}
                        <span className="text-xs font-bold text-gray-800 line-clamp-1">
                          {pack.name}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 line-clamp-2 mb-2 leading-tight">
                        {pack.subtitle}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-100/80 text-amber-800">
                        {pack.badge}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tùy chọn chi tiết nếu không phải NONE */}
            {conceptId !== 'NONE' && (
              <div className="pt-3 border-t border-red-200/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
                  <input
                    type="checkbox"
                    checked={enableAtmosphere}
                    onChange={(e) => setEnableAtmosphere(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      Hiệu ứng rơi lất phất trên trang
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                      {CONCEPT_PACKS.find((p) => p.id === conceptId)?.atmosphereLabel ||
                        'Cánh hoa rơi nhẹ nhàng'}
                    </span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors shadow-2xs">
                  <input
                    type="checkbox"
                    checked={enableCornerStickers}
                    onChange={(e) => setEnableCornerStickers(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      Họa tiết trang trí góc & Hero
                    </span>
                    <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                      {CONCEPT_PACKS.find((p) => p.id === conceptId)?.cornerLabel ||
                        'Cành mai rủ & Bánh chưng xanh'}
                    </span>
                  </div>
                </label>
              </div>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50/40 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={sellerPortalVisible}
                onChange={(e) => setSellerPortalVisible(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
              />
              <span>
                <span className="block text-sm font-bold text-gray-900">
                  Công bố trên Seller Portal
                </span>
                <span className="block text-xs text-gray-500">
                  Cho nhà bán hàng xem sự kiện và đăng ký vào các khung giờ Flash Sale.
                </span>
              </span>
            </label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <label className="text-xs font-semibold text-gray-700 lg:col-span-1">
                Mở đăng ký
                <input
                  type="datetime-local"
                  value={registrationStartAt}
                  onChange={(e) => setRegistrationStartAt(e.target.value)}
                  disabled={!sellerPortalVisible}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs disabled:opacity-50"
                />
              </label>
              <label className="text-xs font-semibold text-gray-700 lg:col-span-1">
                Đóng đăng ký
                <input
                  type="datetime-local"
                  value={registrationEndAt}
                  max={startAt}
                  onChange={(e) => setRegistrationEndAt(e.target.value)}
                  disabled={!sellerPortalVisible}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs disabled:opacity-50"
                />
              </label>
              <label className="text-xs font-semibold text-gray-700">
                OCOP tối thiểu
                <select
                  value={minOcopStar}
                  onChange={(e) => setMinOcopStar(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs"
                >
                  <option value={3}>3 sao</option>
                  <option value={4}>4 sao</option>
                  <option value={5}>5 sao</option>
                </select>
              </label>
              <label className="text-xs font-semibold text-gray-700">
                Giảm tối thiểu (%)
                <input
                  type="number"
                  min={1}
                  max={99}
                  value={minDiscountPercent}
                  onChange={(e) => setMinDiscountPercent(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs"
                />
              </label>
              <label className="text-xs font-semibold text-gray-700">
                Sản phẩm/shop
                <input
                  type="number"
                  min={1}
                  value={maxProductsPerShop}
                  onChange={(e) => setMaxProductsPerShop(Number(e.target.value))}
                  className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2.5 py-2 text-xs"
                />
              </label>
            </div>
          </div>

          {/* Home Featured Switch */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isHomeFeatured"
              checked={isHomeFeatured}
              onChange={(e) => setIsHomeFeatured(e.target.checked)}
              className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-gray-300"
            />
            <label htmlFor="isHomeFeatured" className="text-sm font-medium text-gray-800">
              Kích hoạt hiển thị ưu tiên trên Trang chủ
            </label>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-md transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{initialData ? 'Lưu thay đổi' : 'Tạo sự kiện'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* SVG Gallery Preview Modal */}
      <EventSvgGalleryModal isOpen={showSvgGallery} onClose={() => setShowSvgGallery(false)} />
    </div>
  );
}
