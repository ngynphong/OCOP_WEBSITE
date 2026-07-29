import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
import dynamic from 'next/dynamic';
import { HeroSection } from '@/features/home/components/HeroSection';
import { AmbientBackground } from '@/features/home/components/AmbientBackground';

const FeatureHighlights = dynamic(() =>
  import('@/features/home/components/FeatureHighlights').then((mod) => mod.FeatureHighlights),
);
const CategoryList = dynamic(() =>
  import('@/features/home/components/CategoryList').then((mod) => mod.CategoryList),
);
const FlashSaleSection = dynamic(() =>
  import('@/features/home/components/FlashSaleSection').then((mod) => mod.FlashSaleSection),
);
const BestSellersSection = dynamic(() =>
  import('@/features/home/components/BestSellersSection').then((mod) => mod.BestSellersSection),
);
const CategoryShowcase = dynamic(() =>
  import('@/features/home/components/CategoryShowcase').then((mod) => mod.CategoryShowcase),
);
const TestimonialSection = dynamic(() =>
  import('@/features/home/components/TestimonialSection').then((mod) => mod.TestimonialSection),
);
const QRTraceabilitySection = dynamic(() =>
  import('@/features/home/components/QRTraceabilitySection').then(
    (mod) => mod.QRTraceabilitySection,
  ),
);
const NewsletterSection = dynamic(() =>
  import('@/features/home/components/NewsletterSection').then((mod) => mod.NewsletterSection),
);
const QuickLinksRow = dynamic(() =>
  import('@/features/home/components/QuickLinksRow').then((mod) => mod.QuickLinksRow),
);
const VoucherHomeSection = dynamic(() =>
  import('@/features/home/components/VoucherHomeSection').then((mod) => mod.VoucherHomeSection),
);
const OcopMallSection = dynamic(() =>
  import('@/features/home/components/OcopMallSection').then((mod) => mod.OcopMallSection),
);
const DailyDiscoverFeed = dynamic(() =>
  import('@/features/home/components/DailyDiscoverFeed').then((mod) => mod.DailyDiscoverFeed),
);
const SubBanners = dynamic(() =>
  import('@/features/home/components/SubBanners').then((mod) => mod.SubBanners),
);

const ComplaintFloatingButton = dynamic(() =>
  import('@/features/complaints/components/ComplaintFloatingButton').then(
    (mod) => mod.ComplaintFloatingButton,
  ),
);
const FloatingChatbot = dynamic(() =>
  import('@/features/ai-chat/components/FloatingChatbot').then((mod) => mod.FloatingChatbot),
);

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-transparent relative">
      {/* Background Layer */}
      <AmbientBackground />

      {/* Content Layer */}
      <Header />

      <main className="relative z-10 flex-1 flex flex-col justify-start items-center w-full overflow-x-hidden">
        <div className="w-full pb-12 flex flex-col justify-start items-center">
          <div className="w-full">
            <HeroSection />
          </div>

          <div className="w-full flex flex-col gap-10 md:gap-16 mt-6 relative z-20">
            <QuickLinksRow />
            <BestSellersSection />
            <VoucherHomeSection />
            <FlashSaleSection />
            <FeatureHighlights />
            <CategoryList />
            <SubBanners />
            <OcopMallSection />
            <CategoryShowcase />
            <DailyDiscoverFeed />
          </div>
        </div>

        <div className="relative z-20 w-full flex flex-col items-center">
          <TestimonialSection />
          <QRTraceabilitySection />
          <NewsletterSection />
        </div>
      </main>
      <ComplaintFloatingButton />
      <FloatingChatbot />
      <Footer />
    </div>
  );
}
