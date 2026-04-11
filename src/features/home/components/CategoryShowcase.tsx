import { ProductCard } from '@/components/ui/ProductCard';
import Image from 'next/image';
import Link from 'next/link';

export function CategoryShowcase() {
  const leafyGreens = [
    {
      name: 'Cải Chíp Organic',
      price: 45000,
      unit: 'kg',
      location: 'Đà Lạt, Lâm Đồng',
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 4,
      rating: 5,
      reviewCount: 0,
      slug: 'cai-chip-organic',
    },
    {
      name: 'Cải Kale T.Canh',
      price: 75000,
      unit: 'kg',
      location: 'Đơn Dương, Lâm Đồng',
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 5,
      rating: 5,
      reviewCount: 0,
      slug: 'cai-kale-tuyet-canh',
    },
    {
      name: 'Bó Xôi Organic',
      price: 55000,
      unit: 'kg',
      location: 'Mộc Châu, Sơn La',
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 4,
      rating: 5,
      reviewCount: 0,
      slug: 'bo-xoi-organic',
    },
    {
      name: 'Xà Lách Lolo Tím',
      price: 42000,
      unit: 'kg',
      location: 'Lạc Dương, Lâm Đồng',
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 3,
      rating: 5,
      reviewCount: 0,
      slug: 'xa-lach-lolo-tim',
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col justify-start items-start gap-16 md:gap-32 py-10 md:py-20 px-6">
      {/* --- RAU LÁ XANH SECTION --- */}
      <section className="w-full flex flex-col justify-start items-start gap-8 md:gap-12">
        <div className="w-full inline-flex justify-start items-center gap-4">
          <h2 className="text-stone-900 text-3xl md:text-4xl font-bold font-sans leading-10 whitespace-nowrap">
            Rau Lá Xanh
          </h2>
          <div className="flex-1 h-0.5 bg-stone-200 rounded-full" />
          <Link
            href="/category/rau-la-xanh"
            className="text-green-900 text-sm md:text-base font-bold font-sans whitespace-nowrap hidden sm:block hover:text-green-700 transition-colors"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {leafyGreens.map((item, index) => (
            <ProductCard
              key={index}
              name={item.name}
              price={item.price}
              unit={item.unit}
              location={item.location}
              image={item.image}
              ocopStar={item.ocopStar}
              rating={item.rating}
              reviewCount={item.reviewCount}
              slug={item.slug}
            />
          ))}
        </div>
      </section>

      {/* --- CỦ & QUẢ SECTION --- */}
      <section className="w-full p-4 sm:p-6 md:p-12 lg:p-20 bg-orange-100/80 rounded-[24px] md:rounded-[48px] flex flex-col justify-start items-start gap-8 md:gap-12 shadow-sm">
        <div className="w-full inline-flex justify-start items-center gap-4">
          <h2 className="text-stone-900 text-3xl md:text-4xl font-bold font-sans leading-10 whitespace-nowrap">
            Củ & Quả
          </h2>
          <div className="flex-1 h-0.5 bg-stone-300 rounded-full" />
          <Link
            href="/category/cu-qua"
            className="text-green-900 text-sm md:text-base font-bold font-sans whitespace-nowrap hidden sm:block hover:text-green-700 transition-colors"
          >
            Xem tất cả
          </Link>
        </div>

        <div className="w-full flex flex-col lg:flex-row justify-start items-stretch gap-6">
          {/* Featured Banner Card */}
          <div className="flex-1 relative bg-stone-900 rounded-2xl md:rounded-3xl shadow-xl flex flex-col justify-end items-start overflow-hidden min-h-[340px] md:min-h-[384px] cursor-pointer group">
            <Image
              src="/images/fresh-green-produce.jpg"
              alt="Khoai Tây Vàng Mộc Châu"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-linear-to-t md:bg-linear-to-l from-black/90 via-black/40 to-black/0" />

            <div className="relative z-10 w-full p-5 md:p-10 flex flex-col justify-end items-start h-full">
              <div className="pb-4 flex justify-start items-center gap-2">
                <span className="px-3 py-1 bg-yellow-600 rounded-full text-white text-xs font-bold leading-4 tracking-wide shadow-sm">
                  OCOP 5 SAO
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full backdrop-blur-md text-white text-xs font-bold leading-4 tracking-wide">
                  MIỀN BẮC
                </span>
              </div>

              <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold font-sans leading-tight mb-2">
                Khoai Tây Vàng Mộc Châu
              </h3>

              <p className="text-white/80 text-sm md:text-base font-normal font-sans leading-6 max-w-sm mb-6">
                Thơm ngon, bở tơi, đậm đà hương vị núi rừng Tây Bắc. Canh tác hoàn toàn tự nhiên.
              </p>

              <div className="flex flex-col sm:flex-row justify-start items-start sm:items-center gap-3 md:gap-6 mt-auto">
                <span className="text-green-300 text-xl md:text-2xl lg:text-3xl font-black font-sans leading-none">
                  38.000đ/kg
                </span>
                <button
                  suppressHydrationWarning
                  className="w-full sm:w-auto px-6 md:px-8 py-3 bg-green-900 hover:bg-green-800 transition-colors rounded-full text-white text-sm md:text-base font-bold font-sans whitespace-nowrap shadow-md"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>

          {/* Side Card */}
          <div className="w-full lg:w-80 bg-white rounded-3xl shadow-lg flex flex-col justify-start items-start overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
            <div className="w-full relative aspect-5/3 lg:aspect-auto lg:flex-1 overflow-hidden">
              <Image
                src="/images/fresh-green-produce.jpg"
                alt="Cà Rốt Đà Lạt"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="p-2 absolute right-4 top-4 bg-green-900 rounded-full shadow-md">
                {/* SVG Leaf Icon representation */}
                <div
                  className="w-5 h-3 bg-white"
                  style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}
                />
              </div>
            </div>

            <div className="w-full p-6 lg:p-8 flex flex-col justify-between items-start flex-none">
              <div className="w-full flex flex-col justify-start items-start gap-2 mb-6">
                <h3 className="text-stone-900 text-2xl font-bold font-sans leading-8">
                  Cà Rốt Đà Lạt
                </h3>
                <p className="text-neutral-700 text-sm font-normal font-sans leading-5">
                  Giòn ngọt, giàu dinh dưỡng, thu hoạch mới mỗi sáng.
                </p>
              </div>

              <div className="w-full pt-4 border-t border-orange-100 flex justify-between items-center mt-auto">
                <span className="text-green-900 text-xl font-black font-sans leading-7">
                  28.000đ/kg
                </span>
                <button
                  suppressHydrationWarning
                  className="text-green-900 text-base font-bold font-sans hover:text-green-700"
                >
                  Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
