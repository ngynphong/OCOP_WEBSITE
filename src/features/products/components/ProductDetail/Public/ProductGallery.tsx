'use client';

import React, { useState, useMemo, memo, useCallback } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ProductImage } from '@/features/products/types/productTypes';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGalleryProps {
  images?: ProductImage[];
  name: string;
}

export const ProductGallery = memo(function ProductGallery({
  images = [],
  name,
}: ProductGalleryProps) {
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.sortOrder - b.sortOrder),
    [images],
  );

  const mediaList = useMemo(() => {
    const list: { type: 'IMAGE'; url: string; id?: number | string }[] = [];
    sortedImages.forEach((img) => {
      list.push({ type: 'IMAGE', url: img.url, id: img.id });
    });
    if (list.length === 0) {
      list.push({ type: 'IMAGE', url: '/images/fresh-green-produce.jpg', id: 'fallback' });
    }
    return list;
  }, [sortedImages]);

  const [activeMedia, setActiveMedia] = useState<{
    type: 'IMAGE';
    url: string;
    id?: number | string;
  }>(mediaList[0]);

  const currentIndex = mediaList.findIndex(
    (m) => m.type === activeMedia.type && (m.id === activeMedia.id || m.url === activeMedia.url),
  );

  const handlePrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentIndex > 0) {
        setActiveMedia(mediaList[currentIndex - 1]);
      } else {
        setActiveMedia(mediaList[mediaList.length - 1]);
      }
    },
    [currentIndex, mediaList],
  );

  const handleNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (currentIndex < mediaList.length - 1) {
        setActiveMedia(mediaList[currentIndex + 1]);
      } else {
        setActiveMedia(mediaList[0]);
      }
    },
    [currentIndex, mediaList],
  );

  if (!images.length) {
    return (
      <div className="w-full aspect-square bg-stone-100 rounded-3xl flex items-center justify-center">
        <span className="text-stone-400">Không có hình ảnh</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Display */}
      <div className="w-full max-h-[500px] aspect-square relative rounded-3xl overflow-hidden bg-stone-50 border border-stone-100 shadow-sm group">
        <Image
          src={activeMedia.url}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain scale-105 p-4 group-hover:scale-110 transition-transform duration-1000 ease-out"
        />

        {/* Navigation Arrows */}
        {mediaList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:text-green-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 mr-0.5" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm shadow-md rounded-full flex items-center justify-center text-stone-600 hover:bg-white hover:text-green-600 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 ml-0.5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails Row */}
      <div className="flex flex-wrap gap-4 px-2">
        {/* Image Thumbnails */}
        {sortedImages.map((image) => (
          <button
            key={image.id}
            onClick={() => setActiveMedia({ type: 'IMAGE', url: image.url, id: image.id })}
            className={cn(
              'relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300',
              activeMedia.type === 'IMAGE' && activeMedia.id === image.id
                ? 'border-green-600 ring-4 ring-green-50 shadow-md'
                : 'border-transparent bg-stone-50 hover:border-stone-200',
            )}
          >
            <Image
              src={image.thumbnailUrl || image.url || '/images/placeholder-product.jpg'}
              alt={image.altText || name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
});
