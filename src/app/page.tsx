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

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />

      <main className="flex-1 flex flex-col justify-start items-center w-full">
        <div className="w-full pb-12 flex flex-col justify-start items-center gap-10 md:gap-16">
          <HeroSection />
          <FlashSaleSection />
          <FeatureHighlights />
          <CategoryList />
          <BestSellersSection />
          <CategoryShowcase />
        </div>

        <TestimonialSection />
        <QRTraceabilitySection />
        <NewsletterSection />
      </main>

      <Footer />
    </div>
  );
}
