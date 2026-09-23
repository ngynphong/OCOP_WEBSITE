'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface ChristmasHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function ChristmasHero({ item, isSelected }: ChristmasHeroProps) {
  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(220, 38, 38, 0.45) 0%, rgba(16, 185, 129, 0.35) 60%, transparent 75%)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
      >
        {item.id === 0 ? (
          <g>
            <path
              d="M38 18 L62 18 L60 52 C60 58 64 64 74 68 C82 72 82 84 72 88 C58 92 46 86 44 76 L40 50 Z"
              fill="#DC2626"
              stroke="#FEF08A"
              strokeWidth="1.2"
            />
            <rect
              x="34"
              y="14"
              width="32"
              height="12"
              rx="6"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="1"
            />
            <path
              d="M52 50 L52 64 M45 57 L59 57 M47 52 L57 62 M47 62 L57 52"
              stroke="#FDE68A"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M60 20 C60 8 72 8 72 16 L72 26"
              stroke="#EF4444"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M60 20 C60 8 72 8 72 16 L72 26"
              stroke="#FFFFFF"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="3 3"
              fill="none"
            />
          </g>
        ) : item.id === 1 ? (
          <g>
            <rect
              x="22"
              y="38"
              width="56"
              height="46"
              rx="6"
              fill="#047857"
              stroke="#6EE7B7"
              strokeWidth="1.4"
            />
            <rect
              x="18"
              y="28"
              width="64"
              height="14"
              rx="4"
              fill="#065F46"
              stroke="#A7F3D0"
              strokeWidth="1.4"
            />
            <rect x="45" y="28" width="10" height="56" fill="#F59E0B" />
            <rect x="22" y="56" width="56" height="10" fill="#F59E0B" />
            <ellipse
              cx="40"
              cy="24"
              rx="10"
              ry="6"
              transform="rotate(-25 40 24)"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1"
            />
            <ellipse
              cx="60"
              cy="24"
              rx="10"
              ry="6"
              transform="rotate(25 60 24)"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1"
            />
            <circle cx="50" cy="25" r="4" fill="#D97706" />
          </g>
        ) : item.id === 2 ? (
          <g>
            <path
              d="M30 76 L70 76 L74 88 L26 88 Z"
              fill="#78350F"
              stroke="#FEF3C7"
              strokeWidth="1.2"
            />
            <circle
              cx="50"
              cy="46"
              r="32"
              fill="#0284C7"
              fillOpacity="0.25"
              stroke="#E0F2FE"
              strokeWidth="2"
            />
            <polygon
              points="50,26 62,40 56,40 66,54 58,54 68,68 32,68 42,54 34,54 44,40 38,40"
              fill="#059669"
            />
            <polygon points="50,26 56,33 44,33" fill="#FFFFFF" />
            <circle cx="38" cy="36" r="1.5" fill="#FFFFFF" />
            <circle cx="62" cy="34" r="1.5" fill="#FFFFFF" />
            <circle cx="44" cy="60" r="1.2" fill="#FFFFFF" />
            <circle cx="58" cy="58" r="1.2" fill="#FFFFFF" />
            <path
              d="M32 30 C30 38 30 54 36 62"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
              fill="none"
            />
          </g>
        ) : item.id === 3 ? (
          <g>
            <path
              d="M34 38 C34 38 48 40 48 60 L24 64 C24 48 34 38 34 38 Z"
              fill="#F59E0B"
              stroke="#92400E"
              strokeWidth="1.2"
            />
            <ellipse cx="36" cy="62" rx="12" ry="4" fill="#D97706" />
            <path
              d="M60 38 C60 38 48 40 48 60 L72 64 C72 48 60 38 60 38 Z"
              fill="#FBBF24"
              stroke="#92400E"
              strokeWidth="1.2"
            />
            <ellipse cx="60" cy="62" rx="12" ry="4" fill="#D97706" />
            <ellipse cx="44" cy="30" rx="8" ry="4" fill="#15803D" />
            <ellipse cx="56" cy="30" rx="8" ry="4" fill="#15803D" />
            <circle cx="48" cy="32" r="4" fill="#DC2626" />
            <circle cx="53" cy="31" r="3.5" fill="#EF4444" />
          </g>
        ) : item.id === 4 ? (
          <g>
            <circle cx="50" cy="28" r="12" fill="#B45309" stroke="#FEF3C7" strokeWidth="1.2" />
            <rect
              x="42"
              y="38"
              width="16"
              height="26"
              rx="4"
              fill="#B45309"
              stroke="#FEF3C7"
              strokeWidth="1.2"
            />
            <rect
              x="22"
              y="40"
              width="56"
              height="9"
              rx="4.5"
              fill="#B45309"
              stroke="#FEF3C7"
              strokeWidth="1.2"
            />
            <rect
              x="36"
              y="60"
              width="10"
              height="22"
              rx="5"
              fill="#B45309"
              stroke="#FEF3C7"
              strokeWidth="1.2"
            />
            <rect
              x="54"
              y="60"
              width="10"
              height="22"
              rx="5"
              fill="#B45309"
              stroke="#FEF3C7"
              strokeWidth="1.2"
            />
            <circle cx="46" cy="26" r="1.5" fill="#FFFFFF" />
            <circle cx="54" cy="26" r="1.5" fill="#FFFFFF" />
            <path d="M46 32 Q50 36 54 32" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
            <circle cx="50" cy="45" r="2" fill="#DC2626" />
            <circle cx="50" cy="52" r="2" fill="#16A34A" />
          </g>
        ) : (
          <g>
            <polygon
              points="50,14 56,36 78,36 60,50 67,72 50,58 33,72 40,50 22,36 44,36"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1.5"
            />
            <polygon
              points="50,22 54,38 70,38 57,48 62,64 50,54 38,64 43,48 30,38 46,38"
              fill="#FEF08A"
            />
            <circle cx="50" cy="46" r="6" fill="#FFFFFF" opacity="0.8" />
          </g>
        )}
      </svg>
    </div>
  );
}
