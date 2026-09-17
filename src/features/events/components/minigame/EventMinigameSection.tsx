'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Trophy,
  Gift,
  Ticket,
  Truck,
  Coins,
  Moon,
  Wheat,
  Zap,
  Snowflake,
  Award,
} from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type { EventDetailResponse, ActiveEventResponse } from '../../types/eventTypes';
import { useEventMinigame } from '../../hooks/useEventMinigame';
import { MinigameRewardModal } from './MinigameRewardModal';
import { MysteryPickCardItem } from './MysteryPickCardItem';

interface EventMinigameSectionProps {
  event: EventDetailResponse | ActiveEventResponse;
  className?: string;
  isMobilePreview?: boolean;
}

function getConceptTabIcon(conceptId: string) {
  if (conceptId === 'TRUNG_THU') return <Moon className="w-4 h-4 shrink-0" />;
  if (conceptId === 'MUA_VANG') return <Wheat className="w-4 h-4 shrink-0" />;
  if (conceptId === 'MEGA_SALE') return <Zap className="w-4 h-4 shrink-0" />;
  if (conceptId === 'GIANG_SINH') return <Snowflake className="w-4 h-4 shrink-0" />;
  if (conceptId === 'DAI_LE') return <Award className="w-4 h-4 shrink-0" />;
  return <Gift className="w-4 h-4 shrink-0" />;
}

const SLICE_COLORS = [
  '#DC2626', // Đỏ son
  '#F59E0B', // Vàng hổ phách
  '#059669', // Xanh ngọc OCOP
  '#7C3AED', // Tím hoa cà
  '#EA580C', // Cam đất
  '#0284C7', // Xanh chàm
  '#DB2777', // Hồng sen
  '#D97706', // Vàng lúa chín
];

export function EventMinigameSection({
  event,
  className = '',
  isMobilePreview = false,
}: EventMinigameSectionProps) {
  const minigame = useEventMinigame({
    eventId: event.id,
    eventSlug: event.slug,
    eventType: event.type,
    theme: event.theme,
    minigameConfig: (event as EventDetailResponse).minigameConfig,
  });

  const concept = minigame.mysteryPickConceptConfig;
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const isEnvelopeTab = minigame.activeGameType === 'LUCKY_ENVELOPE';
  const wheelRewards = minigame.wheelRewards;
  const sliceAngle = 360 / wheelRewards.length;

  const handleCopy = (code: string) => {
    minigame.handleCopyCode(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <section id="activities" className={`w-full scroll-mt-24 ${className}`}>
      {/* ── Outer Card: Warm Festival Surface ───────────────────────────── */}
      <div className="rounded-2xl sm:rounded-3xl border border-amber-200/90 dark:border-amber-900/40 bg-gradient-to-b from-amber-50/80 via-white to-red-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 shadow-xl shadow-amber-900/5 overflow-hidden transition-all">
        {/* ── 1. HEADER & TAB SWITCHER BAR ───────────────────────────────── */}
        <div className="p-4 sm:p-6 md:p-8 border-b border-amber-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5">
          {/* Header text */}
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[11px] sm:text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/60">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>{concept.badgeText}</span>
            </div>

            <h2
              className={`${isMobilePreview ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl md:text-3xl'} font-black text-slate-900 dark:text-white tracking-tight`}
            >
              {concept.tabLabel} & Vòng Quay May Mắn
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {concept.summaryText}
            </p>
          </div>

          {/* Tab switchers */}
          <div className="w-full md:w-auto flex justify-center md:justify-end">
            <div className="grid grid-cols-2 sm:flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-inner w-full sm:w-auto">
              <button
                type="button"
                onClick={() => minigame.setActiveGameType('LUCKY_ENVELOPE')}
                disabled={minigame.isSpinning}
                className={`w-full sm:w-auto justify-center px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isEnvelopeTab
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {getConceptTabIcon(concept.id)}
                <span>{concept.tabLabel}</span>
              </button>

              <button
                type="button"
                onClick={() => minigame.setActiveGameType('WHEEL_SPIN')}
                disabled={minigame.isSpinning}
                className={`w-full sm:w-auto justify-center px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isEnvelopeTab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Trophy className="w-4 h-4 shrink-0" />
                <span>Vòng Quay OCOP</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── 2. USER STATS & CHECK-IN SUB-BAR ────────────────────────────── */}
        <div className="px-4 sm:px-8 py-2.5 sm:py-3 bg-amber-500/10 dark:bg-slate-800/60 border-b border-amber-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs">
          <div className="flex items-center justify-between sm:justify-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-600 dark:text-slate-400 font-medium text-xs">
                Lượt chơi:
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-xs">
                {minigame.spinsLeft} lượt
              </span>
            </div>
            <span className="text-slate-400 dark:text-slate-500 text-[11px] hidden md:inline">
              • Tặng thêm lượt khi mua đơn từ 300.000đ
            </span>
          </div>

          <div className="flex items-center justify-end">
            {minigame.canClaimDailyFreeSpin ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={minigame.handleClaimDailyFreeSpin}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                className="w-full sm:w-auto justify-center bg-white dark:bg-slate-900 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-50 shadow-xs text-xs font-bold cursor-pointer"
              >
                Điểm danh nhận +1 lượt hôm nay
              </Button>
            ) : (
              <span className="w-full sm:w-auto justify-center inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-200/80 text-xs">
                <Check className="w-3.5 h-3.5" />
                <span>Đã điểm danh hôm nay</span>
              </span>
            )}
          </div>
        </div>

        {/* ── 3. IN-PLACE PLAYGROUND (SÂN CHƠI TRỰC TIẾP TRÊN TRANG) ───────── */}
        <div className="p-3.5 sm:p-6 md:p-8 lg:p-10">
          {/* TAB 1: BỐC QUÀ THEO CONCEPT TRỰC TIẾP TRÊN TRANG */}
          {isEnvelopeTab && (
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center max-w-md mx-auto">
                <p className="text-xs sm:text-sm font-semibold text-amber-900 dark:text-amber-200">
                  {concept.gameSubtitle}
                </p>
              </div>

              {/* Grid 6 Món Theo Concept: 2 cols on mobile, 3 cols on sm, 6 cols on md and above */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5 sm:gap-3.5 md:gap-3 lg:gap-4">
                {minigame.pickItems.map((item) => {
                  const isSelected = minigame.selectedEnvelopeIndex === item.id;
                  return (
                    <MysteryPickCardItem
                      key={item.id}
                      item={item}
                      conceptId={concept.id}
                      isSelected={isSelected}
                      isSpinning={minigame.isSpinning}
                      disabled={minigame.isSpinning || minigame.spinsLeft <= 0}
                      actionLabel={concept.actionLabel}
                      spinningLabel={concept.spinningLabel}
                      onPlay={minigame.playEnvelope}
                    />
                  );
                })}
              </div>

              {/* Nút bốc ngẫu nhiên & Tóm tắt quà */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px] sm:text-xs">{concept.summaryText}</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={minigame.isSpinning || minigame.spinsLeft <= 0}
                  onClick={() =>
                    minigame.playEnvelope(Math.floor(Math.random() * minigame.pickItems.length))
                  }
                  leftIcon={<Gift className="w-3.5 h-3.5" />}
                  className="w-full sm:w-auto justify-center bg-white dark:bg-slate-800 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200 hover:bg-amber-50 shrink-0 text-xs font-bold cursor-pointer"
                >
                  {concept.randomButtonLabel}
                </Button>
              </div>
            </div>
          )}

          {/* TAB 2: VÒNG QUAY OCOP TRỰC TIẾP TRÊN TRANG (Side-by-side on iPad md: & Desktop, stacked gracefully on mobile) */}
          {!isEnvelopeTab && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
              {/* Cột Trái: Đĩa quay SVG */}
              <div className="md:col-span-6 lg:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 flex items-center justify-center">
                  {/* Vành ngoài ánh vàng viền kim tuyến */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-200 to-amber-500 p-2 sm:p-2.5 shadow-xl sm:shadow-2xl shadow-amber-900/20">
                    <div className="w-full h-full rounded-full border-4 border-dashed border-amber-100/70 bg-slate-900" />
                  </div>

                  {/* Kim chỉ 12h màu vàng óng */}
                  <div className="absolute -top-2.5 sm:-top-3 left-1/2 -translate-x-1/2 z-30 drop-shadow-md">
                    <div className="w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-transparent border-r-[10px] sm:border-r-[12px] border-r-transparent border-t-[20px] sm:border-t-[24px] border-t-amber-400" />
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-600 border border-amber-200 mx-auto -mt-5 sm:-mt-6 shadow-xs" />
                  </div>

                  {/* Đĩa quay SVG vật lý */}
                  <div
                    className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full overflow-hidden shadow-inner"
                    style={{
                      transform: `rotate(${minigame.wheelRotation}deg)`,
                      transition: minigame.isSpinning
                        ? 'transform 4.5s cubic-bezier(0.15, 0.9, 0.25, 1)'
                        : 'none',
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {wheelRewards.map((reward, i) => {
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

                    {/* Nhãn phần thưởng trên từng lát cắt */}
                    {wheelRewards.map((reward, i) => {
                      const rotation = i * sliceAngle + sliceAngle / 2;

                      return (
                        <div
                          key={reward.id}
                          className="absolute inset-0 flex items-start justify-center pt-1.5 sm:pt-2 select-none pointer-events-none"
                          style={{
                            transform: `rotate(${rotation}deg)`,
                          }}
                        >
                          <div className="text-center pt-0.5 sm:pt-1 transform -rotate-90 origin-bottom">
                            <span className="text-[9px] sm:text-[10px] md:text-[11px] font-black text-white drop-shadow-md whitespace-nowrap block">
                              {reward.badge}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Nút QUAY ở tâm đĩa */}
                  <button
                    type="button"
                    disabled={minigame.isSpinning || minigame.spinsLeft <= 0}
                    onClick={minigame.playWheel}
                    className="absolute z-20 w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full border-3 sm:border-4 border-white shadow-xl flex flex-col items-center justify-center font-black cursor-pointer hover:scale-105 active:scale-95 transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                      background:
                        'linear-gradient(135deg, var(--event-secondary, #F59E0B) 0%, var(--event-primary, #DC2626) 100%)',
                      color: '#FFFFFF',
                    }}
                  >
                    {minigame.isSpinning ? (
                      <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 animate-spin text-white" />
                    ) : (
                      <>
                        <span className="text-[11px] sm:text-xs md:text-sm tracking-wider uppercase drop-shadow-xs">
                          QUAY
                        </span>
                        <span className="text-[8px] sm:text-[9px] font-semibold text-white/90 -mt-0.5">
                          NGAY
                        </span>
                      </>
                    )}
                  </button>
                </div>

                <div className="mt-3 sm:mt-4 text-center w-full sm:w-auto">
                  <Button
                    type="button"
                    variant="primary"
                    size="md"
                    disabled={minigame.isSpinning || minigame.spinsLeft <= 0}
                    onClick={minigame.playWheel}
                    leftIcon={
                      <RefreshCw
                        className={`w-4 h-4 ${minigame.isSpinning ? 'animate-spin' : ''}`}
                      />
                    }
                    className="w-full sm:w-auto justify-center text-white shadow-md font-extrabold text-xs sm:text-sm cursor-pointer"
                    style={{
                      backgroundColor: 'var(--event-primary, #059669)',
                    }}
                  >
                    {minigame.isSpinning ? 'Đang quay...' : 'Quay Vòng May Mắn'}
                  </Button>
                </div>
              </div>

              {/* Cột Phải: Bảng 8 Giải Thưởng */}
              <div className="md:col-span-6 lg:col-span-7 space-y-2.5 sm:space-y-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <h4 className="font-extrabold text-xs sm:text-sm uppercase tracking-wide text-slate-900 dark:text-white">
                    8 Phần Thưởng Vòng Quay
                  </h4>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                  {wheelRewards.map((reward, i) => (
                    <div
                      key={reward.id}
                      className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-800/70 flex items-center gap-1.5 sm:gap-2 text-xs shadow-2xs"
                    >
                      <div
                        className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
                        style={{ backgroundColor: SLICE_COLORS[i % SLICE_COLORS.length] }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-[11px] sm:text-xs text-slate-900 dark:text-white truncate">
                          {reward.name}
                        </p>
                        <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {reward.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                  * Mỗi đơn hàng hoàn tất từ 150.000đ sẽ tự động được cộng thêm 1 lượt quay.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── 5. WON REWARDS HISTORY STRIP (Nếu user đã trúng giải) ───────── */}
        {minigame.history.length > 0 && (
          <div className="p-3.5 sm:p-6 md:p-7 border-t border-amber-100 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 space-y-2.5 sm:space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Phần Thưởng Của Bạn ({minigame.history.length})
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-500">
                Mã giảm giá đã được lưu vào ví voucher của bạn
              </span>
            </div>

            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin">
              {minigame.history
                .filter((entry) => Boolean(entry && entry.reward))
                .slice(0, 6)
                .map((entry) => {
                  const voucherCode = entry.reward?.voucherCode;
                  const isCopied = Boolean(voucherCode && copiedCode === voucherCode);
                  return (
                    <div
                      key={entry.id}
                      className="shrink-0 p-2.5 sm:p-3 rounded-2xl border border-amber-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-2xs flex items-center gap-2.5 sm:gap-3 min-w-[200px] sm:min-w-[230px]"
                    >
                      <div
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-sm sm:text-base shadow-xs shrink-0"
                        style={{
                          backgroundColor: entry.reward.themeColor || '#f59e0b',
                          color: '#FFFFFF',
                        }}
                      >
                        {entry.reward.type === 'VOUCHER' ? (
                          <Ticket className="w-4 h-4" />
                        ) : entry.reward.type === 'FREESHIP' ? (
                          <Truck className="w-4 h-4" />
                        ) : entry.reward.type === 'POINTS' ? (
                          <Coins className="w-4 h-4" />
                        ) : (
                          <Sparkles className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                          {entry.reward.name || 'Phần thưởng'}
                        </p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {entry.reward.description || ''}
                        </p>
                      </div>

                      {voucherCode && (
                        <button
                          type="button"
                          onClick={() => handleCopy(voucherCode)}
                          className={`p-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                            isCopied
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200'
                          }`}
                          title="Sao chép mã voucher"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>

      {/* ── 6. REWARD CELEBRATION MODAL ───────────────────────────────────── */}
      {minigame.isRewardModalOpen && (
        <MinigameRewardModal
          isOpen={minigame.isRewardModalOpen}
          reward={minigame.currentReward}
          spinsLeft={minigame.spinsLeft}
          onClose={minigame.closeRewardModal}
          onCopyCode={minigame.handleCopyCode}
          onPlayAgain={() => {
            minigame.closeRewardModal();
            if (minigame.activeGameType === 'WHEEL_SPIN') {
              minigame.playWheel();
            }
          }}
        />
      )}
    </section>
  );
}
