import { Metadata } from 'next';
import { CategoryDetailClient } from './CategoryDetailClient';
import { PublicCategory } from '@/features/products/types/productTypes';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function fetchCategoryServer(slug: string): Promise<PublicCategory | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as PublicCategory;
  } catch (error) {
    console.error('Error fetching category for metadata:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await fetchCategoryServer(slug);

  if (!category) {
    return {
      title: 'Danh mục không tồn tại | Sàn OCOP',
    };
  }

  const metaTitle = `${category.name} | Sàn thương mại điện tử OCOP`;
  const metaDescription =
    category.description ||
    `Khám phá các sản phẩm đặc sản thuộc danh mục ${category.name} đạt tiêu chuẩn OCOP.`;

  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      images:
        category.bannerUrl || category.iconUrl
          ? [{ url: (category.bannerUrl || category.iconUrl) as string }]
          : [],
      type: 'website',
    },
    alternates: {
      canonical: `/danh-muc/${slug}`,
    },
  };
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  return <CategoryDetailClient />;
}
