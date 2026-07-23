'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Store,
  MapPin,
  Search,
  Sparkles,
  Filter,
  ChevronRight,
  X,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePublicShopsQuery } from '@/features/shop/hooks/usePublicShop';
import { useLocationQuery } from '@/features/shop/hooks/useLocationQuery';
import { ShopInfo } from '@/features/shop/types/shopTypes';
import { Button } from '@/components/ui/AppButton';
import { CustomSelect } from '@/components/ui/CustomSelect';

interface FeaturedShop extends ShopInfo {
  ocopStar?: number;
}

export function PublicShopList() {
  const [pageNo, setPageNo] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<number | undefined>();
  const [allShops, setAllShops] = useState<FeaturedShop[]>([]);
  const pageSize = 12;

  const {
    data: shopsResp,
    isLoading,
    isFetching,
  } = usePublicShopsQuery({
    pageNo,
    pageSize,
    keyword: searchQuery || undefined,
    provinceId: selectedProvinceId,
  });

  const { provinces } = useLocationQuery();

  const [prevResp, setPrevResp] = useState(shopsResp);
  const [prevPageNo, setPrevPageNo] = useState(pageNo);

  if (shopsResp !== prevResp || pageNo !== prevPageNo) {
    setPrevResp(shopsResp);
    setPrevPageNo(pageNo);

    const items = (shopsResp?.data?.items as FeaturedShop[]) || [];
    if (pageNo === 1) {
      setAllShops(items);
    } else if (items.length > 0) {
      const existingIds = new Set(allShops.map((s) => s.id));
      const newItems = items.filter((s) => !existingIds.has(s.id));
      if (newItems.length > 0) {
        setAllShops([...allShops, ...newItems]);
      }
    }
  }

  const totalPage = shopsResp?.data?.totalPage || 1;
  const totalElements = shopsResp?.data?.totalElement || allShops.length;
  const hasMore = pageNo < totalPage;
  const selectedProvinceName = provinces?.data?.data?.find(
    (p) => p.id === selectedProvinceId,
  )?.name;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    setSearchQuery(keyword.trim());
  };

  const handleProvinceChange = (val: string | number) => {
    setSelectedProvinceId(val ? Number(val) : undefined);
    setPageNo(1);
  };

  const clearSearch = () => {
    setKeyword('');
    setSearchQuery('');
    setPageNo(1);
  };

  const clearFilters = () => {
    setKeyword('');
    setSearchQuery('');
    setSelectedProvinceId(undefined);
    setPageNo(1);
  };

  return (
    <div className="w-full relative overflow-hidden">
      {/* Decorative Liquid Glass Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-300/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-80 h-80 bg-teal-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-12 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-stone-200/80 shadow-xs mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Danh sách OCOP Mall
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight mb-6"
          >
            Khám Phá{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Tinh Hoa
            </span>
            <br />
            Đặc Sản Vùng Miền
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-stone-600 max-w-2xl mb-10 leading-relaxed"
          >
            Hàng ngàn gian hàng chứng nhận OCOP tiêu chuẩn, mang đến sản phẩm chất lượng, an toàn và
            đậm đà bản sắc Việt.
          </motion.p>

          {/* Liquid Glass Search Bar */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onSubmit={handleSearch}
            className="w-full max-w-3xl relative z-10 group"
          >
            <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-white/80 rounded-2xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-transparent transition-all duration-300">
              <Search className="w-6 h-6 text-stone-400 ml-4 hidden sm:block shrink-0" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm cửa hàng, thương hiệu, hoặc đặc sản..."
                className="w-full pl-4 sm:pl-4 pr-3 py-3 bg-transparent text-stone-800 font-medium placeholder:text-stone-400 focus:outline-none text-base"
                aria-label="Tìm kiếm cửa hàng OCOP"
              />
              {keyword && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-2 text-stone-400 hover:text-stone-600 transition-colors mr-1 cursor-pointer rounded-full hover:bg-stone-100/80 shrink-0"
                  aria-label="Xóa từ khóa tìm kiếm"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0 cursor-pointer flex items-center gap-2"
              >
                <Search className="w-4 h-4 sm:hidden" />
                <span>Tìm kiếm</span>
              </button>
            </div>
          </motion.form>
        </div>

        {/* Categories / Filters & Counter Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 mb-6">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 p-1.5 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-emerald-600 ml-2.5 shrink-0" />
              <CustomSelect
                value={selectedProvinceId || ''}
                onChange={handleProvinceChange}
                options={[
                  { label: 'Tất cả khu vực', value: '' },
                  ...(provinces?.data?.data?.map((p) => ({
                    label: p.name,
                    value: p.id,
                  })) || []),
                ]}
                placeholder="Chọn khu vực"
                className="sm:w-52"
              />
            </div>

            {/* Active Filter Chips */}
            {(searchQuery || selectedProvinceId) && (
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium">
                    Từ khóa: &quot;{searchQuery}&quot;
                    <button
                      onClick={clearSearch}
                      className="hover:text-emerald-950 cursor-pointer"
                      aria-label="Xóa bộ lọc từ khóa"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                {selectedProvinceName && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 font-medium">
                    Khu vực: {selectedProvinceName}
                    <button
                      onClick={() => handleProvinceChange('')}
                      className="hover:text-teal-950 cursor-pointer"
                      aria-label="Xóa bộ lọc khu vực"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-stone-500 hover:text-stone-800 underline underline-offset-2 font-medium ml-1 cursor-pointer"
                >
                  Xóa tất cả
                </button>
              </div>
            )}
          </div>

          {/* Results counter */}
          {!isLoading && allShops.length > 0 && (
            <span className="text-xs font-semibold text-stone-500 shrink-0">
              Hiển thị <strong className="text-stone-800">{allShops.length}</strong> /{' '}
              {totalElements} gian hàng
            </span>
          )}
        </div>

        {/* Grid List */}
        <AnimatePresence mode="wait">
          {allShops.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-20 bg-white/60 backdrop-blur-xl rounded-3xl border border-stone-200/80 shadow-sm max-w-2xl mx-auto px-6"
            >
              <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-emerald-100">
                <Store className="w-9 h-9 text-emerald-600" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-stone-900 mb-2">
                Không tìm thấy gian hàng
              </h3>
              <p className="text-stone-600 mb-8 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
                Chúng tôi không thể tìm thấy gian hàng nào khớp với bộ lọc của bạn. Hãy thử thay đổi
                từ khóa hoặc xóa bộ lọc khu vực.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="bg-white border-stone-300 hover:bg-stone-50 cursor-pointer font-bold"
              >
                Xóa bộ lọc tìm kiếm
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.08 }}
            >
              {allShops.map((shop) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -6 }}
                  key={shop.id}
                  className="group relative bg-white/80 backdrop-blur-xl border border-stone-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-emerald-900/10 transition-all duration-300 flex flex-col cursor-pointer"
                >
                  {/* Entire Card Clickable Link */}
                  <Link
                    href={`/cua-hang/${shop.slug}`}
                    className="absolute inset-0 z-20 focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-3xl"
                    aria-label={`Ghé thăm gian hàng ${shop.name}`}
                  />

                  {/* Card Header Background Banner */}
                  <div className="h-36 bg-stone-900 relative overflow-hidden">
                    {shop.bannerUrl ? (
                      <Image
                        src={shop.bannerUrl}
                        alt={shop.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        className="object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-teal-900" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                    {/* Star Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 z-10">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-white text-xs font-bold">
                        {shop.ratingAvg ? shop.ratingAvg.toFixed(1) : 'Mới'}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info Container */}
                  <div className="px-5 pb-5 pt-0 relative flex-1 flex flex-col">
                    {/* Logo Overlap */}
                    <div className="absolute -top-10 left-5 w-20 h-20 bg-white rounded-2xl p-1 shadow-lg border border-stone-100 group-hover:-translate-y-1 transition-transform duration-300 z-10">
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-50">
                        <Image
                          src={shop.logoUrl || '/images/logo.png'}
                          alt={shop.name}
                          fill
                          sizes="80px"
                          className="object-contain p-1"
                        />
                      </div>
                    </div>

                    <div className="ml-22 pt-3 min-h-[52px]">
                      <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-xs text-stone-600 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">
                          {shop.districtName ? `${shop.districtName}, ` : ''}
                          {shop.provinceName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 flex-1">
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {shop.description ||
                          'Gian hàng OCOP chính hãng, cung cấp các sản phẩm chất lượng đạt tiêu chuẩn.'}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between z-10 pointer-events-none">
                      {shop.ocopStar ? (
                        <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-1 rounded-full font-bold border border-amber-200/60">
                          OCOP {shop.ocopStar} Sao
                        </span>
                      ) : (
                        <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full font-bold border border-emerald-200/60">
                          Gian hàng OCOP
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs group-hover:text-emerald-700">
                        Vào shop
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Initial Loading Skeletons */}
        {isLoading && pageNo === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-xs border border-stone-200/60 overflow-hidden h-[330px] animate-pulse"
              >
                <div className="h-36 bg-stone-200/60" />
                <div className="p-5">
                  <div className="w-20 h-20 bg-stone-300/60 rounded-2xl -mt-14 mb-4 border-2 border-white" />
                  <div className="h-5 bg-stone-200/70 rounded-md w-3/4 mb-2" />
                  <div className="h-3.5 bg-stone-200/60 rounded-md w-1/2 mb-5" />
                  <div className="h-3 bg-stone-200/50 rounded-md w-full mb-2" />
                  <div className="h-3 bg-stone-200/50 rounded-md w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {!isLoading && hasMore && (
          <div className="flex justify-center mt-14 mb-6">
            <button
              onClick={() => setPageNo((p) => p + 1)}
              disabled={isFetching}
              className="relative group overflow-hidden bg-white hover:bg-emerald-50/50 border border-stone-200 text-stone-800 font-bold px-9 py-3.5 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center gap-2 text-sm">
                {isFetching ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                    <span>Đang tải thêm...</span>
                  </>
                ) : (
                  <>
                    <span>Tải thêm gian hàng</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
