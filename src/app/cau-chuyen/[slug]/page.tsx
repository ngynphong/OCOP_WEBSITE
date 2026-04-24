'use client';

import React from 'react';
import {
  StoryHero,
  StoryOrigin,
  StoryArtisan,
  StoryTimeline,
  StoryImpact,
} from '@/features/products/components/story/StoryComponents';
import { Users, ShieldCheck, Sparkles } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useParams } from 'next/navigation';
import { usePublicProductDetailQuery } from '@/features/products/hooks/usePublicProducts';
import { ProductJournal } from '@/features/products/types/productTypes';

export default function ProductStoryPage() {
  const { slug } = useParams();
  const { data: productResp, isLoading } = usePublicProductDetailQuery(slug as string);
  const product = productResp?.data;

  // Mock data for demo if product is not fully loaded or lacks some fields
  const mockData = {
    heroImage: '/images/hero-tra.jpg',
    originTitle: 'Từ những đỉnh núi mờ sương',
    originContent:
      'Trà Shan Tuyết cổ thụ được hái từ những cây trà hàng trăm năm tuổi tại vùng núi cao phía Bắc. Nơi đây, khí hậu mát mẻ quanh năm cùng thổ nhưỡng đặc trưng đã tạo nên hương vị chát thanh, hậu ngọt sâu lắng mà không loại trà nào có được.',
    subImage: '/images/tra-nguyen-lieu.jpg',
    artisan: {
      name: 'Nghệ nhân Ma Văn Khởi',
      role: 'Trưởng bản - Người giữ lửa truyền thống',
      quote:
        'Làm trà không chỉ là một nghề, đó là cách chúng tôi giữ gìn văn hóa và tình yêu với mảnh đất này. Từng búp trà là sự chắt chiu của đất trời và tâm huyết của người làm.',
      avatar: '/images/artisan-demo.jpg',
    },
    steps: [
      {
        date: 'Tháng 3 - Tháng 4',
        title: 'Thu hái búp xuân',
        description:
          'Những búp trà non nhất được hái thủ công bởi những người phụ nữ bản địa khi sương sớm còn đọng trên lá.',
        image: '/images/step-1.jpg',
      },
      {
        date: 'Sau 2h thu hái',
        title: 'Làm héo tự nhiên',
        description:
          'Trà được trải mỏng trên nia tre, phơi trong bóng râm để giữ lại các dưỡng chất quý giá.',
        image: '/images/step-2.jpg',
      },
      {
        date: 'Nghệ thuật sao trà',
        title: 'Sao tay thủ công',
        description:
          'Nghệ nhân dùng đôi tay cảm nhận nhiệt độ để đảo trà trên chảo gang, tạo nên hình dáng cánh trà xoăn đều và hương thơm đặc trưng.',
        image: '/images/step-3.jpg',
      },
    ],
    impact: [
      {
        icon: <Users size={32} />,
        value: '45+',
        label: 'Hộ gia đình bản địa',
      },
      {
        icon: <ShieldCheck size={32} />,
        value: '100%',
        label: 'Canh tác hữu cơ',
      },
      {
        icon: <Sparkles size={32} />,
        value: 'OCOP 4*',
        label: 'Xếp hạng chất lượng',
      },
    ],
  };

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#FCF8F2] text-emerald-800 font-bold uppercase tracking-widest animate-pulse">
        Đang kể lại câu chuyện...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        <StoryHero
          name={product?.name || 'Trà Shan Tuyết Cổ Thụ'}
          province={product?.provinceName || 'Hà Giang'}
          imageUrl={product?.imageUrl || mockData.heroImage}
        />

        <StoryOrigin
          title={mockData.originTitle}
          content={product?.description || mockData.originContent}
          subImage={mockData.subImage}
        />

        <StoryArtisan
          name={mockData.artisan.name}
          role={mockData.artisan.role}
          quote={mockData.artisan.quote}
          avatar={mockData.artisan.avatar}
        />

        <StoryTimeline
          steps={
            product?.journals?.length
              ? product.journals.map((j: ProductJournal) => ({
                  date: new Date(j.activityDate).toLocaleDateString('vi-VN'),
                  title: j.title,
                  description: j.description,
                  image: j.images?.[0] || '/images/placeholder.jpg',
                }))
              : mockData.steps
          }
        />

        <StoryImpact items={mockData.impact} />
      </main>

      <Footer />
    </div>
  );
}
