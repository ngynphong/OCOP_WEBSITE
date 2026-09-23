'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { RefreshCw, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import { BatchCreationFormData, SellerProduct, SellerVariant, generateLotCode } from './types';
import YieldCalculator from './YieldCalculator';

interface Step1GeneralInfoProps {
  form: UseFormReturn<BatchCreationFormData>;
  products: SellerProduct[];
  variants: SellerVariant[];
  selectedProductId: number;
  lockedProductId: number | null;
  selectedVariant?: SellerVariant;
  onApplyYield: (data: {
    quantity: number;
    unit: string;
    rawYieldUsed: number;
    rawYieldUnit: string;
    packagingYieldRate: number;
    packagingRatioNotes: string;
  }) => void;
}

export default function Step1GeneralInfo({
  form,
  products,
  variants,
  selectedProductId,
  lockedProductId,
  selectedVariant,
  onApplyYield,
}: Step1GeneralInfoProps) {
  return (
    <div
      id="tour-lot-step-1"
      className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-semibold text-slate-700">
          Mã lô sản xuất <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <input
            {...form.register('lotCode')}
            readOnly
            className="w-full rounded-xl bg-slate-50 text-slate-500 font-medium border border-slate-200 px-4 py-3 text-sm focus:outline-none cursor-not-allowed"
            title="Mã lô được tự động sinh ra"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => form.setValue('lotCode', generateLotCode())}
            className="shrink-0 h-auto rounded-xl px-4 border-slate-200 text-slate-600 hover:bg-slate-50"
            title="Tạo lại mã mới"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Tạo lại
          </Button>
        </div>
        {form.formState.errors.lotCode && (
          <p className="text-sm text-red-500 font-medium mt-1">
            {form.formState.errors.lotCode.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Sản phẩm <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...form.register('productId', {
                valueAsNumber: true,
                onChange: () => {
                  form.setValue('variantId', 0);
                  form.setValue('processTemplateId', 0);
                },
              })}
              className={`w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none ${
                lockedProductId
                  ? 'bg-slate-50 cursor-not-allowed opacity-90 pointer-events-none'
                  : 'bg-white'
              }`}
            >
              <option value={0}>Chọn sản phẩm</option>
              {products.map((p: SellerProduct) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>
          {form.formState.errors.productId && (
            <p className="text-sm text-red-500 font-medium mt-1">
              {form.formState.errors.productId.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Biến thể (Quy cách) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <select
              {...form.register('variantId', { valueAsNumber: true })}
              disabled={!selectedProductId}
              className="w-full appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-10 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none disabled:bg-slate-50 disabled:text-slate-400 bg-white"
            >
              <option value={0}>Chọn biến thể</option>
              {variants.map((v: SellerVariant) => (
                <option key={v.id} value={v.id}>
                  {v.variantName} (SKU: {v.sku})
                </option>
              ))}
            </select>
            <ChevronRight className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
          </div>
          {form.formState.errors.variantId && (
            <p className="text-sm text-red-500 font-medium mt-1">
              {form.formState.errors.variantId.message}
            </p>
          )}
        </div>
      </div>

      <YieldCalculator selectedVariant={selectedVariant} onApply={onApplyYield} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">
            Sản lượng dự kiến <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              {...form.register('quantity')}
              className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
            />
            <div className="relative shrink-0">
              <select
                {...form.register('unit')}
                className="w-24 appearance-none rounded-xl text-gray-700 border border-slate-200 px-4 py-3 pr-8 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none bg-white cursor-pointer"
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="tấn">tấn</option>
                <option value="lít">lít</option>
                <option value="ml">ml</option>
                <option value="hộp">hộp</option>
                <option value="chai">chai</option>
                <option value="gói">gói</option>
                <option value="túi">túi</option>
                <option value="hũ">hũ</option>
                <option value="lon">lon</option>
                <option value="cái">cái</option>
                <option value="sản phẩm">sản phẩm</option>
              </select>
              <ChevronRight className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 rotate-90 pointer-events-none" />
            </div>
          </div>
          {(form.formState.errors.quantity || form.formState.errors.unit) && (
            <p className="text-sm text-red-500 font-medium mt-1">
              {form.formState.errors.quantity?.message || form.formState.errors.unit?.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Ngày sản xuất</label>
          <input
            type="date"
            {...form.register('productionDate')}
            className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700">Hạn sử dụng</label>
          <input
            type="date"
            {...form.register('expiryDate')}
            className="w-full rounded-xl text-gray-700 border border-slate-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
          />
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl">
        <input
          type="checkbox"
          id="activateImmediately"
          {...form.register('activateImmediately')}
          className="w-4 h-4 mt-0.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500 cursor-pointer shrink-0"
        />
        <label htmlFor="activateImmediately" className="text-xs text-blue-900 cursor-pointer">
          <strong className="font-bold block text-sm mb-0.5 text-blue-950">
            Kích hoạt mở bán ngay trong kho (Đã hoàn thiện đóng gói KCS)
          </strong>
          Tích chọn nếu mẻ hàng này đã đóng gói sẵn trong kho và bạn muốn mở bán ngay trên sàn mà
          không cần đợi ghi nhật ký công đoạn đóng gói sau.
        </label>
      </div>
    </div>
  );
}
