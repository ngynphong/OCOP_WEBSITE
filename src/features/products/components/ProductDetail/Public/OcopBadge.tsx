'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OcopBadgeProps {
  stars: number;
  className?: string;
}

export function OcopBadge({ stars, className }: OcopBadgeProps) {
  if (!stars) return null;

  return (
    <div
      className={cn(
        'flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-stone-100 w-fit',
        className,
      )}
    >
      <div className="relative w-8 h-8 shrink-0">
        <Image
          src="/images/logo-ocop-rm.jpg"
          alt="OCOP Certification"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain"
        />
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 leading-none mb-1">
          Chứng nhận
        </span>
        <div className="flex items-center gap-1">
          <span className="text-sm font-black text-stone-900 leading-none">OCOP {stars} SAO</span>
          <div className="flex items-center ml-1">
            {Array.from({ length: stars }).map((_, i) => (
              <svg key={i} className="w-3 h-3 text-amber-500 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
