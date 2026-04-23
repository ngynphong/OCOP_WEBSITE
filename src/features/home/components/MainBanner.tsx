'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useBannersQuery } from '../hooks/useHome';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export const MainBanner = memo(function MainBanner() {
  const { data: bannersResp, isLoading } = useBannersQuery();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const bannersData = bannersResp?.data;
  const banners = (Array.isArray(bannersData) ? bannersData : []).filter((b) => b.type === 'MAIN');

  useEffect(() => {
    if (banners.length > 0 && isAutoPlay) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length, isAutoPlay]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] md:h-[450px] lg:h-[500px] bg-stone-100 animate-pulse rounded-[32px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#0D631B] animate-spin" />
      </div>
    );
  }

  if (banners.length === 0) return null;

  const handleNext = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handlePrev = () => {
    setIsAutoPlay(false);
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="relative w-full group overflow-hidden rounded-[32px] shadow-2xl shadow-emerald-900/10">
      <div className="relative w-full aspect-[21/9] md:aspect-[21/7] lg:h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={banners[currentIndex].id}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <Link href={banners[currentIndex].link || '#'}>
              <div className="relative w-full h-full">
                {/* Desktop Image */}
                <div className="hidden md:block w-full h-full">
                  <Image
                    src={banners[currentIndex].imageUrl}
                    alt={banners[currentIndex].title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
                {/* Mobile Image */}
                <div className="block md:hidden w-full h-full">
                  <Image
                    src={banners[currentIndex].imageMobileUrl || banners[currentIndex].imageUrl}
                    alt={banners[currentIndex].title}
                    fill
                    priority
                    className="object-cover"
                  />
                </div>

                {/* Overlay text if needed - Can be customized per banner design */}
                <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent flex flex-col justify-center px-8 md:px-16">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="max-w-lg"
                  >
                    <h2 className="text-white text-3xl md:text-5xl font-black mb-4 drop-shadow-lg leading-tight">
                      {banners[currentIndex].title}
                    </h2>
                    <p className="text-white/90 text-sm md:text-lg mb-8 drop-shadow-md line-clamp-2">
                      {banners[currentIndex].description}
                    </p>
                  </motion.div>
                </div>
              </div>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 z-20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white/40 z-20"
        >
          <ChevronRight size={24} />
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-20">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlay(false);
                setCurrentIndex(index);
              }}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === currentIndex ? 'w-10 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});
