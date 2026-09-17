import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getEventCommerceOverviewServer } from '@/features/events/api/eventCommerceApi';
import { EventCommerceLandingView } from '@/features/events/components/commerce/EventCommerceLandingView';

interface EventPageProps {
  params: Promise<{
    slug: string;
  }>;
}

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

  return (
    <EventCommerceLandingView
      event={event}
      theme={event.theme}
      collections={collections}
      flashSales={flashSales}
      vouchers={vouchers}
      isCustomerView={true}
    />
  );
}
