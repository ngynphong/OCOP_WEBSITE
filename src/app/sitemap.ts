import { MetadataRoute } from 'next';
import { Product } from '@/features/products/types/productTypes';
import { Blog } from '@/features/blog/types/blogTypes';
import { ShopInfo } from '@/features/shop/types/shopTypes';

// We map IDs to different sitemap types:
// 0: static
// 1000 + page: products (1001, 1002...)
// 2000 + page: blogs (2001, 2002...)
// 3000 + page: shops (3001, 3002...)

export async function generateSitemaps() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const sitemaps = [{ id: 0 }];

  try {
    // Products sitemaps
    const productsRes = await fetch(`${apiUrl}/products?pageSize=1000&pageNo=1`, {
      next: { revalidate: 3600 },
    });
    if (productsRes.ok) {
      const data = await productsRes.json();
      const totalPage = data?.data?.totalPage || 1;
      for (let i = 1; i <= totalPage; i++) {
        sitemaps.push({ id: 1000 + i });
      }
    } else {
      sitemaps.push({ id: 1001 });
    }
  } catch (error) {
    console.error('Error generating products sitemap:', error);
    sitemaps.push({ id: 1001 });
  }

  try {
    // Blogs sitemaps
    const blogsRes = await fetch(`${apiUrl}/blog?pageSize=1000&pageNo=1`, {
      next: { revalidate: 3600 },
    });
    if (blogsRes.ok) {
      const data = await blogsRes.json();
      const totalPage = data?.data?.totalPage || 1;
      for (let i = 1; i <= totalPage; i++) {
        sitemaps.push({ id: 2000 + i });
      }
    } else {
      sitemaps.push({ id: 2001 });
    }
  } catch (error) {
    console.error('Error generating blogs sitemap:', error);
    sitemaps.push({ id: 2001 });
  }

  try {
    // Shops sitemaps
    const shopsRes = await fetch(`${apiUrl}/shops?pageSize=1000&pageNo=1`, {
      next: { revalidate: 3600 },
    });
    if (shopsRes.ok) {
      const data = await shopsRes.json();
      const totalPage = data?.data?.totalPage || 1;
      for (let i = 1; i <= totalPage; i++) {
        sitemaps.push({ id: 3000 + i });
      }
    } else {
      sitemaps.push({ id: 3001 });
    }
  } catch (error) {
    console.error('Error generating shops sitemap:', error);
    sitemaps.push({ id: 3001 });
  }

  return sitemaps;
}

export default async function sitemap({
  id,
}: {
  id: Promise<string | number> | string | number;
}): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.ocop.iesconnect.vn';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const routes: MetadataRoute.Sitemap = [];

  const resolvedId = await id;
  const numericId = Number(resolvedId);

  if (numericId === 0) {
    // Static routes
    routes.push(
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
        url: `${baseUrl}/danh-muc`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/vung-mien`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/bai-viet`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    );
  } else if (numericId > 1000 && numericId < 2000) {
    // Products
    const pageNo = numericId - 1000;
    try {
      console.log(`Fetching products for sitemap page ${pageNo} using API: ${apiUrl}`);
      const res = await fetch(`${apiUrl}/products?pageSize=1000&pageNo=${pageNo}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const products: Product[] = data?.data?.items || [];
        console.log(`Found ${products.length} products`);
        const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
          url: `${baseUrl}/san-pham/${product.slug}`,
          lastModified: new Date(product.updatedAt || product.createdAt),
          changeFrequency: 'daily',
          priority: 0.8,
        }));
        routes.push(...productRoutes);
      } else {
        console.error(`API returned status ${res.status}`);
      }
    } catch (error) {
      console.error('Error generating products sitemap:', error);
    }
  } else if (numericId > 2000 && numericId < 3000) {
    // Blogs
    const pageNo = numericId - 2000;
    try {
      const res = await fetch(`${apiUrl}/blog?pageSize=1000&pageNo=${pageNo}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const blogs: Blog[] = data?.data?.content || data?.data?.items || [];
        const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
          url: `${baseUrl}/bai-viet/${blog.slug}`,
          lastModified: new Date(blog.updatedAt || blog.createdAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        routes.push(...blogRoutes);
      }
    } catch (error) {
      console.error('Error generating blogs sitemap:', error);
    }
  } else if (numericId > 3000 && numericId < 4000) {
    // Shops
    const pageNo = numericId - 3000;
    try {
      const res = await fetch(`${apiUrl}/shops?pageSize=1000&pageNo=${pageNo}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        const shops: ShopInfo[] = data?.data?.items || [];
        const shopRoutes: MetadataRoute.Sitemap = shops.map((shop) => ({
          url: `${baseUrl}/cua-hang/${shop.slug}`,
          lastModified: new Date(shop.createdAt),
          changeFrequency: 'weekly',
          priority: 0.7,
        }));
        routes.push(...shopRoutes);
      }
    } catch (error) {
      console.error('Error generating shops sitemap:', error);
    }
  }

  return routes;
}
