'use client';

import { useState, useEffect, memo } from 'react';
import {
  Apple,
  Citrus,
  Grape,
  Carrot,
  Package,
  Store,
  Map,
  LucideIcon,
  QrCode,
  Leaf,
} from 'lucide-react';
import { MainBanner } from './MainBanner';

const floatingIcons = [
  { Icon: Apple, top: '10%', left: '5%', size: 40, delay: '0s', duration: '4s' },
  { Icon: Leaf, top: '25%', right: '10%', size: 30, delay: '1s', duration: '5s' },
  { Icon: Carrot, bottom: '15%', left: '12%', size: 35, delay: '2s', duration: '4.5s' },
  { Icon: Citrus, top: '60%', right: '5%', size: 45, delay: '0.5s', duration: '6s' },
  { Icon: Grape, top: '40%', left: '48%', size: 25, delay: '1.5s', duration: '5.5s' },
  { Icon: Leaf, bottom: '5%', right: '45%', size: 20, delay: '0s', duration: '4s' },
];

export const HeroSection = memo(function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  return (
    <section className="relative w-full bg-[#113B28] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#9C6644]/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {isMounted &&
          floatingIcons.map(({ Icon, top, left, right, bottom, size, delay, duration }, index) => (
            <div
              key={index}
              className="absolute text-emerald-50/30 animate-float-y"
              style={
                {
                  top,
                  left,
                  right,
                  bottom,
                  width: size,
                  height: size,
                  '--float-delay': delay,
                  '--float-duration': duration,
                } as React.CSSProperties
              }
            >
              <div
                className="animate-slow-rotate"
                style={
                  {
                    '--float-duration': duration,
                  } as React.CSSProperties
                }
              >
                <Icon size={size} strokeWidth={2} />
              </div>
            </div>
          ))}
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* Left Column */}
        <div className="w-full lg:w-4/12 flex flex-col justify-start items-start">
          <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-flex items-center gap-2 mb-8 backdrop-blur-sm">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-white/90 text-[10px] md:text-xs font-bold tracking-widest uppercase">
              Nền tảng TMĐT OCOP Việt Nam
            </span>
          </div>

          <h1 className="text-white text-5xl md:text-6xl font-black font-sans tracking-tight leading-none mb-4">
            OCOP
            <span className="text-[#D4AF37] text-3xl md:text-4xl block mt-1">IES Connect</span>
          </h1>

          <p className="text-emerald-50/80 text-sm md:text-base max-w-sm mb-10 font-sans leading-relaxed">
            Kết nối nông dân • Người tiêu dùng
            <br />
            Truy xuất nguồn gốc qua QR
          </p>
          <div className="w-full grid grid-cols-2 gap-y-6 gap-x-4">
            <StatItem value="12K+" label="Sản phẩm OCOP" icon={Package} />
            <StatItem value="3.400+" label="Cửa hàng" icon={Store} />
            <StatItem value="63" label="Tỉnh thành" icon={Map} />
            <StatItem value="QR" label="Truy xuất" icon={QrCode} />
          </div>
        </div>

        {/* Right Carousel Column (now MainBanner) */}
        <div className="w-full lg:w-8/12 flex justify-center lg:justify-end items-center mt-12 lg:mt-0 relative h-[300px] md:h-[400px] lg:h-[500px]">
          <MainBanner />
        </div>
      </div>
    </section>
  );
});

const StatItem = memo(
  ({ value, label, icon: Icon }: { value: string; label: string; icon: LucideIcon }) => (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-[#D4AF37]" />
      </div>
      <div className="flex flex-col">
        <p className="text-[#D4AF37] text-xl md:text-2xl font-black font-sans tracking-tight leading-none">
          {value}
        </p>
        <p className="text-white/70 text-[10px] md:text-xs mt-1 font-medium tracking-wide leading-tight">
          {label}
        </p>
      </div>
    </div>
  ),
);
StatItem.displayName = 'StatItem';
