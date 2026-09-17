'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Wheat, Star, MapPin, Store } from 'lucide-react';
import type { EventCollection, EventProductSummary } from '../../types/eventCommerceTypes';

interface EventCollectionSectionProps {
  collections: EventCollection[];
  title?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export function EventCollectionSection({
  collections,
  title = 'Bộ Sưu Tập Nông Sản Đặc Sắc',
  device,
}: EventCollectionSectionProps) {
  const isMobile = device === 'mobile';
  const isTablet = device === 'tablet';

  const [selectedCollectionId, setSelectedCollectionId] = useState<number>(
    collections.length > 0 ? collections[0].id : 0,
  );
  const [starFilter, setStarFilter] = useState<number | null>(null);
  const [provinceFilter, setProvinceFilter] = useState<string>('');

  if (!collections || collections.length === 0) return null;

  const activeCollection = collections.find((c) => c.id === selectedCollectionId) || collections[0];

  const provinces = Array.from(
    new Set(
      activeCollection.products
        .map((product) => product.provinceName?.trim())
        .filter((province): province is string => Boolean(province)),
    ),
  ).sort((a, b) => a.localeCompare(b, 'vi'));

  const filteredProducts = activeCollection.products.filter((p) => {
    if (starFilter !== null && p.ocopStar !== starFilter) return false;
    if (provinceFilter && p.provinceName !== provinceFilter) return false;
    return true;
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(val);
  };

  return (
    <section
      id="collections"
      className={`w-full max-w-7xl mx-auto scroll-mt-24 ${
        isMobile ? 'py-4 px-2.5' : 'py-10 px-4 sm:px-6 lg:px-8'
      }`}
    >
      {/* Section Header */}
      <div className={`text-center ${isMobile ? 'mb-4' : 'mb-8'}`}>
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border shadow-xs"
          style={{
            backgroundColor: 'var(--event-surface, #FEF2F2)',
            color: 'var(--event-primary, #DC2626)',
            borderColor: 'var(--event-primary, #DC2626)',
          }}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Sản phẩm tuyển chọn</span>
        </div>
        <h2
          className={`font-extrabold tracking-tight text-slate-900 ${
            isMobile ? 'text-lg' : 'text-2xl sm:text-3xl'
          }`}
        >
          {title}
        </h2>
        {activeCollection.description && (
          <p className="mt-2 text-xs sm:text-base text-slate-600 max-w-2xl mx-auto">
            {activeCollection.description}
          </p>
        )}
      </div>

      {/* Collection Tabs */}
      {collections.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 flex-wrap mb-5">
          {collections.map((col) => {
            const isSelected = col.id === activeCollection.id;
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => {
                  setSelectedCollectionId(col.id);
                  setProvinceFilter('');
                }}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer shadow-xs border ${
                  isSelected
                    ? 'text-white scale-105 shadow-md border-transparent'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
                style={
                  isSelected ? { backgroundColor: 'var(--event-primary, #DC2626)' } : undefined
                }
              >
                {col.name}
                <span className="ml-1.5 text-xs opacity-80">({col.products.length})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick filters: OCOP stars and province */}
      <div
        className="flex items-center justify-between flex-wrap gap-2.5 mb-5 p-2.5 sm:p-3 rounded-2xl border backdrop-blur-md shadow-xs"
        style={{
          backgroundColor: 'var(--event-card-bg, #FFFFFF)',
          borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
        }}
      >
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-600">
            Hạng sao OCOP:
          </span>
          <button
            type="button"
            onClick={() => setStarFilter(null)}
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition cursor-pointer border ${
              starFilter === null
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/60'
            }`}
          >
            Tất cả
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarFilter(starFilter === star ? null : star)}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition cursor-pointer border ${
                starFilter === star
                  ? 'bg-amber-500 text-slate-950 shadow-2xs font-bold border-amber-500'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200/60'
              }`}
            >
              <span>{star} Sao</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
            </button>
          ))}
          {provinces.length > 0 && (
            <select
              value={provinceFilter}
              onChange={(event) => setProvinceFilter(event.target.value)}
              aria-label="Lọc sản phẩm theo tỉnh thành"
              className="px-2.5 py-1 text-xs rounded-lg font-medium bg-slate-50 text-slate-700 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="" className="bg-white text-slate-800">
                Tất cả tỉnh thành
              </option>
              {provinces.map((province) => (
                <option key={province} value={province} className="bg-white text-slate-800">
                  {province}
                </option>
              ))}
            </select>
          )}
        </div>
        <span className="text-[11px] sm:text-xs text-slate-500">
          Hiển thị <strong className="text-slate-800">{filteredProducts.length}</strong> sản phẩm
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div
          className="py-12 text-center rounded-2xl border border-dashed bg-white"
          style={{
            borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.12))',
          }}
        >
          <Wheat className="w-10 h-10 mx-auto text-slate-400 opacity-60 mb-2" />
          <p className="text-sm text-slate-400">Chưa có sản phẩm nào phù hợp với bộ lọc đã chọn.</p>
        </div>
      ) : (
        <div
          className={`grid ${
            isMobile
              ? 'grid-cols-2 gap-2.5'
              : isTablet
                ? 'grid-cols-3 gap-4'
                : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6'
          }`}
        >
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} formatPrice={formatPrice} isMobile={isMobile} />
          ))}
        </div>
      )}
    </section>
  );
}

interface ProductCardProps {
  product: EventProductSummary;
  formatPrice: (val: number) => string;
  isMobile?: boolean;
}

function ProductCard({ product, formatPrice, isMobile = false }: ProductCardProps) {
  const isOcop = Boolean(product.ocopStar && product.ocopStar >= 3);

  return (
    <div
      className="group relative rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1 bg-white"
      style={{
        borderColor: 'var(--event-card-border, rgba(0, 0, 0, 0.08))',
      }}
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Wheat className="w-10 h-10 opacity-30" />
          </div>
        )}

        {/* OCOP Star Badge */}
        {isOcop && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold shadow-md">
            <span>OCOP {product.ocopStar}</span>
            <Star className="w-2.5 h-2.5 fill-white text-white inline" />
          </div>
        )}

        {/* Highlighted Ribbon */}
        {product.isHighlighted && (
          <div
            className="absolute top-2 right-2 z-10 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white shadow-md uppercase tracking-wider"
            style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
          >
            Đặc sắc
          </div>
        )}

        {/* Province Chip */}
        {product.provinceName && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-white text-[9px] font-medium flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 text-amber-400 shrink-0" />
            <span className="truncate max-w-[100px]">{product.provinceName}</span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div
        className={`${isMobile ? 'p-2.5' : 'p-3.5 sm:p-4'} flex-1 flex flex-col justify-between`}
      >
        <div>
          {/* Shop Name */}
          {product.shopName && (
            <p className="text-[10px] text-slate-500 truncate mb-1 flex items-center gap-1">
              <Store className="w-3 h-3 shrink-0 text-slate-400" />
              <span className="truncate">{product.shopName}</span>
            </p>
          )}

          {/* Product Name */}
          <h3
            className={`${
              isMobile ? 'text-xs min-h-[30px]' : 'text-xs sm:text-sm min-h-[36px]'
            } font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-amber-600 transition-colors`}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="mt-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`${isMobile ? 'text-xs' : 'text-sm sm:text-base'} font-extrabold tracking-tight`}
              style={{ color: 'var(--event-secondary, #D97706)' }}
            >
              {formatPrice(product.minPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
            <div className="flex items-center gap-0.5">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.ratingAvg.toFixed(1)}</span>
            </div>
            <span>Đã bán {product.soldCount}</span>
          </div>

          {/* Action CTA */}
          <Link
            href={`/product/${product.slug}`}
            className={`mt-2.5 w-full block text-center ${
              isMobile ? 'py-1.5 px-2 text-[11px]' : 'py-2 px-3 text-xs'
            } rounded-xl font-bold text-white transition-all shadow-xs group-hover:shadow-md cursor-pointer`}
            style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
