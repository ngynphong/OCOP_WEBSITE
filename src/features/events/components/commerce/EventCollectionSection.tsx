'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { EventCollection, EventProductSummary } from '../../types/eventCommerceTypes';

interface EventCollectionSectionProps {
  collections: EventCollection[];
  title?: string;
}

export function EventCollectionSection({
  collections,
  title = 'Bộ Sưu Tập Nông Sản Đặc Sắc',
}: EventCollectionSectionProps) {
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
      className="w-full py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-24"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <div
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 border shadow-sm"
          style={{
            backgroundColor: 'var(--event-surface, #FEF2F2)',
            color: 'var(--event-primary, #DC2626)',
            borderColor: 'var(--event-primary, #DC2626)',
          }}
        >
          <span>📦</span>
          <span>Sản phẩm tuyển chọn</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {title}
        </h2>
        {activeCollection.description && (
          <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {activeCollection.description}
          </p>
        )}
      </div>

      {/* Collection Tabs */}
      {collections.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap mb-6">
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
                className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer shadow-sm border ${
                  isSelected
                    ? 'text-white scale-105 shadow-md border-transparent'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
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
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6 p-3 bg-white/70 dark:bg-slate-800/70 rounded-xl border border-slate-200/80 dark:border-slate-700">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Lọc theo hạng sao OCOP:
          </span>
          <button
            type="button"
            onClick={() => setStarFilter(null)}
            className={`px-3 py-1 text-xs rounded-lg font-medium transition cursor-pointer ${
              starFilter === null
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setStarFilter(starFilter === star ? null : star)}
              className={`px-3 py-1 text-xs rounded-lg font-medium flex items-center gap-1 transition cursor-pointer ${
                starFilter === star
                  ? 'bg-amber-500 text-white shadow-sm font-bold'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              <span>{star} Sao</span>
              <span>⭐</span>
            </button>
          ))}
          {provinces.length > 0 && (
            <select
              value={provinceFilter}
              onChange={(event) => setProvinceFilter(event.target.value)}
              aria-label="Lọc sản phẩm theo tỉnh thành"
              className="ml-0 sm:ml-2 px-3 py-1.5 text-xs rounded-lg font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">Tất cả tỉnh thành</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
          )}
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Hiển thị <strong>{filteredProducts.length}</strong> sản phẩm
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-12 text-center bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <span className="text-4xl">🌾</span>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Chưa có sản phẩm nào phù hợp với bộ lọc đã chọn.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} formatPrice={formatPrice} />
          ))}
        </div>
      )}
    </section>
  );
}

interface ProductCardProps {
  product: EventProductSummary;
  formatPrice: (val: number) => string;
}

function ProductCard({ product, formatPrice }: ProductCardProps) {
  const isOcop = Boolean(product.ocopStar && product.ocopStar >= 3);

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {product.mainImageUrl ? (
          <Image
            src={product.mainImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-slate-400">
            🌾
          </div>
        )}

        {/* OCOP Star Badge */}
        {isOcop && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-0.5 px-2 py-0.5 rounded-md bg-amber-500 text-white text-[11px] font-extrabold shadow-md">
            <span>OCOP {product.ocopStar}★</span>
          </div>
        )}

        {/* Highlighted Ribbon */}
        {product.isHighlighted && (
          <div
            className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[10px] font-bold text-white shadow-md uppercase tracking-wider"
            style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
          >
            Đặc sắc
          </div>
        )}

        {/* Province Chip */}
        {product.provinceName && (
          <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium flex items-center gap-1">
            <span>📍</span>
            <span className="truncate max-w-[120px]">{product.provinceName}</span>
          </div>
        )}
      </div>

      {/* Product Content */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop Name */}
          {product.shopName && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">
              🏪 {product.shopName}
            </p>
          )}

          {/* Product Name */}
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Price & Rating */}
        <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-baseline gap-1.5">
            <span
              className="text-sm sm:text-base font-extrabold tracking-tight"
              style={{ color: 'var(--event-primary, #DC2626)' }}
            >
              {formatPrice(product.minPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
            <div className="flex items-center gap-0.5">
              <span className="text-amber-400">★</span>
              <span>{product.ratingAvg.toFixed(1)}</span>
            </div>
            <span>Đã bán {product.soldCount}</span>
          </div>

          {/* Action CTA */}
          <Link
            href={`/product/${product.slug}`}
            className="mt-3 w-full block text-center py-2 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm group-hover:shadow-md cursor-pointer"
            style={{ backgroundColor: 'var(--event-primary, #DC2626)' }}
          >
            Xem Chi Tiết
          </Link>
        </div>
      </div>
    </div>
  );
}
