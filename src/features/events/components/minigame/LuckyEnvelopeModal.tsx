import React from 'react';
import { X, Sparkles, Gift, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type { MysteryPickConceptConfig } from '../../types/eventMinigameTypes';
import { MYSTERY_PICK_CONCEPTS } from '../../constants/minigamePresets';
import { MysteryPickCardItem } from './MysteryPickCardItem';

interface LuckyEnvelopeModalProps {
  isOpen: boolean;
  spinsLeft: number;
  isSpinning: boolean;
  selectedEnvelopeIndex: number | null;
  onClose: () => void;
  onPlayEnvelope: (index: number) => void;
  onClaimDailySpin: () => void;
  canClaimDaily: boolean;
  conceptConfig?: MysteryPickConceptConfig;
}

export function LuckyEnvelopeModal({
  isOpen,
  spinsLeft,
  isSpinning,
  selectedEnvelopeIndex,
  onClose,
  onPlayEnvelope,
  onClaimDailySpin,
  canClaimDaily,
  conceptConfig,
}: LuckyEnvelopeModalProps) {
  if (!isOpen) return null;

  const concept = conceptConfig || MYSTERY_PICK_CONCEPTS.TET_NGUYEN_DAN;
  const items = concept.defaultItems;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        onClick={() => !isSpinning && onClose()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl z-10 border transition-all my-auto"
        style={{
          backgroundColor: '#090D16',
          borderColor: 'var(--event-secondary, #F59E0B)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75)',
        }}
      >
        {/* Header Đồng Bộ Theme Sự Kiện */}
        <div
          className="relative px-5 sm:px-8 py-5 border-b flex items-center justify-between"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in srgb, var(--event-primary, #4F46E5) 30%, #0B0F19) 0%, #070A12 100%)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border shrink-0"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                borderColor: 'var(--event-secondary, #F59E0B)',
              }}
            >
              <Gift className="w-5 h-5" style={{ color: 'var(--event-secondary, #F59E0B)' }} />
            </div>
            <div>
              <h3
                className="text-base sm:text-lg font-black tracking-tight"
                style={{ color: 'var(--event-secondary, #FDE68A)' }}
              >
                {concept.gameTitle}
              </h3>
              <p className="text-xs text-white/70">{concept.gameSubtitle}</p>
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

        {/* Subheader: Lượt bốc & Nhiệm vụ */}
        <div className="px-5 sm:px-7 py-3 bg-black/25 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-white/80 font-medium">Lượt bốc của bạn:</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-sm shadow-xs">
              {spinsLeft}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {canClaimDaily && (
              <button
                type="button"
                onClick={onClaimDailySpin}
                className="px-3 py-1 rounded-lg bg-linear-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Điểm danh nhận +1 lượt</span>
              </button>
            )}
            <span className="text-white/60 hidden sm:inline">
              (Mua đơn từ 300K nhận thêm +1 lượt)
            </span>
          </div>
        </div>

        {/* Dynamic Mystery Pick Grid */}
        <div className="p-5 sm:p-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
            {items.map((item) => {
              const isSelected = selectedEnvelopeIndex === item.id;

              return (
                <MysteryPickCardItem
                  key={item.id}
                  item={item}
                  conceptId={concept.id}
                  isSelected={isSelected}
                  isSpinning={isSpinning}
                  disabled={isSpinning || spinsLeft <= 0}
                  actionLabel={concept.actionLabel}
                  spinningLabel={concept.spinningLabel}
                  onPlay={onPlayEnvelope}
                />
              );
            })}
          </div>

          {/* Bottom notice & Quick action */}
          <div className="mt-6 p-3.5 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{concept.summaryText}</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isSpinning || spinsLeft <= 0}
              onClick={() => onPlayEnvelope(Math.floor(Math.random() * items.length))}
              leftIcon={<Gift className="w-3.5 h-3.5" />}
              className="border-amber-400/60 text-amber-300 hover:bg-amber-400/10 shrink-0 cursor-pointer"
            >
              {concept.randomButtonLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
