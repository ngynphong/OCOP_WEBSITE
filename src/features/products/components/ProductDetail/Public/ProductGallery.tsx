'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/features/products/types/productTypes';

interface ProductGalleryProps {
  images?: ProductImage[];
  name: string;
  videoUrl?: string;
}

export function ProductGallery({
  images = [],
  name,
  videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-farmer-walking-through-a-field-of-wheat-4428-large.mp4',
}: ProductGalleryProps) {
  const [activeMedia, setActiveMedia] = useState<{
    type: 'IMAGE' | 'VIDEO';
    url: string;
    id?: number | string;
  }>({
    type: 'IMAGE',
    url:
      images.find((img) => img.isPrimary)?.url ||
      images[0]?.url ||
      '/images/placeholder-product.jpg',
    id: images.find((img) => img.isPrimary)?.id || images[0]?.id,
  });

  const sortedImages = [...images].sort((a, b) => a.sortOrder - b.sortOrder);

  if (!images.length && !videoUrl) {
    return (
      <div className="w-full aspect-square bg-stone-100 rounded-3xl flex items-center justify-center">
        <span className="text-stone-400">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Main Display */}
      <div className="w-full relative aspect-square rounded-[2.5rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-sm group">
        {activeMedia.type === 'VIDEO' ? (
          <video
            src={activeMedia.url}
            controls
            autoPlay
            muted
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <Image
            src={activeMedia.url}
            alt={name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-1000 ease-out"
          />
        )}

        {/* Badge Overlay */}
        <div className="absolute top-6 left-6">
          <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-stone-100 flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-widest text-stone-900">
              Premium OCOP
            </span>
          </div>
        </div>
      </div>

      {/* Thumbnails Row */}
      <div className="flex flex-wrap gap-4 px-2">
        {/* Video Thumbnail (Always first if exists) */}
        {videoUrl && (
          <button
            onClick={() => setActiveMedia({ type: 'VIDEO', url: videoUrl })}
            className={cn(
              'relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 group',
              activeMedia.type === 'VIDEO'
                ? 'border-green-600 ring-4 ring-green-50 shadow-lg'
                : 'border-transparent bg-stone-100 hover:border-stone-200',
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-stone-900/20 group-hover:bg-stone-900/10 z-10">
              <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm">
                <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-8 border-l-green-700 border-b-[5px] border-b-transparent ml-0.5" />
              </div>
            </div>
            <video src={videoUrl} className="w-full h-full object-cover grayscale-[0.5]" />
          </button>
        )}

        {/* Image Thumbnails */}
        {sortedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setActiveMedia({ type: 'IMAGE', url: image.url, id: image.id })}
            className={cn(
              'relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300',
              activeMedia.type === 'IMAGE' && activeMedia.id === image.id
                ? 'border-green-600 ring-4 ring-green-50 shadow-lg'
                : 'border-transparent bg-stone-50 hover:border-stone-200',
            )}
          >
            <Image
              src={image.thumbnailUrl || image.url || '/images/placeholder-product.jpg'}
              alt={image.altText || name}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
