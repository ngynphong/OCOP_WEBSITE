'use client';

import React from 'react';
import Image from 'next/image';
import {
  useSellerImagesQuery,
  useSellerImageMutations,
} from '@/features/products/hooks/useSellerImages';
import { ProductImage } from '@/features/products/types/productTypes';

interface ImagesTabProps {
  productId: number;
}

export function ImagesTab({ productId }: ImagesTabProps) {
  const { data, isPending } = useSellerImagesQuery(productId);
  const { uploadImage, isUploading, deleteImage, isDeleting, setPrimaryImage, isSettingPrimary } =
    useSellerImageMutations(productId);

  const images: ProductImage[] = data?.data ?? [];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await uploadImage(file);
    e.target.value = '';
  };

  if (isPending) return <div className="h-48 bg-stone-100 rounded-xl animate-pulse" />;

  return (
    <div className="space-y-4">
      {/* Upload button */}
      <label className="flex items-center justify-center gap-2 w-full py-4 border-2 border-dashed border-stone-200 rounded-xl cursor-pointer hover:border-emerald-300 transition">
        <span className="text-sm font-bold text-stone-400">
          {isUploading ? ' Đang upload...' : '+ Upload ảnh mới'}
        </span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>

      {/* Images grid */}
      {images.length === 0 ? (
        <div className="flex items-center justify-center h-24 bg-stone-50 rounded-xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-sm">Chưa có ảnh nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {images.map((img) => (
            <div
              key={img.id}
              className={`relative group rounded-xl overflow-hidden border-2 transition aspect-square ${
                img.isPrimary ? 'border-emerald-400' : 'border-transparent hover:border-stone-200'
              }`}
            >
              <Image
                src={img.thumbnailUrl || img.url || ''}
                alt={img.altText || 'Product image'}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                className="object-cover"
              />
              {img.isPrimary && (
                <span className="absolute top-1.5 left-1.5 bg-emerald-500 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-lg shadow-emerald-500/20">
                  Chính
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                {!img.isPrimary && (
                  <button
                    onClick={() => setPrimaryImage(img.id)}
                    disabled={isSettingPrimary}
                    className="px-2.5 py-1 bg-white text-stone-700 text-[10px] font-black uppercase rounded-lg hover:bg-emerald-50 transition cursor-pointer"
                  >
                    Đặt chính
                  </button>
                )}
                <button
                  onClick={() => deleteImage(img.id)}
                  disabled={isDeleting}
                  className="px-2.5 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-lg hover:bg-red-600 transition cursor-pointer"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
