import { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PublicShopProfile } from '@/features/shop/components/PublicShopProfile';

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${slug}`, {
      next: { revalidate: 60 * 5 },
    });

    if (res.ok) {
      const { data } = await res.json();
      return {
        title: `${data.name} | Sàn thương mại điện tử OCOP`,
        description:
          data.description ||
          `Mua sắm sản phẩm đặc sản chính hãng từ ${data.name} trên hệ thống OCOP. Chất lượng đảm bảo, truy xuất nguồn gốc rõ ràng.`,
        openGraph: {
          title: `${data.name} | Sàn thương mại điện tử OCOP`,
          description:
            data.description ||
            `Mua sắm sản phẩm đặc sản chính hãng từ ${data.name} trên hệ thống OCOP. Chất lượng đảm bảo, truy xuất nguồn gốc rõ ràng.`,
          images: data.logoUrl ? [{ url: data.logoUrl }] : [],
          type: 'website',
        },
        alternates: {
          canonical: `/cua-hang/${slug}`,
        },
      };
    }
  } catch {}

  return {
    title: 'Cửa hàng | OCOP',
    description: 'Mua sắm sản phẩm chính hãng từ các cửa hàng OCOP',
  };
}

export default async function ShopProfilePage({ params }: ShopPageProps) {
  const { slug } = await params;
  let shopData = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/shops/${slug}`, {
      next: { revalidate: 60 * 5 },
    });
    if (res.ok) {
      const { data } = await res.json();
      shopData = data;
    }
  } catch (error) {
    console.error('Error fetching shop data for schema:', error);
  }

  const jsonLd = shopData
    ? {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: shopData.name,
        image: shopData.logoUrl ? [shopData.logoUrl] : [],
        description: shopData.description || `Cửa hàng ${shopData.name} trên OCOP.`,
        address: shopData.address
          ? {
              '@type': 'PostalAddress',
              streetAddress: shopData.address,
            }
          : undefined,
        telephone: shopData.phone,
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/cua-hang/${slug}`,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      <Header />
      <main className="flex-1 w-full relative">
        <PublicShopProfile shopSlug={slug} />
      </main>
      <Footer />
    </div>
  );
}
