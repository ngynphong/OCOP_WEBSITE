import React, { useState, useCallback } from 'react';
import {
  Star,
  MapPin,
  Package,
  ShoppingCart,
  Zap,
  Heart,
  Loader2,
  ChevronRight,
  MessageSquareQuote,
  ShieldCheck,
  Scale,
  Award,
  Bell,
  QrCode,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Product, ProductVariant } from '@/features/products/types/productTypes';
import { Button } from '@/components/ui/AppButton';
import { OcopBadge } from './OcopBadge';
import Image from 'next/image';
import { useAddToWishlist, useRemoveFromWishlist } from '@/features/wishlist/hooks/useWishlist';
import { useAddToCart } from '@/features/cart/hooks/useCart';
import { useAppSelector } from '@/store/hooks';
import toast from 'react-hot-toast';
import { QuickBuyModal } from '@/features/checkout/components/QuickBuyModal';
import { RFQModal } from '@/features/quotations/components/RFQModal';
import Link from 'next/link';

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
  const [quantity, setQuantity] = useState<number>(1);

  const price = selectedVariant?.price ?? product.maxPrice;
  const oldPrice = selectedVariant?.comparePrice ?? null;
  const discount =
    oldPrice && price < oldPrice ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0;

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
    addToCart({ variantId, qty: quantity });
  }, [selectedVariant, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    const variantId = selectedVariant?.id;
    if (!variantId) return;
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để sử dụng tính năng Mua ngay');
      return;
    }
    setIsQuickBuyModalOpen(true);
  }, [selectedVariant, isAuthenticated]);

  const originLocation =
    product.productionArea && product.province?.name
      ? `${product.productionArea}, ${product.province.name}`
      : product.productionArea || product.province?.name || 'Chưa cập nhật';

  const weightDisplay =
    selectedVariant?.weightGram || product.weightGram
      ? `${selectedVariant?.weightGram || product.weightGram}g`
      : null;

  return (
    <>
      <div className="flex flex-col gap-5 lg:sticky lg:top-24">
        {/* 1. Header Identity & Trust Area */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
              {product.category?.name || 'Chưa cập nhật'}
            </span>

            <div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl md:text-3xl font-black text-stone-900 leading-tight tracking-tight">
                {product.name}
              </h1>
              <button
                onClick={handleWishlistClick}
                disabled={isWishlistLoading}
                aria-label={isWishlisted ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
                className={cn(
                  'p-2.5 rounded-xl border transition-all active:scale-95 shrink-0 cursor-pointer',
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-500 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-400 hover:text-rose-500 hover:bg-rose-50/50',
                )}
              >
                <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
              </button>
            </div>
          </div>

          {/* Unified Trust Bar: OCOP Star + Rating + Sold + Origin */}
          <div className="flex flex-wrap items-center gap-y-2 gap-x-3 pt-0.5">
            <OcopBadge stars={product.ocopStar} />

            <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" />
                <span className="ml-1 text-stone-900 font-black">
                  {product.ratingAvg > 0 ? product.ratingAvg.toFixed(1) : 'Chưa có'}
                </span>
              </div>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">{product.totalReviews} đánh giá</span>
              <span className="text-stone-300">•</span>
              <span className="text-stone-500">{product.soldCount} đã bán</span>
            </div>

            <div className="w-full flex items-center gap-1.5 text-xs text-stone-600 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Xuất xứ: <strong className="text-stone-800">{originLocation}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* 2. Primary Buy Box */}
        <div className="bg-white p-5 md:p-6 rounded-2xl border border-stone-200/90 flex flex-col gap-5 shadow-xs">
          {/* Price Area */}
          <div className="flex flex-col gap-1 pb-4 border-b border-stone-100">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl md:text-4xl font-black text-emerald-700 tracking-tight">
                {price.toLocaleString('vi-VN')}₫
              </span>
              {oldPrice && oldPrice > price && (
                <span className="text-base md:text-lg text-stone-400 line-through font-semibold">
                  {oldPrice.toLocaleString('vi-VN')}₫
                </span>
              )}
              {discount > 0 && (
                <span className="bg-rose-500 text-white px-2 py-0.5 rounded-lg text-xs font-black shadow-xs">
                  -{discount}%
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
              <span>Giá niêm yết từ Chủ thể OCOP</span>
              {selectedVariant?.minQuantity && selectedVariant.minQuantity > 1 && (
                <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-bold text-[11px] border border-emerald-100">
                  Bán buôn tối thiểu {selectedVariant.minQuantity} {product.unit || 'sp'}
                </span>
              )}
            </div>
          </div>

          {/* Variants Selector (FIRST) */}
          {product.variants.length > 1 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-700 uppercase tracking-wider">
                  Quy cách đóng gói
                </span>
                {selectedVariant && (
                  <span className="text-stone-500">
                    Đang chọn:{' '}
                    <strong className="text-stone-800">{selectedVariant.variantName}</strong>
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.id === variant.id;
                  const isOutOfStock =
                    variant.inStock === false ||
                    (variant.stockQty !== undefined && variant.stockQty <= 0);

                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() => setSelectedVariant(variant)}
                      disabled={isOutOfStock}
                      className={cn(
                        'p-2.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer',
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 text-emerald-950 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/50 text-stone-700',
                        isOutOfStock &&
                          'opacity-50 cursor-not-allowed bg-stone-100 border-stone-200',
                      )}
                    >
                      <span className="text-xs font-bold truncate block">
                        {variant.variantName}
                      </span>
                      <span
                        className={cn(
                          'text-xs font-semibold mt-1 block',
                          isSelected ? 'text-emerald-700 font-black' : 'text-stone-500',
                        )}
                      >
                        {variant.price.toLocaleString('vi-VN')}₫
                      </span>
                      {isOutOfStock && (
                        <span className="text-[10px] text-rose-500 font-medium mt-0.5">
                          Hết hàng
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Specs Highlight (Linked to selected variant) */}
          <div className="grid grid-cols-2 gap-2 p-3 bg-stone-50/80 rounded-xl border border-stone-100 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Package className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-stone-500 shrink-0">Đơn vị:</span>
              <span className="font-bold text-stone-800 truncate">
                {product.unit || 'Chưa cập nhật'}
              </span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Scale className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-stone-500 shrink-0">Khối lượng:</span>
              <span className="font-bold text-stone-800 truncate">
                {weightDisplay || 'Chưa cập nhật'}
              </span>
            </div>
          </div>

          {/* Wholesale Prices Table (SECOND - Underneath Variant Selector) */}
          {selectedVariant?.isWholesaleEnabled &&
            selectedVariant.wholesalePrices &&
            selectedVariant.wholesalePrices.length > 0 && (
              <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/60 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-3.5 bg-amber-500 rounded-full" />
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                      Ưu đãi giá sỉ cho {selectedVariant.variantName}
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-full">
                    Áp dụng tự động
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {selectedVariant.wholesalePrices.map((wp, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col bg-white p-2.5 rounded-lg border border-amber-200/50 shadow-xs"
                    >
                      <span className="text-[11px] text-amber-700 font-semibold">
                        Từ {wp.minQuantity} {product.unit || 'sản phẩm'}
                      </span>
                      <span className="text-sm font-black text-amber-950 mt-0.5">
                        {wp.price.toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Purchase Actions (Desktop) */}
          <div className="hidden md:flex flex-col gap-3">
            {product.commercialStatus === 'AWAITING_LOT' ? (
              <div className="flex flex-col gap-3 p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  Sản phẩm OCOP mới duyệt • Đang chờ mẻ thu hoạch / xuất xưởng
                </div>
                <p className="text-amber-800/80 text-xs leading-relaxed">
                  Sản phẩm đã đạt chuẩn OCOP {product.ocopStar} sao. Chủ thể đang chuẩn bị thu hoạch
                  vụ mới hoặc đang trong công đoạn đóng gói để nhập kho mở bán.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Bell className="w-4 h-4 text-amber-700" />}
                  className="w-full bg-white border-amber-300 text-amber-800 hover:bg-amber-100/50 font-bold rounded-xl"
                  onClick={() =>
                    toast.success(
                      'Đã ghi nhận yêu cầu! Bạn sẽ nhận được thông báo ngay khi mẻ mới lên kệ.',
                    )
                  }
                >
                  Nhận thông báo khi mở bán
                </Button>
              </div>
            ) : product.commercialStatus === 'IN_PRODUCTION' ? (
              <div className="flex flex-col gap-3 p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Vụ mùa đang canh tác & sơ chế đóng gói
                </div>
                <p className="text-emerald-800/80 text-xs leading-relaxed">
                  Lô sản xuất đang được vận hành và ghi nhật ký chuỗi cung ứng chuẩn OCOP. Hàng sẽ
                  sẵn sàng đặt mua ngay khi hoàn thành kiểm định KCS.
                </p>
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Bell className="w-4 h-4 text-emerald-700" />}
                  className="w-full bg-white border-emerald-300 text-emerald-800 hover:bg-emerald-100/50 font-bold rounded-xl"
                  onClick={() =>
                    toast.success('Đã ghi nhận! Bạn sẽ nhận được thông báo khi lô hàng xuất xưởng.')
                  }
                >
                  Nhận thông báo khi xuất xưởng
                </Button>
              </div>
            ) : (
                selectedVariant ? selectedVariant.inStock === false : product.inStock === false
              ) ? (
              <div className="flex flex-col gap-3">
                <div className="w-full py-4 bg-stone-100 text-stone-500 rounded-xl font-bold text-center text-sm border border-stone-200 uppercase tracking-wider">
                  {product.commercialStatus === 'OUT_OF_STOCK'
                    ? 'Tạm hết mẻ này • Mời theo dõi vụ tiếp theo'
                    : 'Sản phẩm hiện đang hết hàng'}
                </div>
                <p className="text-center text-stone-400 text-xs font-medium">
                  Vui lòng quay lại sau hoặc chọn sản phẩm tương tự
                </p>
              </div>
            ) : (
              <>
                {/* Quantity + Add to Cart + Buy Now row */}
                <div className="flex items-center gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-stone-200 rounded-xl h-12 bg-white shrink-0 overflow-hidden shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                      disabled={quantity <= 1}
                      className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer text-base font-bold"
                      aria-label="Giảm số lượng"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={selectedVariant?.stockQty || 999}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) setQuantity(val);
                      }}
                      className="w-12 text-center text-sm font-bold text-stone-800 border-none outline-hidden focus:ring-0 p-0"
                    />
                    <button
                      type="button"
                      onClick={() => setQuantity((prev) => prev + 1)}
                      className="w-10 h-full flex items-center justify-center text-stone-600 hover:bg-stone-100 transition cursor-pointer text-base font-bold"
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>

                  {/* Thêm vào giỏ */}
                  <Button
                    variant="outline"
                    size="lg"
                    className="flex-1 h-12 rounded-xl text-sm font-bold border-stone-200 hover:bg-stone-50 text-stone-700"
                    leftIcon={
                      isAddingToCart ? (
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      ) : (
                        <ShoppingCart className="w-4 h-4 text-emerald-600" />
                      )
                    }
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !selectedVariant}
                  >
                    {isAddingToCart ? 'Đang thêm...' : 'Thêm vào giỏ'}
                  </Button>

                  {/* Mua ngay */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1 h-12 rounded-xl text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                    leftIcon={
                      isAddingToCart ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Zap className="w-4 h-4 fill-current" />
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
                  size="md"
                  className="w-full h-11 rounded-xl text-xs font-bold border-dashed border-stone-300 text-stone-700 hover:bg-stone-50 hover:border-emerald-400 hover:text-emerald-700 transition-colors"
                  leftIcon={<MessageSquareQuote className="w-4 h-4" />}
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Vui lòng đăng nhập để gửi yêu cầu báo giá');
                      return;
                    }
                    setIsRFQModalOpen(true);
                  }}
                >
                  Yêu cầu báo giá sỉ cho đối tác / đại lý
                </Button>
              </>
            )}
          </div>

          {/* Quality Commitments */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
            <div className="flex flex-col items-center gap-1">
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-[11px] font-bold text-stone-700">
                {product.ocopStar ? `OCOP ${product.ocopStar} sao` : 'Chưa cập nhật'}
              </span>
              <span className="text-[10px] text-stone-400">Đã thẩm định</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <QrCode className="w-4 h-4 text-emerald-600" />
              <span className="text-[11px] font-bold text-stone-700">Truy xuất QR</span>
              <span className="text-[10px] text-stone-400">Từng lô hàng</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[11px] font-bold text-stone-700">Chính hãng 100%</span>
              <span className="text-[10px] text-stone-400">Từ Chủ thể OCOP</span>
            </div>
          </div>
        </div>

        {/* 3. Shop Info Overlay */}
        <Link
          href={product.shop?.slug ? `/cua-hang/${product.shop.slug}` : '#'}
          aria-label={`Xem cửa hàng ${product.shop?.name || 'Chủ thể'}`}
          className="p-4 bg-stone-50/80 hover:bg-white border border-stone-200/80 rounded-2xl flex items-center justify-between shadow-xs transition-all group cursor-pointer"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white border border-stone-200/80 shrink-0">
              <Image
                src={product.shop?.logoUrl || '/images/shop-default.jpg'}
                alt={product.shop?.name || 'Cửa hàng'}
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">
                Chủ thể sản xuất OCOP
              </p>
              <h4 className="text-sm font-bold text-stone-900 truncate group-hover:text-emerald-700 transition-colors">
                {product.shop.name || 'Chưa cập nhật'}
              </h4>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs font-semibold text-stone-500 group-hover:text-emerald-700 shrink-0">
            <span>Xem shop</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </Link>
      </div>

      {selectedVariant && (
        <>
          <QuickBuyModal
            isOpen={isQuickBuyModalOpen}
            onClose={() => setIsQuickBuyModalOpen(false)}
            product={product}
            selectedVariant={selectedVariant}
            initialQuantity={quantity}
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
