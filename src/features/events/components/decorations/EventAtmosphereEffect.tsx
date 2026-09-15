'use client';

import React from 'react';
import type { AtmosphereEffectType } from '../../types/eventTypes';

interface EventAtmosphereEffectProps {
  type?: AtmosphereEffectType;
  enabled?: boolean;
  contained?: boolean;
}

// Danh sách các hạt với tọa độ, độ trễ và thời gian ngẫu nhiên được tính sẵn
const PARTICLES = [
  { id: 1, left: '3%', delay: '0s', duration: '7.5s', size: 22, sway: '30px' },
  { id: 2, left: '11%', delay: '2.1s', duration: '9.2s', size: 18, sway: '-25px' },
  { id: 3, left: '19%', delay: '4.5s', duration: '8.1s', size: 24, sway: '35px' },
  { id: 4, left: '28%', delay: '1.2s', duration: '6.8s', size: 16, sway: '-20px' },
  { id: 5, left: '37%', delay: '3.4s', duration: '10.5s', size: 26, sway: '40px' },
  { id: 6, left: '46%', delay: '0.8s', duration: '7.9s', size: 20, sway: '-30px' },
  { id: 7, left: '55%', delay: '5.0s', duration: '8.7s', size: 23, sway: '25px' },
  { id: 8, left: '64%', delay: '2.8s', duration: '6.5s', size: 17, sway: '-35px' },
  { id: 9, left: '73%', delay: '4.1s', duration: '9.8s', size: 25, sway: '30px' },
  { id: 10, left: '82%', delay: '1.7s', duration: '7.2s', size: 19, sway: '-22px' },
  { id: 11, left: '91%', delay: '3.9s', duration: '8.4s', size: 21, sway: '28px' },
  { id: 12, left: '97%', delay: '0.3s', duration: '10.0s', size: 15, sway: '-18px' },
];

export function EventAtmosphereEffect({
  type = 'apricot_petals',
  enabled = true,
  contained = false,
}: EventAtmosphereEffectProps) {
  if (!enabled || type === 'none') {
    return null;
  }

  // Render SVG đồ họa tương ứng với từng loại hiệu ứng
  const renderParticle = (index: number) => {
    switch (type) {
      case 'apricot_petals':
        // Hoa mai vàng 5 cánh với nhị đỏ
        return (
          <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-xs">
            <g transform="translate(20, 20)">
              {[0, 72, 144, 216, 288].map((angle) => (
                <ellipse
                  key={angle}
                  cx="0"
                  cy="-10"
                  rx="6"
                  ry="9"
                  fill="#FBBF24"
                  stroke="#F59E0B"
                  strokeWidth="0.8"
                  transform={`rotate(${angle})`}
                />
              ))}
              <circle cx="0" cy="0" r="3.5" fill="#EF4444" />
              <circle cx="0" cy="0" r="2" fill="#FDE047" />
            </g>
          </svg>
        );

      case 'peach_petals':
        // Cánh hoa đào hồng phai duyên dáng
        return (
          <svg viewBox="0 0 30 30" className="w-full h-full drop-shadow-xs">
            <path
              d="M15 2 C8 7, 5 16, 12 25 C15 28, 17 28, 19 25 C26 16, 23 7, 15 2 Z"
              fill="#F472B6"
              stroke="#EC4899"
              strokeWidth="0.6"
              opacity="0.85"
            />
          </svg>
        );

      case 'golden_leaves':
        // Lá lúa vàng óng ả mùa gặt
        return (
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-xs">
            <path
              d="M6 26 C12 20, 24 16, 28 6 C20 10, 10 18, 6 26 Z"
              fill="#F59E0B"
              stroke="#D97706"
              strokeWidth="0.8"
              opacity="0.9"
            />
          </svg>
        );

      case 'starlight':
        // Ánh sao lung linh đêm hội trăng rằm
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full">
            <polygon
              points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
              fill="#FDE047"
              opacity="0.8"
            />
          </svg>
        );

      case 'confetti':
        // Pháo giấy kim tuyến đa sắc (đỏ, vàng, tím, xanh)
        const colors = ['#EF4444', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899'];
        const color = colors[index % colors.length];
        return (
          <div
            className="w-full h-full rounded-2xs opacity-85 shadow-2xs"
            style={{ backgroundColor: color }}
          />
        );

      case 'snowflakes':
        // Bông tuyết mùa đông
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full text-white/80" fill="currentColor">
            <path
              d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Định nghĩa CSS Keyframe animations siêu mượt, nhẹ nhàng */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes eventAtmosphereFall {
          0% {
            transform: translate3d(0, -60px, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.9;
          }
          90% {
            opacity: 0.85;
          }
          100% {
            transform: translate3d(var(--particle-sway, 25px), ${contained ? '850px' : '105vh'}, 0) rotate(360deg);
            opacity: 0;
          }
        }
      `,
        }}
      />

      <div
        className={`pointer-events-none ${contained ? 'absolute' : 'fixed'} inset-0 z-30 overflow-hidden select-none`}
        aria-hidden="true"
      >
        {PARTICLES.map((particle, idx) => (
          <div
            key={particle.id}
            className="absolute top-0 will-change-transform"
            style={{
              left: particle.left,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `eventAtmosphereFall ${particle.duration} linear infinite`,
              animationDelay: particle.delay,
              // Truyền khoảng cách lượn sóng ngang qua biến CSS
              ['--particle-sway' as string]: particle.sway,
            }}
          >
            {renderParticle(idx)}
          </div>
        ))}
      </div>
    </>
  );
}
