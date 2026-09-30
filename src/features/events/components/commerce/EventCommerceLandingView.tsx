'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ShoppingBag, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

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

import {
  EventLandingHeader,
  EventLandingHeroBanner,
  EventLandingFlashSaleSection,
  EventLandingVoucherSection,
  EventLandingFooter,
} from './landing';

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
  const isMobile = isForcedMobile;

  const timeScenario = useMemo(() => {
    if (externalTimeScenario) return externalTimeScenario;
    if (event.status === 'LIVE') return 'LIVE';
    if (event.status === 'SCHEDULED') return 'UPCOMING';
    return 'ENDED';
  }, [externalTimeScenario, event.status]);

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

  return (
    <EventThemeProvider theme={theme} device={device} contained={!isCustomerView}>
      <div
        className="min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300"
        style={{
          background: 'var(--event-bg, #FFF1F2)',
          color: 'var(--event-text, #0F172A)',
        }}
      >
        <EventLandingHeader
          eventName={event.name}
          timeScenario={timeScenario}
          isForcedMobile={isForcedMobile}
        />

        <EventLandingHeroBanner event={event} device={device} isCustomerView={isCustomerView} />

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

        <EventStickyNav
          hasFlashSale={flashSales && flashSales.length > 0}
          hasCollections={collections && collections.length > 0}
          hasVouchers={vouchers && vouchers.length > 0}
          hasActivities={true}
        />

        <main className="flex-1 w-full pb-16 space-y-8 mt-2">
          <EventLandingFlashSaleSection
            eventId={event.id}
            flashSales={flashSales}
            activeSale={activeSale}
            onSelectSlot={handleSelectSlot}
            isMobile={isMobile}
            device={device}
            isCustomerView={isCustomerView}
          />

          <EventLandingVoucherSection
            eventId={event.id}
            vouchers={vouchers}
            savedVoucherIds={savedVoucherIds}
            onSaveVoucher={handleSaveVoucherClick}
            isMobile={isMobile}
            device={device}
            isCustomerView={isCustomerView}
          />

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

          {(!isCustomerView || (event as EventDetailResponse).minigameConfig?.isActive) && (
            <EventMinigameSection
              event={event}
              isMobilePreview={isMobile}
              className={`py-6 max-w-7xl mx-auto ${isMobile ? 'px-2.5' : 'px-3 sm:px-6 lg:px-8'}`}
            />
          )}
        </main>

        <EventLandingFooter />
      </div>
    </EventThemeProvider>
  );
}
