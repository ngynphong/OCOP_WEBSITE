import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, AlertCircle } from 'lucide-react';
import type { EventDetailResponse, ActiveEventResponse } from '@/features/events/types/eventTypes';

export interface EventLandingHeroBannerProps {
  event: EventDetailResponse | ActiveEventResponse;
  device?: 'desktop' | 'tablet' | 'mobile';
  isCustomerView?: boolean;
}

export const EventLandingHeroBanner: React.FC<EventLandingHeroBannerProps> = ({
  event,
  device = 'desktop',
  isCustomerView = true,
}) => {
  const isForcedMobile = device === 'mobile';
  const isForcedDesktop = device === 'desktop';
  const isForcedTablet = device === 'tablet';

  return (
    <>
      {!isCustomerView && isForcedMobile && !event.bannerMobileUrl && event.bannerDesktopUrl && (
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

      <section
        className="relative w-full overflow-hidden transition-colors duration-300"
        style={{
          background: 'linear-gradient(180deg, var(--event-surface, #FFF1F2) 0%, transparent 100%)',
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
            <>
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
              background: 'linear-gradient(to top, var(--event-bg, #FFF1F2) 0%, transparent 100%)',
            }}
          />
        </div>
      </section>
    </>
  );
};
