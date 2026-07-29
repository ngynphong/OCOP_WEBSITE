import type { Banner } from '../api/homeApi';
import { HeroSlider } from './HeroSlider';

interface HeroSectionProps {
  banners: Banner[];
}

export function HeroSection({ banners }: HeroSectionProps) {
  const mainBanners = banners
    .filter((banner) => banner.type === 'MAIN')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  if (mainBanners.length === 0) {
    return (
      <section className="relative w-full h-[58svh] min-h-[360px] max-h-[560px] md:h-[calc(100vh-72px)] md:min-h-[500px] lg:h-[calc(100vh-80px)] md:max-h-[900px] overflow-hidden bg-[#113B28]" />
    );
  }

  return <HeroSlider banners={mainBanners} />;
}
