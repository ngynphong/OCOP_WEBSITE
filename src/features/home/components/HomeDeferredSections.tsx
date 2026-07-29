'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const QuickLinksRow = dynamic(() =>
  import('@/features/home/components/QuickLinksRow').then((mod) => mod.QuickLinksRow),
);
const BestSellersSection = dynamic(() =>
  import('@/features/home/components/BestSellersSection').then((mod) => mod.BestSellersSection),
);
const VoucherHomeSection = dynamic(() =>
  import('@/features/home/components/VoucherHomeSection').then((mod) => mod.VoucherHomeSection),
);
const FlashSaleSection = dynamic(() =>
  import('@/features/home/components/FlashSaleSection').then((mod) => mod.FlashSaleSection),
);
const FeatureHighlights = dynamic(() =>
  import('@/features/home/components/FeatureHighlights').then((mod) => mod.FeatureHighlights),
);
const CategoryList = dynamic(() =>
  import('@/features/home/components/CategoryList').then((mod) => mod.CategoryList),
);
const SubBanners = dynamic(() =>
  import('@/features/home/components/SubBanners').then((mod) => mod.SubBanners),
);
const OcopMallSection = dynamic(() =>
  import('@/features/home/components/OcopMallSection').then((mod) => mod.OcopMallSection),
);
const CategoryShowcase = dynamic(() =>
  import('@/features/home/components/CategoryShowcase').then((mod) => mod.CategoryShowcase),
);
const DailyDiscoverFeed = dynamic(() =>
  import('@/features/home/components/DailyDiscoverFeed').then((mod) => mod.DailyDiscoverFeed),
);
const TestimonialSection = dynamic(() =>
  import('@/features/home/components/TestimonialSection').then((mod) => mod.TestimonialSection),
);
const QRTraceabilitySection = dynamic(() =>
  import('@/features/home/components/QRTraceabilitySection').then(
    (mod) => mod.QRTraceabilitySection,
  ),
);
const NewsletterSection = dynamic(() =>
  import('@/features/home/components/NewsletterSection').then((mod) => mod.NewsletterSection),
);

function DeferredSectionsSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-8 space-y-8" aria-hidden="true">
      <div className="h-16 rounded-xl bg-white/30 border border-white/30 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="aspect-4/5 rounded-xl bg-white/30 border border-white/30 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}

export function HomeDeferredSections() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const target = containerRef.current;
    const idleTimer = window.setTimeout(() => setShouldRender(true), 2500);

    if (!target || !('IntersectionObserver' in window)) {
      return () => window.clearTimeout(idleTimer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          window.clearTimeout(idleTimer);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' },
    );

    observer.observe(target);

    return () => {
      window.clearTimeout(idleTimer);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      {shouldRender ? (
        <>
          <div className="w-full flex flex-col gap-10 md:gap-16 mt-6 relative z-20">
            <QuickLinksRow />
            <BestSellersSection />
            <VoucherHomeSection />
            <FlashSaleSection />
            <FeatureHighlights />
            <CategoryList />
            <SubBanners />
            <OcopMallSection />
            <CategoryShowcase />
            <DailyDiscoverFeed />
          </div>

          <div className="relative z-20 w-full flex flex-col items-center">
            <TestimonialSection />
            <QRTraceabilitySection />
            <NewsletterSection />
          </div>
        </>
      ) : (
        <DeferredSectionsSkeleton />
      )}
    </div>
  );
}
