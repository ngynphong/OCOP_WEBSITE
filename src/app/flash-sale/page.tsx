'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  useActiveFlashSales,
  useUpcomingFlashSales,
} from '@/features/flash-sale/hooks/useFlashSales';
import { usePublicCategoriesQuery } from '@/features/products/hooks/usePublicProducts';
import { FlashSaleCard } from '@/components/ui/FlashSaleCard';
import { CountdownTimer } from '@/features/home/components/CountdownTimer';
import { Zap, Timer, Flame, LayoutGrid, Calendar } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function FlashSalePage() {
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const { data: activeData, isPending: activePending } = useActiveFlashSales(selectedCategory);
  const { data: upcomingData, isPending: upcomingPending } =
    useUpcomingFlashSales(selectedCategory);
  const { data: categoriesData } = usePublicCategoriesQuery();

  const activeFlashSales = activeData?.data || [];
  const upcomingFlashSales = upcomingData?.data || [];
  const categories = categoriesData?.data || [];

  // Get the main active sale for the hero
  const mainSale = activeFlashSales.length > 0 ? activeFlashSales[0] : null;
  const targetDate = mainSale ? new Date(mainSale.endTime) : null;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section - Brighter & More Vibrant */}
        <section className="relative w-full overflow-hidden pt-16 pb-24 px-6">
          {/* Vibrant Gradient Background */}
          <div className="absolute inset-0 bg-linear-to-br from-red-600 via-orange-500 to-amber-500" />

          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src={mainSale?.bannerUrl || '/images/flash-sale-banner-v2.png'}
              alt="Flash Sale Hero"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center gap-2 mb-6 shadow-sm"
            >
              <Zap className="w-4 h-4 text-white fill-current" />
              <span className="text-white text-[10px] md:text-xs font-black uppercase tracking-widest">
                Siêu khuyến mãi OCOP
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-10 tracking-tighter drop-shadow-2xl"
            >
              FLASH <span className="text-transparent font-outline tracking-wider">SALE</span>{' '}
              <span className="text-white">OCOP</span>
            </motion.h1>

            {mainSale && targetDate && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/95 backdrop-blur-xl p-8 md:p-10 rounded-[40px] shadow-2xl shadow-red-900/20 border border-white"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2 text-red-600 font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
                    <Timer className="w-4 h-4" />
                    <span>Kết thúc sau</span>
                  </div>
                  <div className="scale-125 md:scale-150 transform origin-center py-4">
                    <CountdownTimer targetDate={targetDate} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Category Ribbon - Sticky */}
        <div className="sticky top-16 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm overflow-x-auto hide-scrollbar">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedCategory(undefined)}
              className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === undefined
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tất cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">
          {/* Active Flash Sales Section */}
          <section id="active-sales">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2.5 rounded-2xl">
                  <Flame className="w-6 h-6 text-red-600 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight leading-none">
                    ĐANG DIỄN RA
                  </h2>
                  <p className="text-stone-500 text-sm font-medium mt-1">
                    Nhanh tay kẻo lỡ - Số lượng có hạn
                  </p>
                </div>
              </div>
            </div>

            {activePending ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-stone-200 animate-pulse rounded-2xl h-80" />
                ))}
              </div>
            ) : activeFlashSales.length > 0 ? (
              <div className="flex flex-col gap-12">
                {activeFlashSales.map((sale) => (
                  <div key={sale.id} className="flex flex-col gap-6">
                    {activeFlashSales.length > 1 && (
                      <h3 className="text-lg font-black text-stone-800 border-l-4 border-red-600 pl-4">
                        {sale.name}
                      </h3>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                      {sale.items.map((item) => (
                        <FlashSaleCard
                          key={item.id}
                          name={item.productName}
                          price={item.salePrice}
                          oldPrice={item.originalPrice}
                          discountPercent={item.discountPercent}
                          soldPercent={Math.round((item.qtySold / item.qtyLimit) * 100)}
                          image={item.thumbnailUrl}
                          slug={item.productSlug || item.variantId.toString()}
                          productId={item.productId}
                          className="w-full"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-20 bg-white rounded-[32px] border border-stone-200 flex flex-col items-center justify-center text-center px-6">
                <div className="bg-stone-100 p-6 rounded-full mb-6">
                  <LayoutGrid className="w-12 h-12 text-stone-300" />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-stone-500 max-w-sm">
                  Hiện tại chưa có chương trình Flash Sale nào đang diễn ra trong danh mục này.
                </p>
              </div>
            )}
          </section>

          {/* Upcoming Flash Sales Section */}
          <section id="upcoming-sales" className="pt-8 border-t border-stone-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-2xl">
                  <Calendar className="w-6 h-6 text-blue-600 fill-current" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-stone-900 tracking-tight leading-none">
                    SẮP DIỄN RA
                  </h2>
                  <p className="text-stone-500 text-sm font-medium mt-1">
                    Lên lịch săn Deal - Ưu đãi sập sàn
                  </p>
                </div>
              </div>
            </div>

            {upcomingPending ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="bg-stone-200 animate-pulse rounded-2xl h-80" />
                ))}
              </div>
            ) : upcomingFlashSales.length > 0 ? (
              <div className="flex flex-col gap-12">
                {upcomingFlashSales.map((sale) => (
                  <div key={sale.id} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border border-blue-100 rounded-2xl">
                      <h3 className="text-sm font-black text-blue-800">{sale.name}</h3>
                      <span className="text-[10px] font-bold text-blue-600 bg-white px-3 py-1 rounded-full border border-blue-200 shadow-sm uppercase tracking-wider">
                        Bắt đầu lúc: {new Date(sale.startTime).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 opacity-90 grayscale-[0.5]">
                      {sale.items.map((item) => (
                        <FlashSaleCard
                          key={item.id}
                          name={item.productName}
                          price={item.salePrice}
                          oldPrice={item.originalPrice}
                          discountPercent={item.discountPercent}
                          soldPercent={0}
                          image={item.thumbnailUrl}
                          slug={item.productSlug || item.variantId.toString()}
                          productId={item.productId}
                          className="w-full"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full py-16 bg-stone-100/50 rounded-[32px] border border-stone-200/50 flex flex-col items-center justify-center text-center px-6 grayscale">
                <p className="text-stone-400 font-bold uppercase tracking-widest text-xs">
                  Hiện chưa có lịch trình Flash Sale mới
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Support Section */}
        <section className="bg-red-600 py-16 px-6">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8 text-white">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
              ĐỪNG BỎ LỠ CƠ HỘI SỞ HỮU SẢN PHẨM OCOP GIÁ TỐT
            </h2>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
              Hàng ngàn sản phẩm đạt chứng nhận OCOP từ khắp mọi miền tổ quốc đang được giảm giá
              kịch sàn. Tải app hoặc đăng ký nhận tin để không bao giờ bỏ lỡ Flash Sale!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-red-600 px-8 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
                XEM SẢN PHẨM MỚI
              </button>
              <button className="bg-red-700 text-white border border-red-500 px-8 py-4 rounded-2xl font-black shadow-xl hover:bg-red-800 transition-all">
                LIÊN HỆ HỖ TRỢ
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Styles for hidden scrollbar and custom text effects */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .font-outline {
          -webkit-text-stroke: 2px white;
        }
        @media (max-width: 768px) {
          .font-outline {
            -webkit-text-stroke: 1px white;
          }
        }
      `}</style>
    </div>
  );
}
