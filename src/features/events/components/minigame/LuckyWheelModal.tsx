'use client';

import React from 'react';
import { X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import type { MinigameReward } from '../../types/eventMinigameTypes';

interface LuckyWheelModalProps {
  isOpen: boolean;
  rewards: MinigameReward[];
  spinsLeft: number;
  isSpinning: boolean;
  wheelRotation: number;
  onClose: () => void;
  onSpinWheel: () => void;
  onClaimDailySpin: () => void;
  canClaimDaily: boolean;
}

const SLICE_COLORS = [
  '#DC2626', // Red
  '#059669', // Emerald
  '#D97706', // Amber
  '#2563EB', // Blue
  '#7C3AED', // Purple
  '#DB2777', // Pink
  '#4B5563', // Slate
  '#CA8A04', // Gold
];

export function LuckyWheelModal({
  isOpen,
  rewards,
  spinsLeft,
  isSpinning,
  wheelRotation,
  onClose,
  onSpinWheel,
  onClaimDailySpin,
  canClaimDaily,
}: LuckyWheelModalProps) {
  if (!isOpen) return null;

  const totalSlices = rewards.length;
  const sliceAngle = 360 / totalSlices;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={() => !isSpinning && onClose()}
        aria-hidden="true"
      />

      {/* Main Container */}
      <div className="relative w-full max-w-xl bg-linear-to-b from-slate-900 via-slate-900 to-slate-950 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden z-10 text-white animate-in zoom-in-95 duration-200">
        {/* Decorative Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-radial from-emerald-500/20 via-teal-500/10 to-transparent blur-2xl pointer-events-none" />

        {/* Header Bar */}
        <div className="relative p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-xl shadow-inner">
              🎡
            </div>
            <div>
              <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white">
                Vòng Quay May Mắn OCOP
              </h3>
              <p className="text-xs text-slate-400">
                Quay thưởng mỗi ngày nhận Voucher mua sắm và Xu tích lũy
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSpinning}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subheader: Lượt quay & Daily check-in */}
        <div className="px-5 sm:px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Lượt quay còn lại:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-sm shadow-xs">
              {spinsLeft}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canClaimDaily && (
              <button
                type="button"
                onClick={onClaimDailySpin}
                className="px-3 py-1 rounded-lg bg-linear-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Điểm danh nhận +1 lượt</span>
              </button>
            )}
            <span className="text-slate-400 hidden sm:inline">(Đơn hàng từ 300K tặng +1 lượt)</span>
          </div>
        </div>

        {/* Wheel Wheel Canvas Container */}
        <div className="p-6 sm:p-8 flex flex-col items-center justify-center">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
            {/* Outer Golden Border with Lights */}
            <div className="absolute inset-0 rounded-full bg-linear-to-tr from-amber-400 via-yellow-200 to-amber-500 p-2 shadow-2xl shadow-emerald-950/50">
              <div className="w-full h-full rounded-full border-4 border-dashed border-amber-200/60 bg-slate-900" />
            </div>

            {/* Pointer / Needle Indicator at 12 o'clock */}
            <div className="absolute -top-3 z-30 flex flex-col items-center">
              <div className="w-5 h-7 bg-amber-400 rounded-b-full shadow-lg shadow-black/50 border-2 border-white transform rotate-180" />
              <div className="w-3 h-3 rounded-full bg-red-600 border border-white -mt-2" />
            </div>

            {/* Rotating Wheel Disk */}
            <div
              className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full overflow-hidden shadow-inner"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none',
              }}
            >
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {rewards.map((reward, i) => {
                  const startAngle = i * sliceAngle;
                  const endAngle = (i + 1) * sliceAngle;
                  const startRad = (startAngle * Math.PI) / 180;
                  const endRad = (endAngle * Math.PI) / 180;

                  const x1 = Number((50 + 50 * Math.cos(startRad)).toFixed(3));
                  const y1 = Number((50 + 50 * Math.sin(startRad)).toFixed(3));
                  const x2 = Number((50 + 50 * Math.cos(endRad)).toFixed(3));
                  const y2 = Number((50 + 50 * Math.sin(endRad)).toFixed(3));

                  const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;
                  const color = SLICE_COLORS[i % SLICE_COLORS.length];

                  return (
                    <path
                      key={reward.id}
                      d={pathData}
                      fill={color}
                      stroke="#FFFFFF"
                      strokeWidth="0.5"
                    />
                  );
                })}
              </svg>

              {/* Labels on Slices */}
              {rewards.map((reward, i) => {
                const rotation = i * sliceAngle + sliceAngle / 2;

                return (
                  <div
                    key={reward.id}
                    className="absolute inset-0 flex items-start justify-center pt-2 select-none pointer-events-none"
                    style={{
                      transform: `rotate(${rotation}deg)`,
                    }}
                  >
                    <div className="text-center pt-1 transform -rotate-90 origin-bottom">
                      <span className="text-[10px] sm:text-[11px] font-black text-white drop-shadow-md whitespace-nowrap block">
                        {reward.badge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Center Spin Button Knob */}
            <button
              type="button"
              disabled={isSpinning || spinsLeft <= 0}
              onClick={onSpinWheel}
              className="absolute z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-linear-to-tr from-amber-500 via-yellow-400 to-amber-600 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-tight shadow-xl shadow-amber-500/30 border-4 border-white flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSpinning ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="font-black leading-none">QUAY</span>
                  <span className="text-[9px] font-bold text-amber-950/80">NGAY</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom helper notice */}
          <div className="mt-6 p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300 text-center flex items-center justify-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Quay trúng Voucher sẽ được tự động lưu vào ví và áp dụng ngay khi đặt hàng.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
