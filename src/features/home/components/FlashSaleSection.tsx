'use client';

import Link from 'next/link';
import { ChevronRight, Zap } from 'lucide-react';
import { FlashSaleCard } from '@/components/ui/FlashSaleCard';
import { useActiveFlashSales } from '@/features/flash-sale/hooks/useFlashSales';
import { CountdownTimer } from './CountdownTimer';
import Image from 'next/image';

export function FlashSaleSection() {
  const { data, isPending, isError } = useActiveFlashSales();

  // Lấy Flash Sale đầu tiên đang diễn ra (nếu có)
  const activeFlashSale = data?.data && data.data.length > 0 ? data.data[0] : null;
  const items = activeFlashSale?.items || [];
  const targetDate = activeFlashSale ? new Date(activeFlashSale.endTime) : null;

  if (isPending) {
    return (
      <section className="w-full max-w-7xl mx-auto my-8 px-6">
        <div className="w-full h-64 bg-stone-100 animate-pulse rounded-[32px]" />
      </section>
    );
  }

  if (isError || !activeFlashSale) return null;

  return (
    <section className="w-full max-w-7xl mx-auto my-8 px-6">
      <div className="relative w-full overflow-hidden rounded-[32px] border border-red-200/50 shadow-2xl shadow-red-900/10">
        {/* Premium Banner Background Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src={activeFlashSale?.bannerUrl || '/images/flash-sale-banner-v2.png'}
            alt={activeFlashSale?.name || 'Flash Sale Banner'}
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-r from-red-100/90 via-red-50/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-6 md:px-12 py-10 flex flex-col justify-start items-start gap-8">
          <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-600/30">
                  <Zap className="text-white fill-current w-6 h-6" />
                </div>
                <h2 className="text-stone-800 text-3xl font-black tracking-tight">
                  GIÁ HỜI MỖI NGÀY
                </h2>
              </div>

              <div className="flex justify-start items-center gap-3 bg-white/60 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/40 border-b-2 border-b-red-200">
                <span className="text-red-600 text-xs font-black uppercase tracking-widest">
                  Kết thúc sau
                </span>
                {targetDate && <CountdownTimer targetDate={targetDate} />}
              </div>
            </div>

            <Link
              href="/flash-sale"
              className="group flex justify-start items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-2xl text-base font-bold shadow-lg shadow-red-600/20 hover:bg-red-700 transition-all hover:scale-105"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 snap-x hide-scrollbar">
            <div className="flex gap-4 sm:gap-6 w-max">
              {items.map((item) => (
                <div key={item.id} className="snap-start pt-2">
                  <FlashSaleCard
                    name={item.productName}
                    price={item.salePrice}
                    oldPrice={item.originalPrice}
                    discountPercent={item.discountPercent}
                    soldPercent={Math.round((item.qtySold / item.qtyLimit) * 100)}
                    image={item.thumbnailUrl}
                    slug={item.productSlug || item.variantId.toString()}
                    className="w-64 min-w-[16rem]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
