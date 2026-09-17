'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Zap,
  ShoppingBag,
  Ticket,
  Sparkles,
  AlertCircle,
  PlusCircle,
  Check,
} from 'lucide-react';
import { EventThemeProvider } from '@/features/events/components/EventThemeProvider';
import { EventStickyNav } from '@/features/events/components/commerce/EventStickyNav';
import { EventCountdownSection } from '@/features/events/components/sections/EventCountdownSection';
import { EventCollectionSection } from '@/features/events/components/commerce/EventCollectionSection';
import { EventMinigameSection } from '@/features/events/components/minigame/EventMinigameSection';
import type {
  EventDetailResponse,
  ActiveEventResponse,
  EventTheme,
} from '@/features/events/types/eventTypes';
import type {
  EventCollection,
  EventFlashSale,
  EventVoucher,
} from '@/features/events/types/eventCommerceTypes';
import { useAppSelector } from '@/store/hooks';
import { useSavedVouchers, useSaveVoucherMutations } from '@/features/vouchers/hooks/useVouchers';
import toast from 'react-hot-toast';

export interface EventCommerceLandingViewProps {
  event: EventDetailResponse | ActiveEventResponse;
  theme?: EventTheme | null;
  device?: 'desktop' | 'tablet' | 'mobile';
  timeScenario?: 'UPCOMING' | 'LIVE' | 'ENDED';
  collections?: EventCollection[];
  flashSales?: EventFlashSale[];
  vouchers?: EventVoucher[];
  selectedSlotId?: number | null;
  onSelectSlot?: (slotId: number) => void;
  isCustomerView?: boolean;
}

export function EventCommerceLandingView({
  event,
  theme,
  device = 'desktop',
  timeScenario: externalTimeScenario,
  collections = [],
  flashSales = [],
  vouchers = [],
  selectedSlotId,
  onSelectSlot,
  isCustomerView = true,
}: EventCommerceLandingViewProps) {
  const isForcedMobile = device === 'mobile';
  const isForcedDesktop = device === 'desktop';
  const isForcedTablet = device === 'tablet';
  const isMobile = isForcedMobile;

  // Compute timeScenario if not explicitly passed from simulator
  const timeScenario = useMemo(() => {
    if (externalTimeScenario) return externalTimeScenario;
    if (event.status === 'LIVE') return 'LIVE';
    if (event.status === 'SCHEDULED') return 'UPCOMING';
    return 'ENDED';
  }, [externalTimeScenario, event.status]);

  // Flash Sale Slot state (internal fallback if not controlled externally)
  const [internalSlotId, setInternalSlotId] = useState<number | null>(null);
  const currentSlotId = selectedSlotId !== undefined ? selectedSlotId : internalSlotId;

  const handleSelectSlot = (slotId: number) => {
    if (onSelectSlot) {
      onSelectSlot(slotId);
    } else {
      setInternalSlotId(slotId);
    }
  };

  const activeSale = useMemo(() => {
    if (!flashSales || flashSales.length === 0) return null;
    if (currentSlotId) {
      const found = flashSales.find((fs) => fs.id === currentSlotId);
      if (found) return found;
    }
    return flashSales[0];
  }, [flashSales, currentSlotId]);

  // Voucher Saving (Real customer API when isCustomerView, Simulated when in Admin Preview)
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { saveVoucher } = useSaveVoucherMutations();
  const { data: savedResponse } = useSavedVouchers(1, 200, isCustomerView && isAuthenticated);

  const [simulatedSavedVouchers, setSimulatedSavedVouchers] = useState<Set<number>>(new Set());
  const [customerSavedLocalIds, setCustomerSavedLocalIds] = useState<Set<number>>(new Set());

  const savedVoucherIds = useMemo(() => {
    if (!isCustomerView) {
      return simulatedSavedVouchers;
    }
    const set = new Set(customerSavedLocalIds);
    if (savedResponse?.data?.content) {
      savedResponse.data.content.forEach((sv) => set.add(sv.voucherId));
    }
    return set;
  }, [isCustomerView, simulatedSavedVouchers, customerSavedLocalIds, savedResponse]);

  const handleSaveVoucherClick = (v: EventVoucher) => {
    if (!isCustomerView) {
      // Simulator mode
      setSimulatedSavedVouchers((prev) => {
        const next = new Set(prev);
        if (next.has(v.id)) {
          next.delete(v.id);
          toast('Đã hủy lưu mã thử nghiệm');
        } else {
          next.add(v.id);
          toast.success(`Đã lưu thử nghiệm mã "${v.code}"!`);
        }
        return next;
      });
      return;
    }

    // Real Customer mode
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để lưu mã giảm giá vào ví');
      return;
    }

    const voucherTargetId = v.voucherId || v.id;
    saveVoucher.mutate(voucherTargetId, {
      onSuccess: () => {
        setCustomerSavedLocalIds((prev) => new Set(prev).add(v.id));
      },
    });
  };

  // Format currency
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  return (
    <EventThemeProvider theme={theme} device={device} contained={!isCustomerView}>
      <div
        className="min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300"
        style={{
          background: 'var(--event-bg, #FFF1F2)',
          color: 'var(--event-text, #0F172A)',
        }}
      >
        {/* ── 1. Notice banner for missing mobile image fallback (Admin only) ── */}
        {!isCustomerView && isMobile && !event.bannerMobileUrl && event.bannerDesktopUrl && (
          <div className="bg-amber-500/15 border-b border-amber-500/30 px-3 py-1.5 flex items-center justify-between text-[11px] text-amber-800">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Đang dùng ảnh Desktop co giãn (Khuyến nghị thêm ảnh dọc 800×800)</span>
            </div>
            <Link
              href={`/admin/events/${event.id}/edit`}
              className="font-bold underline ml-2 shrink-0 hover:text-amber-700"
            >
              Thêm
            </Link>
          </div>
        )}

        {/* ── 2. Top Campaign Header ─────────────────────────────────────── */}
        <header
          className="sticky top-0 z-30 w-full backdrop-blur-md border-b shadow-xs transition-colors duration-300"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
          }}
        >
          <div className="max-w-7xl mx-auto px-3 sm:px-4 h-14 flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Back to Home button & Event Title */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors shrink-0 whitespace-nowrap"
                title="Quay lại Trang Chủ"
              >
                <ArrowLeft className="w-4 h-4 shrink-0 text-slate-700" />
                <span className={isForcedMobile ? 'hidden' : 'hidden sm:inline'}>Trang Chủ</span>
              </Link>

              <div className="min-w-0 flex-1 flex items-center gap-1.5">
                <span
                  className="font-bold text-xs sm:text-sm md:text-base tracking-tight text-slate-900 truncate block leading-normal min-w-0"
                  title={event.name}
                >
                  {event.name}
                </span>
              </div>
            </div>

            {/* Right: Live / Scheduled / Ended Status Badge */}
            <div className="flex items-center shrink-0">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-xs shrink-0 whitespace-nowrap select-none"
                style={{
                  backgroundColor:
                    timeScenario === 'LIVE'
                      ? '#DC2626'
                      : timeScenario === 'UPCOMING'
                        ? '#D97706'
                        : '#64748B',
                }}
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  {timeScenario === 'LIVE' && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  )}
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
                </span>
                <span className="whitespace-nowrap leading-none">
                  {timeScenario === 'LIVE'
                    ? 'Đang diễn ra'
                    : timeScenario === 'UPCOMING'
                      ? 'Sắp diễn ra'
                      : 'Đã kết thúc'}
                </span>
              </span>
            </div>
          </div>
        </header>

        {/* ── 3. Main Hero Banner ────────────────────────────────────────── */}
        <section
          className="relative w-full overflow-hidden transition-colors duration-300"
          style={{
            background:
              'linear-gradient(180deg, var(--event-surface, #FFF1F2) 0%, transparent 100%)',
          }}
        >
          <div
            className={`relative w-full ${
              isForcedMobile
                ? 'h-[320px] sm:h-[360px]'
                : isForcedTablet
                  ? 'h-[340px]'
                  : 'h-[280px] sm:h-[380px] md:h-[460px]'
            }`}
          >
            {/* 1. Explicit Mobile Banner (used in simulator or when forced mobile) */}
            {isForcedMobile ? (
              (event.bannerMobileUrl || event.bannerDesktopUrl) && (
                <Image
                  src={event.bannerMobileUrl || event.bannerDesktopUrl!}
                  alt={event.name}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )
            ) : isForcedDesktop && !isCustomerView ? (
              /* 2. Explicit Desktop Banner (used when admin explicitly tests desktop in preview) */
              (event.bannerDesktopUrl || event.bannerMobileUrl) && (
                <Image
                  src={event.bannerDesktopUrl || event.bannerMobileUrl!}
                  alt={event.name}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )
            ) : isForcedTablet && !isCustomerView ? (
              /* 3. Explicit Tablet Banner (used when admin explicitly tests tablet in preview) */
              (event.bannerDesktopUrl || event.bannerMobileUrl) && (
                <Image
                  src={event.bannerDesktopUrl || event.bannerMobileUrl!}
                  alt={event.name}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover object-center"
                />
              )
            ) : (
              /* 4. Dual Responsive Banner for Customer View & Browser Resizing:
                 - Mobile banner automatically shown on mobile viewports (< 640px)
                 - Desktop banner automatically shown on tablet & desktop (>= 640px) */
              <>
                {/* Desktop Banner: hidden on mobile (< 640px), shown on sm (>= 640px) */}
                {(event.bannerDesktopUrl || event.bannerMobileUrl) && (
                  <Image
                    src={event.bannerDesktopUrl || event.bannerMobileUrl!}
                    alt={event.name}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center hidden sm:block"
                  />
                )}

                {/* Mobile Banner: shown on mobile (< 640px), hidden on sm (>= 640px) */}
                {(event.bannerMobileUrl || event.bannerDesktopUrl) && (
                  <Image
                    src={event.bannerMobileUrl || event.bannerDesktopUrl!}
                    alt={event.name}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover object-center block sm:hidden"
                  />
                )}
              </>
            )}

            {/* Fallback if no banner uploaded */}
            {!event.bannerDesktopUrl && !event.bannerMobileUrl && (
              <div
                className="w-full h-full flex flex-col items-center justify-center text-center px-4"
                style={{
                  background:
                    'radial-gradient(ellipse at center, var(--event-surface, #FEF2F2) 0%, transparent 80%)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3 text-white shadow-lg"
                  style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
                >
                  <Sparkles className="w-8 h-8" />
                </div>
                <h1
                  className="text-2xl sm:text-4xl font-black tracking-tight max-w-3xl"
                  style={{ color: 'var(--event-primary, #DC2626)' }}
                >
                  {event.name}
                </h1>
                {event.description && (
                  <p className="mt-2 text-xs sm:text-base text-slate-600 max-w-xl">
                    {event.description}
                  </p>
                )}
              </div>
            )}

            <div
              className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, var(--event-bg, #FFF1F2) 0%, transparent 100%)',
              }}
            />
          </div>
        </section>

        {/* ── 4. Countdown Timer Section ─────────────────────────────────── */}
        <div className="w-full relative z-10 -mt-6 sm:-mt-10 max-w-5xl mx-auto px-3 sm:px-4">
          <EventCountdownSection
            title={
              timeScenario === 'UPCOMING'
                ? 'SỰ KIỆN SẼ BẮT ĐẦU TRONG'
                : timeScenario === 'LIVE'
                  ? 'ƯU ĐÃI SỰ KIỆN KẾT THÚC TRONG'
                  : 'SỰ KIỆN ĐÃ KẾT THÚC'
            }
            endAt={timeScenario === 'UPCOMING' ? event.startAt : event.endAt}
            device={device}
          />
        </div>

        {/* ── 5. Sticky Quick Navigation ─────────────────────────────────── */}
        <EventStickyNav
          hasFlashSale={flashSales && flashSales.length > 0}
          hasCollections={collections && collections.length > 0}
          hasVouchers={vouchers && vouchers.length > 0}
          hasActivities={true}
        />

        {/* ── 6. Commerce Content Main Area ──────────────────────────────── */}
        <main className="flex-1 w-full pb-16 space-y-8 mt-2">
          {/* ⚡ FLASH SALE SECTION */}
          <section
            id="flash-sale"
            className={`w-full max-w-7xl mx-auto scroll-mt-24 ${
              isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'
            }`}
          >
            {flashSales && flashSales.length > 0 && activeSale ? (
              <div
                className={`relative overflow-hidden shadow-lg border backdrop-blur-md transition-all duration-300 ${
                  isMobile ? 'rounded-2xl p-3' : 'rounded-3xl p-4 sm:p-8'
                }`}
                style={{
                  backgroundColor: 'var(--event-card-bg, #FFFFFF)',
                  borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
                  boxShadow: '0 20px 40px -15px var(--event-glow, rgba(220, 38, 38, 0.12))',
                }}
              >
                {/* Header & Slots Tab Bar */}
                <div className="flex flex-col gap-3 pb-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                        style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
                      >
                        <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h2
                            className={`${
                              isMobile ? 'text-base' : 'text-lg sm:text-2xl'
                            } font-black text-slate-900 uppercase tracking-wider`}
                          >
                            {activeSale.name || 'Flash Sale Giờ Vàng'}
                          </h2>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                            Live
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Ưu đãi giảm giá sốc số lượng có hạn
                        </p>
                      </div>
                    </div>

                    {/* Slot Count Indicator */}
                    <div className="text-xs text-slate-500">
                      <span>{flashSales.length} khung giờ</span>
                    </div>
                  </div>

                  {/* Multi-slot selector tabs */}
                  {flashSales.length > 1 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-2 no-scrollbar">
                      {flashSales.map((slot) => {
                        const isSelected = slot.id === activeSale.id;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSelectSlot(slot.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                              isSelected
                                ? 'text-white shadow-md font-extrabold border-transparent'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                            }`}
                            style={
                              isSelected
                                ? {
                                    backgroundColor: 'var(--event-primary, #DC2626)',
                                    boxShadow:
                                      '0 4px 12px var(--event-glow, rgba(220, 38, 38, 0.3))',
                                  }
                                : undefined
                            }
                          >
                            <span>{slot.name}</span>
                            <span className="ml-1 text-[10px] opacity-80">
                              ({slot.items?.length || 0})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Items Grid */}
                {activeSale.items && activeSale.items.length > 0 ? (
                  <div
                    className={`mt-4 sm:mt-6 grid ${
                      isMobile
                        ? 'grid-cols-2 gap-2.5'
                        : device === 'tablet'
                          ? 'grid-cols-3 gap-4'
                          : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6'
                    }`}
                  >
                    {activeSale.items.map((item) => {
                      const cardContent = (
                        <div
                          className="group relative rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col bg-white h-full"
                          style={{
                            borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
                          }}
                        >
                          {/* Thumbnail */}
                          <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                            {item.productImageUrl ? (
                              <Image
                                src={item.productImageUrl}
                                alt={item.productName}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <ShoppingBag className="w-8 h-8 opacity-40" />
                              </div>
                            )}

                            {/* Discount Tag */}
                            <div className="absolute top-2 right-2 bg-red-600 text-white font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded-lg shadow-md">
                              -{item.discountPercent}%
                            </div>
                          </div>

                          {/* Info */}
                          <div
                            className={`${isMobile ? 'p-2.5' : 'p-3 sm:p-4'} flex flex-col flex-1`}
                          >
                            <h3
                              className={`${
                                isMobile
                                  ? 'text-xs min-h-[30px]'
                                  : 'text-xs sm:text-sm min-h-[32px] sm:min-h-[40px]'
                              } font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors`}
                            >
                              {item.productName}
                            </h3>

                            <div className="mt-1.5 flex items-baseline gap-1.5 flex-wrap">
                              <span
                                className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} font-extrabold`}
                                style={{ color: 'var(--event-secondary, #D97706)' }}
                              >
                                {formatCurrency(item.flashPrice)}
                              </span>
                              {item.originalPrice > item.flashPrice && (
                                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                                  {formatCurrency(item.originalPrice)}
                                </span>
                              )}
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-2.5">
                              <div className="flex justify-between text-[10px] text-slate-500 font-medium mb-1">
                                <span>Đã bán {item.soldQuantity}</span>
                                <span>{item.progressPercent}%</span>
                              </div>
                              <div className="w-full bg-slate-100 border border-slate-200/50 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-500"
                                  style={{
                                    width: `${Math.min(item.progressPercent, 100)}%`,
                                    background:
                                      'linear-gradient(to right, var(--event-secondary, #D97706), var(--event-primary, #DC2626))',
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );

                      if (isCustomerView && item.productId) {
                        return (
                          <Link key={item.id} href={`/products/${item.productId}`}>
                            {cardContent}
                          </Link>
                        );
                      }

                      return <div key={item.id}>{cardContent}</div>;
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    <p className="text-sm">Khung giờ này chưa có sản phẩm nào được duyệt.</p>
                  </div>
                )}
              </div>
            ) : !isCustomerView ? (
              /* Empty state placeholder when no flash sales exist (Admin preview only) */
              <div
                className="rounded-3xl p-6 sm:p-8 border-2 border-dashed text-center bg-white"
                style={{
                  borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.12))',
                }}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Chưa kích hoạt khung giờ Flash Sale
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Sự kiện chưa có khung giờ Flash Sale hoặc chưa có sản phẩm tham gia được phê
                  duyệt.
                </p>
                <Link
                  href={`/admin/events/${event.id}/commerce`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-amber-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Quản lý Khung Giờ Flash Sale</span>
                </Link>
              </div>
            ) : null}
          </section>

          {/* 🎁 VOUCHERS SECTION */}
          <section
            id="vouchers"
            className={`w-full max-w-7xl mx-auto scroll-mt-24 ${
              isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'
            }`}
          >
            {vouchers && vouchers.length > 0 ? (
              <div
                className={`border backdrop-blur-md shadow-md transition-all duration-300 ${
                  isMobile ? 'rounded-2xl p-3' : 'rounded-3xl p-4 sm:p-8'
                }`}
                style={{
                  backgroundColor: 'var(--event-card-bg, #FFFFFF)',
                  borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
                }}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
                      style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
                    >
                      <Ticket className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h2
                        className={`${
                          isMobile ? 'text-base' : 'text-lg sm:text-2xl'
                        } font-black text-slate-900 uppercase tracking-wider`}
                      >
                        Mã Giảm Giá
                      </h2>
                      <p className="text-xs text-slate-500">
                        Lưu voucher độc quyền áp dụng cho toàn bộ sản phẩm OCOP
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`grid ${
                    isMobile
                      ? 'grid-cols-1 gap-2.5'
                      : device === 'tablet'
                        ? 'grid-cols-2 gap-3'
                        : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
                  }`}
                >
                  {vouchers.map((v) => {
                    const isSaved = savedVoucherIds.has(v.id) || savedVoucherIds.has(v.voucherId);
                    return (
                      <div
                        key={v.id}
                        className="rounded-2xl border border-dashed p-3.5 flex flex-col justify-between transition-all shadow-2xs"
                        style={{
                          backgroundColor: 'var(--event-surface, #FFFBEB)',
                          borderColor: 'var(--event-primary, #DC2626)',
                        }}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs font-mono font-bold px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: 'var(--event-glow, rgba(220, 38, 38, 0.15))',
                                color: 'var(--event-primary, #DC2626)',
                              }}
                            >
                              {v.code}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {v.type === 'PERCENT' ? `Giảm ${v.discountValue}%` : 'Giảm tiền mặt'}
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900 mt-2">{v.name}</h4>

                          <p className="text-xs text-slate-600 mt-1">
                            Đơn tối thiểu {formatCurrency(v.minOrderValue)}
                          </p>
                        </div>

                        <div className="mt-3.5 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
                          <span className="text-[11px] text-slate-500 font-medium">
                            {v.usedCount} lượt dùng
                          </span>
                          <button
                            type="button"
                            onClick={() => handleSaveVoucherClick(v)}
                            className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                              isSaved
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-900 font-bold hover:opacity-90 shadow-2xs'
                            }`}
                            style={
                              !isSaved
                                ? { backgroundColor: 'var(--event-secondary, #F59E0B)' }
                                : undefined
                            }
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-3 h-3" />
                                <span>Đã lưu</span>
                              </>
                            ) : (
                              <span>Lưu mã</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : !isCustomerView ? (
              <div
                className="rounded-3xl p-6 sm:p-8 border-2 border-dashed text-center bg-white"
                style={{
                  borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.12))',
                }}
              >
                <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                  <Ticket className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Chưa gán Voucher cho sự kiện</h3>
                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                  Thêm các voucher để kích thích người mua hàng đặt đơn.
                </p>
                <Link
                  href={`/admin/events/${event.id}/commerce`}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-amber-200"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Thêm Voucher</span>
                </Link>
              </div>
            ) : null}
          </section>

          {/* 🌿 COLLECTIONS SECTION */}
          <section id="collections" className="w-full">
            {collections && collections.length > 0 ? (
              <EventCollectionSection collections={collections} device={device} />
            ) : !isCustomerView ? (
              <div className={`max-w-7xl mx-auto ${isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'}`}>
                <div
                  className="rounded-3xl p-6 sm:p-8 border-2 border-dashed text-center bg-white"
                  style={{
                    borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.12))',
                  }}
                >
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Chưa thêm Bộ sưu tập OCOP</h3>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    Thêm các bộ sưu tập theo chủ đề để làm nổi bật sản phẩm.
                  </p>
                  <Link
                    href={`/admin/events/${event.id}/commerce`}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3.5 py-2 rounded-xl transition cursor-pointer border border-amber-200"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Thêm Bộ Sưu Tập</span>
                  </Link>
                </div>
              </div>
            ) : null}
          </section>

          {/* 🧧 ACTIVITIES / MINIGAME SECTION */}
          <EventMinigameSection
            event={event}
            isMobilePreview={isMobile}
            className={`py-6 max-w-7xl mx-auto ${isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'}`}
          />
        </main>

        {/* ── 7. Footer ─────────────────────────────────────────────────── */}
        <footer
          className="w-full py-6 border-t text-center text-xs text-slate-500"
          style={{
            borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          <p>© {new Date().getFullYear()} Sàn Thương Mại Điện Tử Nông Sản OCOP.</p>
        </footer>
      </div>
    </EventThemeProvider>
  );
}
