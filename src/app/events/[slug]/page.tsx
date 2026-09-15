import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getEventCommerceOverviewServer } from '@/features/events/api/eventCommerceApi';
import { EventThemeProvider } from '@/features/events/components/EventThemeProvider';
import { EventStickyNav } from '@/features/events/components/commerce/EventStickyNav';
import { EventCollectionSection } from '@/features/events/components/commerce/EventCollectionSection';
import { EventFlashSaleSection } from '@/features/events/components/commerce/EventFlashSaleSection';
import { EventVoucherSection } from '@/features/events/components/commerce/EventVoucherSection';
import { EventCountdownSection } from '@/features/events/components/sections/EventCountdownSection';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const EVENT_STATUS_LABELS = {
  DRAFT: 'Bản nháp',
  SCHEDULED: 'Sắp diễn ra',
  LIVE: 'Đang diễn ra',
  ENDING: 'Sắp kết thúc',
  ENDED: 'Đã kết thúc',
  ARCHIVED: 'Đã lưu trữ',
  PAUSED: 'Tạm dừng',
} as const;

const PUBLIC_EVENT_STATUSES = new Set(['SCHEDULED', 'LIVE', 'ENDING', 'ENDED', 'PAUSED']);

const isPublicEventStatus = (status: string | undefined) =>
  Boolean(status && PUBLIC_EVENT_STATUSES.has(status));

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const overview = await getEventCommerceOverviewServer(slug);

  if (!overview || !overview.event || !isPublicEventStatus(overview.event.status)) {
    return {
      title: 'Sự Kiện OCOP | Nông Sản Việt Nam',
      description: 'Khám phá các sự kiện và nông sản OCOP chất lượng cao.',
    };
  }

  const { event } = overview;
  const bannerImage = event.bannerDesktopUrl || '/images/hero-banner-1.jpg';

  return {
    title: `${event.name} - Đại Tiệc Nông Sản OCOP`,
    description:
      event.description ||
      `Khám phá hàng ngàn đặc sản OCOP đạt chuẩn 3-5 sao tham gia sự kiện ${event.name} với ưu đãi Flash Sale và voucher cực lớn!`,
    openGraph: {
      title: `${event.name} | Sàn Nông Sản OCOP`,
      description: event.description || undefined,
      images: [{ url: bannerImage }],
    },
  };
}

export default async function EventLandingPage({ params }: EventPageProps) {
  const { slug } = await params;
  const overview = await getEventCommerceOverviewServer(slug);

  if (!overview || !overview.event || !isPublicEventStatus(overview.event.status)) {
    notFound();
  }

  const { event, collections, flashSales, vouchers } = overview;
  const theme = event.theme;
  const isLive = event.status === 'LIVE';
  const isScheduled = event.status === 'SCHEDULED';
  const statusLabel = EVENT_STATUS_LABELS[event.status];
  const statusColor = isLive
    ? 'var(--event-primary, #DC2626)'
    : isScheduled
      ? '#D97706'
      : '#475569';

  return (
    <EventThemeProvider theme={theme}>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative overflow-x-hidden">
        {/* Top Campaign Bar */}
        <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-black/5 dark:border-white/10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <span>←</span>
                <span>Trang Chủ</span>
              </Link>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-2">
                <span className="text-base">🎉</span>
                <span className="font-extrabold text-sm sm:text-base tracking-tight truncate max-w-[200px] sm:max-w-xs">
                  {event.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white shadow-sm"
                style={{ backgroundColor: statusColor }}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full bg-white ${isLive ? 'animate-ping' : ''}`}
                />
                <span>{statusLabel}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Main Hero Banner */}
        <section className="relative w-full overflow-hidden bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-900 dark:to-slate-950">
          <div className="relative w-full h-[280px] sm:h-[380px] md:h-[480px]">
            {/* Desktop Banner (1920x600) with fallback */}
            {(event.bannerDesktopUrl || event.bannerMobileUrl) && (
              <Image
                src={event.bannerDesktopUrl || event.bannerMobileUrl!}
                alt={event.name}
                fill
                priority
                sizes="100vw"
                className="object-cover hidden sm:block"
              />
            )}

            {/* Mobile Banner (800x800) with fallback */}
            {(event.bannerMobileUrl || event.bannerDesktopUrl) && (
              <Image
                src={event.bannerMobileUrl || event.bannerDesktopUrl!}
                alt={event.name}
                fill
                priority
                sizes="100vw"
                className="object-cover block sm:hidden"
              />
            )}

            {/* If no banner image, render elegant gradient hero */}
            {!event.bannerDesktopUrl && !event.bannerMobileUrl && (
              <div
                className="w-full h-full flex flex-col items-center justify-center text-center px-4"
                style={{
                  background:
                    'radial-gradient(ellipse at center, var(--event-surface, #FEF2F2) 0%, transparent 80%)',
                }}
              >
                <span className="text-6xl sm:text-7xl mb-3 drop-shadow-md">🎉</span>
                <h1
                  className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-sm max-w-3xl"
                  style={{ color: 'var(--event-primary, #DC2626)' }}
                >
                  {event.name}
                </h1>
                {event.description && (
                  <p className="mt-3 text-sm sm:text-lg text-slate-700 dark:text-slate-300 max-w-2xl">
                    {event.description}
                  </p>
                )}
              </div>
            )}

            {/* Bottom gradient overlay to blend into body */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none" />
          </div>
        </section>

        {/* Countdown Section */}
        <div className="w-full relative z-10 -mt-8 sm:-mt-12 max-w-5xl mx-auto px-4">
          <EventCountdownSection
            title={isScheduled ? 'SỰ KIỆN BẮT ĐẦU TRONG' : 'ƯU ĐÃI KẾT THÚC TRONG'}
            endAt={isScheduled ? event.startAt : event.endAt}
          />
        </div>

        {/* Sticky Quick Nav */}
        <EventStickyNav
          hasFlashSale={flashSales && flashSales.length > 0}
          hasCollections={collections && collections.length > 0}
          hasVouchers={vouchers && vouchers.length > 0}
          hasActivities={true}
        />

        {/* Content Sections */}
        <main className="flex-1 w-full pb-16 space-y-4">
          {/* Flash Sale Section */}
          {flashSales && flashSales.length > 0 && <EventFlashSaleSection flashSales={flashSales} />}

          {/* Collections Section */}
          {collections && collections.length > 0 && (
            <EventCollectionSection collections={collections} />
          )}

          {/* Vouchers Section */}
          {vouchers && vouchers.length > 0 && <EventVoucherSection vouchers={vouchers} />}

          {/* Phase 3 Gamification Teaser / Minigame Hub */}
          <section
            id="activities"
            className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
          >
            <div className="rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md text-center shadow-lg">
              <div
                className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-4 shadow-md text-white"
                style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
              >
                🎁
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Hoạt Động & Minigame Lễ Hội
              </h2>
              <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto">
                Bốc lì xì may mắn mỗi ngày, Vòng quay OCOP và tích điểm đổi quà độc quyền đang diễn
                ra trong khuôn khổ sự kiện!
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="px-6 py-3 rounded-2xl text-sm font-extrabold text-white shadow-lg hover:scale-105 transition-all cursor-pointer"
                  style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
                >
                  🧧 Bốc Lì Xì May Mắn
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 rounded-2xl text-sm font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition cursor-pointer"
                >
                  Xem Thêm Đặc Sản
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="w-full py-8 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-900/50">
          <p>
            © {new Date().getFullYear()} Sàn Thương Mại Điện Tử Nông Sản OCOP. Bản quyền thuộc về Bộ
            Nông nghiệp & Phát triển Nông thôn.
          </p>
        </footer>
      </div>
    </EventThemeProvider>
  );
}
