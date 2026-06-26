'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SearchBox } from '@/features/products/components/SearchBox';
import {
  usePublicProductsQuery,
  useFeaturedStoryQuery,
} from '@/features/products/hooks/usePublicProducts';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, ArrowRight, Loader2, BookOpen, Sparkles } from 'lucide-react';

export default function StoryLandingPage() {
  const [selectedProvince] = useState<number | undefined>(undefined);
  const { data: productsRes, isLoading } = usePublicProductsQuery({
    pageSize: 12,
    provinceId: selectedProvince,
    // We want products that likely have stories
    sort: 'viewCount,desc',
  });

  const { data: featuredStoryRes } = useFeaturedStoryQuery();
  const featuredStory = featuredStoryRes?.data;

  const products = productsRes?.data?.items || [];

  return (
    <div className="min-h-screen bg-[#FCF8F2]">
      <Header />

      <main className="pb-24">
        {/* Hero Section */}
        <section className="relative min-h-[60vh] py-32 md:py-0 flex items-center justify-center bg-[#113B28] z-30">
          <div className="absolute inset-0 opacity-40">
            <Image
              src="/images/story-bg.jpg"
              alt="Story Background"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-[#113B28]/80" />

          <div className="relative z-10 text-center max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-white text-5xl md:text-6xl font-black mb-6 italic">
                Hành trình Tinh hoa OCOP
              </h1>
              <p className="text-emerald-50/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                Đằng sau mỗi sản phẩm OCOP là một câu chuyện về tâm huyết, văn hóa và khát vọng của
                người nông dân Việt Nam.
              </p>

              <div className="w-full max-w-xl mx-auto">
                <SearchBox variant="hero" />
                <p className="mt-4 text-emerald-100/40 text-xs uppercase tracking-widest font-bold">
                  Khám phá câu chuyện qua tên sản phẩm hoặc địa danh
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Product Selection Grid */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-20 relative z-20">
          <div className="bg-white rounded-xl shadow-2xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
              <div>
                <h2 className="text-3xl font-black text-[#113B28] mb-2">
                  Chọn câu chuyện bạn muốn nghe
                </h2>
                <p className="text-stone-400 font-medium">
                  Danh sách các sản phẩm tiêu biểu có hành trình minh bạch
                </p>
              </div>
              <div className="flex items-center gap-4">{/* Province Filter could go here */}</div>
            </div>

            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-4 text-emerald-800">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="font-bold uppercase tracking-widest text-xs">
                  Đang tìm kiếm các câu chuyện...
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product, idx) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Link
                      href={`/cau-chuyen/${product.slug}`}
                      className="group block bg-stone-50 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-stone-100"
                    >
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={
                            product.thumbnailUrl || product.imageUrl || '/images/default-image.png'
                          }
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                          <Star className="w-3.5 h-3.5 text-[#D4AF37] fill-current" />
                          <span className="text-xs font-black text-[#113B28]">
                            {product.ocopStar} Sao
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <span className="text-white font-bold flex items-center gap-2">
                            Đọc câu chuyện <ArrowRight size={16} />
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-2">
                          <MapPin size={12} />
                          {product.provinceName}
                        </div>
                        <h3 className="text-lg font-black text-stone-800 mb-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-stone-400 text-xs line-clamp-2 leading-relaxed">
                          {product.shortDesc ||
                            'Khám phá hành trình tinh hoa của sản phẩm OCOP đặc thù này...'}
                        </p>

                        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BookOpen size={14} className="text-stone-400" />
                            <span className="text-xs font-bold text-stone-400 uppercase tracking-tighter">
                              {product.journals?.length || 5} Chương
                            </span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-sm">
                            <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {!isLoading && products.length === 0 && (
              <div className="py-24 text-center">
                <p className="text-stone-400">Không tìm thấy câu chuyện nào phù hợp.</p>
              </div>
            )}
          </div>
        </section>

        {/* Featured Story of the Month */}
        {featuredStory && (
          <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-[48px] overflow-hidden bg-[#113B28] min-h-[500px] flex items-center"
            >
              <div className="absolute inset-0 opacity-30">
                <Image
                  src={
                    featuredStory.storyImage ||
                    featuredStory.thumbnailUrl ||
                    '/images/default-image.png'
                  }
                  alt={featuredStory.storyTitle || featuredStory.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <div className="relative z-10 w-full md:w-1/2 p-12 md:p-20 space-y-6">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-1.5 bg-[#D4AF37] text-[#113B28] rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Sparkles size={12} fill="currentColor" /> Câu chuyện nổi bật
                  </span>
                </div>
                <h3 className="text-white text-4xl md:text-5xl font-black  italic leading-tight">
                  {featuredStory.storyTitle || featuredStory.name}
                </h3>
                <p className="text-emerald-50/70 text-lg leading-relaxed line-clamp-3">
                  {featuredStory.shortDesc}
                </p>
                <Link
                  href={`/cau-chuyen/${featuredStory.slug}`}
                  className="inline-flex items-center gap-3 bg-white text-[#113B28] px-8 py-4 rounded-full font-black hover:bg-[#D4AF37] transition-all group"
                >
                  Khám phá ngay{' '}
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
