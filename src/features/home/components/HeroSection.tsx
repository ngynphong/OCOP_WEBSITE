'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBannersQuery } from '../hooks/useHome';
import { Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const HeroSection = memo(function HeroSection() {
  const { data: bannersResp, isLoading } = useBannersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const bannersData = bannersResp?.data;
  const banners = (Array.isArray(bannersData) ? bannersData : []).filter((b) => b.type === 'MAIN');

  useEffect(() => {
    if (banners.length > 0 && isAutoPlay) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [banners.length, isAutoPlay]);

  if (isLoading) {
    return (
      <div className="w-full h-[85vh] min-h-[600px] max-h-[900px] bg-stone-900 animate-pulse flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-stone-500 animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section className="relative w-full h-[calc(100vh-72px)] lg:h-[calc(100vh-80px)] min-h-[500px] max-h-[900px] overflow-hidden bg-[#113B28]">
      {/* Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 z-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={banners[currentIndex].imageUrl}
              alt={banners[currentIndex].title || 'OCOP Banner'}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/60" />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-10 flex flex-col justify-between w-full h-full py-8 md:py-12 lg:py-16 px-6 md:px-12 lg:px-24">
        {/* Top Row */}
        <div className="flex justify-end items-start w-full gap-8 pointer-events-none">
          {/* Top Right - Stats & Description */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-start md:items-end md:text-right max-w-sm mt-4 md:mt-8 bg-black/30 backdrop-blur-md border border-white/10 p-6 rounded-2xl pointer-events-auto"
          >
            <p className="text-white/90 text-sm md:text-base font-sans tracking-wide leading-relaxed mb-6 drop-shadow-md">
              Kết nối nông dân và người tiêu dùng qua nền tảng thương mại điện tử chuyên biệt. Truy
              xuất nguồn gốc dễ dàng qua mã QR.
            </p>
            <Link href="/san-pham">
              <span className="group inline-flex items-center gap-2 text-white/70 hover:text-white uppercase tracking-[0.2em] text-[10px] md:text-xs transition-colors cursor-pointer pb-1 border-b border-white/30 hover:border-white">
                Khám phá sản phẩm
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Dynamic Center is removed to clear the center space for the banner */}
        <div className="flex-1" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-end w-full gap-8">
          {/* Bottom Left - Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex items-center gap-6 text-white/80 font-[family-name:var(--font-playfair)] tracking-widest"
          >
            <span className="text-sm md:text-base">
              {String(currentIndex + 1).padStart(2, '0')}
            </span>
            <div
              className="w-24 md:w-48 h-[1px] bg-white/30 overflow-hidden relative cursor-pointer"
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex((prev) => (prev + 1) % banners.length);
              }}
            >
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: '0%' }}
                animate={{ width: isAutoPlay ? '100%' : '0%' }}
                transition={{ duration: 6, ease: 'linear', repeat: isAutoPlay ? Infinity : 0 }}
                key={`progress-${currentIndex}`}
              />
            </div>
            <span className="text-sm md:text-base">{String(banners.length).padStart(2, '0')}</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
