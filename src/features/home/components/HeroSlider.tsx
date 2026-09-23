'use client';

import { memo, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Award } from 'lucide-react';
import type { Banner } from '../api/homeApi';

interface HeroSliderProps {
  mainBanners: Banner[];
  subBanners?: Banner[];
}

export const HeroSlider = memo(function HeroSlider({
  mainBanners,
  subBanners = [],
}: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const total = mainBanners.length;
  const currentBanner = mainBanners[currentIndex] ?? mainBanners[0];

  const nextSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (total <= 1 || isPaused) return;

    const interval = window.setInterval(() => {
      nextSlide();
    }, 5000);

    return () => window.clearInterval(interval);
  }, [total, isPaused, nextSlide]);

  if (total === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-3 md:pt-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
        <div
          className="lg:col-span-8 relative w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] rounded-2xl overflow-hidden shadow-sm group bg-emerald-950"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Link
            href={currentBanner.link || '/san-pham'}
            className="block relative w-full h-full cursor-pointer"
            aria-label={currentBanner.title || 'Banner chính'}
          >
            <Image
              src={currentBanner.imageUrl}
              alt={currentBanner.title || 'OCOP Banner'}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

            {(currentBanner.title || currentBanner.description) && (
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 md:p-8 text-white z-10 pointer-events-none">
                {currentBanner.title && (
                  <h2 className="text-lg sm:text-2xl md:text-3xl font-black drop-shadow-md leading-tight line-clamp-1 mb-1.5">
                    {currentBanner.title}
                  </h2>
                )}
                {currentBanner.description && (
                  <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-xl drop-shadow-sm font-normal">
                    {currentBanner.description}
                  </p>
                )}
              </div>
            )}
          </Link>

          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Slide trước"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Slide tiếp theo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-20 cursor-pointer shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {total > 1 && (
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5">
              {mainBanners.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Đi tới slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    currentIndex === idx
                      ? 'w-6 bg-white shadow-sm'
                      : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="hidden lg:flex lg:col-span-4 flex-col gap-3.5 h-[380px]">
          {subBanners[0] ? (
            <Link
              href={subBanners[0].link || '/san-pham'}
              className="relative flex-1 rounded-2xl overflow-hidden shadow-sm group bg-emerald-950 border border-emerald-800/30 cursor-pointer"
            >
              <Image
                src={subBanners[0].imageUrl}
                alt={subBanners[0].title || 'Ưu đãi OCOP'}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-300 mb-1">
                  Đặc sắc
                </span>
                <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {subBanners[0].title}
                </h3>
              </div>
            </Link>
          ) : (
            <Link
              href="/flash-sale"
              className="relative flex-1 rounded-2xl overflow-hidden shadow-sm group bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 border border-emerald-700/50 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                  <Flame className="w-3.5 h-3.5 fill-current animate-pulse" />
                  Flash Sale
                </span>
                <span className="text-xs text-emerald-200 font-medium">Hàng ngày</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-black tracking-tight leading-snug group-hover:text-amber-200 transition-colors">
                  Giá Hời Nông Sản
                </h3>
                <p className="text-xs text-emerald-100/80 mt-1 line-clamp-1">
                  Ưu đãi chớp nhoáng theo khung giờ
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                <span>Săn deal ngay</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          )}

          {subBanners[1] ? (
            <Link
              href={subBanners[1].link || '/san-pham'}
              className="relative flex-1 rounded-2xl overflow-hidden shadow-sm group bg-emerald-950 border border-emerald-800/30 cursor-pointer"
            >
              <Image
                src={subBanners[1].imageUrl}
                alt={subBanners[1].title || 'Khám phá OCOP'}
                fill
                sizes="33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 flex flex-col justify-end">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300 mb-1">
                  Tiêu biểu
                </span>
                <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-emerald-300 transition-colors">
                  {subBanners[1].title}
                </h3>
              </div>
            </Link>
          ) : (
            <Link
              href="/san-pham?ocopStar=5"
              className="relative flex-1 rounded-2xl overflow-hidden shadow-sm group bg-gradient-to-br from-stone-900 via-emerald-950 to-emerald-900 border border-emerald-800/40 p-6 flex flex-col justify-between cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-black uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" />
                  Chuẩn 5 Sao
                </span>
                <span className="text-xs text-stone-400 font-medium">Quốc gia</span>
              </div>
              <div>
                <h3 className="text-white text-lg font-black tracking-tight leading-snug group-hover:text-emerald-300 transition-colors">
                  Tinh Hoa OCOP 5★
                </h3>
                <p className="text-xs text-stone-300 mt-1 line-clamp-1">
                  Đặc sản xuất khẩu từ các vùng miền
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 group-hover:translate-x-1 transition-transform">
                <span>Xem danh sách</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
});

HeroSlider.displayName = 'HeroSlider';
