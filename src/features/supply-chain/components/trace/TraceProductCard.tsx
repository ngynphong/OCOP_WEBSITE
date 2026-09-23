import React from 'react';
import Image from 'next/image';
import { Star, Package, Store, MapPin, FileText } from 'lucide-react';
import { TraceProductInfo } from '@/features/products/types/productTypes';

export interface TraceProductCardProps {
  product: TraceProductInfo;
}

export const TraceProductCard: React.FC<TraceProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
            <Star className="w-4.5 h-4.5 fill-amber-500 text-amber-500" />
          </div>
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Thông tin OCOP
            </h2>
            <p className="text-[11px] text-stone-400">Hồ sơ nông sản & chủ thể</p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-800 bg-amber-50/80 px-2.5 py-1 rounded-full border border-amber-200/80 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>{product.ocopStar} sao</span>
        </span>
      </div>
      <div className="p-4 flex flex-col gap-4">
        <div className="relative w-full aspect-4/3 sm:aspect-video lg:aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-50 flex items-center justify-center">
          {product.thumbnailUrl && product.thumbnailUrl.trim() !== '' ? (
            <Image
              src={product.thumbnailUrl}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 bg-stone-100 p-4">
              <Package className="w-12 h-12 opacity-40 mb-2" />
              <span className="text-xs text-stone-500 font-medium">Sản phẩm chứng nhận OCOP</span>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
            {product.name}
          </h3>
          <div className="flex flex-col gap-2 pt-2 border-t border-stone-100">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500 flex items-center gap-1">
                <Store className="w-3.5 h-3.5 text-stone-400" /> Chủ thể
              </span>
              <span className="font-bold text-stone-900 truncate max-w-[180px]">
                {product.shop.name}
              </span>
            </div>
            {product.shop.province && (
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" /> Địa bàn
                </span>
                <span className="font-semibold text-stone-700">{product.shop.province}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-500 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-stone-400" /> Số chứng nhận
              </span>
              <span className="font-bold text-stone-900">
                {product.certificationNumber || 'Chưa cập nhật'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
