'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { MysteryPickItem, MysteryPickConceptId } from '../../types/eventMinigameTypes';
import MysteryPickHeaderTag from './heroes/MysteryPickHeaderTag';
import MysteryPickCardHero from './heroes/MysteryPickCardHero';

export interface MysteryPickCardItemProps {
  item: MysteryPickItem;
  conceptId: MysteryPickConceptId;
  isSelected: boolean;
  isSpinning: boolean;
  disabled: boolean;
  actionLabel: string;
  spinningLabel: string;
  onPlay: (id: number) => void;
  className?: string;
}

export function MysteryPickCardItem({
  item,
  conceptId,
  isSelected,
  isSpinning,
  disabled,
  actionLabel,
  spinningLabel,
  onPlay,
  className = '',
}: MysteryPickCardItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPlay(item.id)}
      className={`group relative flex flex-col justify-between items-center text-center rounded-2xl p-2.5 sm:p-3 transition-all duration-300 cursor-pointer overflow-hidden border min-h-[14rem] sm:min-h-[15rem] md:h-64 ${
        isSelected
          ? 'scale-105 shadow-2xl ring-4 ring-amber-400/60'
          : 'hover:-translate-y-1.5 hover:shadow-xl'
      } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${className}`}
      style={
        {
          borderColor: isSelected
            ? 'var(--event-secondary, #F59E0B)'
            : 'var(--event-card-border, rgba(255, 255, 255, 0.2))',
          background: isSelected
            ? 'linear-gradient(180deg, color-mix(in srgb, var(--event-primary, #4F46E5) 45%, #0B0F19) 0%, #070A12 100%)'
            : 'linear-gradient(180deg, color-mix(in srgb, var(--event-primary, #4F46E5) 20%, #0F172A) 0%, #060910 100%)',
          boxShadow: isSelected
            ? '0 0 25px color-mix(in srgb, var(--event-secondary, #F59E0B) 50%, transparent)'
            : '0 6px 18px rgba(0, 0, 0, 0.35)',
        } as React.CSSProperties
      }
    >
      <MysteryPickHeaderTag conceptId={conceptId} item={item} />

      <div className="my-auto text-center w-full px-1 flex flex-col items-center justify-center">
        <MysteryPickCardHero conceptId={conceptId} item={item} isSelected={isSelected} />

        <div className="w-full min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center justify-center mt-1">
          <span
            className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-tight drop-shadow-xs line-clamp-2 leading-tight text-center break-words px-0.5"
            style={{ color: 'var(--event-secondary, #FDE68A)' }}
            title={item.name}
          >
            {item.name}
          </span>
        </div>

        <div className="w-full min-h-[1.75rem] sm:min-h-[2rem] flex items-center justify-center">
          <span
            className="text-[9px] sm:text-[10px] text-white/80 line-clamp-2 leading-tight text-center break-words px-0.5"
            title={item.subTitle}
          >
            {item.subTitle}
          </span>
        </div>
      </div>

      <div
        className="w-full text-center text-[10px] sm:text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 shrink-0 group-hover:brightness-110"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          color: 'var(--event-secondary, #FDE68A)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {isSpinning && isSelected ? (
          <span className="flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> {spinningLabel}
          </span>
        ) : (
          actionLabel
        )}
      </div>
    </button>
  );
}

export default MysteryPickCardItem;
