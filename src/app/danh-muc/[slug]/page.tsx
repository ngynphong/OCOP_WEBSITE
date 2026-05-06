'use client';

import { useParams } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProductCard } from '@/components/ui/ProductCard';
import {
  usePublicCategoryDetailQuery,
  usePublicProductsQuery,
} from '@/features/products/hooks/usePublicProducts';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { Search } from 'lucide-react';
import Image from 'next/image';

export default function CategoryDetailPage() {
  const { slug } = useParams() as { slug: string };
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // 1. Fetch category info
  const { data: categoryData, isPending: isCategoryLoading } = usePublicCategoryDetailQuery(slug);
  const category = categoryData?.data;

  // 2. Fetch products for this category
  const {
    data: productsData,
    isPending: isProductsLoading,
    isError,
  } = usePublicProductsQuery(
    {
      categoryIds: category?.id ? [category.id] : undefined,
      pageSize: 20,
    },
    { enabled: !!category?.id },
  );

  const products = productsData?.data?.items ?? [];

  // 3. Batch Wishlist Status
  const productIds = products.map((p) => p.id);
  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? productIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  const isLoading = isCategoryLoading || isProductsLoading;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50/30">
      <Header />
      <main className="flex-1 pt-8 md:pt-12 pb-16 max-w-7xl mx-auto px-6 md:px-8 w-full">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Sản phẩm', href: '/san-pham' },
            { label: category?.name || 'Danh mục' },
          ]}
          className="mb-8"
        />

        {/* Category Header */}
        <div className="relative w-full h-[200px] md:h-[300px] rounded-[32px] overflow-hidden mb-12 shadow-xl group">
          {category?.bannerUrl ? (
            <Image
              src={category.bannerUrl}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-green-800 to-green-600" />
          )}
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-black font-sans mb-4 drop-shadow-lg">
              {category?.name || (isLoading ? 'Đang tải...' : 'Danh mục')}
            </h1>
            {category?.description && (
              <p className="max-w-2xl text-lg font-medium opacity-90 drop-shadow-md">
                {category.description}
              </p>
            )}
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="flex flex-col">
          {/* Loading state */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-4">
                  <div className="w-full aspect-4/5 bg-stone-100 rounded-[20px] animate-pulse" />
                  <div className="h-6 bg-stone-100 rounded-lg w-3/4 animate-pulse" />
                  <div className="h-4 bg-stone-100 rounded-lg w-1/2 animate-pulse" />
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="w-full h-64 flex flex-col items-center justify-center bg-red-50 rounded-3xl border border-red-100 border-dashed">
              <p className="text-red-500 text-lg font-medium">Không thể tải danh sách sản phẩm.</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 transition"
              >
                Thử lại
              </button>
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={product.minPrice}
                  oldPrice={product.minPrice < product.maxPrice ? product.maxPrice : undefined}
                  rating={product.ratingAvg}
                  reviewCount={product.totalReviews}
                  image={product.thumbnailUrl || ''}
                  ocopStar={product.ocopStar}
                  location={product.provinceName || product.province?.name}
                  unit={product.unit}
                  shopName={product.shopName}
                  categoryName={product.categoryName}
                  soldCount={product.soldCount}
                  isWishlisted={!!wishlistStatusMap[product.id]}
                  inStock={product.inStock}
                />
              ))}
            </div>
          ) : (
            <div className="w-full h-80 flex flex-col items-center justify-center bg-white rounded-3xl border border-stone-100 shadow-sm transition-all hover:shadow-md">
              <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                <Search className="w-8 h-8 text-stone-300" />
              </div>
              <p className="text-stone-500 text-lg font-medium">
                Hiện chưa có sản phẩm nào trong danh mục này.
              </p>
              <p className="text-stone-400 text-sm mt-1">Quay lại sau bạn nhé!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
