'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingCart, Star, Leaf } from 'lucide-react';

const carouselItems = [
  {
    name: 'Trà Shan Tuyết Hà Giang',
    shop: 'HTX Lũng Phìn - Hà Giang',
    rating: 4.9,
    price: '120.000đ',
    oldPrice: '160.000đ',
    discount: '-25%',
    image: '/images/tra-do-uong.jpg',
    ocop: '5★',
  },
  {
    name: 'Cà Rốt Đà Lạt Hữu Cơ',
    shop: 'Đà Lạt Farm - Lâm Đồng',
    rating: 4.8,
    price: '45.000đ',
    oldPrice: '60.000đ',
    discount: '-25%',
    image: '/images/fresh-green-produce.jpg',
    ocop: '4★',
  },
  {
    name: 'Gia vị Mắc Khén Tây Bắc',
    shop: 'Bản Loong - Sơn La',
    rating: 5.0,
    price: '85.000đ',
    oldPrice: '100.000đ',
    discount: '-15%',
    image: '/images/gia-vi-ban-dia.jpg',
    ocop: '4★',
  },
];

export function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full bg-[#113B28] overflow-hidden">
      {/* Background Orbs / Glow Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-500/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#9C6644]/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 mix-blend-overlay pointer-events-none" />

      <div className="relative w-full max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center gap-16 z-10">
        {/* Left Content Column */}
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
            Truy xuất nguồn gốc 100% qua QR & Blockchain
          </p>

          <form
            className="w-full max-w-xl bg-white rounded-2xl md:rounded-full p-1.5 md:p-2 flex flex-col sm:flex-row items-center shadow-2xl mb-12 transition-all focus-within:ring-4 focus-within:ring-white/20 gap-2 sm:gap-0"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center w-full flex-1 px-2">
              <Search className="w-5 h-5 text-gray-400 ml-2 md:ml-4 shrink-0" />
              <input
                type="text"
                placeholder="Tìm mật ong, trà, gạo ST25, lụa Bảo Lộc..."
                className="w-full bg-transparent border-none outline-none px-3 md:px-4 py-2 md:py-0 text-sm md:text-base text-gray-800 placeholder:text-gray-400 font-sans"
                required
                suppressHydrationWarning
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#2A5C45] text-white px-6 md:px-8 py-3.5 md:py-3 rounded-xl sm:rounded-full text-sm md:text-base font-bold font-sans hover:bg-[#1f4734] transition-all shadow-md shrink-0 active:scale-95 sm:hover:-translate-y-px"
              suppressHydrationWarning
            >
              Tìm kiếm
            </button>
          </form>

          <div className="w-full grid grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col">
              <p className="text-[#D4AF37] text-xl md:text-3xl font-black font-sans tracking-tight">
                12K+
              </p>
              <p className="text-white/70 text-[10px] md:text-xs mt-1 font-medium tracking-wide">
                Sản phẩm OCOP
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#D4AF37] text-xl md:text-3xl font-black font-sans tracking-tight">
                3.400+
              </p>
              <p className="text-white/70 text-[10px] md:text-xs mt-1 font-medium tracking-wide">
                Cửa hàng
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#D4AF37] text-xl md:text-3xl font-black font-sans tracking-tight">
                63
              </p>
              <p className="text-white/70 text-[10px] md:text-xs mt-1 font-medium tracking-wide">
                Tỉnh thành
              </p>
            </div>
            <div className="flex flex-col">
              <p className="text-[#D4AF37] text-xl md:text-3xl font-black font-sans tracking-tight">
                100%
              </p>
              <p className="text-white/70 text-[10px] md:text-xs mt-1 font-medium tracking-wide">
                Blockchain
              </p>
            </div>
          </div>
        </div>

        {/* Right Carousel Column */}
        <div className="w-full lg:w-5/12 flex justify-center lg:justify-end items-center mt-12 lg:mt-0 relative h-[520px]">
          {carouselItems.map((item, idx) => (
            <div
              key={idx}
              className={`absolute right-0 top-0 w-full max-w-[400px] md:max-w-[440px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 shadow-2xl transition-all duration-700 ease-in-out transform origin-right
                ${
                  idx === currentIndex
                    ? 'opacity-100 translate-x-0 scale-100 pointer-events-auto z-20'
                    : 'opacity-0 translate-x-12 scale-95 pointer-events-none z-10'
                }
              `}
            >
              <div className="relative rounded-2xl bg-[#FCF8F2] h-[240px] w-full flex items-center justify-center p-6 overflow-hidden shadow-inner group">
                {/* OCOP Badge */}
                <div className="absolute top-3 right-3 bg-[#113B28] text-white text-[10px] md:text-xs font-black px-3 py-1.5 flex flex-col items-center rounded-full z-10 border border-green-800/20 shadow-lg">
                  <span>OCOP</span>
                  <span className="flex items-center gap-0.5 text-[#D4AF37]">
                    {item.ocop.replace('★', '')}
                    <Star className="w-2.5 h-2.5 fill-current" />
                  </span>
                </div>
                {/* Product Image */}
                <div className="relative w-full h-full transform group-hover:scale-110 transition-transform duration-700 ease-out">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col">
                <h3 className="text-white font-sans text-xl md:text-2xl font-bold leading-tight line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-white/60 text-xs md:text-sm font-sans mt-1.5 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] inline-block" />
                  {item.shop}
                </p>

                <div className="flex items-center gap-1 mt-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-[#D4AF37] fill-[#D4AF37]" />
                  ))}
                  <span className="text-[#D4AF37] font-bold text-xs md:text-sm ml-1.5">
                    {item.rating}
                  </span>
                </div>

                <div className="flex flex-col mb-6">
                  <span className="text-[#D4AF37] font-bold text-2xl md:text-3xl font-sans">
                    {item.price}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white/40 line-through text-xs md:text-sm select-none">
                      {item.oldPrice}
                    </span>
                    <span className="text-emerald-400 text-xs md:text-sm font-semibold select-none">
                      {item.discount}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    suppressHydrationWarning
                    className="flex-1 bg-linear-to-r from-[#D4AF37] to-[#C2A052] hover:brightness-110 text-[#133D29] py-3.5 rounded-xl font-bold text-sm md:text-base border-none outline-none shadow-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:-rotate-12 transition-transform" />{' '}
                    Mua ngay
                  </button>
                  <button
                    suppressHydrationWarning
                    className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all shadow-md flex items-center justify-center group active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 group-hover:text-red-400 transition-colors" />
                    <span className="sr-only">Thêm vào giỏ hàng</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer 
                  ${idx === currentIndex ? 'w-8 h-2 bg-[#D4AF37]' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
