import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
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
import { MainBanner } from '@/features/home/components/MainBanner';
import { SubBanners } from '@/features/home/components/SubBanners';
import { ScrollToTop } from '@/components/ui/ScrollToTop';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50">
      <Header />

      <main className="flex-1 flex flex-col justify-start items-center w-full overflow-x-hidden">
        <div className="w-full pb-12 flex flex-col justify-start items-center">
          <HeroSection />

          <div className="w-full max-w-7xl px-6 lg:px-8 mt-10">
            <MainBanner />
          </div>

          <div className="w-full flex flex-col gap-10 md:gap-16 mt-6">
            <QuickLinksRow />
            <VoucherHomeSection />
            <FlashSaleSection />
            <FeatureHighlights />
            <CategoryList />
            <SubBanners />
            <OcopMallSection />
            <BestSellersSection />
            <CategoryShowcase />
            <DailyDiscoverFeed />
          </div>
        </div>

        <TestimonialSection />
        <QRTraceabilitySection />
        <NewsletterSection />
        <ScrollToTop />
      </main>

      <Footer />
    </div>
  );
}
