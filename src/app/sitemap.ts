import { MetadataRoute } from 'next';
import { Product } from '@/features/products/types/productTypes';
import { Blog } from '@/features/blog/types/blogTypes';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocop.iesconnect.vn';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/san-pham`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/bai-viet`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  try {
    // Fetch products
    const productsRes = await fetch(`${apiUrl}/products?pageSize=100`, {
      next: { revalidate: 3600 },
    });
    if (productsRes.ok) {
      const productsData = await productsRes.json();
      const products: Product[] = productsData?.data?.items || [];
      const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
        url: `${baseUrl}/san-pham/${product.slug}`,
        lastModified: new Date(product.updatedAt || product.createdAt),
        changeFrequency: 'daily',
        priority: 0.8,
      }));
      routes.push(...productRoutes);
    }

    // Fetch blogs
    const blogsRes = await fetch(`${apiUrl}/blog?pageSize=50`, {
      next: { revalidate: 3600 },
    });
    if (blogsRes.ok) {
      const blogsData = await blogsRes.json();
      const blogs: Blog[] = blogsData?.data?.content || blogsData?.data?.items || [];
      const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
        url: `${baseUrl}/bai-viet/${blog.slug}`,
        lastModified: new Date(blog.updatedAt || blog.createdAt),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));
      routes.push(...blogRoutes);
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
