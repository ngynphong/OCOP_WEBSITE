'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { ProductSidebar } from '@/features/products/components/ProductSidebar';
import { ProductPagination } from '@/features/products/components/ProductPagination';
import { ProductCard } from '@/components/ui/ProductCard';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { usePublicProductsQuery } from '@/features/products/hooks/usePublicProducts';
import { PublicProductListParams } from '@/features/products/types/productTypes';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2000000);
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(0);

  const params: PublicProductListParams = {
    page,
    size: PAGE_SIZE,
    search: searchQuery || undefined,
    ocopStar: selectedRatings.length === 1 ? selectedRatings[0] : undefined,
    maxPrice: maxPrice < 2000000 ? maxPrice : undefined,
    sortBy: sortBy !== 'newest' ? sortBy : undefined,
  };

  const { data, isPending, isError } = usePublicProductsQuery(params);

  const products = data?.data?.items ?? [];
  const totalElement = data?.data?.totalElement ?? 0;
  const totalPage = data?.data?.totalPage ?? 1;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRatings([]);
    setSelectedRegions([]);
    setSelectedCategories([]);
    setMaxPrice(2000000);
    setPage(0);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedRegions.length > 0 ||
    selectedRatings.length > 0 ||
    maxPrice < 2000000;

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
              {isPending
                ? 'Đang tải...'
                : `Tìm thấy ${totalElement} sản phẩm trực tiếp từ các nghệ nhân vùng miền`}
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
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
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
            setSearchQuery={(v) => {
              setSearchQuery(v);
              setPage(0);
            }}
            selectedRatings={selectedRatings}
            setSelectedRatings={(v) => {
              setSelectedRatings(v);
              setPage(0);
            }}
            selectedRegions={selectedRegions}
            setSelectedRegions={(v) => {
              setSelectedRegions(v);
              setPage(0);
            }}
            maxPrice={maxPrice}
            setMaxPrice={(v) => {
              setMaxPrice(v);
              setPage(0);
            }}
            selectedCategories={selectedCategories}
            setSelectedCategories={(v) => {
              setSelectedCategories(v);
              setPage(0);
            }}
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
              {hasActiveFilters && (
                <span
                  onClick={handleClearFilters}
                  className="inline-flex items-center px-3 py-1.5 text-green-700 text-xs font-bold cursor-pointer hover:underline"
                >
                  Xóa tất cả bộ lọc
                </span>
              )}
            </div>

            {/* Loading skeleton */}
            {isPending && (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="h-72 bg-stone-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            )}

            {/* Error state */}
            {isError && (
              <div className="w-full h-64 flex flex-col items-center justify-center bg-red-50 rounded-2xl border border-red-100">
                <p className="text-red-500 text-lg font-medium">Không tải được sản phẩm.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 transition"
                >
                  Thử lại
                </button>
              </div>
            )}

            {/* Products grid */}
            {!isPending && !isError && (
              <>
                {products.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                      {products.map((product) => {
                        const primaryImage = product.images?.find((img) => img.isPrimary);
                        const defaultVariant =
                          product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
                        return (
                          <ProductCard
                            key={product.id}
                            name={product.name}
                            price={defaultVariant?.price ?? product.minPrice}
                            oldPrice={defaultVariant?.comparePrice ?? undefined}
                            rating={product.ratingAvg}
                            reviewCount={product.totalReviews}
                            image={primaryImage?.url ?? primaryImage?.thumbnailUrl ?? ''}
                            ocopStar={product.ocopStar}
                            location={product.province?.name}
                            unit={product.unit}
                          />
                        );
                      })}
                    </div>
                    {totalPage > 1 && (
                      <div className="mt-8">
                        <ProductPagination />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-64 flex flex-col items-center justify-center bg-white rounded-2xl border border-stone-200 shadow-sm">
                    <p className="text-stone-500 text-lg font-medium">
                      Không tìm thấy sản phẩm nào phù hợp với bộ lọc.
                    </p>
                    <button
                      onClick={handleClearFilters}
                      className="mt-4 px-6 py-2 bg-green-700 text-white rounded-full font-bold text-sm shadow-sm hover:bg-green-800 transition"
                    >
                      Xóa tất cả bộ lọc
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
