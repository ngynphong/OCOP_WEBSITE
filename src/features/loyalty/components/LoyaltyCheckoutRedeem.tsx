'use client';

import React from 'react';
import { useCheckRedeem } from '../hooks/useLoyalty';
import { FiAward, FiInfo } from 'react-icons/fi';
import { Loader2 } from 'lucide-react';

interface LoyaltyCheckoutRedeemProps {
  orderAmount: number;
  isUsed: boolean;
  onToggle: (used: boolean) => void;
  onUpdateRedeemInfo?: (points: number, discount: number) => void;
}

export const LoyaltyCheckoutRedeem = ({
  orderAmount,
  isUsed,
  onToggle,
  onUpdateRedeemInfo,
}: LoyaltyCheckoutRedeemProps) => {
  const { data: redeemRes, isLoading } = useCheckRedeem(orderAmount);
  const info = redeemRes?.data;

  // Cập nhật thông tin lên cha khi dữ liệu API thay đổi
  const lastPointsRef = React.useRef(0);
  const lastDiscountRef = React.useRef(0);

  React.useEffect(() => {
    const nextPoints = info && isUsed ? info.maxRedeemPoints : 0;
    const nextDiscount = info && isUsed ? info.maxDiscount : 0;

    if (nextPoints !== lastPointsRef.current || nextDiscount !== lastDiscountRef.current) {
      lastPointsRef.current = nextPoints;
      lastDiscountRef.current = nextDiscount;
      onUpdateRedeemInfo?.(nextPoints, nextDiscount);
    }
  }, [info, isUsed, onUpdateRedeemInfo]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 bg-stone-50 rounded-xl animate-pulse">
        <Loader2 className="w-5 h-5 animate-spin text-stone-300" />
        <div className="h-4 w-32 bg-stone-200 rounded" />
      </div>
    );
  }

  if (!info || info.availablePoints <= 0) return null;

  return (
    <div
      className={`transition-all duration-300 rounded-xl p-4 border ${
        isUsed ? 'bg-green-50 border-green-200 shadow-sm' : 'bg-stone-50 border-stone-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isUsed
                ? 'bg-green-600 text-white'
                : 'bg-white text-stone-400 border border-stone-100 shadow-sm'
            }`}
          >
            <FiAward size={20} />
          </div>
          <div>
            <p className="text-xs font-bold text-stone-900">Điểm thưởng OCOP</p>
            <p className="text-[10px] text-stone-500 font-medium">
              Bạn đang có {info.availablePoints.toLocaleString()} điểm
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggle(!isUsed)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
            isUsed ? 'bg-green-600' : 'bg-stone-200'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
              isUsed ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {isUsed && (
        <div className="mt-4 pt-4 border-t border-green-200/50 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-green-700 font-medium">Sử dụng tối đa:</span>
            <span className="text-green-900 font-black">
              {info.maxRedeemPoints.toLocaleString()} điểm
            </span>
          </div>
          <div className="flex justify-between items-center text-xs font-bold text-green-700 bg-white/50 p-2 rounded-lg">
            <span>Tiết kiệm được:</span>
            <span>-{info.maxDiscount.toLocaleString()}₫</span>
          </div>
          <div className="flex items-start gap-1.5 mt-1">
            <FiInfo size={12} className="text-green-600 shrink-0 mt-0.5" />
            <p className="text-[9px] text-green-600 leading-tight italic">
              {info.note || 'Số điểm được quy đổi trực tiếp vào giá trị thanh toán của đơn hàng.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
