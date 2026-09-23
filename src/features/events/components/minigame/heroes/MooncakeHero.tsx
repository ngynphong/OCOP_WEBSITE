'use client';

import React from 'react';
import type { MysteryPickItem } from '../../../types/eventMinigameTypes';

interface MooncakeHeroProps {
  item: MysteryPickItem;
  isSelected: boolean;
}

export default function MooncakeHero({ item, isSelected }: MooncakeHeroProps) {
  const isSnowSkin =
    item.name.includes('Dẻo') ||
    Boolean(item.badge?.includes('Dẻo')) ||
    item.id === 1 ||
    item.id === 4;
  const isComNon = item.id === 4 || item.name.includes('Cốm');
  const character =
    item.character ||
    (item.name.includes('Thập Cẩm')
      ? '月'
      : item.name.includes('Hạt Sen')
        ? '圓'
        : item.name.includes('Đậu Xanh')
          ? '秋'
          : item.name.includes('Khoai Môn')
            ? '和'
            : item.name.includes('Cốm')
              ? '美'
              : '福');

  const gradId = `mc_grad_${item.id}`;
  const shadowId = `mc_shadow_${item.id}`;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      <div
        className={`absolute inset-0 rounded-full blur-xl transition-opacity duration-300 pointer-events-none ${
          isSelected ? 'opacity-95 scale-110' : 'opacity-40 group-hover:opacity-75'
        }`}
        style={{
          background: isSnowSkin
            ? isComNon
              ? 'radial-gradient(circle, rgba(52, 211, 153, 0.45) 0%, transparent 70%)'
              : 'radial-gradient(circle, rgba(254, 240, 138, 0.5) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(245, 158, 11, 0.55) 0%, transparent 70%)',
        }}
      />

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full relative z-10 select-none drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {isSnowSkin ? (
            isComNon ? (
              <radialGradient id={gradId} cx="42%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="35%" stopColor="#F0FDF4" />
                <stop offset="70%" stopColor="#BBF7D0" />
                <stop offset="95%" stopColor="#86EFAC" />
                <stop offset="100%" stopColor="#4ADE80" />
              </radialGradient>
            ) : (
              <radialGradient id={gradId} cx="42%" cy="38%" r="62%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#FEFCE8" />
                <stop offset="75%" stopColor="#FEF08A" />
                <stop offset="95%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#EAB308" />
              </radialGradient>
            )
          ) : (
            <radialGradient id={gradId} cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="25%" stopColor="#F59E0B" />
              <stop offset="60%" stopColor="#D97706" />
              <stop offset="85%" stopColor="#B45309" />
              <stop offset="100%" stopColor="#78350F" />
            </radialGradient>
          )}

          <filter id={shadowId} x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodOpacity="0.4" />
          </filter>
        </defs>

        <g filter={`url(#${shadowId})`}>
          {[
            [87, 50],
            [82.04, 68.5],
            [68.5, 82.04],
            [50, 87],
            [31.5, 82.04],
            [17.96, 68.5],
            [13, 50],
            [17.96, 31.5],
            [31.5, 17.96],
            [50, 13],
            [68.5, 17.96],
            [82.04, 31.5],
          ].map(([cx, cy], i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r="9.5"
              fill={`url(#${gradId})`}
              stroke={isSnowSkin ? (isComNon ? '#4ADE80' : '#CA8A04') : '#92400E'}
              strokeWidth="0.8"
            />
          ))}

          <circle
            cx="50"
            cy="50"
            r="40"
            fill={`url(#${gradId})`}
            stroke={isSnowSkin ? (isComNon ? '#4ADE80' : '#CA8A04') : '#92400E'}
            strokeWidth="0.8"
          />
        </g>

        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={isSnowSkin ? (isComNon ? '#86EFAC' : '#EAB308') : '#78350F'}
          strokeWidth="1.6"
          opacity="0.85"
        />

        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = (50 + 25 * Math.cos(rad)).toFixed(2);
          const y1 = (50 + 25 * Math.sin(rad)).toFixed(2);
          const x2 = (50 + 34 * Math.cos(rad)).toFixed(2);
          const y2 = (50 + 34 * Math.sin(rad)).toFixed(2);
          return (
            <line
              key={deg}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isSnowSkin ? (isComNon ? '#4ADE80' : '#CA8A04') : '#92400E'}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.75"
            />
          );
        })}

        <circle
          cx="50"
          cy="50"
          r="23.5"
          fill="none"
          stroke={isSnowSkin ? (isComNon ? '#22C55E' : '#A16207') : '#FEF3C7'}
          strokeWidth="1.4"
          strokeDasharray="2.5 2"
          opacity="0.9"
        />

        <circle
          cx="50"
          cy="50"
          r="16.5"
          fill={isSnowSkin ? (isComNon ? '#F0FDF4' : '#FEFCE8') : '#92400E'}
          stroke={isSnowSkin ? (isComNon ? '#16A34A' : '#CA8A04') : '#FDE68A'}
          strokeWidth="1.4"
        />

        <text
          x="50"
          y="55.5"
          textAnchor="middle"
          fontSize="13"
          fontWeight="900"
          fontFamily="serif, system-ui"
          fill={isSnowSkin ? (isComNon ? '#15803D' : '#854D0E') : '#FEF3C7'}
        >
          {character}
        </text>

        <path
          d="M 33 28 Q 50 18 67 28 Q 50 24 33 28 Z"
          fill="#FFFFFF"
          opacity={isSnowSkin ? 0.38 : 0.28}
        />
      </svg>
    </div>
  );
}
