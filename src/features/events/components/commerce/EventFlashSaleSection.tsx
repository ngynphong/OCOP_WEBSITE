'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Zap, Flame } from 'lucide-react';
import type { EventFlashSale } from '../../types/eventCommerceTypes';

interface EventFlashSaleSectionProps {
  flashSales: EventFlashSale[];
}

export function EventFlashSaleSection({ flashSales }: EventFlashSaleSectionProps) {
  const activeSale = flashSales.length > 0 ? flashSales[0] : null;

  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!activeSale?.endTime) return;

    const calculateTime = () => {
      const diff = new Date(activeSale.endTime).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const totalSec = Math.floor(diff / 1000);
      const hours = Math.floor(totalSec / 3600);
      const minutes = Math.floor((totalSec % 3600) / 60);
      const seconds = totalSec % 60;
      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeSale?.endTime]);

  if (!activeSale || !activeSale.items || activeSale.items.length === 0) {
    return null;
  }

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <section
      id="flash-sale"
      className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl border border-amber-400/30 bg-gradient-to-br from-amber-500/10 via-red-500/10 to-transparent dark:from-amber-950/30 dark:via-red-950/30 dark:to-slate-900/60 backdrop-blur-md">
        {/* Decorative corner glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-amber-400/20 blur-3xl pointer-events-none" />

        {/* Header with Title and Countdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md text-white"
              style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
            >
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  {activeSale.name || 'Flash Sale Giờ Vàng'}
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600 text-white animate-pulse">
                  Đang diễn ra
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                Ưu đãi giảm sốc có hạn dành riêng cho sự kiện
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-1.5 self-end sm:self-auto bg-black/80 dark:bg-black/90 px-4 py-2 rounded-2xl shadow-inner text-white">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300 mr-1">
              Kết thúc sau
            </span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-sm font-mono font-bold">
              {pad(timeLeft.hours)}
            </span>
            <span className="font-bold text-amber-400">:</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-sm font-mono font-bold">
              {pad(timeLeft.minutes)}
            </span>
            <span className="font-bold text-amber-400">:</span>
            <span className="px-2 py-1 bg-white/10 rounded-lg text-sm font-mono font-bold">
              {pad(timeLeft.seconds)}
            </span>
          </div>
        </div>

        {/* Items Carousel/Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {activeSale.items.map((item) => {
            const isAlmostGone = item.progressPercent >= 75;
            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Image & Discount Tag */}
                <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
                  {item.productImageUrl ? (
                    <Image
                      src={item.productImageUrl}
                      alt={item.productName}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Zap className="w-8 h-8 opacity-30" />
                    </div>
                  )}

                  {/* Discount percent badge */}
                  {item.discountPercent > 0 && (
                    <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-lg bg-red-600 text-white text-xs font-black shadow-md flex items-center gap-0.5">
                      <span>-{item.discountPercent}%</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug">
                      {item.productName}
                    </h3>
                  </div>

                  <div className="mt-3">
                    {/* Prices */}
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-base sm:text-lg font-black tracking-tight"
                        style={{ color: 'var(--event-primary, #DC2626)' }}
                      >
                        {formatPrice(item.flashPrice)}
                      </span>
                      {item.originalPrice > item.flashPrice && (
                        <span className="text-xs line-through text-slate-400">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mt-2.5">
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isAlmostGone
                              ? 'bg-gradient-to-r from-amber-500 to-red-600 animate-pulse'
                              : 'bg-gradient-to-r from-red-500 to-amber-400'
                          }`}
                          style={{ width: `${Math.max(5, item.progressPercent)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-semibold mt-1">
                        <span
                          className={
                            isAlmostGone
                              ? 'text-red-600 dark:text-red-400 font-bold'
                              : 'text-slate-500'
                          }
                        >
                          {isAlmostGone ? (
                            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                              <Flame className="w-3 h-3" />
                              <span>Sắp cháy hàng</span>
                            </span>
                          ) : (
                            `Đã bán ${item.soldQuantity}`
                          )}
                        </span>
                        <span className="text-slate-400 font-medium">
                          Còn {item.remainingStock}
                        </span>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 text-center py-2 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-md group-hover:scale-[1.02] cursor-pointer"
                      style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Săn Ngay</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
