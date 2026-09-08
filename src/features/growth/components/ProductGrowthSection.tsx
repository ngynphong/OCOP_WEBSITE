'use client';

import React from 'react';
import { Star, ArrowRight, Eye, ShoppingBag, Box, ShieldCheck, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductGrowthItem } from '../types';

interface Props {
  products: ProductGrowthItem[];
  isLoading?: boolean;
}

export const ProductGrowthSection: React.FC<Props> = ({ products, isLoading = false }) => {
  const getHealthBadge = (score: number, status: string) => {
    switch (status) {
      case 'EXCELLENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3 h-3 text-emerald-600" /> {score}đ • Xuất sắc
          </span>
        );
      case 'HEALTHY':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {score}đ • Tốt
          </span>
        );
      case 'NEEDS_IMPROVEMENT':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" /> {score}đ • Cần tối ưu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-600" /> {score}đ • Báo động
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="h-6 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-gray-50 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Sức Khoẻ & Tiềm Năng Sản Phẩm OCOP</h3>
          <p className="text-xs text-gray-500">
            Theo dõi tỷ lệ chuyển đổi, độ hoàn thiện hồ sơ OCOP và đề xuất hành động trực tiếp
          </p>
        </div>

        <Link
          href="/dashboard/san-pham"
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          Tất cả sản phẩm ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="p-8 text-center bg-gray-50 rounded-xl">
          <p className="text-xs text-gray-500">Chưa có sản phẩm nào được duyệt trong gian hàng.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-3">Sản phẩm OCOP</th>
                <th className="py-3 px-3 text-center">Lượt xem / Đã bán</th>
                <th className="py-3 px-3 text-center">Tỷ lệ chuyển đổi</th>
                <th className="py-3 px-3 text-center">Tồn kho</th>
                <th className="py-3 px-3 text-center">Điểm sức khoẻ</th>
                <th className="py-3 px-3 text-right">Đề xuất hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((prod) => (
                <tr key={prod.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0 relative border border-gray-100">
                        {prod.thumbnail ? (
                          <Image
                            src={prod.thumbnail}
                            alt={prod.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xs">
                            OCOP
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate max-w-xs">
                          {prod.name}
                        </div>
                        {prod.ocopStar && (
                          <div className="flex items-center gap-0.5 mt-0.5 text-amber-500">
                            {Array.from({ length: prod.ocopStar }).map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-amber-400" />
                            ))}
                            <span className="text-[10px] text-gray-500 font-medium ml-1">
                              {prod.ocopStar} sao OCOP
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="inline-flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-gray-600" title="Lượt xem">
                        <Eye className="w-3.5 h-3.5 text-gray-400" /> {prod.viewCount}
                      </span>
                      <span
                        className="flex items-center gap-1 text-gray-800 font-semibold"
                        title="Đã bán"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" /> {prod.soldCount}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center font-semibold text-gray-800">
                    <span
                      className={`px-2 py-0.5 rounded ${
                        prod.conversionRate >= 2.0
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {prod.conversionRate}%
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-medium ${
                        prod.totalStock <= 5
                          ? 'bg-rose-50 text-rose-700 font-bold'
                          : 'text-gray-700'
                      }`}
                    >
                      <Box className="w-3 h-3" /> {prod.totalStock}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    {getHealthBadge(prod.healthScore, prod.healthStatus)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <Link
                      href={prod.suggestedActionUrl}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-emerald-600 hover:text-white text-gray-700 font-semibold text-xs transition-colors"
                    >
                      <span>{prod.suggestedAction}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
