'use client';

import { useState, useEffect, memo } from 'react';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  Star,
  Leaf,
  Heart,
  Apple,
  Citrus,
  Grape,
  Carrot,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeaturedProductsQuery } from '@/features/products/hooks/usePublicProducts';
import {
  useWishlistStatus,
  useAddToWishlist,
  useRemoveFromWishlist,
} from '@/features/wishlist/hooks/useWishlist';
import { useAppSelector } from '@/store/hooks';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const floatingIcons = [
  { Icon: Apple, top: '10%', left: '5%', size: 40, delay: '0s', duration: '4s' },
  { Icon: Leaf, top: '25%', right: '10%', size: 30, delay: '1s', duration: '5s' },
  { Icon: Carrot, bottom: '15%', left: '12%', size: 35, delay: '2s', duration: '4.5s' },
  { Icon: Citrus, top: '60%', right: '5%', size: 45, delay: '0.5s', duration: '6s' },
  { Icon: Grape, top: '40%', left: '48%', size: 25, delay: '1.5s', duration: '5.5s' },
  { Icon: Leaf, bottom: '5%', right: '45%', size: 20, delay: '0s', duration: '4s' },
];

export const HeroSection = memo(function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const { data: featuredResp, isLoading: isProductsLoading } = useFeaturedProductsQuery(12);
  const products = featuredResp?.data?.items || [];

  const productIds = products.map((p) => p.id);
  const { data: wishlistStatusData } = useWishlistStatus(isAuthenticated ? productIds : []);
  const wishlistStatusMap = wishlistStatusData?.data || {};

  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const isWishlistLoading = addToWishlist.isPending || removeFromWishlist.isPending;

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  const handleWishlistToggle = (e: React.MouseEvent, productId: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để yêu thích sản phẩm');
      return;
    }

    if (wishlistStatusMap[productId]) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId);
    }
  };

  const handleBuyNow = (slug: string) => {
    router.push(`/san-pham/${slug}`);
  };

  return (
    <section className="relative w-full bg-[#113B28] overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#9C6644]/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none" />

      {/* Floating Icons */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {isMounted &&
          floatingIcons.map(({ Icon, top, left, right, bottom, size, delay, duration }, index) => (
            <div
              key={index}
              className="absolute text-emerald-50/30 animate-float-y"
              style={
                {
                  top,
                  left,
                  right,
                  bottom,
                  width: size,
                  height: size,
                  '--float-delay': delay,
                  '--float-duration': duration,
                } as React.CSSProperties
              }
            >
              <div
                className="animate-slow-rotate"
                style={
                  {
                    '--float-duration': duration,
                  } as React.CSSProperties
                }
              >
                <Icon size={size} strokeWidth={2} />
              </div>
            </div>
          ))}
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* Left Column */}
        <div className="w-full lg:w-7/12 flex flex-col justify-start items-start">
          <div className="px-4 py-1.5 bg-white/10 border border-white/20 rounded-full inline-flex items-center gap-2 mb-8 backdrop-blur-sm">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-white/90 text-[10px] md:text-xs font-bold tracking-widest uppercase">
              Nền tảng TMĐT OCOP Việt Nam
            </span>
          </div>

          <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-bold font-sans leading-[1.1] md:leading-[1.15] mb-6">
            Tinh Hoa
            <br />
            <span className="text-[#D4AF37]">Đất Việt</span>
          </h1>

          <p className="text-emerald-50/80 text-base md:text-lg max-w-lg mb-12 font-sans leading-relaxed">
            Kết nối nông dân • Nghệ nhân • Người tiêu dùng
            <br />
            Truy xuất nguồn gốc 100% qua QR
          </p>

          <form
            className="w-full max-w-xl bg-white rounded-xl md:rounded-full p-1.5 md:p-2 flex flex-col sm:flex-row items-center shadow-2xl mb-12 transition-all focus-within:ring-4 focus-within:ring-white/20 gap-2 sm:gap-0"
            onSubmit={(e) => {
              e.preventDefault();
              const q = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
              if (q) router.push(`/san-pham?keyword=${encodeURIComponent(q)}`);
            }}
          >
            <div className="flex items-center w-full flex-1 px-2">
              <Search className="w-5 h-5 text-gray-400 ml-2 md:ml-4 shrink-0" />
              <input
                name="search"
                type="text"
                placeholder="Tìm mật ong, trà, gạo ST25, lụa Bảo Lộc..."
                className="w-full bg-transparent border-none outline-none px-3 md:px-4 py-2 md:py-0 text-sm md:text-base text-gray-800 placeholder:text-gray-400 font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#2A5C45] text-white px-6 md:px-8 py-3.5 md:py-3 rounded-xl sm:rounded-full text-sm md:text-base font-bold font-sans hover:bg-[#1f4734] transition-all shadow-md shrink-0 active:scale-95 sm:hover:-translate-y-px"
            >
              Tìm kiếm
            </button>
          </form>

          <div className="w-full grid grid-cols-4 gap-4 md:gap-8">
            <StatItem value="12K+" label="Sản phẩm OCOP" />
            <StatItem value="3.400+" label="Cửa hàng" />
            <StatItem value="63" label="Tỉnh thành" />
            <StatItem value="100%" label="Blockchain" />
          </div>
        </div>

        {/* Right Carousel Column */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end items-center mt-12 lg:mt-0 relative h-[520px]">
          {!isMounted || isProductsLoading ? (
            <div className="w-full max-w-[400px] h-[480px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-center">
              <Loader2 className="w-10 h-10 text-[#D4AF37] animate-spin" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {products.length > 0 &&
                products.map(
                  (item, idx) =>
                    idx === currentIndex && (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -40, scale: 0.95 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="absolute right-0 top-0 w-full max-w-[400px] md:max-w-[440px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl origin-right z-20"
                      >
                        <div
                          className="relative rounded-2xl bg-[#FCF8F2] h-[240px] w-full flex items-center justify-center p-6 overflow-hidden shadow-inner group cursor-pointer"
                          onClick={() => router.push(`/san-pham/${item.slug}`)}
                        >
                          {/* OCOP Badge */}
                          <div className="absolute top-3 right-3 bg-[#113B28] text-white text-[10px] md:text-xs font-black px-3 py-1.5 flex flex-col items-center rounded-full z-10 border border-green-800/20 shadow-lg">
                            <span>OCOP</span>
                            <span className="flex items-center gap-0.5 text-[#D4AF37]">
                              {item.ocopStar}
                              <Star className="w-2.5 h-2.5 fill-current" />
                            </span>
                          </div>
                          {/* Product Image */}
                          <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out">
                            <Image
                              src={item.thumbnailUrl || '/images/tra-do-uong.jpg'}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 400px"
                              className="object-contain drop-shadow-2xl"
                              priority={currentIndex === 0}
                            />
                          </div>
                        </div>

                        <div className="mt-6 flex flex-col">
                          <h3 className="text-white font-sans text-xl md:text-2xl font-bold leading-tight line-clamp-1">
                            {item.name}
                          </h3>
                          <p className="text-white/60 text-xs md:text-sm font-sans mt-1.5 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block" />
                            {item.shopName || 'Chủ thể OCOP'}
                          </p>

                          <div className="flex items-center gap-1 mt-2 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'w-3.5 h-3.5',
                                  i < Math.round(item.ratingAvg)
                                    ? 'text-[#D4AF37] fill-[#D4AF37]'
                                    : 'text-white/20 fill-white/20',
                                )}
                              />
                            ))}
                            <span className="text-[#D4AF37] font-bold text-xs md:text-sm ml-1.5">
                              {item.ratingAvg.toFixed(1)}
                            </span>
                          </div>

                          <div className="flex flex-col mb-6">
                            <span className="text-[#D4AF37] font-bold text-2xl md:text-3xl font-sans">
                              {item.minPrice.toLocaleString('vi-VN')}₫
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleBuyNow(item.slug)}
                              className="flex-1 bg-linear-to-r from-[#D4AF37] to-[#C2A052] hover:brightness-110 text-[#133D29] py-3.5 rounded-xl font-bold text-sm md:text-base border-none outline-none shadow-xl transition-all flex items-center justify-center gap-2 group active:scale-95"
                            >
                              <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:-rotate-12 transition-transform" />{' '}
                              Mua ngay
                            </button>
                            <button
                              onClick={(e) => handleWishlistToggle(e, item.id)}
                              disabled={isWishlistLoading}
                              className={cn(
                                'px-5 py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center group active:scale-95',
                                wishlistStatusMap[item.id]
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/10 hover:bg-white/20 text-white',
                              )}
                            >
                              <Heart
                                className={cn(
                                  'w-4 h-4 md:w-5 md:h-5 transition-colors',
                                  wishlistStatusMap[item.id] && 'fill-current',
                                )}
                              />
                              <span className="sr-only">Yêu thích</span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ),
                )}
            </AnimatePresence>
          )}

          {/* Dots Indicator */}
          {!isProductsLoading && products.length > 0 && (
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer 
                    ${idx === currentIndex ? 'w-8 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

const StatItem = memo(({ value, label }: { value: string; label: string }) => (
  <div className="flex flex-col">
    <p className="text-[#D4AF37] text-xl md:text-3xl font-black font-sans tracking-tight">
      {value}
    </p>
    <p className="text-white/70 text-[10px] md:text-xs mt-1 font-medium tracking-wide">{label}</p>
  </div>
));
StatItem.displayName = 'StatItem';
