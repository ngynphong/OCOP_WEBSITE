'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const VoucherHomeSection = dynamic(() =>
  import('@/features/home/components/VoucherHomeSection').then((mod) => mod.VoucherHomeSection),
);
const CategoryList = dynamic(() =>
  import('@/features/home/components/CategoryList').then((mod) => mod.CategoryList),
);
const SubBanners = dynamic(() =>
  import('@/features/home/components/SubBanners').then((mod) => mod.SubBanners),
);
const CategoryShowcase = dynamic(() =>
  import('@/features/home/components/CategoryShowcase').then((mod) => mod.CategoryShowcase),
);
const DailyDiscoverFeed = dynamic(() =>
  import('@/features/home/components/DailyDiscoverFeed').then((mod) => mod.DailyDiscoverFeed),
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
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 space-y-8" aria-hidden="true">
      <div className="h-16 rounded-xl bg-emerald-100/50 border border-emerald-100/40 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="aspect-4/5 rounded-xl bg-white border border-stone-200/60 animate-pulse"
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
    const idleTimer = window.setTimeout(() => setShouldRender(true), 1500);

    if (!target || !('IntersectionObserver' in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShouldRender(true);
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
      { rootMargin: '600px 0px' },
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
          <div className="w-full flex flex-col gap-10 md:gap-14 mt-4 relative z-20">
            <VoucherHomeSection />
            <CategoryList />
            <SubBanners />
            <CategoryShowcase />
            <DailyDiscoverFeed />
          </div>

          <div className="relative z-20 w-full flex flex-col items-center mt-8">
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
