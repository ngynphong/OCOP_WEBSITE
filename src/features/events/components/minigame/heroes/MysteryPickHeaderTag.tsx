'use client';

import React from 'react';
import type { MysteryPickItem, MysteryPickConceptId } from '../../../types/eventMinigameTypes';

interface MysteryPickHeaderTagProps {
  conceptId: MysteryPickConceptId;
  item: MysteryPickItem;
}

export default function MysteryPickHeaderTag({ conceptId, item }: MysteryPickHeaderTagProps) {
  if (conceptId === 'TRUNG_THU') {
    const isSnowSkin =
      item.name.includes('Dẻo') ||
      Boolean(item.badge?.includes('Dẻo')) ||
      item.id === 1 ||
      item.id === 4;
    return (
      <div className="w-full flex items-center justify-between px-1">
        <span
          className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs border uppercase tracking-wider"
          style={{
            backgroundColor: isSnowSkin ? 'rgba(16, 185, 129, 0.2)' : 'rgba(217, 119, 6, 0.25)',
            borderColor: isSnowSkin ? '#34D399' : '#F59E0B',
            color: isSnowSkin ? '#A7F3D0' : '#FDE68A',
          }}
        >
          {item.badge || (isSnowSkin ? 'Bánh Dẻo' : 'Bánh Nướng')}
        </span>
        <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
      </div>
    );
  }

  if (conceptId === 'TET_NGUYEN_DAN') {
    return (
      <div className="w-full flex items-center justify-between px-1">
        <span
          className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs border uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(220, 38, 38, 0.35)',
            borderColor: '#F59E0B',
            color: '#FEF08A',
          }}
        >
          {item.badge || 'Lì Xì Tết'}
        </span>
        <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
      </div>
    );
  }

  if (conceptId === 'MUA_VANG') {
    return (
      <div className="w-full flex items-center justify-between px-1">
        <span
          className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs border uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(5, 150, 105, 0.25)',
            borderColor: '#10B981',
            color: '#6EE7B7',
          }}
        >
          {item.badge || 'Nông Sản OCOP'}
        </span>
        <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
      </div>
    );
  }

  if (conceptId === 'MEGA_SALE') {
    return (
      <div className="w-full flex items-center justify-between px-1">
        <span
          className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs border uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(124, 58, 237, 0.3)',
            borderColor: '#EC4899',
            color: '#F472B6',
          }}
        >
          {item.badge || 'FLASH DEAL'}
        </span>
        <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
      </div>
    );
  }

  if (conceptId === 'GIANG_SINH') {
    return (
      <div className="w-full flex items-center justify-between px-1">
        <span
          className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs border uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(185, 28, 28, 0.3)',
            borderColor: '#10B981',
            color: '#FEE2E2',
          }}
        >
          {item.badge || 'QUÀ NOEL'}
        </span>
        <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
      </div>
    );
  }

  if (conceptId === 'DAI_LE') {
    return (
      <div className="w-full flex items-center justify-between px-1">
        <span
          className="text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-full shadow-2xs border uppercase tracking-wider"
          style={{
            backgroundColor: 'rgba(180, 83, 9, 0.3)',
            borderColor: '#F59E0B',
            color: '#FEF08A',
          }}
        >
          {item.badge || 'DI SẢN'}
        </span>
        <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
      </div>
    );
  }

  return (
    <div className="w-full flex items-center justify-between px-1">
      <span
        className="text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full border"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          color: '#FFFFFF',
        }}
      >
        {item.badge || `Số ${item.id + 1}`}
      </span>
      <span className="text-[10px] font-bold text-white/50">#{item.id + 1}</span>
    </div>
  );
}
