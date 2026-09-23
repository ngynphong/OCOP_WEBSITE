'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface CustomHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function CustomHero({ isSelected }: CustomHeroProps) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.45) 0%, rgba(245, 158, 11, 0.35) 60%, transparent 75%)',
        }}
      />
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
      >
        <rect
          x="20"
          y="46"
          width="60"
          height="38"
          rx="5"
          fill="#78350F"
          stroke="#F59E0B"
          strokeWidth="1.8"
        />
        <path d="M18 46 C18 28 82 28 82 46 Z" fill="#92400E" stroke="#F59E0B" strokeWidth="1.8" />
        <rect
          x="30"
          y="30"
          width="8"
          height="54"
          fill="#D97706"
          stroke="#FEF3C7"
          strokeWidth="0.8"
        />
        <rect
          x="62"
          y="30"
          width="8"
          height="54"
          fill="#D97706"
          stroke="#FEF3C7"
          strokeWidth="0.8"
        />
        <circle cx="50" cy="52" r="7" fill="#FBBF24" stroke="#78350F" strokeWidth="1.2" />
        <circle cx="50" cy="52" r="2.5" fill="#78350F" />
      </svg>
    </div>
  );
}
