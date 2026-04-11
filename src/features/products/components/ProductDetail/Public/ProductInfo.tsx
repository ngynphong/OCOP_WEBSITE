'use client';

import React, { useState } from 'react';
import { Star, MapPin, Package, ShieldCheck, ShoppingCart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductVariant } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { OcopBadge } from './OcopBadge';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.find((v) => v.isDefault) || product.variants[0] || null,
  );

  const price = selectedVariant?.price ?? product.maxPrice;
  const oldPrice = selectedVariant?.comparePrice ?? null;
  const discount =
    oldPrice && price < oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;
  const router = useRouter();
  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-24">
      {/* Name & Badge Area */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <p className="text-stone-400 font-black uppercase tracking-[0.3em] text-[10px]">
            {product.category?.name || 'Sản phẩm OCOP'}
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-stone-900 leading-[1.1] tracking-tight">
            {product.name}
          </h1>
          <p className="text-lg font-bold text-stone-500 mt-1">
            Từ {product.productionArea || product.province?.name || 'Vùng nguyên liệu sạch'}
          </p>
        </div>

        <OcopBadge stars={product.ocopStar} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={cn(
                  'w-4 h-4',
                  s <= Math.round(product.ratingAvg)
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-stone-200 fill-stone-200',
                )}
              />
            ))}
            <span className="ml-1 text-stone-900 font-black text-lg">
              {product.ratingAvg.toFixed(1)}
            </span>
          </div>
          <div className="h-3 w-px bg-stone-200" />
          <span className="text-stone-500 font-bold text-base">
            {product.totalReviews} Đánh giá
          </span>
          <div className="h-3 w-px bg-stone-200" />
          <span className="text-stone-500 font-bold text-base">{product.soldCount} Đã bán</span>
        </div>
      </div>

      {/* Pricing & Buy Box */}
      <div className="bg-stone-50 p-6 md:p-8 rounded-4xl border border-stone-100 flex flex-col gap-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-black text-green-700 tracking-tighter">
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
                    'px-6 py-3.5 rounded-2xl border-2 font-black transition-all text-sm',
                    selectedVariant?.id === variant.id
                      ? 'border-green-600 bg-green-50 text-green-700 shadow-md scale-[1.05]'
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
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-base"
              leftIcon={<ShoppingCart className="w-5 h-5" />}
            >
              Thêm vào giỏ
            </Button>
            <Button
              variant="primary"
              size="lg"
              className="flex-1 h-14 rounded-2xl text-base"
              leftIcon={<Zap className="w-5 h-5" />}
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
      <div className="grid grid-cols-2 gap-6">
        <div className="flex items-center gap-5 p-6 bg-white border border-stone-100 rounded-4xl shadow-sm">
          <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <MapPin className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-black mb-1">
              Xuất xứ
            </p>
            <p className="font-black text-stone-900 text-lg leading-none">
              {product.province?.name || 'Việt Nam'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5 p-6 bg-white border border-stone-100 rounded-4xl shadow-sm">
          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shrink-0">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-stone-400 font-black mb-1">
              Quy cách
            </p>
            <p className="font-black text-stone-900 text-lg leading-none">
              {product.unit || 'Sản phẩm'}
            </p>
          </div>
        </div>
      </div>

      {/* Shop Info Overlay */}
      <div
        onClick={() => router.push(`/cua-hang/${product.shop.slug}`)}
        className="p-8 border bg-stone-100 rounded-[2.5rem] text-white flex items-center justify-between shadow-sm relative overflow-hidden group cursor-pointer"
      >
        <div className="absolute inset-0 bg-linear-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-white shadow-inner">
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
            <p className="text-[10px] uppercase tracking-widest text-gray-700 font-black mb-1">
              Cung cấp bởi
            </p>
            <h4 className="text-xl text-gray-700 font-black tracking-tight leading-tight">
              {product.shop.name}
            </h4>
          </div>
        </div>
        <ShieldCheck className="w-10 h-10 text-lime-400 relative z-10" />
      </div>
    </div>
  );
}
