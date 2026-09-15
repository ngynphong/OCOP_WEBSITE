'use client';

import React from 'react';
import type { ConceptPackId } from '../../types/eventTypes';

interface EventCornerDecorationsProps {
  conceptId?: ConceptPackId;
  enabled?: boolean;
  customStickerLeftUrl?: string;
  customStickerRightUrl?: string;
  device?: 'desktop' | 'tablet' | 'mobile';
}

export function EventCornerDecorations({
  conceptId = 'TET_NGUYEN_DAN',
  enabled = true,
  customStickerLeftUrl,
  customStickerRightUrl,
  device,
}: EventCornerDecorationsProps) {
  if (!enabled || conceptId === 'NONE') {
    return null;
  }

  const isForcedMobile = device === 'mobile';
  const isForcedTablet = device === 'tablet';

  const leftClasses = isForcedMobile
    ? 'absolute -top-1 -left-1 w-12 h-12 transition-transform hover:scale-105 duration-300 opacity-90'
    : isForcedTablet
      ? 'absolute top-0 left-0 w-24 h-24 transition-transform hover:scale-105 duration-300'
      : 'absolute -top-1 -left-1 sm:top-0 sm:left-0 w-14 h-14 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 transition-transform hover:scale-105 duration-300';

  const rightClasses = isForcedMobile
    ? 'absolute -top-1 -right-1 w-12 h-12 transition-transform hover:scale-105 duration-300 opacity-90'
    : isForcedTablet
      ? 'absolute top-0 right-0 w-24 h-24 transition-transform hover:scale-105 duration-300'
      : 'absolute -top-1 -right-1 sm:top-0 sm:right-0 w-14 h-14 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 transition-transform hover:scale-105 duration-300';

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Họa tiết góc trên bên trái (Top Left Corner) */}
      <div className={leftClasses}>
        {customStickerLeftUrl ? (
          <img
            src={customStickerLeftUrl}
            alt="Left Decoration"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        ) : conceptId === 'TET_NGUYEN_DAN' ? (
          // Cành hoa mai vàng nghệ thuật rủ từ góc trên bên trái
          <svg viewBox="0 0 200 200" className="w-full h-full filter drop-shadow-md">
            {/* Cành cây gỗ uốn lượn */}
            <path
              d="M0 0 Q60 30 110 55 T180 80 M70 38 Q95 70 125 95 M120 60 Q145 35 170 25"
              fill="none"
              stroke="#78350F"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Hoa mai 1 */}
            <g transform="translate(65, 35)">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="-10"
                  rx="6"
                  ry="9"
                  fill="#FBBF24"
                  stroke="#F59E0B"
                  strokeWidth="0.8"
                  transform={`rotate(${a})`}
                />
              ))}
              <circle cx="0" cy="0" r="3" fill="#DC2626" />
            </g>
            {/* Hoa mai 2 */}
            <g transform="translate(125, 60) scale(1.15)">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="-10"
                  rx="6"
                  ry="9"
                  fill="#FBBF24"
                  stroke="#F59E0B"
                  strokeWidth="0.8"
                  transform={`rotate(${a})`}
                />
              ))}
              <circle cx="0" cy="0" r="3.5" fill="#DC2626" />
            </g>
            {/* Hoa mai 3 */}
            <g transform="translate(170, 85) scale(0.85)">
              {[0, 72, 144, 216, 288].map((a) => (
                <ellipse
                  key={a}
                  cx="0"
                  cy="-10"
                  rx="6"
                  ry="9"
                  fill="#FBBF24"
                  stroke="#F59E0B"
                  strokeWidth="0.8"
                  transform={`rotate(${a})`}
                />
              ))}
              <circle cx="0" cy="0" r="3" fill="#DC2626" />
            </g>
            {/* Nụ hoa & búp non */}
            <circle cx="95" cy="45" r="4" fill="#84CC16" />
            <circle cx="115" cy="90" r="3.5" fill="#84CC16" />
          </svg>
        ) : conceptId === 'TRUNG_THU' ? (
          // Lồng đèn ông sao góc trái
          <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-md">
            <line x1="40" y1="0" x2="40" y2="45" stroke="#DC2626" strokeWidth="2" />
            <polygon
              points="40,30 46,45 62,45 49,55 54,70 40,60 26,70 31,55 18,45 34,45"
              fill="#EF4444"
              stroke="#F59E0B"
              strokeWidth="1.5"
            />
            <circle cx="40,50" r="7" fill="#FDE047" />
          </svg>
        ) : conceptId === 'DAI_LE' ? (
          // Lá cờ đỏ sao vàng Việt Nam uốn lượn góc trái
          <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-md">
            <line
              x1="25"
              y1="10"
              x2="25"
              y2="150"
              stroke="#78350F"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <circle cx="25" cy="10" r="5" fill="#F59E0B" />
            {/* Thân cờ uốn lượn */}
            <path
              d="M27 20 Q65 10 95 28 T150 20 L150 85 Q115 95 90 75 T27 88 Z"
              fill="#DA251D"
              stroke="#B91C1C"
              strokeWidth="1"
            />
            {/* Ngôi sao vàng 5 cánh ở trung tâm cờ */}
            <polygon
              points="85,38 89,50 102,50 91,58 95,70 85,62 75,70 79,58 68,50 81,50"
              fill="#FFFF00"
              stroke="#F59E0B"
              strokeWidth="0.8"
            />
          </svg>
        ) : conceptId === 'GIANG_SINH' ? (
          // Chú người tuyết ngộ nghĩnh góc trái
          <svg viewBox="0 0 140 160" className="w-full h-full filter drop-shadow-md">
            {/* Thân người tuyết dưới */}
            <circle cx="70" cy="115" r="38" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            {/* Cúc áo than */}
            <circle cx="70" cy="105" r="3.5" fill="#1E293B" />
            <circle cx="70" cy="122" r="3.5" fill="#1E293B" />
            {/* Đầu người tuyết */}
            <circle cx="70" cy="62" r="26" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2" />
            {/* Mắt */}
            <circle cx="61" cy="56" r="3" fill="#1E293B" />
            <circle cx="79" cy="56" r="3" fill="#1E293B" />
            {/* Mũi cà rốt cam */}
            <polygon points="70,60 88,65 70,67" fill="#F97316" />
            {/* Nụ cười than */}
            <circle cx="63" cy="74" r="1.5" fill="#1E293B" />
            <circle cx="70" cy="76" r="1.5" fill="#1E293B" />
            <circle cx="77" cy="74" r="1.5" fill="#1E293B" />
            {/* Khăn quàng cổ đỏ */}
            <path d="M48 80 Q70 90 92 80 L88 88 Q70 98 52 88 Z" fill="#DC2626" />
            <rect
              x="74"
              y="85"
              width="10"
              height="25"
              rx="2"
              fill="#DC2626"
              transform="rotate(10 74 85)"
            />
            {/* Nón len đỏ chóp bông */}
            <path d="M46 45 Q70 30 94 45 L90 28 Q70 20 50 28 Z" fill="#DC2626" />
            <circle cx="70" cy="18" r="6" fill="#FFFFFF" />
          </svg>
        ) : conceptId === 'MUA_VANG' ? (
          // Bông lúa vàng óng ả
          <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-md">
            <path d="M0 0 Q40 60 90 120" fill="none" stroke="#D97706" strokeWidth="3" />
            {[30, 50, 70, 90, 110].map((y, i) => (
              <g key={i} transform={`translate(${y * 0.7}, ${y})`}>
                <ellipse cx="-8" cy="-3" rx="7" ry="3.5" fill="#FBBF24" transform="rotate(-30)" />
                <ellipse cx="8" cy="-3" rx="7" ry="3.5" fill="#FBBF24" transform="rotate(30)" />
              </g>
            ))}
          </svg>
        ) : conceptId === 'MEGA_SALE' ? (
          // Tia chớp Neon 3D
          <svg viewBox="0 0 120 120" className="w-full h-full filter drop-shadow-md">
            <polygon
              points="40,10 15,65 42,65 25,110 75,50 48,50"
              fill="#FACC15"
              stroke="#E11D48"
              strokeWidth="2"
            />
          </svg>
        ) : null}
      </div>

      {/* 2. Họa tiết góc trên bên phải (Top Right Corner) */}
      <div className={rightClasses}>
        {customStickerRightUrl ? (
          <img
            src={customStickerRightUrl}
            alt="Right Decoration"
            className="w-full h-full object-contain filter drop-shadow-md"
          />
        ) : conceptId === 'TET_NGUYEN_DAN' ? (
          // Cặp lồng đèn đỏ may mắn đung đưa góc phải
          <svg viewBox="0 0 160 180" className="w-full h-full filter drop-shadow-md">
            <line x1="60" y1="0" x2="60" y2="40" stroke="#DC2626" strokeWidth="2" />
            <g transform="translate(60, 70)">
              <rect x="-16" y="-30" width="32" height="6" rx="2" fill="#F59E0B" />
              <ellipse
                cx="0"
                cy="0"
                rx="24"
                ry="28"
                fill="#DC2626"
                stroke="#B91C1C"
                strokeWidth="1"
              />
              <line
                x1="-12"
                y1="-24"
                x2="-12"
                y2="24"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <line
                x1="12"
                y1="-24"
                x2="12"
                y2="24"
                stroke="#F59E0B"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
              <rect x="-16" y="24" width="32" height="6" rx="2" fill="#F59E0B" />
              <path d="M-8 30 L-8 55 M0 30 L0 60 M8 30 L8 55" stroke="#F59E0B" strokeWidth="2" />
            </g>
            <line x1="115" y1="0" x2="115" y2="25" stroke="#DC2626" strokeWidth="1.5" />
            <g transform="translate(115, 48) scale(0.75)">
              <rect x="-16" y="-30" width="32" height="6" rx="2" fill="#F59E0B" />
              <ellipse cx="0" cy="0" rx="24" ry="28" fill="#DC2626" />
              <rect x="-16" y="24" width="32" height="6" rx="2" fill="#F59E0B" />
              <path d="M-8 30 L-8 55 M0 30 L0 60 M8 30 L8 55" stroke="#F59E0B" strokeWidth="2" />
            </g>
          </svg>
        ) : conceptId === 'TRUNG_THU' ? (
          // Bánh Trung Thu nướng vàng ươm góc phải
          <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-md">
            <g transform="translate(100, 50)">
              {/* Thân bánh tròn hoa cúc */}
              <circle cx="0" cy="0" r="38" fill="#D97706" stroke="#B45309" strokeWidth="2" />
              {/* Các cánh hoa bánh nướng xung quanh */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <circle
                  key={deg}
                  cx={Math.cos((deg * Math.PI) / 180) * 36}
                  cy={Math.sin((deg * Math.PI) / 180) * 36}
                  r="7"
                  fill="#F59E0B"
                  stroke="#B45309"
                  strokeWidth="1"
                />
              ))}
              {/* Mặt trên bánh vàng ươm */}
              <circle cx="0" cy="0" r="30" fill="#FBBF24" stroke="#B45309" strokeWidth="1.5" />
              <circle cx="0" cy="0" r="22" fill="#F59E0B" opacity="0.6" />
            </g>
          </svg>
        ) : conceptId === 'DAI_LE' ? (
          // Trống đồng Đông Sơn & Họa tiết chim Lạc góc phải
          <svg viewBox="0 0 160 160" className="w-full h-full filter drop-shadow-md">
            <g transform="translate(100, 50)">
              <circle cx="0" cy="0" r="42" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" />
              <circle
                cx="0"
                cy="0"
                r="34"
                fill="none"
                stroke="#D97706"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <circle cx="0" cy="0" r="26" fill="none" stroke="#D97706" strokeWidth="1" />
              {/* Mặt trời 12 tia sáng ở tâm */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="0"
                  x2={Math.cos((deg * Math.PI) / 180) * 20}
                  y2={Math.sin((deg * Math.PI) / 180) * 20}
                  stroke="#D97706"
                  strokeWidth="1.5"
                />
              ))}
              <circle cx="0" cy="0" r="8" fill="#F59E0B" />
            </g>
          </svg>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Cụm Sticker biểu tượng đặt cạnh Hero Banner / Countdown
 * Hỗ trợ linh hoạt theo từng Concept:
 * - TET_NGUYEN_DAN: Bánh Chưng xanh & Bao Lì Xì đỏ
 * - DAI_LE: Lá Cờ Đỏ Sao Vàng & Hoa Sen
 * - GIANG_SINH: Người Tuyết ấm áp & Hộp Quà
 * - TRUNG_THU: Bánh Trung Thu nướng & Đèn Ông Sao
 */
export function EventHeroFestiveSticker({ conceptId }: { conceptId?: ConceptPackId }) {
  if (!conceptId || conceptId === 'NONE') {
    return null;
  }

  // 1. Concept TẾT
  if (conceptId === 'TET_NGUYEN_DAN') {
    return (
      <div className="hidden lg:flex items-center gap-2.5 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200 shadow-xl pointer-events-auto">
        <svg viewBox="0 0 120 100" className="w-16 h-14 flex-shrink-0 drop-shadow-md">
          <g transform="translate(20, 20)">
            <rect
              x="0"
              y="0"
              width="55"
              height="55"
              rx="5"
              fill="#15803D"
              stroke="#166534"
              strokeWidth="1.5"
              transform="rotate(15 27 27)"
            />
            <line
              x1="27"
              y1="0"
              x2="27"
              y2="55"
              stroke="#EF4444"
              strokeWidth="2.5"
              transform="rotate(15 27 27)"
            />
            <line
              x1="0"
              y1="27"
              x2="55"
              y2="27"
              stroke="#EF4444"
              strokeWidth="2.5"
              transform="rotate(15 27 27)"
            />
            <rect
              x="20"
              y="20"
              width="15"
              height="15"
              fill="#DC2626"
              transform="rotate(15 27 27)"
            />
            <text
              x="27"
              y="32"
              textAnchor="middle"
              fill="#FEF08A"
              fontSize="9"
              fontWeight="bold"
              transform="rotate(15 27 27)"
            >
              TẾT
            </text>
          </g>
          <g transform="translate(60, 30) rotate(-18)">
            <rect
              x="0"
              y="0"
              width="28"
              height="44"
              rx="3"
              fill="#DC2626"
              stroke="#B91C1C"
              strokeWidth="1"
            />
            <path d="M0 0 L14 12 L28 0 Z" fill="#EF4444" stroke="#B91C1C" strokeWidth="0.8" />
            <circle cx="14" cy="22" r="6" fill="#F59E0B" />
            <text x="14" y="25" textAnchor="middle" fill="#78350F" fontSize="7" fontWeight="bold">
              LỘC
            </text>
          </g>
        </svg>
        <div className="text-left pr-1">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider mb-0.5">
            🧧 Tết Bính Ngọ 2026
          </span>
          <p className="text-xs font-bold text-gray-900 leading-tight">Bánh Chưng Tranh Tết</p>
          <p className="text-[11px] text-amber-700 font-medium">Khai xuân đón lộc OCOP</p>
        </div>
      </div>
    );
  }

  // 2. Concept ĐẠI LỄ 2/9, 30/4 (Lá cờ Việt Nam)
  if (conceptId === 'DAI_LE') {
    return (
      <div className="hidden lg:flex items-center gap-2.5 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-red-200 shadow-xl pointer-events-auto">
        <svg viewBox="0 0 110 80" className="w-16 h-13 flex-shrink-0 drop-shadow-md">
          {/* Cột cờ */}
          <line
            x1="15"
            y1="5"
            x2="15"
            y2="75"
            stroke="#78350F"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle cx="15" cy="5" r="3.5" fill="#F59E0B" />
          {/* Lá cờ đỏ sao vàng */}
          <path
            d="M17 10 Q45 4 68 15 T105 10 L105 52 Q75 58 55 45 T17 55 Z"
            fill="#DA251D"
            stroke="#B91C1C"
            strokeWidth="0.8"
          />
          <polygon
            points="60,20 63,29 73,29 64,35 68,44 60,38 52,44 56,35 47,29 57,29"
            fill="#FFFF00"
            stroke="#F59E0B"
            strokeWidth="0.6"
          />
        </svg>
        <div className="text-left pr-1">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-wider mb-0.5">
            🇻🇳 Đại Lễ Non Sông
          </span>
          <p className="text-xs font-bold text-gray-900 leading-tight">Tự Hào Nông Sản Việt</p>
          <p className="text-[11px] text-red-600 font-medium">Bản sắc quê hương đất nước</p>
        </div>
      </div>
    );
  }

  // 3. Concept GIÁNG SINH & NĂM MỚI (Người tuyết)
  if (conceptId === 'GIANG_SINH') {
    return (
      <div className="hidden lg:flex items-center gap-2.5 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-blue-200 shadow-xl pointer-events-auto">
        <svg viewBox="0 0 90 90" className="w-14 h-14 flex-shrink-0 drop-shadow-md">
          {/* Thân người tuyết */}
          <circle cx="45" cy="62" r="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="45" cy="56" r="2.5" fill="#1E293B" />
          <circle cx="45" cy="67" r="2.5" fill="#1E293B" />
          {/* Đầu */}
          <circle cx="45" cy="30" r="17" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
          <circle cx="39" cy="26" r="2" fill="#1E293B" />
          <circle cx="51" cy="26" r="2" fill="#1E293B" />
          <polygon points="45,29 57,32 45,34" fill="#F97316" />
          {/* Khăn quàng đỏ */}
          <path d="M31 42 Q45 49 59 42 L56 47 Q45 53 34 47 Z" fill="#DC2626" />
          {/* Nón len đỏ */}
          <path d="M30 20 Q45 10 60 20 L58 8 Q45 3 32 8 Z" fill="#DC2626" />
          <circle cx="45" cy="3" r="4.5" fill="#FFFFFF" />
        </svg>
        <div className="text-left pr-1">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider mb-0.5">
            ❄️ Giáng Sinh Rộn Ràng
          </span>
          <p className="text-xs font-bold text-gray-900 leading-tight">Người Tuyết Mùa Đông</p>
          <p className="text-[11px] text-blue-600 font-medium">Ấm áp quà tặng cuối năm</p>
        </div>
      </div>
    );
  }

  // 4. Concept TRUNG THU (Bánh Trung Thu)
  if (conceptId === 'TRUNG_THU') {
    return (
      <div className="hidden lg:flex items-center gap-2.5 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200 shadow-xl pointer-events-auto">
        <svg viewBox="0 0 100 80" className="w-16 h-13 flex-shrink-0 drop-shadow-md">
          {/* Bánh Trung Thu nướng */}
          <g transform="translate(42, 40)">
            <circle cx="0" cy="0" r="30" fill="#D97706" stroke="#B45309" strokeWidth="2" />
            {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((deg) => (
              <circle
                key={deg}
                cx={Math.cos((deg * Math.PI) / 180) * 28}
                cy={Math.sin((deg * Math.PI) / 180) * 28}
                r="5.5"
                fill="#F59E0B"
                stroke="#B45309"
                strokeWidth="0.8"
              />
            ))}
            <circle cx="0" cy="0" r="23" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="16" fill="#F59E0B" opacity="0.6" />
          </g>
          {/* Lồng đèn ông sao mini */}
          <g transform="translate(80, 24) scale(0.65)">
            <polygon
              points="15,0 19,12 32,12 22,20 26,32 15,24 4,32 8,20 -2,12 11,12"
              fill="#EF4444"
              stroke="#F59E0B"
              strokeWidth="1.2"
            />
            <circle cx="15" cy="16" r="4.5" fill="#FDE047" />
          </g>
        </svg>
        <div className="text-left pr-1">
          <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase tracking-wider mb-0.5">
            🥮 Rằm Tháng Tám
          </span>
          <p className="text-xs font-bold text-gray-900 leading-tight">Bánh Trung Thu Cổ Truyền</p>
          <p className="text-[11px] text-amber-700 font-medium">Trông trăng phá cỗ sum vầy</p>
        </div>
      </div>
    );
  }

  return null;
}
