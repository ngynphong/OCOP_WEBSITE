'use client';

import React from 'react';
import { Package, Layers } from 'lucide-react';
import { IProcessTemplate } from '@/features/supply-chain/types/supplyChainTypes';
import { SellerProduct, SellerVariant } from './types';

interface BatchSetupSummaryProps {
  lotCode: string;
  selectedProduct?: SellerProduct;
  selectedVariant?: SellerVariant;
  selectedTemplate?: IProcessTemplate;
  materialsCount: number;
}

export default function BatchSetupSummary({
  lotCode,
  selectedProduct,
  selectedVariant,
  selectedTemplate,
  materialsCount,
}: BatchSetupSummaryProps) {
  return (
    <div className="sticky top-8 bg-slate-50 rounded-2xl p-6 border border-slate-200">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Package className="w-5 h-5 text-blue-500" />
        Tóm tắt thiết lập
      </h3>

      <div className="space-y-4 text-sm">
        <div className="pb-4 border-b border-slate-200">
          <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
            Mã lô
          </span>
          <span className="font-medium text-slate-900">
            {lotCode || <span className="text-slate-400 italic">Chưa nhập</span>}
          </span>
        </div>

        <div className="pb-4 border-b border-slate-200">
          <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
            Sản phẩm & Quy cách
          </span>
          <div className="font-medium text-slate-900">
            {selectedProduct?.name ? (
              <div>
                {selectedProduct.name}
                {selectedVariant?.variantName && (
                  <span className="text-slate-500 font-normal">
                    {' '}
                    - {selectedVariant.variantName}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 italic">Chưa chọn</span>
            )}
          </div>
        </div>

        <div className="pb-4 border-b border-slate-200">
          <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
            Quy trình
          </span>
          <div className="font-medium text-slate-900">
            {selectedTemplate?.name ? (
              <div className="flex items-center gap-1.5 text-emerald-700">
                <Layers className="w-3.5 h-3.5" /> {selectedTemplate.name}
              </div>
            ) : (
              <span className="text-slate-400 italic">Chưa chọn</span>
            )}
          </div>
        </div>

        <div className="pb-4 border-b border-slate-200">
          <span className="text-slate-500 block text-xs uppercase tracking-wider font-semibold mb-1">
            Nguyên liệu
          </span>
          <div className="font-medium text-slate-900">
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {materialsCount}
            </span>{' '}
            lô được chọn
          </div>
        </div>
      </div>
    </div>
  );
}
