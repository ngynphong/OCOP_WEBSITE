import { ProductDetailClient } from '@/features/products/components/ProductDetail/Public/ProductDetailClient';
import { Metadata } from 'next';
import { Product } from '@/features/products/types/productTypes';

async function fetchProductServer(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as Product;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductServer(slug);

  if (!product) {
    return {
      title: 'Sản phẩm không tồn tại | Sàn OCOP',
    };
  }

  const ocopBadge = product.ocopStar ? ` - OCOP ${product.ocopStar} Sao` : '';
  const metaTitle = `${product.name}${ocopBadge} | Sàn thương mại điện tử OCOP`;

  return {
    title: metaTitle,
    description:
      product.shortDesc || `Mua ${product.name} chính hãng, đạt tiêu chuẩn OCOP tại Sàn OCOP.`,
    openGraph: {
      title: metaTitle,
      description:
        product.shortDesc || `Mua ${product.name} chính hãng, đạt tiêu chuẩn OCOP tại Sàn OCOP.`,
      images: product.thumbnailUrl ? [{ url: product.thumbnailUrl }] : [],
      type: 'website',
    },
    alternates: {
      canonical: `/san-pham/${slug}`,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const product = await fetchProductServer(slug);

  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: product.thumbnailUrl,
        description: product.shortDesc || product.name,
        sku: product.variants?.[0]?.sku || product.id.toString(),
        brand: {
          '@type': 'Brand',
          name: product.shop?.name || 'OCOP',
        },
        offers: {
          '@type': 'Offer',
          url: `${process.env.NEXT_PUBLIC_SITE_URL}/san-pham/${product.slug}`,
          priceCurrency: 'VND',
          price: product.minPrice,
          availability: product.inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        },
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductDetailClient initialProduct={product} />
    </>
  );
}
