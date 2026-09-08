'use client';

import React, { useMemo, memo } from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface ProductStoryProps {
  description?: string;
  name: string;
  images?: string[];
}

export const ProductStory = memo(function ProductStory({
  description = '',
  name,
  images = [],
}: ProductStoryProps) {
  const validImages = useMemo(() => {
    return (images || []).filter((img) =>
      Boolean(img && typeof img === 'string' && img.trim() !== ''),
    );
  }, [images]);

  const paragraphs = useMemo(() => {
    if (!description || typeof description !== 'string') return [];
    return description
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [description]);

  return (
    <section className="py-8 border-t border-stone-100 overflow-hidden">
      <div className="flex flex-col gap-8">
        {/* Intro Header */}
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="text-emerald-700 font-bold uppercase tracking-[0.4em] text-[10px] mb-2">
            Câu chuyện sản phẩm
          </p>
          <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-tight mb-3">
            Hồi ức về vùng đất tạo nên {name}
          </h2>
          <div className="w-16 h-1 bg-emerald-700 mx-auto rounded-full" />
        </div>

        {paragraphs.length === 0 ? (
          <div className="p-8 bg-stone-50/70 rounded-2xl border border-dashed border-stone-200 text-center space-y-1 max-w-xl mx-auto w-full my-4">
            <p className="text-sm font-semibold text-stone-500 italic">
              Chưa cập nhật câu chuyện sản phẩm
            </p>
            <p className="text-xs text-stone-400">
              Thông tin chi tiết về xuất xứ và câu chuyện đằng sau sản phẩm đang được chủ thể cập
              nhật.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Section 1: Lead Paragraph with primary image if available */}
            <div
              className={`grid grid-cols-1 ${
                validImages.length > 0 ? 'lg:grid-cols-2 gap-8 lg:gap-12' : 'max-w-3xl mx-auto'
              } items-center`}
            >
              {validImages.length > 0 && (
                <div className="relative aspect-4/5 max-h-[460px] rounded-2xl overflow-hidden shadow-sm border border-stone-100 group">
                  <Image
                    src={validImages[0]}
                    alt={`${name} - Khởi nguồn`}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="flex flex-col gap-4 px-2 sm:px-6">
                <Quote className="w-8 h-8 text-emerald-200 fill-emerald-100" />
                <div className="prose prose-stone text-sm sm:text-base max-w-none text-stone-700 font-medium leading-relaxed tracking-tight">
                  <p className="first-letter:text-5xl first-letter:font-black first-letter:text-emerald-700 first-letter:mr-2.5 first-letter:float-left first-letter:leading-none">
                    {paragraphs[0]}
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Remaining paragraphs (if any) */}
            {paragraphs.length > 1 && (
              <div
                className={`grid grid-cols-1 ${
                  validImages.length > 1
                    ? 'lg:grid-cols-2 gap-8 lg:gap-12'
                    : 'max-w-3xl mx-auto w-full'
                } items-center pt-6 border-t border-stone-100`}
              >
                <div className="flex flex-col gap-4 px-2 sm:px-6 order-2 lg:order-1">
                  <div className="prose prose-stone text-sm sm:text-base max-w-none text-stone-600 font-normal leading-relaxed space-y-4">
                    {paragraphs.slice(1).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </div>

                {validImages.length > 1 && (
                  <div className="relative aspect-4/5 max-h-[420px] rounded-2xl overflow-hidden shadow-sm border border-stone-100 order-1 lg:order-2 group">
                    <Image
                      src={validImages[1]}
                      alt={`${name} - Quy trình`}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
});
