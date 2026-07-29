'use client';

import React, { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import VietnamMap from '@/components/ui/VietnamMap';
import { MapPin, Package } from 'lucide-react';
import {
  usePublicProvincesQuery,
  usePublicProductsInfiniteQuery,
} from '@/features/products/hooks/usePublicProducts';
import { ProductCard } from '@/components/ui/ProductCard';

const emptySubscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export default function VungMienContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const isClient = useSyncExternalStore(emptySubscribe, getSnapshot, getServerSnapshot);

  const rawProvinceQuery = searchParams.get('province');
  const selectedProvince = useMemo(
    () =>
      rawProvinceQuery === 'undefined' || rawProvinceQuery === 'null' ? null : rawProvinceQuery,
    [rawProvinceQuery],
  );

  const { data: provincesRes } = usePublicProvincesQuery();
  const provinces = useMemo(() => provincesRes?.data || [], [provincesRes]);

  const provinceId = useMemo(() => {
    if (selectedProvince && provinces.length > 0) {
      const matched = provinces.find(
        (p) =>
          p.name.toLowerCase().includes(selectedProvince.toLowerCase()) ||
          selectedProvince.toLowerCase().includes(p.name.toLowerCase()),
      );
      return matched?.id;
    }
    return undefined;
  }, [selectedProvince, provinces]);

  const {
    data: productsInfiniteRes,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = usePublicProductsInfiniteQuery(
    {
      provinceId,
      pageSize: 12,
    },
    {
      enabled: isClient && (!selectedProvince || provinces.length > 0),
    },
  );

  const products = useMemo(
    () => productsInfiniteRes?.pages.flatMap((page) => page.data.items) || [],
    [productsInfiniteRes],
  );

  const handleSelectProvince = useCallback(
    (provinceName: string) => {
      router.push(`/vung-mien?province=${encodeURIComponent(provinceName)}`, { scroll: false });
    },
    [router],
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col gap-4">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đặc sản vùng miền' }]} />
        <div className="bg-gradient-to-r from-green-800 to-emerald-600 rounded-xl p-8 text-white shadow-lg overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-400 opacity-10 rounded-full translate-y-1/3 -translate-x-1/4"></div>
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 font-sans tracking-tight">
              Tinh Hoa Nông Sản Việt
            </h1>
            <p className="text-emerald-50 text-base md:text-lg opacity-90">
              Khám phá bản đồ đặc sản OCOP từ 63 tỉnh thành phố. Mỗi vùng đất, một câu chuyện, một
              hương vị tự hào.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Map */}
        <div className="lg:col-span-5 bg-white rounded-xl shadow-sm border border-stone-100 p-6 flex flex-col items-center h-fit lg:sticky lg:top-24">
          <div className="w-full flex items-center gap-2 mb-6 border-b border-stone-100 pb-4">
            <MapPin className="text-green-600 w-6 h-6" />
            <h2 className="text-lg font-bold text-stone-800">Bản Đồ Đặc Sản</h2>
          </div>

          <div className="w-full flex justify-center py-4 bg-emerald-50/30 rounded-xl relative overflow-hidden border border-emerald-100/50">
            <VietnamMap
              onSelectProvince={handleSelectProvince}
              selectedProvince={selectedProvince}
            />
          </div>

          <p className="text-sm text-stone-500 mt-6 text-center italic">
            * Chạm vào một tỉnh/thành trên bản đồ để xem các đặc sản OCOP tương ứng.
          </p>
        </div>

        {/* Right Column: Products */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <div className="flex items-center justify-between mb-6 border-b border-stone-100 pb-4">
              <div className="flex items-center gap-3">
                <Package className="text-emerald-600 w-6 h-6" />
                <h2 className="text-xl font-bold text-stone-800">
                  {selectedProvince
                    ? `Đặc sản ${selectedProvince}`
                    : 'Sản phẩm tiêu biểu toàn quốc'}
                </h2>
              </div>
              {selectedProvince && (
                <button
                  onClick={() => {
                    router.push('/vung-mien', { scroll: false });
                  }}
                  className="text-sm text-green-600 hover:text-green-700 font-medium p-2 -mr-2 md:p-0 md:mr-0"
                >
                  Xem tất cả
                </button>
              )}
            </div>

            <div className="relative min-h-[400px]">
              {/* Loading Overlay */}
              {isFetching && !isFetchingNextPage && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-xl transition-all">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-widest animate-pulse">
                      Đang cập nhật...
                    </p>
                  </div>
                </div>
              )}

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 transition-opacity duration-300 ${
                  isFetching && !isFetchingNextPage ? 'opacity-40' : 'opacity-100'
                }`}
              >
                {products.length === 0 && !isFetching && (
                  <div className="col-span-full py-12 flex flex-col items-center justify-center text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    <Package className="w-12 h-12 text-stone-300 mb-3" />
                    <p className="font-medium text-center text-stone-600">
                      Chưa có dữ liệu sản phẩm cho khu vực này
                    </p>
                    <p className="text-sm mt-1 text-center">
                      Vui lòng chọn tỉnh thành khác hoặc xem sản phẩm tiêu biểu bên dưới
                    </p>
                  </div>
                )}

                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    price={product.minPrice || 0}
                    rating={product.ratingAvg || 0}
                    image={product.thumbnailUrl || product.imageUrl || null}
                    ocopStar={product.ocopStar}
                    unit={product.unit}
                    location={product.provinceName || undefined}
                    shopName={product.shopName}
                    categoryName={product.categoryName}
                    soldCount={product.soldCount}
                    inStock={product.inStock}
                  />
                ))}
              </div>
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-3 md:py-2.5 bg-white border-2 border-green-600 text-green-700 font-semibold rounded-full hover:bg-green-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isFetchingNextPage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      Đang tải...
                    </>
                  ) : (
                    'Xem thêm sản phẩm'
                  )}
                </button>
              </div>
            )}

            {/* Loading Indicator for initial load */}
            {isFetching && products.length === 0 && (
              <div className="col-span-full py-12 flex justify-center">
                <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
