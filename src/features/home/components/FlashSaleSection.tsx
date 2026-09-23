'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { FlashSaleCard } from '@/components/ui/FlashSaleCard';
import { useActiveFlashSales } from '@/features/flash-sale/hooks/useFlashSales';
import { CountdownTimer } from './CountdownTimer';
import { FlashSaleQuickBuyModal } from '@/features/flash-sale/components/FlashSaleQuickBuyModal';
import { FlashSaleItem } from '@/features/flash-sale/types';

export function FlashSaleSection() {
  const { data, isPending, isError } = useActiveFlashSales();
  const [isQuickBuyModalOpen, setIsQuickBuyModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FlashSaleItem | null>(null);

  const handleQuickBuy = (item: FlashSaleItem) => {
    setSelectedItem(item);
    setIsQuickBuyModalOpen(true);
  };

  const activeFlashSale = data?.data && data.data.length > 0 ? data.data[0] : null;
  const items = activeFlashSale?.items || [];
  const targetDate = activeFlashSale ? new Date(activeFlashSale.endTime) : null;

  if (isPending) {
    return (
      <section className="w-full max-w-7xl mx-auto my-8 px-6">
        <div className="w-full h-64 bg-stone-100 animate-pulse rounded-xl" />
      </section>
    );
  }

  if (isError || !activeFlashSale) return null;

  return (
    <section className="w-full max-w-7xl mx-auto my-8 px-6">
      <div className="relative w-full overflow-hidden rounded-xl border border-red-200/50 shadow-2xl shadow-red-900/10">
        <div className="absolute inset-0 z-0">
          <Image
            src={activeFlashSale?.bannerUrl || '/images/flash-sale-banner-v2.png'}
            alt={activeFlashSale?.name || 'Flash Sale Banner'}
            fill
            sizes="(max-width: 768px) 100vw, 100vw"
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-linear-to-r from-red-100/90 via-red-50/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full px-4 md:px-8 py-5 sm:py-6 flex flex-col justify-start items-start gap-4 sm:gap-5">
          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <h2 className="text-stone-900 text-xl sm:text-2xl font-black tracking-tight">
                  GIÁ HỜI MỖI NGÀY
                </h2>
              </div>

              <div className="flex justify-start items-center gap-2 bg-white/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/50 border-b-2 border-b-red-200">
                <span className="text-red-600 text-[11px] font-black uppercase tracking-wider">
                  Kết thúc sau
                </span>
                {targetDate && <CountdownTimer targetDate={targetDate} />}
              </div>
            </div>

            <Link
              href="/flash-sale"
              className="group flex items-center gap-1 text-xs sm:text-sm font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>Xem tất cả</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="w-full overflow-x-auto pb-2 -mx-2 px-2 snap-x hide-scrollbar">
            <div className="flex gap-2.5 sm:gap-3 w-max">
              {items.map((item) => (
                <div key={item.id} className="snap-start pt-1">
                  <FlashSaleCard
                    name={item.productName}
                    price={item.salePrice}
                    oldPrice={item.originalPrice}
                    discountPercent={item.discountPercent}
                    soldPercent={Math.round((item.qtySold / item.qtyLimit) * 100)}
                    image={item.thumbnailUrl}
                    slug={item.productSlug || item.variantId.toString()}
                    productId={item.productId}
                    className="w-[170px] sm:w-[185px] min-w-[170px] sm:min-w-[185px]"
                    onBuyClick={() => handleQuickBuy(item)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {selectedItem && (
        <FlashSaleQuickBuyModal
          isOpen={isQuickBuyModalOpen}
          onClose={() => setIsQuickBuyModalOpen(false)}
          item={selectedItem}
        />
      )}
    </section>
  );
}
