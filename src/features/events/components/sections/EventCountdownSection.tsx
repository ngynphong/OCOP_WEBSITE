'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Flame } from 'lucide-react';

interface EventCountdownSectionProps {
  title?: string;
  endAt: string;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export function EventCountdownSection({
  title = 'ƯU ĐÃI KẾT THÚC TRONG',
  endAt,
  device,
}: EventCountdownSectionProps) {
  const isForcedMobile = device === 'mobile';
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(endAt).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className={`w-full max-w-7xl mx-auto my-3 ${isForcedMobile ? 'px-1' : 'px-4'}`}>
      <div
        className={`rounded-2xl shadow-xl border border-white/25 bg-origin-border bg-clip-border bg-no-repeat text-white transition-all duration-300 ${
          isForcedMobile
            ? 'p-3 flex flex-col items-center gap-3 text-center'
            : 'p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4'
        }`}
        style={{
          background:
            'var(--event-countdown-bg, linear-gradient(135deg, #DC2626 0%, #F59E0B 100%))',
          backgroundOrigin: 'border-box',
          backgroundClip: 'border-box',
          backgroundRepeat: 'no-repeat',
          borderColor: 'rgba(255, 255, 255, 0.25)',
          boxShadow:
            '0 10px 25px -5px var(--event-glow, rgba(0, 0, 0, 0.25)), inset 0 1px 0 0 rgba(255, 255, 255, 0.35)',
        }}
      >
        <div
          className={`flex items-center gap-2.5 ${
            isForcedMobile ? 'justify-center text-center' : ''
          }`}
        >
          <div
            className={`rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner ${
              isForcedMobile ? 'w-8 h-8 flex-shrink-0' : 'w-10 h-10'
            }`}
          >
            <Flame
              className={`text-amber-300 animate-bounce ${isForcedMobile ? 'w-4 h-4' : 'w-6 h-6'}`}
            />
          </div>
          <div className={isForcedMobile ? 'text-left' : ''}>
            <div
              className={`uppercase tracking-wider text-amber-200 font-bold flex items-center gap-1 ${
                isForcedMobile ? 'text-[10px]' : 'text-xs gap-1.5'
              }`}
            >
              <Timer className="w-3 h-3" />
              <span>Thời gian có hạn</span>
            </div>
            <h3
              className={`font-black tracking-tight drop-shadow leading-tight ${
                isForcedMobile ? 'text-sm' : 'text-base sm:text-lg'
              }`}
            >
              {title}
            </h3>
          </div>
        </div>

        {/* Countdown Digits */}
        <div
          className={`flex items-center justify-center font-mono font-black ${
            isForcedMobile ? 'gap-1.5 text-base w-full' : 'gap-2 sm:gap-3 text-lg sm:text-2xl'
          }`}
        >
          <div className="flex flex-col items-center">
            <div
              className={`bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-inner ${
                isForcedMobile ? 'px-2 py-1 min-w-[42px] text-center text-sm' : 'px-3 py-1.5'
              }`}
            >
              {pad(timeLeft.days)}
            </div>
            <span className="text-[10px] uppercase font-sans text-amber-200 mt-1 font-semibold">
              Ngày
            </span>
          </div>
          <span className="text-amber-300 mb-4 font-bold text-sm">:</span>
          <div className="flex flex-col items-center">
            <div
              className={`bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-inner ${
                isForcedMobile ? 'px-2 py-1 min-w-[42px] text-center text-sm' : 'px-3 py-1.5'
              }`}
            >
              {pad(timeLeft.hours)}
            </div>
            <span className="text-[10px] uppercase font-sans text-amber-200 mt-1 font-semibold">
              Giờ
            </span>
          </div>
          <span className="text-amber-300 mb-4 font-bold text-sm">:</span>
          <div className="flex flex-col items-center">
            <div
              className={`bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-inner ${
                isForcedMobile ? 'px-2 py-1 min-w-[42px] text-center text-sm' : 'px-3 py-1.5'
              }`}
            >
              {pad(timeLeft.minutes)}
            </div>
            <span className="text-[10px] uppercase font-sans text-amber-200 mt-1 font-semibold">
              Phút
            </span>
          </div>
          <span className="text-amber-300 mb-4 font-bold text-sm">:</span>
          <div className="flex flex-col items-center">
            <div
              className={`bg-black/40 backdrop-blur-md rounded-lg border border-white/10 shadow-inner text-amber-300 ${
                isForcedMobile ? 'px-2 py-1 min-w-[42px] text-center text-sm' : 'px-3 py-1.5'
              }`}
            >
              {pad(timeLeft.seconds)}
            </div>
            <span className="text-[10px] uppercase font-sans text-amber-200 mt-1 font-semibold">
              Giây
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
