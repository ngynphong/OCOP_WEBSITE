'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ProductSidebar } from '@/features/products/components/ProductSidebar';
import { ProductPagination } from '@/features/products/components/ProductPagination';
import { ProductCard } from '@/components/ui/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [sortBy, setSortBy] = useState('newest');

  // Mock data for products
  const allProducts = [
    {
      name: 'Trà Xanh Đặc Sản Tân Cương',
      price: 350000,
      oldPrice: 400000,
      rating: 4.9,
      reviewCount: 128,
      image: '/images/tra-do-uong.jpg',
      location: 'Thái Nguyên',
      category: 'Đồ uống',
      ocopStar: 5,
    },
    {
      name: 'Trà Tim Sen Hoàng Gia',
      price: 280000,
      oldPrice: 320000,
      rating: 4.8,
      reviewCount: 95,
      image: '/images/tra-do-uong.jpg',
      location: 'Cố đô Huế',
      category: 'Đồ uống',
      ocopStar: 4,
    },
    {
      name: 'Trà Shan Tuyết Cổ Thụ',
      price: 520000,
      rating: 5.0,
      reviewCount: 214,
      image: '/images/tra-do-uong.jpg',
      location: 'Cao nguyên Hà Giang',
      category: 'Đồ uống',
      ocopStar: 5,
    },
    {
      name: 'Trà Thảo Mộc Actiso',
      price: 125000,
      oldPrice: 150000,
      rating: 4.2,
      reviewCount: 88,
      image: '/images/tra-do-uong.jpg',
      location: 'Lâm Đồng',
      category: 'Thảo dược',
      ocopStar: 3,
    },
    {
      name: 'Trà Ô Long Tâm Châu Cao Cấp',
      price: 420000,
      oldPrice: 500000,
      rating: 4.9,
      reviewCount: 156,
      image: '/images/tra-do-uong.jpg',
      location: 'Bảo Lộc - Lâm Đồng',
      category: 'Đồ uống',
      ocopStar: 5,
    },
    {
      name: 'Trà Bồ Công Anh Nguyên Chất',
      price: 85000,
      rating: 4.5,
      reviewCount: 42,
      image: '/images/tra-do-uong.jpg',
      location: 'Đồng Nai',
      category: 'Thảo dược',
      ocopStar: 3,
    },
  ];

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    const result = allProducts.filter((p) => {
      // Filter by Search Query
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Filter by OCOP Ratings
      if (selectedRatings.length > 0 && !selectedRatings.includes(p.ocopStar)) {
        return false;
      }

      // Filter by Price Range
      if (p.price > maxPrice) {
        return false;
      }

      // Filter by Categories
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) {
        return false;
      }

      // Filter by Regions (Mock logic mapping)
      if (selectedRegions.length > 0) {
        const isMatch = selectedRegions.some((r) => {
          if (
            r === 'Miền Bắc' &&
            (p.location.includes('Thái Nguyên') || p.location.includes('Hà Giang'))
          )
            return true;
          if (r === 'Tây Nguyên' && p.location.includes('Lâm Đồng')) return true;
          if (r === 'Miền Trung' && p.location.includes('Huế')) return true;
          if (r === 'Đồng bằng sông Cửu Long' && p.location.includes('Đồng Nai')) return true;
          return false;
        });
        if (!isMatch) return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedRatings, selectedRegions, selectedCategories, maxPrice, sortBy]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 pt-8 md:pt-12 pb-16 max-w-7xl mx-auto px-6 md:px-8 w-full">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: 'Trang chủ', href: '/' }, { label: 'Sản phẩm' }]}
          className="mb-8"
        />

        {/* Header Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-[3.5rem] font-bold font-sans leading-tight tracking-tight text-stone-900">
              {searchQuery ? `Kết quả cho '${searchQuery}'` : 'Tất cả sản phẩm'}
            </h1>
            <p className="text-base md:text-lg text-neutral-500 font-medium font-sans mt-2">
              Tìm thấy {filteredProducts.length} sản phẩm trực tiếp từ các nghệ nhân vùng miền
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-4 relative">
            <span className="text-sm font-semibold text-neutral-500 uppercase tracking-widest font-sans whitespace-nowrap">
              Sắp xếp
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white px-6 py-3 pr-10 rounded-xl border border-stone-200 font-bold font-sans text-sm text-stone-700 hover:bg-stone-50 transition-colors shadow-sm outline-none cursor-pointer focus:border-green-700 focus:ring-1 focus:ring-green-700"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá từ thấp đến cao</option>
                <option value="price-desc">Giá từ cao đến thấp</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-stone-500" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Filter */}
          <ProductSidebar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedRatings={selectedRatings}
            setSelectedRatings={setSelectedRatings}
            selectedRegions={selectedRegions}
            setSelectedRegions={setSelectedRegions}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />

          {/* Product Grid Area */}
          <div className="grow flex flex-col">
            {/* Active Filter Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((cat) => (
                <span
                  key={cat}
                  onClick={() => setSelectedCategories(selectedCategories.filter((c) => c !== cat))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {cat} <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              ))}
              {selectedRegions.map((reg) => (
                <span
                  key={reg}
                  onClick={() => setSelectedRegions(selectedRegions.filter((r) => r !== reg))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {reg} <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              ))}
              {selectedRatings.map((rating) => (
                <span
                  key={rating}
                  onClick={() => setSelectedRatings(selectedRatings.filter((r) => r !== rating))}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  {rating}★ <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              ))}
              {maxPrice < 2000000 && (
                <span
                  onClick={() => setMaxPrice(2000000)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-stone-200 shadow-sm text-stone-700 text-xs font-semibold rounded-full cursor-pointer hover:border-red-300 hover:text-red-600 transition group"
                >
                  Dưới {maxPrice.toLocaleString('vi-VN')}đ{' '}
                  <X className="w-3 h-3 text-stone-400 group-hover:text-red-500" />
                </span>
              )}
              {(selectedCategories.length > 0 ||
                selectedRegions.length > 0 ||
                selectedRatings.length > 0 ||
                maxPrice < 2000000) && (
                <span
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedRegions([]);
                    setSelectedRatings([]);
                    setMaxPrice(2000000);
                  }}
                  className="inline-flex items-center px-3 py-1.5 text-green-700 text-xs font-bold cursor-pointer hover:underline"
                >
                  Xóa tất cả bộ lọc
                </span>
              )}
            </div>

            {filteredProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                  {filteredProducts.map((product, index) => (
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
                {/* Pagination (Hidden if small amount) */}
                {filteredProducts.length > 3 && <ProductPagination />}
              </>
            ) : (
              <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-200 shadow-sm">
                <p className="text-stone-500 text-lg font-medium">
                  Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRatings([]);
                    setSelectedRegions([]);
                    setSelectedCategories([]);
                    setMaxPrice(2000000);
                  }}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 transition"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
