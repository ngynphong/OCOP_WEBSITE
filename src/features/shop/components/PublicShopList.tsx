'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Store, MapPin, Search, Sparkles, Filter, ChevronRight } from 'lucide-react';
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

  const [allShops, setAllShops] = useState<FeaturedShop[]>([]);
  const [prevItems, setPrevItems] = useState<FeaturedShop[] | null>(null);

  // Deriving state from props/query (You might not need an effect pattern)
  const currentItems = (shopsResp?.data?.items as FeaturedShop[]) || null;
  if (currentItems !== prevItems) {
    setPrevItems(currentItems);
    if (currentItems) {
      if (pageNo === 1) {
        setAllShops(currentItems);
      } else {
        const existingIds = new Set(allShops.map((s) => s.id));
        const newItems = currentItems.filter((s) => !existingIds.has(s.id));
        if (newItems.length > 0) {
          setAllShops([...allShops, ...newItems]);
        }
      }
    }
  }

  const totalPage = shopsResp?.data?.totalPage || 1;
  const hasMore = pageNo < totalPage;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    setSearchQuery(keyword);
  };

  const handleProvinceChange = (val: string | number) => {
    setSelectedProvinceId(val ? Number(val) : undefined);
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
        <div className="flex flex-col items-center text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white shadow-sm mb-6"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest">
              Danh bạ OCOP Mall
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-stone-900 tracking-tight mb-6"
          >
            Khám Phá{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 to-teal-500">
              Tinh Hoa
            </span>
            <br />
            Đặc Sản Vùng Miền
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-stone-500 max-w-2xl mb-10"
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
            <div className="absolute -inset-1 bg-linear-to-r from-emerald-500 to-teal-500 rounded-2xl blur-md opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative flex items-center bg-white/80 backdrop-blur-xl border border-white rounded-2xl p-2 shadow-xl">
              <Search className="w-6 h-6 text-stone-400 ml-4 hidden sm:block" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Tìm kiếm cửa hàng, thương hiệu, hoặc đặc sản..."
                className="w-full pl-4 sm:pl-4 pr-4 py-3 bg-transparent text-stone-800 font-medium placeholder:text-stone-400 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 rounded-xl font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 flex-shrink-0 cursor-pointer"
              >
                Tìm kiếm
              </button>
            </div>
          </motion.form>
        </div>

        {/* Categories / Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 mb-8">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white shadow-xs w-full sm:w-auto relative z-20">
            <Filter className="w-5 h-5 text-emerald-600 ml-2 flex-shrink-0" />

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
              className="sm:w-48"
            />
          </div>
        </div>

        {/* Grid List */}
        <AnimatePresence mode="wait">
          {allShops.length === 0 && !isLoading ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-24 bg-white/40 backdrop-blur-xl rounded-3xl border border-white shadow-xl max-w-2xl mx-auto"
            >
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black text-stone-800 mb-2">Không tìm thấy cửa hàng</h3>
              <p className="text-stone-500 mb-8 max-w-md mx-auto">
                Chúng tôi không thể tìm thấy gian hàng nào khớp với tìm kiếm của bạn. Hãy thử bộ lọc
                khác nhé.
              </p>
              <Button onClick={clearFilters} variant="outline" className="bg-white">
                Xóa bộ lọc
              </Button>
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
            >
              {allShops.map((shop) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -8 }}
                  key={shop.id}
                  className="group relative bg-white/70 backdrop-blur-xl border border-white/60 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-900/15 transition-all duration-500 flex flex-col"
                >
                  {/* Card Header Background */}
                  <div className="h-36 bg-linear-to-br from-emerald-800 to-teal-900 relative overflow-hidden">
                    {shop.bannerUrl ? (
                      <Image
                        src={shop.bannerUrl}
                        alt={shop.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 opacity-20 bg-[url(/images/stardust.png)] mix-blend-overlay" />
                    )}
                    <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-white text-xs font-bold">
                        {shop.ratingAvg?.toFixed(1) || '0.0'}
                      </span>
                    </div>
                  </div>

                  {/* Shop Info Container */}
                  <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col">
                    {/* Logo Overlap */}
                    <div className="absolute -top-10 left-6 w-20 h-20 bg-white rounded-2xl p-1.5 shadow-xl border border-stone-100 group-hover:-translate-y-2 group-hover:shadow-emerald-900/20 transition-all duration-500">
                      <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-50">
                        <Image
                          src={shop.logoUrl || '/images/logo.png'}
                          alt={shop.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <div className="ml-24 pt-3 h-14">
                      <h3 className="text-base font-black text-stone-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                        {shop.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-stone-500 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span className="truncate">
                          {shop.districtName}, {shop.provinceName}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex-1">
                      <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                        {shop.description ||
                          'Gian hàng OCOP chính hãng, cung cấp các sản phẩm chất lượng đạt tiêu chuẩn.'}
                      </p>
                    </div>

                    <div className="mt-6 pt-5 border-t border-stone-100/50 flex items-center justify-between">
                      <span className="text-[10px] bg-linear-to-r from-amber-100 to-amber-50 text-amber-700 px-3 py-1.5 rounded-full font-bold border border-amber-200/50">
                        OCOP {shop.ocopStar || 4} Sao
                      </span>

                      <Link
                        href={`/cua-hang/${shop.slug}`}
                        className="group/btn flex items-center gap-1.5 text-emerald-600 font-bold text-sm hover:text-emerald-700 transition-colors"
                      >
                        Vào shop
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading & Load More */}
        {isFetching && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white/50 backdrop-blur-sm rounded-3xl shadow-sm border border-white overflow-hidden h-[340px] animate-pulse"
              >
                <div className="h-36 bg-stone-200/50"></div>
                <div className="p-6">
                  <div className="w-20 h-20 bg-stone-300/50 rounded-2xl -mt-14 mb-4"></div>
                  <div className="h-5 bg-stone-200/50 rounded-md w-3/4 mb-2"></div>
                  <div className="h-3 bg-stone-200/50 rounded-md w-1/2 mb-6"></div>
                  <div className="h-3 bg-stone-200/50 rounded-md w-full mb-2"></div>
                  <div className="h-3 bg-stone-200/50 rounded-md w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isFetching && hasMore && (
          <div className="flex justify-center mt-16 mb-8">
            <button
              onClick={() => setPageNo((p) => p + 1)}
              className="relative group overflow-hidden bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 font-bold px-10 py-4 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95"
            >
              <div className="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-emerald-500/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
              <span className="relative flex items-center gap-2">
                Tải thêm gian hàng{' '}
                <ChevronRight className="w-4 h-4 group-hover:translate-y-0.5 group-hover:rotate-90 transition-all duration-300" />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
