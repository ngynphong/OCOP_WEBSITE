'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Layers, Droplets } from 'lucide-react';
import { IProcessTemplate } from '@/features/supply-chain/types/supplyChainTypes';
import { BatchCreationFormData, SellerProduct, SellerVariant, MaterialLotOption } from './types';

interface Step4ConfirmationProps {
  form: UseFormReturn<BatchCreationFormData>;
  selectedProduct?: SellerProduct;
  selectedVariant?: SellerVariant;
  selectedTemplate?: IProcessTemplate;
  materialLotsData?: MaterialLotOption[];
}

export default function Step4Confirmation({
  form,
  selectedProduct,
  selectedVariant,
  selectedTemplate,
  materialLotsData,
}: Step4ConfirmationProps) {
  const materialsUsed = form.watch('materialsUsed') || [];

  return (
    <div
      id="tour-lot-submit"
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-slate-800">Kiểm tra & Xác nhận</h2>
        <p className="text-slate-500 text-sm mt-1">
          Vui lòng kiểm tra lại thông tin trước khi khởi tạo lô sản xuất.
        </p>
      </div>

      <div className="bg-slate-50/80 p-6 rounded-2xl border border-slate-200 space-y-6">
        <div className="grid grid-cols-2 gap-y-6 gap-x-8 text-sm">
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block mb-1">Mã lô</span>
            <span className="font-bold text-slate-900 text-base">{form.getValues('lotCode')}</span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block mb-1">Sản lượng dự kiến</span>
            <span className="font-semibold text-slate-700">
              {form.getValues('quantity')} {form.getValues('unit')}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block mb-1">Ngày sản xuất</span>
            <span className="font-semibold text-slate-700">{form.getValues('productionDate')}</span>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block mb-1">Sản phẩm</span>
            <span className="font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg inline-block border border-blue-100">
              {selectedProduct?.name || 'Chưa chọn'}
            </span>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <span className="text-slate-500 block mb-1">Quy cách</span>
            <span className="font-semibold text-slate-700">
              {selectedVariant?.variantName || 'Chưa chọn'}
            </span>
          </div>

          <div className="col-span-2">
            <span className="text-slate-500 block mb-1">Quy trình áp dụng</span>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-700">
                {selectedTemplate?.name || 'Chưa chọn'}
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                v{selectedTemplate?.versionNumber || 1.0}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="w-4 h-4 text-slate-500" />
            <span className="text-slate-700 font-semibold">Nguyên liệu tiêu hao:</span>
          </div>
          {materialsUsed.length > 0 ? (
            <div className="space-y-2">
              {materialsUsed.map((m, idx) => {
                const lotInfo = materialLotsData?.find(
                  (l: MaterialLotOption) => l.id === m.materialLotId,
                );
                if (!lotInfo) return null;
                return (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{lotInfo.materialName}</span>
                      <span className="text-xs text-slate-500">Mã: {lotInfo.code}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-blue-600">{m.quantity}</span>
                      <span className="text-xs text-slate-500 ml-1">{lotInfo.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl border border-slate-100 text-center text-sm font-medium text-slate-500 italic shadow-sm">
              Không phân bổ nguyên liệu cụ thể
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
