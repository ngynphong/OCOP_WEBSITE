import { BlogArticle } from '@/features/blog/components/public/BlogArticle';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

async function fetchBlogServer(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
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
  const blog = await fetchBlogServer(slug);

  if (!blog) {
    return {
      title: 'Bài viết không tồn tại | Sàn OCOP',
    };
  }

  return {
    title: `${blog.title} | Sàn OCOP`,
    description: blog.shortDesc || blog.title,
    openGraph: {
      title: blog.title,
      description: blog.shortDesc || blog.title,
      images: blog.thumbnailUrl ? [{ url: blog.thumbnailUrl }] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const blog = await fetchBlogServer(slug);

  const jsonLd = blog
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: blog.title,
        image: blog.thumbnailUrl ? [blog.thumbnailUrl] : [],
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt || blog.createdAt,
        author: [
          {
            '@type': 'Person',
            name: blog.authorEmail || 'OCOP',
          },
        ],
      }
    : null;

  return (
    <div className="min-h-screen bg-white">
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <main>
        <BlogArticle />
      </main>
      <Footer />
    </div>
  );
}
