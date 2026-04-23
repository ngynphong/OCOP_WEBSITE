'use client';

import { memo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuickLinksQuery } from '@/features/home/hooks/useHome';
import { QuickLink } from '../api/homeApi';

export const QuickLinksRow = memo(function QuickLinksRow() {
  const { data: quickLinksResp, isLoading } = useQuickLinksQuery();

  // Dữ liệu từ API nằm trong quickLinksResp.data
  const quickLinks = Array.isArray(quickLinksResp?.data)
    ? (quickLinksResp.data as QuickLink[])
    : [];

  // Color palette for icons
  const colors = [
    'bg-amber-100 text-amber-600',
    'bg-red-100 text-red-600',
    'bg-yellow-100 text-yellow-600',
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-emerald-100 text-emerald-600',
    'bg-orange-100 text-orange-600',
    'bg-pink-100 text-pink-600',
  ];

  if (isLoading) {
    return (
      <section className="w-full max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-[32px] p-8 shadow-xl shadow-stone-200/50">
          <div className="grid grid-cols-4 md:grid-cols-8 gap-6 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 animate-pulse">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-stone-100 rounded-2xl" />
                <div className="w-12 h-2 bg-stone-100 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Fallback to empty state if no data
  if (quickLinks.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-4">
      <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-[32px] p-6 md:p-8 shadow-xl shadow-stone-200/50">
        <div className="flex items-center justify-between overflow-x-auto gap-8 md:grid md:grid-cols-8 md:gap-4 hide-scrollbar">
          {quickLinks.map((item, index) => (
            <Link
              key={item.id}
              href={item.url}
              className="flex flex-col items-center gap-3 group cursor-pointer min-w-[72px] md:min-w-0"
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={`w-12 h-12 md:w-16 md:h-16 ${colors[index % colors.length]} rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300 relative overflow-hidden`}
              >
                {item.iconUrl ? (
                  <div className="relative w-7 h-7 md:w-10 md:h-10">
                    <Image src={item.iconUrl} alt={item.label} fill className="object-contain" />
                  </div>
                ) : (
                  <ShoppingBag className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2} />
                )}
              </motion.div>
              <span className="text-[10px] md:text-xs font-bold text-stone-700 text-center line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
});

QuickLinksRow.displayName = 'QuickLinksRow';
