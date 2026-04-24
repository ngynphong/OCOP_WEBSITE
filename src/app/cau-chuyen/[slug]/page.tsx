'use client';

import React from 'react';
import {
  StoryHero,
  StoryOrigin,
  StoryArtisan,
  StoryTimeline,
  StoryImpact,
} from '@/features/products/components/story/StoryComponents';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useParams } from 'next/navigation';
import { usePublicProductDetailQuery } from '@/features/products/hooks/usePublicProducts';
import { ProductJournal, ImpactStat } from '@/features/products/types/productTypes';
import { Users, ShieldCheck, Sparkles, Heart, Globe, Award, Leaf } from 'lucide-react';

const IconMap: Record<string, React.ReactNode> = {
  users: <Users size={32} />,
  shield: <ShieldCheck size={32} />,
  sparkles: <Sparkles size={32} />,
  heart: <Heart size={32} />,
  globe: <Globe size={32} />,
  award: <Award size={32} />,
  leaf: <Leaf size={32} />,
};

export default function ProductStoryPage() {
  const { slug } = useParams();
  const { data: productResp, isLoading } = usePublicProductDetailQuery(slug as string);
  const product = productResp?.data;

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FCF8F2] text-emerald-800 font-bold uppercase tracking-widest animate-pulse">
        Đang kể lại câu chuyện...
      </div>
    );

  if (!product)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FCF8F2] text-red-800 font-bold uppercase tracking-widest">
        Không tìm thấy câu chuyện.
      </div>
    );

  // Map impact stats from JSON
  const impactItems = Array.isArray(product.impactStats)
    ? product.impactStats.map((item: ImpactStat) => ({
        icon: IconMap[item.iconType?.toLowerCase()] || <Sparkles size={32} />,
        value: item.value,
        label: item.label,
      }))
    : [
        { icon: <Users size={32} />, value: '100+', label: 'Hộ nông dân' },
        { icon: <ShieldCheck size={32} />, value: 'Hữu cơ', label: 'Tiêu chuẩn' },
        { icon: <Award size={32} />, value: `${product.ocopStar}*`, label: 'Xếp hạng' },
      ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <StoryHero
          name={product.storyTitle || product.name}
          province={product.provinceName || 'Việt Nam'}
          imageUrl={product.storyImage || product.imageUrl || '/images/hero-tra.jpg'}
        />

        <StoryOrigin
          title={product.storyTitle || 'Nguồn gốc & Di sản'}
          content={product.description}
          subImage={product.thumbnailUrl || product.imageUrl || '/images/tra-nguyen-lieu.jpg'}
        />

        {product.shop.ownerName && (
          <StoryArtisan
            name={product.shop.ownerName}
            role={product.shop.ownerRole || 'Chủ cơ sở'}
            quote={product.shop.ownerQuote || 'Chúng tôi gửi gắm cả tâm huyết vào từng sản phẩm.'}
            avatar={
              product.shop.ownerImageUrl || product.shop.logoUrl || '/images/artisan-demo.jpg'
            }
          />
        )}

        <StoryTimeline
          steps={
            product.journals?.length
              ? product.journals.map((j: ProductJournal) => ({
                  date: j.activityDate
                    ? new Date(j.activityDate).toLocaleDateString('vi-VN')
                    : 'Giai đoạn',
                  title: j.title,
                  description: j.description,
                  image: j.images?.[0] || product.thumbnailUrl || '/images/placeholder.jpg',
                }))
              : []
          }
        />

        <StoryImpact items={impactItems} />
      </main>

      <Footer />
    </div>
  );
}
