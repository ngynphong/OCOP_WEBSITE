import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trang chủ | Sàn OCOP',
  description: 'Khám phá hàng ngàn sản phẩm đặc sản vùng miền, đạt chứng nhận OCOP.',
};
import { HeroSection } from '@/features/home/components/HeroSection';
import { FeatureHighlights } from '@/features/home/components/FeatureHighlights';
import { CategoryList } from '@/features/home/components/CategoryList';
import { FlashSaleSection } from '@/features/home/components/FlashSaleSection';
import { BestSellersSection } from '@/features/home/components/BestSellersSection';
import { CategoryShowcase } from '@/features/home/components/CategoryShowcase';
import { TestimonialSection } from '@/features/home/components/TestimonialSection';
import { QRTraceabilitySection } from '@/features/home/components/QRTraceabilitySection';
import { NewsletterSection } from '@/features/home/components/NewsletterSection';
import { QuickLinksRow } from '@/features/home/components/QuickLinksRow';
import { VoucherHomeSection } from '@/features/home/components/VoucherHomeSection';
import { OcopMallSection } from '@/features/home/components/OcopMallSection';
import { DailyDiscoverFeed } from '@/features/home/components/DailyDiscoverFeed';
import { SubBanners } from '@/features/home/components/SubBanners';
import { AmbientBackground } from '@/features/home/components/AmbientBackground';
import { ComplaintFloatingButton } from '@/features/complaints/components/ComplaintFloatingButton';
import { FloatingChatbot } from '@/features/ai-chat/components/FloatingChatbot';

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
