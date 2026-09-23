'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface TetEnvelopeHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function TetEnvelopeHero({ item, isSelected }: TetEnvelopeHeroProps) {
  const gradId = `tet_env_grad_${item.id}`;
  const goldGradId = `tet_gold_${item.id}`;
  const char = item.character || '福';

  return (
    <div className="relative w-20 h-22 sm:w-22 sm:h-24 md:w-24 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-45 group-hover:opacity-80'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(239, 68, 68, 0.55) 0%, rgba(245, 158, 11, 0.35) 60%, transparent 75%)',
        }}
      />

      <svg
        viewBox="0 0 100 115"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="50%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
        </defs>

        <rect
          x="12"
          y="10"
          width="76"
          height="92"
          rx="12"
          fill={`url(#${gradId})`}
          stroke={`url(#${goldGradId})`}
          strokeWidth="1.8"
        />

        <path
          d="M16 80 Q30 72 44 80 T72 80 T84 80"
          stroke="#FBBF24"
          strokeWidth="0.8"
          opacity="0.35"
          fill="none"
        />
        <path
          d="M16 88 Q30 80 44 88 T72 88 T84 88"
          stroke="#FBBF24"
          strokeWidth="0.8"
          opacity="0.35"
          fill="none"
        />

        <path
          d="M12 24 C12 24 35 44 50 44 C65 44 88 24 88 24 L88 10 L12 10 Z"
          fill="#B91C1C"
          stroke={`url(#${goldGradId})`}
          strokeWidth="1.6"
        />

        <circle
          cx="50"
          cy="54"
          r="18"
          fill={`url(#${goldGradId})`}
          stroke="#FEF3C7"
          strokeWidth="1.5"
        />
        <circle cx="50" cy="54" r="14.5" fill="#991B1B" stroke="#FEF3C7" strokeWidth="1" />
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fontSize="13"
          fontWeight="900"
          fontFamily="serif, system-ui"
          fill="#FEF08A"
        >
          {char}
        </text>

        <path d="M46 72 L54 72 L50 78 Z" fill={`url(#${goldGradId})`} />
        <line
          x1="48"
          y1="78"
          x2="46"
          y2="98"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="78"
          x2="50"
          y2="102"
          stroke="#DC2626"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="52"
          y1="78"
          x2="54"
          y2="98"
          stroke="#F59E0B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
