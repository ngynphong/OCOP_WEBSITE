'use client';

import React, { useMemo, memo } from 'react';
import Image from 'next/image';
import { Quote } from 'lucide-react';

interface ProductStoryProps {
  description: string;
  name: string;
  images: string[];
}

export const ProductStory = memo(function ProductStory({
  description,
  name,
  images,
}: ProductStoryProps) {
  const paragraphs = useMemo(
    () => description.split('\n\n').filter((p) => p.trim() !== ''),
    [description],
  );

  return (
    <section className="py-6 border-t border-stone-100 overflow-hidden">
      <div className="flex flex-col gap-8">
        {/* Intro Header */}
        <div className="max-w-4xl mx-auto text-center px-6">
          <p className="text-green-700 font-black uppercase tracking-[0.4em] text-[10px] mb-3">
            Câu chuyện sản phẩm
          </p>
          <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tighter leading-tight mb-4">
            Hồi ức về vùng đất tạo nên {name}
          </h2>
          <div className="w-16 h-1 bg-green-700 mx-auto rounded-full" />
        </div>

        {/* Story Content - Magazine Layout */}
        <div className="flex flex-col gap-8">
          {/* Section 1: Image Left, Text Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center justify-between">
            <div className="relative max-h-[500px] aspect-4/5 rounded-xl overflow-hidden shadow-xl skew-y-1 hover:skew-y-0 transition-transform duration-700">
              <Image
                src={images[0] || '/images/placeholder-product.jpg'}
                alt="Product Origin"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4 px-6">
              <Quote className="w-8 h-8 text-green-100 fill-green-100" />
              <div className="prose prose-stone text-sm max-w-none text-stone-700 font-medium leading-[1.65] tracking-tight">
                <p className="first-letter:text-5xl first-letter:font-black first-letter:text-green-700 first-letter:mr-2 first-letter:float-left first-letter:leading-none">
                  {paragraphs[0] ||
                    'Mỗi sản phẩm OCOP không chỉ là một món hàng, mà là cả một tâm hồn và di sản văn hóa truyền đời của những người nông dân tâm huyết.'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Full Width Quote Banner */}
          <div className="relative py-10 bg-stone-900 rounded-xl text-white overflow-hidden text-center px-6">
            <div className="absolute inset-0 opacity-20">
              <Image
                src={images[1] || images[0] || '/images/placeholder-product.jpg'}
                alt="Background"
                fill
                className="object-cover grayscale"
              />
            </div>
            <div className="relative z-10 max-w-2xl mx-auto flex flex-col gap-4">
              <h3 className="text-xl md:text-2xl font-black italic leading-tight">
                &quot;Chúng tôi không chỉ bán nông sản, chúng tôi kể về niềm tự hào của quê
                hương.&quot;
              </h3>
              <p className="text-stone-400 font-bold tracking-widest uppercase text-xs">
                — Nghệ nhân làng nghề OCOP
              </p>
            </div>
          </div>

          {/* Section 3: Text Left, Image Right */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-center justify-between">
            <div className="flex flex-col gap-4 px-6 order-2 lg:order-1">
              <div className="prose prose-stone text-sm max-w-none text-stone-600 font-medium leading-[1.65]">
                {paragraphs.slice(1).map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
                {!paragraphs[1] && (
                  <p>
                    Quy trình thu hoạch và chế biến được kiểm soát nghiêm ngặt theo các tiêu chuẩn
                    VietGAP và GlobalGAP, đảm bảo giữ trọn vẹn hương vị tự nhiên và giá trị dinh
                    dưỡng cao nhất của sản phẩm.
                  </p>
                )}
              </div>
            </div>
            <div className="relative w-full max-w-[400px] lg:ml-auto aspect-4/5 rounded-xl overflow-hidden shadow-xl -skew-y-1 hover:skew-y-0 transition-transform duration-700 order-1 lg:order-2">
              <Image
                src={images[2] || images[1] || images[0] || '/images/placeholder-product.jpg'}
                alt="Craftsmanship"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
