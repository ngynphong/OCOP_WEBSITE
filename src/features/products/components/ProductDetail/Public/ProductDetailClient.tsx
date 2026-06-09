'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import {
  usePublicProductDetailQuery,
  usePublicProductsQuery,
  useRelatedProductsQuery,
} from '@/features/products/hooks/usePublicProducts';
import { ProductGallery } from '@/features/products/components/ProductDetail/Public/ProductGallery';
import { ProductInfo } from '@/features/products/components/ProductDetail/Public/ProductInfo';
import { ProductTraceability } from '@/features/products/components/ProductDetail/Public/ProductTraceability';
import { ProductStory } from '@/features/products/components/ProductDetail/Public/ProductStory';
import { StickyBottomCTA } from '@/features/products/components/ProductDetail/Public/StickyBottomCTA';
import { ProductCard } from '@/components/ui/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/features/products/types/productTypes';
import { useWishlistStatus } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { ReviewList } from '@/features/reviews/components/ReviewList';
import { QuickBuyModal } from '@/features/checkout/components/QuickBuyModal';
import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';

export function ProductDetailClient() {
  const { slug } = useParams() as { slug: string };
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isQuickBuyModalOpen, setIsQuickBuyModalOpen] = useState(false);

  const { data: productResp, isLoading } = usePublicProductDetailQuery(slug);
  const product = productResp?.data;

  const { data: relatedResp } = useRelatedProductsQuery(slug, 4);
  const relatedProducts: Product[] = relatedResp?.data?.items || [];

  const { data: sameShopResp } = usePublicProductsQuery(
    {
      shopSlug: product?.shop?.slug,
      pageSize: 5,
    },
    { enabled: !!product?.shop?.slug },
  );

  const { data: sameProvinceResp } = usePublicProductsQuery(
    {
      provinceId: product?.province?.id ? product.province.id : undefined,
      pageSize: 5,
    },
    { enabled: !!product?.province?.id },
  );

  const allVisibleProductIds = [
    ...(product?.id ? [product.id] : []),
    ...relatedProducts.map((p) => p.id),
    ...(sameShopResp?.data?.items?.map((p) => p.id) || []),
    ...(sameProvinceResp?.data?.items?.map((p) => p.id) || []),
  ];

  const { data: wishlistStatusData } = useWishlistStatus(
    isAuthenticated ? [...new Set(allVisibleProductIds)] : [],
  );
  const wishlistStatusMap = wishlistStatusData?.data || {};

  const handleBuyNow = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng Mua ngay');
      return;
    }
    setIsQuickBuyModalOpen(true);
  }, [isAuthenticated]);

  if (isLoading) {
    return null;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center flex flex-col items-center gap-6">
            <h1 className="text-4xl font-black text-stone-900 leading-tight">
              Sản phẩm không tồn tại
            </h1>
            <p className="text-stone-500 max-w-md">
              Có vẻ như sản phẩm này đã được gỡ bỏ hoặc bạn đã truy cập sai đường dẫn.
            </p>
            <Link href="/san-pham">
              <button className="px-8 py-4 bg-stone-900 text-white rounded-xl font-black hover:bg-stone-800 transition-colors shadow-xl">
                Quay lại cửa hàng
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Sản phẩm', href: '/san-pham' },
    {
      label: product.category?.name || 'Chi tiết',
      href: `/san-pham?category=${product.category?.id}`,
    },
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-white selection:bg-green-100 selection:text-green-900">
      <Header />

      {/* Sticky Bottom Bar for Mobile */}
      <StickyBottomCTA
        variantId={product.variants.find((v) => v.isDefault)?.id || product.variants[0]?.id || 0}
        inStock={product.inStock}
        price={
          product.variants.find((v) => v.isDefault)?.price ||
          product.variants[0]?.price ||
          product.minPrice
        }
        onBuyNow={handleBuyNow}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 overflow-hidden">
        <div className="mb-8">
          <Breadcrumb items={breadcrumbItems} />
        </div>

        {/* Hero Section: Above the Fold */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 items-start">
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} name={product.name} />
          </div>
          <div className="lg:col-span-5">
            <ProductInfo product={product} isWishlisted={!!wishlistStatusMap[product.id]} />
          </div>
        </div>

        {/* Storytelling Section: Magazine Layout */}
        <div id="story">
          <ProductStory
            name={product.name}
            description={product.description || product.shortDesc || ''}
            images={product.images?.map((img) => img.url) || []}
          />
        </div>

        <div className="mt-16">
          <ProductTraceability journals={product.journals} qrCode={product.qrCode} />
        </div>

        {/* Reviews Section */}
        <div id="reviews" className="mt-16 pt-16 border-t border-stone-100">
          <ReviewList productSlug={slug} />
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between border-b border-stone-100 pb-5">
                <div className="flex flex-col gap-1">
                  <span className="text-green-700 font-black uppercase tracking-[0.2em] text-[10px]">
                    Đề xuất cho bạn
                  </span>
                  <h2 className="text-xl font-black text-stone-900 tracking-tight">
                    Sản phẩm liên quan
                  </h2>
                </div>
                <Link
                  href="/san-pham"
                  className="group flex items-center gap-2 text-stone-900 font-black uppercase tracking-[0.2em] text-[10px] hover:text-green-700 transition-colors"
                >
                  Xem tinh hoa khác
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                {relatedProducts.slice(0, 4).map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    price={p.minPrice}
                    rating={p.ratingAvg || 0}
                    reviewCount={p.totalReviews || 0}
                    image={p.thumbnailUrl || null}
                    ocopStar={p.ocopStar}
                    location={p.provinceName || ''}
                    shopName={p.shopName}
                    categoryName={p.categoryName}
                    soldCount={p.soldCount}
                    isWishlisted={!!wishlistStatusMap[p.id]}
                    inStock={p.inStock}
                    isWholesale={p.variants?.some((v) => v.isWholesaleEnabled)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Cross-selling Sections */}
        <div className="mt-12 flex flex-col gap-12 pb-12">
          {/* Same Shop Products */}
          {sameShopResp?.data?.items && sameShopResp.data.items.length > 1 && (
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between border-b border-stone-100 pb-5">
                <div className="flex flex-col gap-1">
                  <span className="text-green-700 font-black uppercase tracking-[0.2em] text-[10px]">
                    Sản phẩm liên quan
                  </span>
                  <h2 className="text-xl font-black text-stone-900 tracking-tighter">
                    Từ cơ sở {product.shop.name}
                  </h2>
                </div>
                <Link
                  href={`/shop/${product.shop.slug}`}
                  className="group flex items-center gap-3 text-stone-900 font-black uppercase tracking-[0.2em] text-[10px] hover:text-green-700 transition-colors"
                >
                  Xem tất cả
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                {(sameShopResp?.data?.items || [])
                  ?.filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      slug={p.slug}
                      price={p.minPrice}
                      rating={p.ratingAvg || 0}
                      reviewCount={p.totalReviews || 0}
                      image={p.thumbnailUrl || null}
                      ocopStar={p.ocopStar}
                      location={p.provinceName || ''}
                      shopName={p.shopName}
                      categoryName={p.categoryName}
                      isWishlisted={!!wishlistStatusMap[p.id]}
                      inStock={p.inStock}
                      isWholesale={p.variants?.some((v) => v.isWholesaleEnabled)}
                    />
                  ))}
              </div>
            </section>
          )}

          {/* Same Province Products */}
          {sameProvinceResp?.data?.items && sameProvinceResp.data.items.length > 1 && (
            <section className="flex flex-col gap-6">
              <div className="flex items-end justify-between border-b border-stone-100 pb-5">
                <div className="flex flex-col gap-1">
                  <span className="text-amber-600 font-black uppercase tracking-[0.2em] text-[10px]">
                    Đặc sản tỉnh nhà
                  </span>
                  <h2 className="text-xl font-black text-stone-900 tracking-tighter">
                    Sản phẩm từ {product.province?.name}
                  </h2>
                </div>
                <Link
                  href={`/san-pham?provinceIds=${product.province?.id}`}
                  className="group flex items-center gap-3 text-stone-900 font-black uppercase tracking-[0.2em] text-[10px] hover:text-green-700 transition-colors"
                >
                  Khám phá thêm
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
                {(sameProvinceResp?.data?.items || [])
                  ?.filter((p) => p.id !== product.id)
                  .slice(0, 4)
                  .map((p) => (
                    <ProductCard
                      key={p.id}
                      id={p.id}
                      name={p.name}
                      slug={p.slug}
                      price={p.minPrice}
                      rating={p.ratingAvg || 0}
                      reviewCount={p.totalReviews || 0}
                      image={p.thumbnailUrl || null}
                      ocopStar={p.ocopStar}
                      location={p.provinceName || ''}
                      shopName={p.shopName}
                      categoryName={p.categoryName}
                      isWishlisted={!!wishlistStatusMap[p.id]}
                      inStock={p.inStock}
                      isWholesale={p.variants?.some((v) => v.isWholesaleEnabled)}
                    />
                  ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />

      {product && (
        <QuickBuyModal
          isOpen={isQuickBuyModalOpen}
          onClose={() => setIsQuickBuyModalOpen(false)}
          product={product}
          selectedVariant={product.variants.find((v) => v.isDefault) || product.variants[0]}
        />
      )}
    </div>
  );
}
