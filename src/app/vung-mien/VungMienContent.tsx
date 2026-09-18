'use client';

import React from 'react';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import VietnamMap from '@/components/ui/VietnamMap';
import CommuneMapWrapper from './components/CommuneMapWrapper';
import { AdministrativeHierarchyFilter } from './components/AdministrativeHierarchyFilter';
import { CommuneInfoCard } from './components/CommuneInfoCard';
import {
  MapPin,
  Package,
  Compass,
  ChevronRight,
  X,
  Globe,
  Satellite,
  Star,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { ProductCard } from '@/components/ui/ProductCard';
import { useVungMien } from './hooks/useVungMien';

export default function VungMienContent() {
  const {
    isClient,
    mode,
    isTwoTierMode,
    macroRegion,
    selectedRegionId,
    selectedProvince,
    selectedProvinceInfo,
    macroRegionsList,
    availableRegions,
    products,
    totalRawProductsCount,
    selectedStar,
    handleSelectStar,
    isFilteredByCommune,
    isFilteredByDistrict,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    // Phân cấp hành chính
    constituentProvinces,
    selectedConstituentCode,
    handleSelectConstituent,
    selectedDistrictId,
    selectedDistrict,
    districts,
    isLoadingDistricts,
    selectedWardCode,
    selectedWard,
    wards,
    isLoadingWards,
    communeCoords,
    isResolvingCoords,
    activeMapView,
    setActiveMapView,
    // Handlers
    handleSelectMode,
    handleSelectMacroRegion,
    handleSelectRegion,
    handleSelectProvince,
    handleClearProvince,
    handleSelectDistrict,
    handleSelectWard,
    handleResetHierarchy,
    handleLoadMore,
  } = useVungMien();

  if (!isClient) return null;

  return (
    <div className="flex flex-col gap-5 sm:gap-6">
      {/* ─── HEADER & BREADCRUMB & HERO BANNER ─── */}
      <div className="flex flex-col gap-3">
        <Breadcrumb items={[{ label: 'Trang chủ', href: '/' }, { label: 'Đặc sản vùng miền' }]} />

        {/* Hero Card: Gọn gàng, hiện đại, biophilic accents, không choán diện tích */}
        <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 rounded-2xl p-5 sm:p-7 text-white shadow-sm overflow-hidden relative border border-emerald-700/40">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wide uppercase mb-2.5 border border-white/15 text-emerald-100">
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              Bản đồ nông sản OCOP Việt Nam
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight text-white">
              Bản Đồ Đặc Sản & Nông Sản Vùng Miền
            </h1>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed mb-4 max-w-2xl">
              Hệ thống tra cứu số hóa phân cấp từ{' '}
              <span className="text-white font-bold">
                Toàn quốc &bull; Vùng kinh tế &bull; Tỉnh thành
              </span>{' '}
              đến chi tiết{' '}
              <span className="text-white font-bold">
                {isTwoTierMode ? 'Xã / Phường trực thuộc' : 'Quận / Huyện &bull; Xã / Phường'}
              </span>
              . Tích hợp bản đồ vệ tinh vùng trồng và sản phẩm OCOP đạt chuẩn 3 - 5 sao.
            </p>

            {/* Quick Stat Pills */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-medium text-emerald-100/90">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg backdrop-blur-xs border border-white/10">
                <Sparkles className="w-3 h-3 text-amber-300" />
                Hỗ trợ 63 & 34 tỉnh quy hoạch mới
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg backdrop-blur-xs border border-white/10">
                <Satellite className="w-3 h-3 text-emerald-300" />
                Định vị vệ tinh Xã / Vùng trồng
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/10 rounded-lg backdrop-blur-xs border border-white/10">
                <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                OCOP 3 &bull; 4 &bull; 5 Sao
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── BỘ LỌC ĐIỀU HÀNH TẬP TRUNG (COMMAND BAR DUY NHẤT) ─── */}
      <AdministrativeHierarchyFilter
        mode={mode}
        isTwoTierMode={isTwoTierMode}
        onSelectMode={handleSelectMode}
        macroRegion={macroRegion}
        macroRegionsList={macroRegionsList}
        onSelectMacroRegion={handleSelectMacroRegion}
        availableRegions={availableRegions}
        selectedRegionId={selectedRegionId}
        onSelectRegion={handleSelectRegion}
        selectedProvince={selectedProvince}
        onSelectProvince={handleSelectProvince}
        onClearProvince={handleClearProvince}
        constituentProvinces={constituentProvinces}
        selectedConstituentCode={selectedConstituentCode}
        onSelectConstituent={handleSelectConstituent}
        districts={districts}
        selectedDistrictId={selectedDistrictId}
        isLoadingDistricts={isLoadingDistricts}
        onSelectDistrict={handleSelectDistrict}
        wards={wards}
        selectedWardCode={selectedWardCode}
        isLoadingWards={isLoadingWards}
        onSelectWard={handleSelectWard}
        onResetHierarchy={handleResetHierarchy}
      />

      {/* ─── NỘI DUNG CHÍNH: BẢN ĐỒ TƯƠNG TÁC (TRÁI) & SẢN PHẨM OCOP (PHẢI) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* CỘT TRÁI: BẢN ĐỒ & THẺ THÔNG TIN ĐỊA BÀN */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-stone-200/80 p-4 sm:p-5 flex flex-col items-center h-fit lg:sticky lg:top-20 transition-all">
          {/* Header Bản đồ với Bộ chuyển đổi Chế độ hiển thị duy nhất */}
          <div className="w-full flex items-center justify-between mb-3.5 border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin className="text-emerald-700 w-4 h-4 shrink-0" />
              <h2 className="text-sm sm:text-base font-extrabold text-stone-900 truncate">
                {activeMapView === 'satellite'
                  ? 'Bản Đồ Vệ Tinh Xã / Vùng Trồng'
                  : `Bản Đồ ${isTwoTierMode ? '34 Tỉnh Thành (Mới)' : '63 Tỉnh Thành'}`}
              </h2>
            </div>

            {/* Toggle 2 chế độ bản đồ: Overview vs Satellite */}
            <div className="inline-flex p-0.5 bg-stone-100 rounded-lg border border-stone-200 text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setActiveMapView('overview')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeMapView === 'overview'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Bản đồ tổng quan toàn quốc"
              >
                <Globe className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Tổng quan</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveMapView('satellite')}
                className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeMapView === 'satellite'
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Bản đồ vệ tinh chi tiết Xã / Vùng trồng"
              >
                <Satellite className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Vệ tinh Xã</span>
              </button>
            </div>
          </div>

          {/* Vùng hiển thị Bản đồ */}
          {activeMapView === 'satellite' ? (
            <div className="w-full">
              <CommuneMapWrapper
                center={communeCoords}
                zoom={selectedWard ? 14 : selectedDistrict ? 12 : 9}
                provinceName={selectedProvince || undefined}
                districtName={selectedDistrict?.name}
                wardName={selectedWard?.name}
                products={products}
                isResolvingCoords={isResolvingCoords}
              />
            </div>
          ) : (
            <div className="w-full flex justify-center py-2 bg-gradient-to-b from-emerald-50/30 to-stone-50/50 rounded-xl relative overflow-hidden border border-emerald-100/60">
              <VietnamMap
                mode={mode}
                selectedProvince={selectedProvince}
                selectedRegionId={selectedRegionId}
                selectedMacroRegion={macroRegion}
                onSelectProvince={handleSelectProvince}
              />
            </div>
          )}

          {/* Thẻ thông tin Xã / Huyện / Tỉnh bên dưới bản đồ */}
          {selectedWard || (mode === '63' && selectedDistrict) ? (
            <CommuneInfoCard
              provinceName={selectedProvince}
              provinceInfo={selectedProvinceInfo}
              district={selectedDistrict}
              ward={selectedWard}
              isTwoTierMode={isTwoTierMode}
              communeCoords={communeCoords}
              productCount={products.length}
              isFilteredByCommune={isFilteredByCommune}
              activeMapView={activeMapView}
              onToggleMapView={setActiveMapView}
              onClearWard={() => handleSelectWard(null)}
              onClearHierarchy={handleResetHierarchy}
            />
          ) : selectedProvince && selectedProvinceInfo ? (
            /* Card thông tin Tỉnh thành đang chọn */
            <div className="w-full mt-4 p-4 bg-emerald-50/70 rounded-xl border border-emerald-200/80 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {selectedProvinceInfo.macroRegionName} &bull; {selectedProvinceInfo.regionName}
                  </span>
                  <h3 className="text-lg font-black text-stone-900 mt-0.5">
                    {selectedProvinceInfo.name}
                  </h3>
                </div>
                <button
                  onClick={handleClearProvince}
                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-white rounded-lg transition-colors"
                  title="Bỏ chọn tỉnh"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Thông tin hợp nhất cho 34 tỉnh */}
              {isTwoTierMode &&
                selectedProvinceInfo.constituentNames &&
                selectedProvinceInfo.constituentNames.length > 1 && (
                  <div className="mt-2.5 pt-2.5 border-t border-emerald-200/60 text-xs text-stone-600">
                    <span className="font-bold text-stone-700">Tỉnh thành hợp nhất gồm: </span>
                    <span className="text-emerald-900 font-semibold">
                      {selectedProvinceInfo.constituentNames.join(', ')}
                    </span>
                  </div>
                )}
            </div>
          ) : (
            <p className="text-xs text-stone-500 mt-3 text-center italic">
              {isTwoTierMode
                ? '* Chọn Tỉnh ➔ Xã/Phường ở bộ lọc trên để xem bản đồ vệ tinh và sản phẩm OCOP tương ứng.'
                : '* Chọn Tỉnh ➔ Huyện ➔ Xã ở bộ lọc trên để xem bản đồ vệ tinh và sản phẩm OCOP tương ứng.'}
            </p>
          )}
        </div>

        {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM OCOP & BỘ LỌC SAO */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 p-5 sm:p-6">
            {/* Header Showcase: Tiêu đề địa bàn & nút hoàn tác nhanh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3.5 border-b border-stone-100">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs shrink-0">
                  <Package className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg sm:text-xl font-black text-stone-900 truncate">
                    {selectedWard
                      ? isTwoTierMode
                        ? `Đặc sản ${selectedWard.name} (${selectedProvince})`
                        : `Đặc sản ${selectedWard.name} (${selectedDistrict?.name})`
                      : selectedDistrict
                        ? `Đặc sản ${selectedDistrict.name} (${selectedProvince})`
                        : selectedProvince
                          ? `Đặc sản ${selectedProvince}`
                          : selectedRegionId !== 'all'
                            ? `Sản phẩm ${availableRegions.find((r) => r.id === selectedRegionId)?.name}`
                            : macroRegion !== 'all'
                              ? `Sản phẩm ${macroRegionsList.find((m) => m.key === macroRegion)?.name}`
                              : 'Sản phẩm tiêu biểu toàn quốc'}
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {products.length > 0
                      ? isFilteredByCommune
                        ? `Tìm thấy ${products.length} sản phẩm OCOP từ địa bàn ${selectedWard?.name}`
                        : isFilteredByDistrict
                          ? `Tìm thấy ${products.length} sản phẩm OCOP thuộc ${selectedDistrict?.name || selectedProvince}`
                          : `Hiển thị ${products.length} sản phẩm OCOP đạt chuẩn`
                      : totalRawProductsCount > 0
                        ? `Không có sản phẩm nào khớp với bộ lọc sao OCOP đã chọn (trên tổng số ${totalRawProductsCount} sản phẩm khu vực).`
                        : 'Khám phá sản phẩm OCOP đặc trưng của từng vùng miền'}
                  </p>
                </div>
              </div>

              {/* Quick Reset Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                {selectedWard && (
                  <button
                    type="button"
                    onClick={() => handleSelectWard(null)}
                    className="text-xs text-stone-600 hover:text-stone-900 font-bold px-3 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                  >
                    {isTwoTierMode ? 'Xem cả tỉnh' : 'Xem cả huyện'}
                  </button>
                )}
                {selectedProvince && (
                  <button
                    type="button"
                    onClick={handleClearProvince}
                    className="text-xs text-emerald-700 hover:text-emerald-800 font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
                  >
                    Xem toàn quốc
                  </button>
                )}
              </div>
            </div>

            {/* Bộ lọc Hạng Sao OCOP: Tất cả | 5 Sao | 4 Sao | 3 Sao */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
              <span className="text-xs font-bold text-stone-500 mr-1 whitespace-nowrap">
                Hạng OCOP:
              </span>
              <button
                type="button"
                onClick={() => handleSelectStar(null)}
                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedStar === null
                    ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                Tất cả
              </button>
              {[5, 4, 3].map((star) => {
                const isSelected = selectedStar === star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleSelectStar(isSelected ? null : star)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-amber-50 hover:border-amber-200'
                    }`}
                  >
                    <Star
                      className={`w-3 h-3 ${isSelected ? 'fill-white text-white' : 'fill-amber-400 text-amber-400'}`}
                    />
                    <span>{star} Sao</span>
                    {star === 5 && (
                      <span className="text-[10px] opacity-85 hidden sm:inline">(Quốc gia)</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Product Grid Area */}
            <div className="relative min-h-[400px]">
              {isFetching && !isFetchingNextPage && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex items-center justify-center rounded-xl transition-all">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-9 h-9 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs font-bold text-emerald-800 uppercase tracking-widest animate-pulse">
                      Đang cập nhật sản phẩm...
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
                  <div className="col-span-full py-16 flex flex-col items-center justify-center text-stone-500 bg-stone-50/70 rounded-2xl border border-dashed border-stone-300 p-8">
                    <Package className="w-12 h-12 text-stone-300 mb-3" />
                    <p className="font-bold text-center text-stone-700 text-base">
                      Chưa có dữ liệu sản phẩm phù hợp
                    </p>
                    <p className="text-xs text-stone-500 mt-1 text-center max-w-sm">
                      {selectedStar !== null
                        ? `Không tìm thấy sản phẩm ${selectedStar} sao trong khu vực này. Bạn có thể chọn "Tất cả" sao để xem các hạng khác.`
                        : selectedWard
                          ? `Chưa có sản phẩm OCOP đăng ký tại địa bàn ${selectedWard.name}. Bạn có thể xem các sản phẩm khác trong ${isTwoTierMode ? selectedProvince : selectedDistrict?.name || selectedProvince}.`
                          : 'Vui lòng chọn một tỉnh thành hoặc xã/phường khác trên bản đồ để tiếp tục khám phá.'}
                    </p>
                    {selectedStar !== null && (
                      <button
                        type="button"
                        onClick={() => handleSelectStar(null)}
                        className="mt-4 px-4 py-1.5 bg-white border border-stone-200 text-xs font-bold text-stone-700 rounded-lg hover:bg-stone-50 flex items-center gap-1.5 shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Xem tất cả hạng sao
                      </button>
                    )}
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
                    location={product.productionArea || product.provinceName || undefined}
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
                  type="button"
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className="px-6 py-2.5 bg-white border-2 border-emerald-700 text-emerald-800 font-bold rounded-full hover:bg-emerald-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm shadow-xs"
                >
                  {isFetchingNextPage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin" />
                      Đang tải thêm...
                    </>
                  ) : (
                    <>
                      Xem thêm sản phẩm
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
