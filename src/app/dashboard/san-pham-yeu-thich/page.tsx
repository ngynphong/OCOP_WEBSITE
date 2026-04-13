'use client';

import React, { useState } from 'react';
import {
  useWishlist,
  useMoveToCart,
  useWishlistStatus,
} from '@/features/wishlist/hooks/useWishlist';
import { ProductCard } from '@/components/ui/ProductCard';
import { FiHeart, FiShoppingBag, FiArrowRight, FiLoader } from 'react-icons/fi';
import Link from 'next/link';
import { Button } from '@/components/ui/AppButton';

export default function WishlistPage() {
  const [page, setPage] = useState(1);
  const { data: wishlistData, isLoading, isError } = useWishlist(page, 12);
  const moveToCartMutation = useMoveToCart();

  const items = wishlistData?.data?.content || [];
  const totalElements = wishlistData?.data?.totalElements || 0;
  const totalPages = wishlistData?.data?.totalPages || 0;

  // Batching Wishlist Status for red heart display
  const productIds = items.map((item) => item.productId);
  const { data: statusData } = useWishlistStatus(productIds);
  const wishlistStatusMap = statusData?.data || {};

  const handleMoveAllToCart = () => {
    if (items.length === 0) return;
    const ids = items.map((item) => item.productId);
    moveToCartMutation.mutate({ productIds: ids, qty: 1 });
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <FiLoader className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-96 flex flex-col items-center justify-center gap-4">
        <p className="text-stone-500 font-medium">Có lỗi xảy ra khi tải danh sách yêu thích.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-green-600 text-white rounded-full font-bold"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900 uppercase tracking-tight">
            Sản phẩm yêu thích
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Bạn đang có <span className="font-bold text-green-600">{totalElements}</span> sản phẩm
            trong danh sách
          </p>
        </div>

        {items.length > 0 && (
          <Button
            variant="primary"
            onClick={handleMoveAllToCart}
            disabled={moveToCartMutation.isPending}
            className="flex items-center justify-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-stone-800 transition-all shadow-lg hover:shadow-stone-200/50 disabled:opacity-50"
          >
            <FiShoppingBag />
            <span>Chuyển tất cả vào giỏ</span>
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-[40px] p-12 border border-stone-100 shadow-xl shadow-stone-200/40 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center text-stone-200 mb-6">
            <FiHeart size={48} />
          </div>
          <h2 className="text-xl font-bold text-stone-900">Danh sách yêu thích trống</h2>
          <p className="text-stone-500 mt-2 max-w-xs">
            Hãy khám phá các sản phẩm OCOP chất lượng và lưu lại những món đồ bạn yêu thích nhé!
          </p>
          <Link
            href="/"
            className="mt-8 flex items-center gap-2 text-green-600 font-bold hover:gap-3 transition-all"
          >
            <span>Tiếp tục mua sắm</span>
            <FiArrowRight />
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ProductCard
                key={item.productId}
                id={item.productId}
                name={item.productName}
                slug={item.productSlug}
                price={item.minPrice}
                image={item.thumbnailUrl}
                rating={item.ratingAvg}
                reviewCount={0}
                shopName={item.shopName}
                isWishlisted={wishlistStatusMap[item.productId] ?? true} // Ưu tiên từ Map, mặc định là true vì đang ở trang Wishlist
                ocopStar={
                  typeof item.ocopStar === 'number'
                    ? item.ocopStar
                    : parseInt(String(item.ocopStar))
                }
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${
                    page === i + 1
                      ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                      : 'bg-white text-stone-600 border border-stone-100 hover:bg-stone-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
