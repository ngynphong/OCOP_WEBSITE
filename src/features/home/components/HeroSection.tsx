import type { Banner } from '../api/homeApi';
import { HeroSlider } from './HeroSlider';

interface HeroSectionProps {
  banners: Banner[];
}

export function HeroSection({ banners }: HeroSectionProps) {
  const mainBanners = banners
    .filter((banner) => banner.type === 'MAIN')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const subBanners = banners
    .filter((banner) => banner.type === 'SUB')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (mainBanners.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-4 md:px-6 pt-3 md:pt-4">
        <div className="w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] rounded-2xl bg-emerald-950/10 animate-pulse border border-emerald-900/10" />
      </section>
    );
  }

  return <HeroSlider mainBanners={mainBanners} subBanners={subBanners} />;
}
