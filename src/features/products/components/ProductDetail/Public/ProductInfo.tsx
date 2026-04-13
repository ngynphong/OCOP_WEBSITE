'use client';

import React, { useState } from 'react';
import { Star, MapPin, Package, ShieldCheck, ShoppingCart, Zap, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductVariant } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { OcopBadge } from './OcopBadge';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';

interface ProductInfoProps {
  product: Product;
  isWishlisted?: boolean;
}

export function ProductInfo({ product, isWishlisted = false }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.find((v) => v.isDefault) || product.variants[0] || null,
  );

  const price = selectedVariant?.price ?? product.maxPrice;
  const oldPrice = selectedVariant?.comparePrice ?? null;
  const discount =
    oldPrice && price < oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isWishlistLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
      return;
    }
    if (isWishlisted) {
      removeFromWishlist.mutate(product.id);
    } else {
      addToWishlist.mutate(product.id);
    }
  };

  return (
    <div className="flex flex-col gap-5 lg:sticky lg:top-24">
      {/* Name & Badge Area */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-stone-400 font-black uppercase tracking-[0.3em] text-[10px]">
            {product.category?.name || 'Sản phẩm OCOP'}
          </p>
          <div className="flex justify-between items-start gap-4">
            <h1 className="text-2xl md:text-3xl font-black text-stone-900 leading-[1.1] tracking-tight">
              {product.name}
            </h1>
            <button
              onClick={handleWishlistClick}
              disabled={isWishlistLoading}
              className={cn(
                'p-3 rounded-2xl border transition-all active:scale-95',
                isWishlisted
                  ? 'bg-red-50 border-red-100 text-red-500 shadow-sm'
                  : 'bg-stone-50 border-stone-100 text-stone-400 hover:text-red-500 hover:bg-red-50/50',
              )}
            >
              <Heart className={cn('w-6 h-6', isWishlisted && 'fill-current')} />
            </button>
          </div>
          <p className="text-base font-bold text-stone-500 mt-0.5">
            Từ {product.productionArea || product.province?.name || 'Vùng nguyên liệu sạch'}
          </p>
        </div>

        <OcopBadge stars={product.ocopStar} />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'w-3.5 h-3.5',
                  s <= Math.round(product.ratingAvg)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-stone-200 fill-stone-200',
                )}
              />
            ))}
            <span className="ml-1 text-stone-900 font-black text-base">
              {product.ratingAvg.toFixed(1)}
            </span>
          </div>
          <div className="h-2.5 w-px bg-stone-200" />
          <span className="text-stone-500 font-bold text-sm">{product.totalReviews} Đánh giá</span>
          <div className="h-2.5 w-px bg-stone-200" />
          <span className="text-stone-500 font-bold text-sm">{product.soldCount} Đã bán</span>
        </div>
      </div>

      {/* Pricing & Buy Box */}
      <div className="bg-stone-50 p-5 md:p-6 rounded-3xl border border-stone-100 flex flex-col gap-5 shadow-sm">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-black text-green-700 tracking-tighter">
              {price.toLocaleString('vi-VN')}₫
            </span>
            {oldPrice && oldPrice > price && (
              <span className="text-lg text-stone-400 line-through font-bold">
                {oldPrice.toLocaleString('vi-VN')}₫
              </span>
            )}
            {discount > 0 && (
              <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-lg shadow-red-500/20">
                -{discount}%
              </span>
            )}
          </div>
          <p className="text-stone-400 text-sm font-bold tracking-wide">
            Giá niêm yết từ Chủ thể OCOP
          </p>
        </div>

        {/* Variants */}
        {product.variants.length > 1 && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-black text-stone-400 uppercase tracking-widest">
              Lựa chọn quy cách
            </h3>
            <div className="flex flex-wrap gap-3">
              {product.variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    'px-5 py-2.5 rounded-xl border-2 font-black transition-all text-[13px]',
                    selectedVariant?.id === variant.id
                      ? 'border-green-600 bg-green-50 text-green-700 shadow-md scale-[1.03]'
                      : 'border-white bg-white text-stone-600 hover:border-stone-200 shadow-sm',
                  )}
                >
                  {variant.variantName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Purchase Actions (Desktop) */}
        <div className="hidden md:flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-xl text-sm"
              leftIcon={<ShoppingCart className="w-4 h-4" />}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 h-12 rounded-xl text-sm"
              leftIcon={<Zap className="w-4 h-4" />}
            >
              Mua ngay
            </Button>
          </div>
          <p className="text-center text-stone-400 text-xs font-medium">
            Thanh toán an toàn qua cổng OCOP Payment
          </p>
        </div>
      </div>

      {/* Origin Meta */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-3xl shadow-sm">
          <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 font-black mb-0.5">
              Xuất xứ
            </p>
            <p className="font-black text-stone-900 text-base leading-none">
              {product.province?.name || 'Việt Nam'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 p-4 bg-white border border-stone-100 rounded-3xl shadow-sm">
          <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 font-black mb-0.5">
              Quy cách
            </p>
            <p className="font-black text-stone-900 text-base leading-none">
              {product.unit || 'Sản phẩm'}
            </p>
          </div>
        </div>
      </div>

      {/* Shop Info Overlay */}
      <div
        onClick={() => router.push(`/cua-hang/${product.shop.slug}`)}
        className="p-6 border bg-stone-100 rounded-3xl text-white flex items-center justify-between shadow-sm relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute inset-0 bg-linear-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-5 relative z-10">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-inner">
            {product.shop.logoUrl && (
              <Image
                src={product.shop.logoUrl}
                alt={product.shop.name}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className=" flex flex-col justify-center items-start cursor-pointer">
            <p className="text-[9px] uppercase tracking-widest text-gray-700 font-black mb-0.5">
              Cung cấp bởi
            </p>
            <h4 className="text-lg text-gray-700 font-black tracking-tight leading-tight">
              {product.shop.name}
            </h4>
          </div>
        </div>
        <ShieldCheck className="w-8 h-8 text-lime-400 relative z-10" />
      </div>
    </div>
  );
}
