'use client';

import { useBannersQuery } from '../hooks/useHome';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { memo } from 'react';

export const AmbientBackground = memo(function AmbientBackground() {
  const { data: bannerResp } = useBannersQuery();
  const activeBanner = bannerResp?.data?.[0];

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBanner?.imageUrl || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {/* Main Ambient Image - Lower blur to make it recognizable */}
          <div className="absolute inset-0 origin-center">
            {/* Desktop Background */}
            <div className="hidden md:block absolute inset-0">
              <Image
                src={activeBanner?.imageUrl || '/images/background.jpg'}
                alt="Event Background"
                fill
                priority
                className="object-cover blur-[3px] saturate-[1.5] brightness-90"
                sizes="100vw"
              />
            </div>
            {/* Mobile Background */}
            <div className="block md:hidden absolute inset-0">
              <Image
                src={
                  activeBanner?.imageMobileUrl || activeBanner?.imageUrl || '/images/background.jpg'
                }
                alt="Event Background Mobile"
                fill
                priority
                className="object-cover blur-[3px] saturate-[1.5] brightness-90"
                sizes="100vw"
              />
            </div>
          </div>

          {/* Subtle noise texture */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/images/stardust.png')]" />

          {/* Darker overlay to ensure text readability */}
          <div className="absolute inset-0 bg-stone-900/5" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
});
