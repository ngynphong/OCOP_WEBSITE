'use client';

import { memo, useEffect, useState } from 'react';
import { getImageProps } from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Banner } from '../api/homeApi';

interface HeroSliderProps {
  banners: Banner[];
}

const getBannerAlt = (banner: Banner, fallback: string) => banner.title?.trim() || fallback;

export const HeroSlider = memo(function HeroSlider({ banners }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(banners.length > 1);

  const currentBanner = banners[currentIndex] ?? banners[0];
  const totalBanners = banners.length;
  const mobileImageUrl = currentBanner.imageMobileUrl || currentBanner.imageUrl;
  const altText = getBannerAlt(currentBanner, 'OCOP Banner');
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    src: currentBanner.imageUrl,
    alt: altText,
    width: 1920,
    height: 900,
    quality: 75,
    sizes: '100vw',
  });
  const { props: mobileImageProps } = getImageProps({
    src: mobileImageUrl,
    alt: altText,
    width: 828,
    height: 900,
    quality: 75,
    sizes: '100vw',
  });

  useEffect(() => {
    if (totalBanners <= 1 || !isAutoPlay) return;

    const timer = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalBanners);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isAutoPlay, totalBanners]);

  return (
    <section className="relative w-full h-[58svh] min-h-[360px] max-h-[560px] md:h-[calc(100vh-72px)] md:min-h-[500px] lg:h-[calc(100vh-80px)] md:max-h-[900px] overflow-hidden bg-[#113B28]">
      <div className="absolute inset-0 z-0">
        <picture>
          <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes="100vw" />
          <img
            {...mobileImageProps}
            alt={altText}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-br from-black/45 via-black/5 to-black/55" />
      </div>

      <div className="absolute inset-0 z-10 flex flex-col justify-between w-full h-full py-6 md:py-12 lg:py-16 px-5 md:px-12 lg:px-24">
        <div className="flex justify-end items-start w-full gap-8 pointer-events-none">
          <div className="flex flex-col items-start md:items-end md:text-right max-w-[18rem] md:max-w-sm mt-2 md:mt-8 bg-black/35 md:backdrop-blur-md border border-white/10 p-4 md:p-6 rounded-xl md:rounded-2xl pointer-events-auto">
            <p className="text-white/90 text-sm md:text-base font-sans tracking-wide leading-relaxed mb-4 md:mb-6 drop-shadow-md">
              Kết nối nông dân và người tiêu dùng qua nền tảng thương mại điện tử chuyên biệt. Truy
              xuất nguồn gốc dễ dàng qua mã QR.
            </p>
            <Link href="/san-pham">
              <span className="group inline-flex items-center gap-2 text-white/80 hover:text-white uppercase tracking-[0.16em] md:tracking-[0.2em] text-[10px] md:text-xs transition-colors cursor-pointer py-2 md:py-0 md:pb-1 border-b border-white/30 hover:border-white">
                Khám phá sản phẩm
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </div>
        </div>

        <div className="flex-1" />

        {totalBanners > 1 && (
          <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8">
            <div className="flex items-center gap-5 md:gap-6 text-white/85 font-[family-name:var(--font-playfair)] tracking-widest">
              <span className="text-sm md:text-base">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <button
                type="button"
                className="w-24 md:w-48 h-8 flex items-center relative cursor-pointer group"
                onClick={() => {
                  setIsAutoPlay(false);
                  setCurrentIndex((prev) => (prev + 1) % totalBanners);
                }}
                aria-label="Chuyển banner tiếp theo"
              >
                <span className="w-full h-[1px] bg-white/30 overflow-hidden relative group-hover:h-[2px] transition-all">
                  <span
                    className="absolute top-0 left-0 h-full bg-white transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalBanners) * 100}%` }}
                  />
                </span>
              </button>
              <span className="text-sm md:text-base">{String(totalBanners).padStart(2, '0')}</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
});
