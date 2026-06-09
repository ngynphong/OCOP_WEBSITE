'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useBannersQuery } from '../hooks/useHome';
import { motion } from 'framer-motion';

export const SubBanners = memo(function SubBanners() {
  const { data: bannersResp, isLoading } = useBannersQuery();

  const bannersData = bannersResp?.data;
  const subBanners = (Array.isArray(bannersData) ? bannersData : [])
    .filter((b) => b.type === 'SUB')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (isLoading || subBanners.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 lg:px-8">
      <div
        className={`grid gap-6 ${
          subBanners.length === 1
            ? 'grid-cols-1'
            : subBanners.length === 2
              ? 'grid-cols-1 md:grid-cols-2'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}
      >
        {subBanners.map((banner) => (
          <motion.div
            key={banner.id}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
            className="relative aspect-[16/7] md:aspect-[16/6] rounded-xl overflow-hidden shadow-lg shadow-stone-200/50 group"
          >
            <Link href={banner.link || '#'}>
              <div className="relative w-full h-full">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-1 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {banner.title}
                  </h3>
                  <p className="text-white/80 text-xs md:text-sm line-clamp-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {banner.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
});
