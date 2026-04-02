'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { FlashSaleCard } from '@/components/ui/FlashSaleCard';
import { useState, useEffect } from 'react';
import { CountdownTimer } from './CountdownTimer';

export function FlashSaleSection() {
  const [targetDate, setTargetDate] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const date = new Date();
      date.setHours(date.getHours() + 2); // Kết thúc sau 2 giờ
      setTargetDate(date);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const flashSaleItems = [
    {
      name: 'Hạt sen sấy giòn Đồng Tháp - Hũ 500g',
      price: 185000,
      oldPrice: 265000,
      discountPercent: 30,
      soldPercent: 80,
      image: '/images/fresh-green-produce.jpg',
    },
    {
      name: 'Nước mắm cá cơm Phan Thiết thượng hạng',
      price: 120000,
      oldPrice: 160000,
      discountPercent: 25,
      soldPercent: 45,
      image: '/images/fresh-green-produce.jpg',
    },
    {
      name: 'Chuối Ngự Tiến Vua Hà Nam - Combo 2 nải',
      price: 45000,
      oldPrice: 90000,
      discountPercent: 50,
      soldPercent: 95,
      image: '/images/fresh-green-produce.jpg',
    },
    {
      name: 'Bộ ấm trà gốm Bát Tràng men hỏa biến',
      price: 680000,
      oldPrice: 800000,
      discountPercent: 15,
      soldPercent: 20,
      image: '/images/fresh-green-produce.jpg',
    },
    {
      name: 'Bộ ấm trà gốm Bát Tràng men hỏa biến',
      price: 680000,
      oldPrice: 800000,
      discountPercent: 15,
      soldPercent: 20,
      image: '/images/fresh-green-produce.jpg',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto my-8 px-4 sm:px-6 md:px-0">
      <div className="w-full px-6 md:px-12 py-10 bg-red-100/60 rounded-[32px] flex flex-col justify-start items-start gap-8 border border-red-200">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-4 sm:gap-6">
            <h2 className="text-stone-800 text-3xl font-bold font-sans leading-9">
              Giá hời mỗi ngày
            </h2>
            <div className="flex justify-start items-center gap-2">
              {targetDate && <CountdownTimer targetDate={targetDate} />}
            </div>
          </div>

          <Link
            href="/flash-sale"
            className="group flex justify-start items-center gap-1 text-green-900 text-base font-bold font-sans hover:text-green-700 transition-colors"
          >
            <span>Xem tất cả</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 snap-x hide-scrollbar">
          <div className="flex gap-4 sm:gap-6 w-max">
            {flashSaleItems.map((item, index) => (
              <div key={index} className="snap-start pt-2">
                <FlashSaleCard
                  name={item.name}
                  price={item.price}
                  oldPrice={item.oldPrice}
                  discountPercent={item.discountPercent}
                  soldPercent={item.soldPercent}
                  image={item.image}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
