import { ProductCard } from '@/components/ui/ProductCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function BestSellersSection() {
  const products = [
    {
      name: 'Tiêu đen hữu cơ Đắk Lắk',
      price: 145000,
      oldPrice: 180000,
      rating: 4.9,
      reviewCount: 128,
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 5,
      location: 'Đắk Lắk',
    },
    {
      name: 'Mật ong hoa bạc hà Mèo Vạc',
      price: 320000,
      oldPrice: 450000,
      rating: 4.8,
      reviewCount: 95,
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 4,
      location: 'Hà Giang',
    },
    {
      name: 'Hạt điều rang muối Bình Phước',
      price: 210000,
      oldPrice: 250000,
      rating: 5.0,
      reviewCount: 214,
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 5,
      location: 'Bình Phước',
    },
    {
      name: 'Cà phê Robusta Buôn Ma Thuột',
      price: 185000,
      oldPrice: 220000,
      rating: 4.7,
      reviewCount: 88,
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 4,
      location: 'Đắk Lắk',
    },
    {
      name: 'Dầu dừa tinh khiết Bến Tre',
      price: 85000,
      oldPrice: 110000,
      rating: 4.6,
      reviewCount: 52,
      image: '/images/fresh-green-produce.jpg',
      ocopStar: 3,
      location: 'Bến Tre',
    },
  ];

  return (
    <section className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col justify-start items-start gap-8">
      <div className="w-full flex justify-between items-center">
        <h2 className="text-stone-900 text-3xl font-bold font-sans leading-9">Bán chạy nhất</h2>
        <div className="flex justify-start items-start gap-3">
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full border border-stone-300 flex justify-center items-center hover:bg-stone-100 transition-colors text-stone-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            suppressHydrationWarning
            className="w-10 h-10 rounded-full border border-stone-300 flex justify-center items-center hover:bg-stone-100 transition-colors text-stone-900"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            name={product.name}
            price={product.price}
            oldPrice={product.oldPrice}
            rating={product.rating}
            reviewCount={product.reviewCount}
            image={product.image}
            ocopStar={product.ocopStar}
            location={product.location}
          />
        ))}
      </div>
    </section>
  );
}
