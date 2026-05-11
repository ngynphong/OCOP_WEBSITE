import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PublicShopProfile } from '@/features/shop/components/PublicShopProfile';

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

// Generate metadata for SEO by fetching shop basic info
export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${slug}`, {
      next: { revalidate: 60 * 5 }, // 5 minutes cache
    });

    if (res.ok) {
      const { data } = await res.json();
      return {
        title: `${data.name} | OCOP`,
        description:
          data.description || `Mua sắm sản phẩm chính hãng từ ${data.name} trên hệ thống OCOP`,
        openGraph: {
          title: data.name,
          images: data.logoUrl ? [data.logoUrl] : [],
        },
      };
    }
  } catch {
    // Return fallback metadata on failure
  }

  return {
    title: 'Cửa hàng | OCOP',
    description: 'Mua sắm sản phẩm chính hãng từ các cửa hàng OCOP',
  };
}

export default async function ShopProfilePage({ params }: ShopPageProps) {
  const { slug } = await params;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 w-full relative">
        <PublicShopProfile shopSlug={slug} />
      </main>
      <Footer />
    </div>
  );
}
