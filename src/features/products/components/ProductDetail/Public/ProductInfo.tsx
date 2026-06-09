'use client';

import React, { useState, useCallback } from 'react';
import { Star, MapPin, Package, ShoppingCart, Zap, Heart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductVariant } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { OcopBadge } from './OcopBadge';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { CiShop } from 'react-icons/ci';
import { QuickBuyModal } from '@/features/checkout/components/QuickBuyModal';
import { RFQModal } from '@/features/quotations/components/RFQModal';
import { MessageSquareQuote } from 'lucide-react';

interface ProductInfoProps {
  product: Product;
  isWishlisted?: boolean;
}

export function ProductInfo({ product, isWishlisted = false }: ProductInfoProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.find((v) => v.isDefault) || product.variants[0] || null,
  );
  const [isQuickBuyModalOpen, setIsQuickBuyModalOpen] = useState(false);
  const [isRFQModalOpen, setIsRFQModalOpen] = useState(false);

  const price = selectedVariant?.price ?? product.maxPrice;
  const oldPrice = selectedVariant?.comparePrice ?? null;
  const discount =
    oldPrice && price < oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Wishlist
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isWishlistLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  // Cart
  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart();

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

  const handleAddToCart = useCallback(() => {
    const variantId = selectedVariant?.id;
    if (!variantId) return;
    addToCart({ variantId, qty: 1 });
  }, [selectedVariant, addToCart]);

  const handleBuyNow = useCallback(() => {
    const variantId = selectedVariant?.id;
    if (!variantId) return;
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng Mua ngay');
      return;
    }
    setIsQuickBuyModalOpen(true);
  }, [selectedVariant, isAuthenticated]);

  return (
    <>
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
                  'p-3 rounded-xl border transition-all active:scale-95',
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
            <span className="text-stone-500 font-bold text-sm">
              {product.totalReviews} Đánh giá
            </span>
            <div className="h-2.5 w-px bg-stone-200" />
            <span className="text-stone-500 font-bold text-sm">{product.soldCount} Đã bán</span>
          </div>
        </div>

        {/* Pricing & Buy Box */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-stone-100 flex flex-col gap-5 shadow-md hover:shadow-lg transition-shadow">
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
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-stone-400 text-sm font-bold tracking-wide">
                Giá niêm yết từ Chủ thể OCOP
              </p>
              {selectedVariant?.minQuantity && selectedVariant.minQuantity > 1 && (
                <div className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md border border-green-100 text-[10px] font-black uppercase tracking-wider">
                  Bán buôn tối thiểu {selectedVariant.minQuantity} {product.unit || 'sản phẩm'}
                </div>
              )}
            </div>
          </div>

          {/* Wholesale Prices Table */}
          {selectedVariant?.isWholesaleEnabled &&
            selectedVariant.wholesalePrices &&
            selectedVariant.wholesalePrices.length > 0 && (
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-4 bg-amber-500 rounded-full" />
                  <h4 className="text-[10px] font-black text-amber-800 uppercase tracking-widest">
                    Bảng giá sỉ ưu đãi
                  </h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {selectedVariant.wholesalePrices.map((wp, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col bg-white/60 p-3 rounded-xl border border-amber-200/50 hover:bg-white transition-colors"
                    >
                      <span className="text-[10px] text-amber-600 font-bold uppercase mb-0.5">
                        Từ {wp.minQuantity} {product.unit || 'sản phẩm'}
                      </span>
                      <span className="text-sm font-black text-amber-900">
                        {wp.price.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-amber-600/70 font-medium mt-3 italic">
                  * Giá sỉ được áp dụng tự động khi mua đủ số lượng
                </p>
              </div>
            )}

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
                      'px-5 py-2.5 rounded-xl border-2 font-black transition-all text-[13px] active:scale-95 focus:outline-none',
                      selectedVariant?.id === variant.id
                        ? 'border-emerald-600 ring-2 ring-emerald-500 ring-offset-2 bg-emerald-50 text-emerald-700 shadow-md'
                        : 'border-stone-100 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-700 shadow-sm',
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
            {(selectedVariant ? selectedVariant.inStock === false : product.inStock === false) ? (
              <div className="flex flex-col gap-3">
                <div className="w-full py-4 bg-stone-100 text-stone-400 rounded-xl font-black text-center text-sm border border-stone-200 uppercase tracking-widest">
                  Sản phẩm hiện đang hết hàng
                </div>
                <p className="text-center text-stone-400 text-xs font-medium">
                  Vui lòng quay lại sau hoặc chọn sản phẩm tương tự
                </p>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  {/* Thêm vào giỏ */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 rounded-xl text-sm"
                    leftIcon={
                      isAddingToCart ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )
                    }
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedVariant}
                  >
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
                  </Button>

                  {/* Mua ngay: thêm vào giỏ rồi navigate */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 h-12 rounded-xl text-sm"
                    leftIcon={
                      isAddingToCart ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )
                    }
                    onClick={handleBuyNow}
                    disabled={isAddingToCart || !selectedVariant}
                  >
                    Mua ngay
                  </Button>
                </div>

                {/* RFQ Action */}
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-12 rounded-xl text-sm border-stone-200 text-stone-600 hover:bg-stone-50"
                  leftIcon={<MessageSquareQuote className="w-4 h-4" />}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Vui lòng đăng nhập để gửi yêu cầu báo giá');
                      return;
                    }
                    setIsRFQModalOpen(true);
                  }}
                >
                  Yêu cầu báo giá sỉ
                </Button>

                <p className="text-center text-stone-400 text-[10px] font-medium">
                  Đơn hàng sỉ từ {selectedVariant?.minQuantity || 10} sản phẩm, thỏa thuận giá & vận
                  chuyển trực tiếp với Shop.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Origin Meta */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 bg-white border border-stone-100 rounded-xl shadow-sm">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shrink-0">
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
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-4 p-3 sm:p-4 bg-white border border-stone-100 rounded-xl shadow-sm">
            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
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
          className="p-6 border bg-stone-100 rounded-xl text-white flex items-center justify-between shadow-sm relative overflow-hidden group cursor-pointer"
        >
          <div className="absolute inset-0 bg-linear-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-5 relative z-10">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white shadow-inner">
              {product.shop.logoUrl ? (
                <Image
                  src={product.shop.logoUrl}
                  alt={product.shop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <Image
                  src="/images/shop-default.jpg"
                  alt={product.shop.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
            </div>
            <div className="flex flex-col justify-center items-start cursor-pointer min-w-0">
              <p className="text-[9px] uppercase tracking-widest text-gray-700 font-black mb-0.5">
                Cung cấp bởi
              </p>
              <h4 className="text-base sm:text-lg text-gray-700 font-black tracking-tight leading-tight truncate w-full">
                {product.shop.name}
              </h4>
            </div>
          </div>
          <CiShop className="w-8 h-8 text-lime-600 relative z-10" />
        </div>
      </div>

      {selectedVariant && (
        <>
          <QuickBuyModal
            isOpen={isQuickBuyModalOpen}
            onClose={() => setIsQuickBuyModalOpen(false)}
            product={product}
            selectedVariant={selectedVariant}
          />
          <RFQModal
            isOpen={isRFQModalOpen}
            onClose={() => setIsRFQModalOpen(false)}
            product={product}
            selectedVariant={selectedVariant}
          />
        </>
      )}
    </>
  );
}
