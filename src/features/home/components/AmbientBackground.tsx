import type { Banner } from '../api/homeApi';

interface AmbientBackgroundProps {
  banners?: Banner[];
}

export function AmbientBackground({ banners = [] }: AmbientBackgroundProps) {
  const activeBanner = banners.find((banner) => banner.isAmbientBackground);
  const backgroundImage = activeBanner?.imageUrl || '/images/background.jpg';

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none bg-[#f6faf4] md:bg-transparent">
      <div
        className="hidden md:block absolute inset-0 bg-cover bg-center blur-[3px] saturate-[1.5] brightness-90 opacity-50"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="hidden md:block absolute inset-0 bg-stone-900/5" />
    </div>
  );
}
