'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles, ArrowRight, Calendar } from 'lucide-react';
import type { ActiveEventResponse, EventThemeDecorations } from '../../types/eventTypes';
import { EventHeroFestiveSticker } from '../decorations/EventCornerDecorations';

interface EventHeroSectionProps {
  event: ActiveEventResponse;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export function EventHeroSection({ event, device }: EventHeroSectionProps) {
  const desktopImg = event.bannerDesktopUrl || event.bannerMobileUrl || '/images/hero-banner-1.jpg';
  const mobileImg = event.bannerMobileUrl || event.bannerDesktopUrl || desktopImg;

  const isForcedMobile = device === 'mobile';
  const isForcedDesktop = device === 'desktop' || device === 'tablet';

  let decorations: EventThemeDecorations | null = null;
  if (event.theme?.decorationsJson) {
    try {
      decorations = JSON.parse(event.theme.decorationsJson);
    } catch {
      // ignore
    }
  }

  return (
    <section className="relative w-full overflow-hidden rounded-2xl md:rounded-3xl shadow-xl border border-amber-500/20 my-4">
      {/* Background Image Layer with Fallback */}
      <div
        className={`relative w-full ${
          isForcedMobile ? 'h-[360px]' : 'h-[360px] sm:h-[420px] md:h-[480px] lg:h-[520px]'
        }`}
      >
        {/* Device-aware Image Rendering */}
        {isForcedMobile ? (
          /* Explicit Mobile Banner (used in preview mode) */
          <div className="absolute inset-0">
            <Image
              src={mobileImg}
              alt={event.name}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ) : isForcedDesktop ? (
          /* Explicit Desktop Banner (used in preview mode) */
          <div className="absolute inset-0">
            <Image
              src={desktopImg}
              alt={event.name}
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        ) : (
          /* Responsive pair for standard public view */
          <>
            <div className="hidden sm:block absolute inset-0">
              <Image
                src={desktopImg}
                alt={event.name}
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            </div>
            <div className="block sm:hidden absolute inset-0">
              <Image
                src={mobileImg}
                alt={event.name}
                fill
                priority
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
          </>
        )}

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex items-center">
          <div
            className={`max-w-7xl mx-auto w-full ${
              isForcedMobile ? 'px-4' : 'px-6 sm:px-10 lg:px-16'
            }`}
          >
            <div className={`max-w-xl text-white ${isForcedMobile ? 'space-y-2.5' : 'space-y-4'}`}>
              {/* Event Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/90 border border-amber-400/40 text-amber-200 text-xs sm:text-sm font-semibold tracking-wide shadow-md backdrop-blur-sm animate-pulse">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                <span>CHIẾN DỊCH ĐẶC BIỆT</span>
              </div>

              {/* Event Title */}
              <h1
                className={`font-extrabold tracking-tight text-white drop-shadow-md leading-tight ${
                  isForcedMobile ? 'text-xl' : 'text-2xl sm:text-4xl lg:text-5xl'
                }`}
              >
                {event.name}
              </h1>

              {/* Event Description */}
              {event.description && (
                <p
                  className={`text-gray-200 leading-relaxed drop-shadow ${
                    isForcedMobile ? 'text-xs line-clamp-2' : 'text-sm sm:text-base line-clamp-3'
                  }`}
                >
                  {event.description}
                </p>
              )}

              {/* Date badge */}
              <div className="flex items-center gap-2 text-xs sm:text-sm text-amber-300/90 font-medium">
                <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>
                  {new Date(event.startAt).toLocaleDateString('vi-VN')} -{' '}
                  {new Date(event.endAt).toLocaleDateString('vi-VN')}
                </span>
              </div>

              {/* CTA Action */}
              <div className="pt-1 sm:pt-2 flex flex-wrap items-center gap-3">
                <Link
                  href={`/events/${event.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold text-xs sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <span>Khám phá ngay</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Cụm Sticker Biểu Tượng Lễ Hội (Bánh Chưng, Bao Lì Xì...) */}
        {decorations?.enableCornerStickers && !isForcedMobile && (
          <div className="absolute bottom-6 right-8 hidden lg:block z-10">
            <EventHeroFestiveSticker conceptId={decorations.conceptId} />
          </div>
        )}
      </div>
    </section>
  );
}
