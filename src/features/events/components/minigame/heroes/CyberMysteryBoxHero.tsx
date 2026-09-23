'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface CyberMysteryBoxHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function CyberMysteryBoxHero({ item, isSelected }: CyberMysteryBoxHeroProps) {
  const neonColor =
    item.id === 0
      ? '#A855F7'
      : item.id === 1
        ? '#EAB308'
        : item.id === 2
          ? '#EF4444'
          : item.id === 3
            ? '#06B6D4'
            : item.id === 4
              ? '#10B981'
              : '#EC4899';
  const tagCode = item.character || item.badge || 'VIP';

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background: `radial-gradient(circle, ${neonColor}77 0%, rgba(59, 130, 246, 0.2) 60%, transparent 75%)`,
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
      >
        <defs>
          <linearGradient id={`box_top_${item.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#312E81" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
          <linearGradient id={`box_left_${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1E1B4B" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>
          <linearGradient id={`box_right_${item.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>

        <polygon
          points="50,16 82,30 50,44 18,30"
          fill={`url(#box_top_${item.id})`}
          stroke={neonColor}
          strokeWidth="1.4"
        />
        <polygon
          points="18,30 50,44 50,82 18,68"
          fill={`url(#box_left_${item.id})`}
          stroke={neonColor}
          strokeWidth="1.4"
        />
        <polygon
          points="50,44 82,30 82,68 50,82"
          fill={`url(#box_right_${item.id})`}
          stroke={neonColor}
          strokeWidth="1.4"
        />

        <polygon points="46,18 54,21 54,42 46,39" fill={neonColor} opacity="0.8" />
        <polygon points="32,24 36,26 64,38 60,36" fill={neonColor} opacity="0.8" />
        <polygon points="46,45 54,42 54,81 46,80" fill={neonColor} opacity="0.8" />

        <circle cx="50" cy="44" r="14" fill="#0F172A" stroke={neonColor} strokeWidth="2" />
        <circle cx="50" cy="44" r="10" fill={neonColor} opacity="0.25" />
        <text
          x="50"
          y="47.5"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="monospace"
          fill="#FFFFFF"
        >
          {tagCode}
        </text>

        <circle cx="18" cy="30" r="2" fill={neonColor} />
        <circle cx="82" cy="30" r="2" fill={neonColor} />
        <circle cx="50" cy="82" r="2" fill={neonColor} />
      </svg>
    </div>
  );
}
