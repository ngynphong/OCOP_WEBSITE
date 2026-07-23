import { MetadataRoute } from 'next';
import { Product } from '@/features/products/types/productTypes';
import { Blog } from '@/features/blog/types/blogTypes';
import { ShopInfo } from '@/features/shop/types/shopTypes';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  children?: CategoryItem[];
}

export const revalidate = 3600;

function extractCategoryRoutes(categories: CategoryItem[], baseUrl: string): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [];

  function traverse(list: CategoryItem[]) {
    for (const cat of list) {
      if (cat.slug) {
        routes.push({
          url: `${baseUrl}/danh-muc/${cat.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        });
      }
      if (cat.children && cat.children.length > 0) {
        traverse(cat.children);
      }
    }
  }

  traverse(categories);
  return routes;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://ocop.iesconnect.vn').replace(
    /\/$/,
    '',
  );
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const routes: MetadataRoute.Sitemap = [];

  // 1. Tất cả các trang tĩnh public chuẩn xác
  routes.push(
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
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
      url: `${baseUrl}/cau-chuyen`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
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
    {
      url: `${baseUrl}/shops`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/flash-sale`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/chinh-sach-bao-mat`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/chinh-sach-dat-hang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/dieu-khoan-dich-vu`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/ho-tro`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  );

  if (!apiUrl) {
    return routes;
  }

  // 2. Fetch tất cả dữ liệu động song song (Promise.allSettled)
  const [productsRes, blogsRes, shopsRes, categoriesRes] = await Promise.allSettled([
    fetch(`${apiUrl}/products?pageSize=1000&pageNo=1`, { next: { revalidate: 3600 } }),
    fetch(`${apiUrl}/blog?pageSize=1000&pageNo=1`, { next: { revalidate: 3600 } }),
    fetch(`${apiUrl}/shops?pageSize=1000&pageNo=1`, { next: { revalidate: 3600 } }),
    fetch(`${apiUrl}/categories`, { next: { revalidate: 3600 } }),
  ]);

  // Xử lý Products & Cau Chuyen
  if (productsRes.status === 'fulfilled' && productsRes.value.ok) {
    try {
      const data = await productsRes.value.json();
      const products: Product[] = data?.data?.items || [];

      products.forEach((product) => {
        if (!product.slug) return;
        const lastMod =
          product.updatedAt || product.createdAt
            ? new Date(product.updatedAt || product.createdAt)
            : undefined;

        routes.push({
          url: `${baseUrl}/san-pham/${product.slug}`,
          lastModified: lastMod,
          changeFrequency: 'daily',
          priority: 0.8,
        });

        routes.push({
          url: `${baseUrl}/cau-chuyen/${product.slug}`,
          lastModified: lastMod,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    } catch (e) {
      console.error('Lỗi parse json sản phẩm cho sitemap:', e);
    }
  }

  // Xử lý Blogs
  if (blogsRes.status === 'fulfilled' && blogsRes.value.ok) {
    try {
      const data = await blogsRes.value.json();
      const blogs: Blog[] = data?.data?.content || data?.data?.items || [];

      blogs.forEach((blog) => {
        if (!blog.slug) return;
        routes.push({
          url: `${baseUrl}/bai-viet/${blog.slug}`,
          lastModified:
            blog.updatedAt || blog.createdAt
              ? new Date(blog.updatedAt || blog.createdAt)
              : undefined,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    } catch (e) {
      console.error('Lỗi parse json bài viết cho sitemap:', e);
    }
  }

  // Xử lý Shops
  if (shopsRes.status === 'fulfilled' && shopsRes.value.ok) {
    try {
      const data = await shopsRes.value.json();
      const shops: ShopInfo[] = data?.data?.items || [];

      shops.forEach((shop) => {
        if (!shop.slug) return;
        routes.push({
          url: `${baseUrl}/cua-hang/${shop.slug}`,
          lastModified: shop.createdAt ? new Date(shop.createdAt) : undefined,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    } catch (e) {
      console.error('Lỗi parse json cửa hàng cho sitemap:', e);
    }
  }

  // Xử lý Categories
  if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
    try {
      const data = await categoriesRes.value.json();
      const categories: CategoryItem[] = data?.data || [];
      const categoryRoutes = extractCategoryRoutes(categories, baseUrl);
      routes.push(...categoryRoutes);
    } catch (e) {
      console.error('Lỗi parse json danh mục cho sitemap:', e);
    }
  }

  return routes;
}
