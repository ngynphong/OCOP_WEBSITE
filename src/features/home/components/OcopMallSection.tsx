'use client';

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, ShieldCheck, ChevronRight, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFeaturedShopsQuery } from '@/features/shop/hooks/usePublicShop';
import { ShopInfo } from '@/features/shop/types/shopTypes';

interface FeaturedShop extends ShopInfo {
  ocopStar?: number;
}

export const OcopMallSection = memo(function OcopMallSection() {
  const { data: shopsResp, isLoading } = useFeaturedShopsQuery(6);

  const shops = (shopsResp?.data?.length ? shopsResp.data : []) as FeaturedShop[];

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-8">
        <div className="h-64 w-full bg-stone-100 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-[#113B28] text-white px-4 py-1.5 rounded-full shadow-lg">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-sm font-black tracking-widest uppercase">OCOP MALL</span>
            </div>
          </div>
          <Link
            href="/shops"
            className="flex items-center gap-1 text-green-900 hover:text-green-700 font-bold transition-colors"
          >
            Xem thêm <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shops.map((shop) => (
            <motion.div
              key={shop.id}
              whileHover={{ y: -6 }}
              className="group relative bg-white/60 backdrop-blur-md border border-white/40 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-900/5 transition-all duration-500"
            >
              {/* Card Header Background - Using shop.bannerUrl if available */}
              <div className="h-28 bg-linear-to-br from-[#113B28] to-[#1a4d35] relative overflow-hidden">
                {shop.bannerUrl ? (
                  <Image
                    src={shop.bannerUrl}
                    alt={shop.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
                )}
                <div className="absolute top-4 right-6 flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <Star className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
                  <span className="text-white text-[10px] font-bold">
                    {shop.ratingAvg?.toFixed(1) || '0.0'} ({shop.totalReviews || 0})
                  </span>
                </div>
              </div>

              {/* Shop Info Container */}
              <div className="px-6 pb-6 pt-0 relative">
                {/* Logo Overlap */}
                <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-xl p-2 shadow-xl border border-stone-100 group-hover:scale-105 transition-transform duration-500">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={shop.logoUrl || '/images/logo.png'}
                      alt={shop.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain scale-130"
                    />
                  </div>
                </div>

                <div className="ml-24 pt-2">
                  <h3 className="text-lg font-black text-stone-900 line-clamp-1 group-hover:text-green-800 transition-colors">
                    {shop.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-bold border border-amber-100">
                      OCOP {shop.ocopStar || 4}★
                    </span>
                    <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-stone-300" />
                      {shop.districtName}, {shop.provinceName}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-sm text-stone-500 line-clamp-2 leading-relaxed h-10 italic">
                  &quot;{shop.description}&quot;
                </p>

                <div className="mt-6 pt-6 border-t border-stone-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-3">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-9 h-9 rounded-full border-2 border-white bg-stone-100 overflow-hidden shadow-sm"
                        >
                          <Image
                            src={`/images/tra-do-uong.jpg`}
                            alt="Product"
                            width={36}
                            height={36}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 font-bold ml-1">+4 SP</span>
                  </div>

                  <Link
                    href={`/cua-hang/${shop.slug}`}
                    className="flex items-center gap-2 bg-[#113B28] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#1a4d35] transition-all shadow-lg shadow-green-900/10 active:scale-95"
                  >
                    <Store className="w-3.5 h-3.5" /> Vào shop
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

OcopMallSection.displayName = 'OcopMallSection';
