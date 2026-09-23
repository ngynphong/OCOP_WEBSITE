'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface HarvestHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function HarvestHero({ item, isSelected }: HarvestHeroProps) {
  const gradId = `harv_grad_${item.id}`;
  const jarGradId = `amber_jar_${item.id}`;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background:
            'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, rgba(34, 197, 94, 0.3) 60%, transparent 75%)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="80%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#92400E" />
          </linearGradient>
          <linearGradient id={jarGradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="85%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        {item.id === 0 ? (
          <g>
            <path
              d="M50 88 C48 65 35 40 22 25 C34 32 44 48 48 70 Z"
              fill="#FBBF24"
              stroke="#D97706"
              strokeWidth="1"
            />
            <path
              d="M50 88 C52 65 65 40 78 25 C66 32 56 48 52 70 Z"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="1"
            />
            <path
              d="M50 90 C50 60 50 35 50 14 C50 35 50 60 50 90 Z"
              stroke="#CA8A04"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {[
              [50, 16],
              [43, 24],
              [57, 24],
              [40, 34],
              [60, 34],
              [38, 46],
              [62, 46],
              [42, 58],
              [58, 58],
            ].map(([x, y], i) => (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="5"
                ry="3"
                transform={`rotate(${x < 50 ? -25 : x > 50 ? 25 : 0} ${x} ${y})`}
                fill={`url(#${gradId})`}
                stroke="#B45309"
                strokeWidth="0.8"
              />
            ))}
            <rect
              x="42"
              y="66"
              width="16"
              height="7"
              rx="3"
              fill="#15803D"
              stroke="#86EFAC"
              strokeWidth="0.8"
            />
            <ellipse cx="50" cy="69.5" rx="3" ry="2" fill="#FEF08A" />
          </g>
        ) : item.id === 1 ? (
          <g>
            <ellipse
              cx="50"
              cy="28"
              rx="22"
              ry="7"
              fill="#D97706"
              stroke="#92400E"
              strokeWidth="1"
            />
            <path d="M28 28 C28 24 72 24 72 28 C70 33 30 33 28 28 Z" fill="#B45309" />
            <line
              x1="26"
              y1="31"
              x2="74"
              y2="31"
              stroke="#FEF3C7"
              strokeWidth="1.5"
              strokeDasharray="3 2"
            />
            <path
              d="M30 32 L26 68 C26 78 74 78 74 68 L70 32 Z"
              fill={`url(#${jarGradId})`}
              stroke="#FEF3C7"
              strokeWidth="1.5"
            />
            <polygon
              points="50,44 57,48 57,56 50,60 43,56 43,48"
              fill="#FDE68A"
              opacity="0.6"
              stroke="#B45309"
              strokeWidth="0.8"
            />
            <polygon
              points="63,52 70,56 70,64 63,68 56,64 56,56"
              fill="#FDE68A"
              opacity="0.4"
              stroke="#B45309"
              strokeWidth="0.8"
            />
            <path
              d="M32 40 L30 64"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.6"
            />
          </g>
        ) : item.id === 2 ? (
          <g>
            <rect
              x="28"
              y="24"
              width="44"
              height="12"
              rx="4"
              fill="#065F46"
              stroke="#34D399"
              strokeWidth="1.2"
            />
            <path
              d="M26 36 C26 36 22 55 24 72 C26 84 74 84 76 72 C78 55 74 36 74 36 Z"
              fill="#047857"
              stroke="#6EE7B7"
              strokeWidth="1.5"
            />
            <ellipse
              cx="50"
              cy="58"
              rx="16"
              ry="16"
              fill="#064E3B"
              stroke="#A7F3D0"
              strokeWidth="1"
            />
            <path d="M50 48 C44 54 44 64 50 68 C56 64 56 54 50 48 Z" fill="#A7F3D0" />
            <path d="M50 52 C42 56 46 64 50 66 C54 64 58 56 50 52 Z" fill="#34D399" />
          </g>
        ) : item.id === 3 ? (
          <g>
            <path d="M25 55 C25 24 75 24 75 55" stroke="#92400E" strokeWidth="2.5" fill="none" />
            <circle cx="40" cy="46" r="14" fill="#84CC16" stroke="#4D7C0F" strokeWidth="1" />
            <ellipse
              cx="58"
              cy="48"
              rx="13"
              ry="11"
              fill="#F59E0B"
              stroke="#B45309"
              strokeWidth="1"
            />
            <circle cx="50" cy="40" r="10" fill="#EF4444" stroke="#991B1B" strokeWidth="1" />
            <path
              d="M20 54 L28 84 C30 87 70 87 72 84 L80 54 Z"
              fill="#B45309"
              stroke="#FDE68A"
              strokeWidth="1.5"
            />
            <line x1="20" y1="54" x2="80" y2="54" stroke="#FEF3C7" strokeWidth="2.5" />
            <path
              d="M26 62 Q50 66 74 62 M28 72 Q50 76 72 72"
              stroke="#78350F"
              strokeWidth="1.5"
              fill="none"
            />
          </g>
        ) : item.id === 4 ? (
          <g>
            <path
              d="M38 38 C32 44 34 54 44 54 C48 54 50 50 46 46 C42 42 42 36 38 38 Z"
              fill="#FDE68A"
              stroke="#B45309"
              strokeWidth="1.2"
            />
            <path
              d="M52 32 C48 38 52 48 60 46 C64 44 64 38 58 36 C54 34 54 30 52 32 Z"
              fill="#FBBF24"
              stroke="#B45309"
              strokeWidth="1.2"
            />
            <path
              d="M48 44 C42 50 46 60 56 58 C60 56 60 50 54 48 C50 46 50 42 48 44 Z"
              fill="#F59E0B"
              stroke="#92400E"
              strokeWidth="1.2"
            />
            <ellipse
              cx="50"
              cy="56"
              rx="32"
              ry="12"
              fill="#78350F"
              stroke="#FBBF24"
              strokeWidth="1.5"
            />
            <path
              d="M18 56 C20 78 80 78 82 56 Z"
              fill="#92400E"
              stroke="#FBBF24"
              strokeWidth="1.5"
            />
          </g>
        ) : (
          <g>
            <rect
              x="44"
              y="16"
              width="12"
              height="10"
              rx="2"
              fill="#B45309"
              stroke="#FEF3C7"
              strokeWidth="1"
            />
            <path
              d="M42 26 L42 36 L30 50 L30 82 C30 87 70 87 70 82 L70 50 L58 36 L58 26 Z"
              fill="#78350F"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            <rect
              x="36"
              y="52"
              width="28"
              height="22"
              rx="3"
              fill="#D97706"
              stroke="#FEF3C7"
              strokeWidth="1"
            />
            <text x="50" y="62" textAnchor="middle" fontSize="6.5" fontWeight="900" fill="#FEF08A">
              CỐT NHĨ
            </text>
            <text x="50" y="70" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#FFFFFF">
              PHÚ QUỐC
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
