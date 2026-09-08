'use client';

import React from 'react';
import { Product } from '@/features/products/types/productTypes';
import {
  ShieldCheck,
  Award,
  MapPin,
  Package,
  Scale,
  FileText,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

interface ProductSpecsProps {
  product: Product;
}

export function ProductSpecs({ product }: ProductSpecsProps) {
  const originLocation =
    product.productionArea && product.province?.name
      ? `${product.productionArea}, ${product.province.name}`
      : product.productionArea || product.province?.name || 'Chưa cập nhật';

  const specs = [
    {
      label: 'Tên sản phẩm',
      value: product.name || 'Chưa cập nhật',
      icon: FileText,
    },
    {
      label: 'Phân hạng OCOP',
      value: product.ocopStar ? `OCOP ${product.ocopStar} Sao Quốc gia` : 'Chưa cập nhật',
      icon: Award,
      highlight: !!product.ocopStar,
    },
    {
      label: 'Vùng sản xuất / Xuất xứ',
      value: originLocation,
      icon: MapPin,
    },
    {
      label: 'Danh mục',
      value: product.category?.name || 'Chưa cập nhật',
      icon: Sparkles,
    },
    {
      label: 'Quy cách đóng gói',
      value: product.unit || 'Chưa cập nhật',
      icon: Package,
    },
    {
      label: 'Khối lượng tịnh',
      value: product.weightGram ? `${product.weightGram} g` : 'Chưa cập nhật',
      icon: Scale,
    },
    {
      label: 'Thành phần',
      value: product.ingredients || 'Chưa cập nhật',
      icon: CheckCircle2,
    },
    {
      label: 'Tiêu chuẩn chất lượng',
      value: product.appliedStandards || 'Chưa cập nhật',
      icon: ShieldCheck,
      highlight: !!product.appliedStandards,
    },
    {
      label: 'Chất liệu bao bì',
      value: product.packagingMaterial || 'Chưa cập nhật',
      icon: Package,
    },
    {
      label: 'Chủ thể sản xuất',
      value: product.shop?.name || 'Chưa cập nhật',
      icon: Award,
    },
  ];

  return (
    <section className="py-8 border-t border-stone-100">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
              Đặc tính & Tiêu chuẩn
            </span>
            <h2 className="text-xl md:text-2xl font-black text-stone-900 tracking-tight mt-0.5">
              Thông số chi tiết sản phẩm
            </h2>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hồ sơ sản phẩm OCOP</span>
          </div>
        </div>

        {/* Specifications Table Grid */}
        <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-100">
            {/* Column 1 */}
            <div className="divide-y divide-stone-100">
              {specs.slice(0, 5).map((item, idx) => {
                const IconComponent = item.icon;
                const isNotUpdated = item.value === 'Chưa cập nhật';
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 sm:p-4 hover:bg-stone-50/60 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs text-stone-500 font-medium">{item.label}</span>
                      <span
                        className={`text-sm mt-0.5 ${
                          isNotUpdated
                            ? 'text-stone-400 italic font-normal'
                            : item.highlight
                              ? 'text-emerald-800 font-black'
                              : 'text-stone-900 font-bold'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="divide-y divide-stone-100">
              {specs.slice(5).map((item, idx) => {
                const IconComponent = item.icon;
                const isNotUpdated = item.value === 'Chưa cập nhật';
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 sm:p-4 hover:bg-stone-50/60 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-xs text-stone-500 font-medium">{item.label}</span>
                      <span
                        className={`text-sm mt-0.5 ${
                          isNotUpdated
                            ? 'text-stone-400 italic font-normal'
                            : item.highlight
                              ? 'text-emerald-800 font-black'
                              : 'text-stone-900 font-bold'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
