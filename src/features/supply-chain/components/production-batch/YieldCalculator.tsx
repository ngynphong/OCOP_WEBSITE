'use client';

import React, { useState } from 'react';
import { Calculator, ChevronDown, ChevronUp, ArrowDown, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { SellerVariant } from './types';

interface YieldCalculatorProps {
  selectedVariant?: SellerVariant;
  onApply: (data: {
    quantity: number;
    unit: string;
    rawYieldUsed: number;
    rawYieldUnit: string;
    packagingYieldRate: number;
    packagingRatioNotes: string;
  }) => void;
}

export const getVariantPackaging = (
  v?: SellerVariant,
): { weightGram: number; packagingUnit: string } => {
  if (!v) return { weightGram: 0, packagingUnit: 'gói' };

  let weight = v.weightGram || 0;
  const nameLower = (v.variantName || '').toLowerCase();

  let unit = 'hộp';
  if (nameLower.includes('gói')) unit = 'gói';
  else if (nameLower.includes('hộp')) unit = 'hộp';
  else if (nameLower.includes('túi')) unit = 'túi';
  else if (nameLower.includes('chai')) unit = 'chai';
  else if (nameLower.includes('lọ') || nameLower.includes('hũ')) unit = 'hũ';
  else if (nameLower.includes('lon')) unit = 'lon';
  else if (nameLower.includes('bình')) unit = 'bình';
  else if (nameLower.includes('cái')) unit = 'cái';
  else unit = 'sản phẩm';

  if (!weight) {
    const matchKg = nameLower.match(/(\d+(?:[.,]\d+)?)\s*(?:kg|kí|kilo)/);
    if (matchKg) {
      weight = parseFloat(matchKg[1].replace(',', '.')) * 1000;
    } else {
      const matchG = nameLower.match(/(\d+(?:[.,]\d+)?)\s*(?:g|gram|gr|ml)/);
      if (matchG) {
        weight = parseFloat(matchG[1].replace(',', '.'));
      }
    }
  }

  return { weightGram: weight, packagingUnit: unit };
};

export default function YieldCalculator({ selectedVariant, onApply }: YieldCalculatorProps) {
  const [calcRawYield, setCalcRawYield] = useState<string>('');
  const [calcYieldRate, setCalcYieldRate] = useState<string>('100');
  const [calcWeightGram, setCalcWeightGram] = useState<string>('');
  const [isCalculatorOpen, setIsCalculatorOpen] = useState<boolean>(true);

  const variantPackaging = getVariantPackaging(selectedVariant);
  const activeWeightGram =
    calcWeightGram !== '' ? Number(calcWeightGram) : variantPackaging.weightGram || 0;
  const activePackagingUnit = variantPackaging.packagingUnit;

  const rawNum = Number(calcRawYield) || 0;
  const rateNum = Number(calcYieldRate) || 100;
  const calculatedUnits =
    rawNum > 0 && activeWeightGram > 0
      ? Math.floor((rawNum * (rateNum / 100) * 1000) / activeWeightGram)
      : 0;

  const handleApply = () => {
    onApply({
      quantity: calculatedUnits,
      unit: activePackagingUnit,
      rawYieldUsed: Number(calcRawYield),
      rawYieldUnit: 'kg',
      packagingYieldRate: Number(calcYieldRate) || 100,
      packagingRatioNotes: `Từ ${calcRawYield} kg nông sản thô qua chế biến/chọn lọc (tỷ lệ thành phẩm ${calcYieldRate || 100}%), đóng gói quy cách ${activeWeightGram}g/${activePackagingUnit}.`,
    });
    toast.success(
      `Đã tự động điền ${calculatedUnits.toLocaleString('vi-VN')} ${activePackagingUnit} vào Sản lượng dự kiến bên dưới!`,
    );
  };

  return (
    <div className="p-5 bg-gradient-to-br from-emerald-50/70 via-slate-50 to-blue-50/40 rounded-2xl border border-emerald-200/80 space-y-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-xs">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              Công cụ tính sản lượng đóng gói từ Nông sản thô
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Hỗ trợ nhanh
              </span>
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              Dành cho mẻ thu hoạch thô (VD: 1.000 kg chè tươi, 5 tấn vải) cần tính ra số lượng
              gói/hộp đưa vào kho.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsCalculatorOpen((prev) => !prev)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition cursor-pointer shrink-0"
        >
          <span>{isCalculatorOpen ? 'Thu gọn' : 'Mở công cụ'}</span>
          {isCalculatorOpen ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </button>
      </div>

      {isCalculatorOpen && (
        <div className="space-y-4 pt-1 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                  1
                </span>
                Sản lượng thô thu hoạch (kg)
              </label>
              <input
                type="number"
                placeholder="VD: 1000"
                value={calcRawYield}
                onChange={(e) => setCalcRawYield(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-800"
              />
              <p className="text-[11px] text-slate-400">
                Khối lượng nông sản vừa thu hoạch từ vườn/ruộng
              </p>
            </div>

            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                    2
                  </span>
                  Tỷ lệ sau sơ chế / sấy (%)
                </label>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {calcYieldRate || 100}%
                </span>
              </div>

              <div className="flex flex-wrap gap-1 pt-0.5">
                <button
                  type="button"
                  onClick={() => setCalcYieldRate('100')}
                  className={`text-[10px] px-2 py-1 rounded-md font-semibold transition cursor-pointer border ${
                    calcYieldRate === '100'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Tươi 100%
                </button>
                <button
                  type="button"
                  onClick={() => setCalcYieldRate('95')}
                  className={`text-[10px] px-2 py-1 rounded-md font-semibold transition cursor-pointer border ${
                    calcYieldRate === '95'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Trừ hao hụt 95%
                </button>
                <button
                  type="button"
                  onClick={() => setCalcYieldRate('25')}
                  className={`text-[10px] px-2 py-1 rounded-md font-semibold transition cursor-pointer border ${
                    calcYieldRate === '25'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Sấy khô 25%
                </button>
              </div>

              <input
                type="number"
                placeholder="Nhập % khác..."
                value={calcYieldRate}
                onChange={(e) => setCalcYieldRate(e.target.value)}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-emerald-500 font-medium text-slate-700"
              />
            </div>

            <div className="space-y-1.5 bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-bold">
                    3
                  </span>
                  Quy cách đóng gói
                </label>
                {variantPackaging.weightGram > 0 && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    Tự động từ biến thể
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder={
                    variantPackaging.weightGram ? `${variantPackaging.weightGram}` : 'VD: 500'
                  }
                  value={calcWeightGram !== '' ? calcWeightGram : variantPackaging.weightGram || ''}
                  onChange={(e) => setCalcWeightGram(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-emerald-500 font-semibold text-slate-800"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                  gram / {activePackagingUnit}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-tight truncate">
                {selectedVariant
                  ? `Biến thể: ${selectedVariant.variantName}`
                  : 'Vui lòng chọn biến thể ở trên'}
              </p>
            </div>
          </div>

          {calculatedUnits > 0 ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-600/15">
              <div>
                <div className="text-xs font-medium text-emerald-100">Dự kiến đóng gói được:</div>
                <div className="text-xl font-black tracking-tight mt-0.5">
                  {calculatedUnits.toLocaleString('vi-VN')} {activePackagingUnit}
                </div>
                <div className="text-[11px] text-emerald-100/90 mt-1">
                  (Từ {calcRawYield} kg thô × {calcYieldRate || 100}% thành phẩm ={' '}
                  {((rawNum * rateNum) / 100).toLocaleString('vi-VN')} kg sạch ÷ {activeWeightGram}
                  g/
                  {activePackagingUnit})
                </div>
              </div>
              <button
                type="button"
                onClick={handleApply}
                className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl hover:bg-emerald-50 transition active:scale-95 shrink-0 shadow-sm cursor-pointer"
              >
                <ArrowDown className="w-3.5 h-3.5 text-emerald-600" />
                Áp dụng vào Sản lượng bên dưới
              </button>
            </div>
          ) : (
            <div className="p-3 bg-white/70 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Nhập <strong>Sản lượng thô (kg)</strong> ở bước 1 để hệ thống tự động tính ra số
                lượng <strong>{activePackagingUnit}</strong> đóng gói dự kiến.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
