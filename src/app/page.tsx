import { Header } from '@/components/layout/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ | Sàn thương mại điện tử OCOP',
  description:
    'Khám phá hàng ngàn sản phẩm đặc sản vùng miền, đạt chứng nhận OCOP, uy tín và chất lượng. Mua sắm đặc sản Việt Nam ngay hôm nay!',
  keywords: ['OCOP', 'đặc sản vùng miền', 'nông sản', 'thương mại điện tử OCOP', 'mua sắm đặc sản'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Trang chủ | Sàn thương mại điện tử OCOP',
    description:
      'Khám phá hàng ngàn sản phẩm đặc sản vùng miền, đạt chứng nhận OCOP, uy tín và chất lượng.',
    url: '/',
    type: 'website',
    images: [
      {
        url: '/images/background.jpg',
        width: 1200,
        height: 630,
        alt: 'Sàn thương mại điện tử OCOP',
      },
    ],
  },
};
import { HeroSection } from '@/features/home/components/HeroSection';
import { AmbientBackground } from '@/features/home/components/AmbientBackground';
import { HomeDeferredSections } from '@/features/home/components/HomeDeferredSections';
import { HomeFloatingWidgets } from '@/features/home/components/HomeFloatingWidgets';
import { HomeDeferredFooter } from '@/features/home/components/HomeDeferredFooter';
import { getHomeBanners } from '@/features/home/api/homeServerApi';

export default async function Home() {
  const banners = await getHomeBanners();

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#f6faf4] md:bg-transparent relative">
      {/* Background Layer */}
      <AmbientBackground banners={banners} />

      {/* Content Layer */}
      <Header />

      <main className="relative z-10 flex-1 flex flex-col justify-start items-center w-full overflow-x-hidden bg-[#f6faf4] md:bg-transparent">
        <div className="w-full pb-12 flex flex-col justify-start items-center">
          <div className="w-full">
            <HeroSection banners={banners} />
          </div>
          <HomeDeferredSections />
        </div>
      </main>
      <HomeFloatingWidgets />
      <HomeDeferredFooter />
    </div>
  );
}
