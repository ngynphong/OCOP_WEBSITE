'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface DaiLeHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function DaiLeHero({ item, isSelected }: DaiLeHeroProps) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(220, 38, 38, 0.5) 0%, rgba(217, 119, 6, 0.4) 60%, transparent 75%)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
      >
        {item.id === 0 ? (
          <g>
            <circle cx="50" cy="50" r="42" fill="#78350F" stroke="#FBBF24" strokeWidth="2" />
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="#92400E"
              stroke="#FEF3C7"
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            <circle cx="50" cy="50" r="26" fill="#B45309" stroke="#FDE68A" strokeWidth="1" />
            <polygon
              points="50,34 53,46 65,42 56,50 66,58 54,54 50,66 46,54 34,58 44,50 35,42 47,46"
              fill="#FEF08A"
            />
            <circle cx="50" cy="50" r="4" fill="#78350F" />
            <path d="M50 18 Q62 20 68 28" stroke="#FEF08A" strokeWidth="1.6" fill="none" />
            <path d="M82 50 Q80 62 72 68" stroke="#FEF08A" strokeWidth="1.6" fill="none" />
            <path d="M50 82 Q38 80 32 72" stroke="#FEF08A" strokeWidth="1.6" fill="none" />
            <path d="M18 50 Q20 38 28 32" stroke="#FEF08A" strokeWidth="1.6" fill="none" />
          </g>
        ) : item.id === 1 ? (
          <g>
            <ellipse
              cx="50"
              cy="74"
              rx="36"
              ry="12"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="1"
            />
            <path
              d="M50 22 C36 36 34 60 50 72 C66 60 64 36 50 22 Z"
              fill="#F43F5E"
              stroke="#FECDD3"
              strokeWidth="1"
            />
            <path d="M50 30 C40 42 40 60 50 68 C60 60 60 42 50 30 Z" fill="#FB7185" />
            <path
              d="M30 46 C24 56 34 68 46 70 C38 60 36 50 30 46 Z"
              fill="#E11D48"
              stroke="#FDA4AF"
              strokeWidth="0.8"
            />
            <path
              d="M70 46 C76 56 66 68 54 70 C62 60 64 50 70 46 Z"
              fill="#E11D48"
              stroke="#FDA4AF"
              strokeWidth="0.8"
            />
            <ellipse
              cx="50"
              cy="58"
              rx="8"
              ry="5"
              fill="#FEF08A"
              stroke="#CA8A04"
              strokeWidth="1"
            />
          </g>
        ) : item.id === 2 ? (
          <g>
            <rect
              x="18"
              y="24"
              width="64"
              height="52"
              rx="6"
              fill="#DC2626"
              stroke="#FEF08A"
              strokeWidth="1.6"
            />
            <line
              x1="18"
              y1="16"
              x2="18"
              y2="84"
              stroke="#FBBF24"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle cx="18" cy="16" r="3" fill="#D97706" />
            <polygon
              points="50,34 54,44 65,44 56,51 60,62 50,55 40,62 44,51 35,44 46,44"
              fill="#FEF08A"
              stroke="#CA8A04"
              strokeWidth="1"
            />
          </g>
        ) : item.id === 3 ? (
          <g>
            <path d="M36 60 C32 74 38 88 44 88 C48 88 42 74 44 60" fill="#EC4899" opacity="0.8" />
            <path d="M64 60 C68 74 62 88 56 88 C52 88 58 74 56 60" fill="#EC4899" opacity="0.8" />
            <path d="M50 20 L84 64 L16 64 Z" fill="#FEF08A" stroke="#D97706" strokeWidth="1.5" />
            <ellipse
              cx="50"
              cy="64"
              rx="34"
              ry="10"
              fill="#FDE68A"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <path d="M26 52 Q50 56 74 52" stroke="#CA8A04" strokeWidth="1" fill="none" />
            <path d="M34 42 Q50 45 66 42" stroke="#CA8A04" strokeWidth="1" fill="none" />
            <path d="M42 32 Q50 34 58 32" stroke="#CA8A04" strokeWidth="1" fill="none" />
          </g>
        ) : item.id === 4 ? (
          <g>
            <path
              d="M16 42 Q50 32 84 42 L74 34 Q50 26 26 34 Z"
              fill="#B91C1C"
              stroke="#FEF08A"
              strokeWidth="1.2"
            />
            <path
              d="M24 32 Q50 22 76 32 L68 24 Q50 18 32 24 Z"
              fill="#991B1B"
              stroke="#FEF08A"
              strokeWidth="1.2"
            />
            <rect
              x="28"
              y="42"
              width="6"
              height="42"
              fill="#7F1D1D"
              stroke="#FEF3C7"
              strokeWidth="0.8"
            />
            <rect
              x="66"
              y="42"
              width="6"
              height="42"
              fill="#7F1D1D"
              stroke="#FEF3C7"
              strokeWidth="0.8"
            />
            <rect
              x="34"
              y="42"
              width="32"
              height="24"
              fill="#991B1B"
              stroke="#FEF3C7"
              strokeWidth="1"
            />
            <circle cx="50" cy="54" r="8" fill="#FEF08A" stroke="#991B1B" strokeWidth="1.2" />
            <rect
              x="20"
              y="80"
              width="60"
              height="8"
              rx="2"
              fill="#78350F"
              stroke="#FDE68A"
              strokeWidth="1"
            />
          </g>
        ) : (
          <g>
            <circle cx="50" cy="50" r="38" fill="#78350F" stroke="#FBBF24" strokeWidth="1.8" />
            <path
              d="M34 64 C30 52 36 38 48 34 C58 30 68 34 72 44 C66 42 60 44 58 50 C62 50 66 52 64 58 C60 56 56 58 54 64 Z"
              fill="#FBBF24"
              stroke="#92400E"
              strokeWidth="1.2"
            />
            <circle cx="54" cy="40" r="2.5" fill="#DC2626" stroke="#FEF3C7" strokeWidth="0.8" />
            <circle cx="34" cy="54" r="5" fill="#EF4444" stroke="#FEF08A" strokeWidth="1" />
          </g>
        )}
      </svg>
    </div>
  );
}
