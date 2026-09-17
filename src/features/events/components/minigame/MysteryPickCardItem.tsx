'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import type { MysteryPickItem, MysteryPickConceptId } from '../../types/eventMinigameTypes';

interface MysteryPickCardItemProps {
  item: MysteryPickItem;
  conceptId: MysteryPickConceptId;
  isSelected: boolean;
  isSpinning: boolean;
  disabled: boolean;
  actionLabel: string;
  spinningLabel: string;
  onPlay: (id: number) => void;
  className?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. CONCEPT TRUNG THU: CHIẾC BÁNH TRUNG THU 3D DẬP NỔI KHUÔN GỖ TRUYỀN THỐNG
// ─────────────────────────────────────────────────────────────────────────────
function renderMooncakeHero(item: MysteryPickItem, isSelected: boolean) {
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
      {/* Vầng sáng hoàng kim / ngọc bích */}
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

        {/* 12 cánh hoa múi bánh dập nổi khuôn truyền thống */}
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

          {/* Mặt bánh chính */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill={`url(#${gradId})`}
            stroke={isSnowSkin ? (isComNon ? '#4ADE80' : '#CA8A04') : '#92400E'}
            strokeWidth="0.8"
          />
        </g>

        {/* Viền gờ dập khuôn trong */}
        <circle
          cx="50"
          cy="50"
          r="34"
          fill="none"
          stroke={isSnowSkin ? (isComNon ? '#86EFAC' : '#EAB308') : '#78350F'}
          strokeWidth="1.6"
          opacity="0.85"
        />

        {/* 12 rãnh khía múi bánh hướng tâm */}
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

        {/* Vành chuỗi hạt ngọc dập nổi */}
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

        {/* Nhụy hoa tâm bánh */}
        <circle
          cx="50"
          cy="50"
          r="16.5"
          fill={isSnowSkin ? (isComNon ? '#F0FDF4' : '#FEFCE8') : '#92400E'}
          stroke={isSnowSkin ? (isComNon ? '#16A34A' : '#CA8A04') : '#FDE68A'}
          strokeWidth="1.4"
        />

        {/* Chữ thư pháp dập nổi ở tâm bánh */}
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

        {/* Vệt sáng bóng lọng trứng nướng (gloss reflection) */}
        <path
          d="M 33 28 Q 50 18 67 28 Q 50 24 33 28 Z"
          fill="#FFFFFF"
          opacity={isSnowSkin ? 0.38 : 0.28}
        />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONCEPT TẾT NGUYÊN ĐÁN: PHONG BAO LÌ XÌ HOÀNG GIA 3D (ROYAL RED ENVELOPE)
// ─────────────────────────────────────────────────────────────────────────────
function renderTetEnvelopeHero(item: MysteryPickItem, isSelected: boolean) {
  const gradId = `tet_env_grad_${item.id}`;
  const goldGradId = `tet_gold_${item.id}`;
  const char = item.character || '福';

  return (
    <div className="relative w-20 h-22 sm:w-22 sm:h-24 md:w-24 md:h-26 mx-auto flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-1">
      {/* Vầng hào quang đỏ son & hoàng kim */}
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

        {/* Thân bao lì xì đỏ nhung */}
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

        {/* Hoa văn mây sóng thủy ba mờ chìm dập kim tuyến */}
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

        {/* Nắp bao lượn sóng viền vàng kim */}
        <path
          d="M12 24 C12 24 35 44 50 44 C65 44 88 24 88 24 L88 10 L12 10 Z"
          fill="#B91C1C"
          stroke={`url(#${goldGradId})`}
          strokeWidth="1.6"
        />

        {/* Khóa Kim Ấn / Hoa Mai Vàng ở tâm dập nổi 3D */}
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

        {/* Nút thắt đồng tâm & tua rua chỉ đỏ vàng may mắn */}
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

// ─────────────────────────────────────────────────────────────────────────────
// 3. CONCEPT MÙA VÀNG: TINH HOA NÔNG SẢN VÀNG OCOP 3D (HARVEST SPECIALTIES)
// ─────────────────────────────────────────────────────────────────────────────
function renderHarvestHero(item: MysteryPickItem, isSelected: boolean) {
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
          /* Item 0: Bó Lúa Vàng ST25 Trĩu Hạt */
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
          /* Item 1: Hũ Mật Ong Rừng U Minh */
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
          /* Item 2: Hũ Trà Shan Tuyết Cổ Thụ */
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
          /* Item 3: Giỏ Trái Cây Miệt Vườn */
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
          /* Item 4: Thố Hạt Điều Rang Củi */
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
          /* Item 5: Chai Nước Mắm Cốt Nhĩ Cổ Truyền */
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

// ─────────────────────────────────────────────────────────────────────────────
// 4. CONCEPT MEGA SALE: HỘP QUÀ CYBER MYSTERY BOX 3D CÔNG NGHỆ CAO
// ─────────────────────────────────────────────────────────────────────────────
function renderCyberMysteryBoxHero(item: MysteryPickItem, isSelected: boolean) {
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

        {/* Mặt trên hộp 3D */}
        <polygon
          points="50,16 82,30 50,44 18,30"
          fill={`url(#box_top_${item.id})`}
          stroke={neonColor}
          strokeWidth="1.4"
        />
        {/* Mặt trái hộp 3D */}
        <polygon
          points="18,30 50,44 50,82 18,68"
          fill={`url(#box_left_${item.id})`}
          stroke={neonColor}
          strokeWidth="1.4"
        />
        {/* Mặt phải hộp 3D */}
        <polygon
          points="50,44 82,30 82,68 50,82"
          fill={`url(#box_right_${item.id})`}
          stroke={neonColor}
          strokeWidth="1.4"
        />

        {/* Dải ruy băng Neon phát sáng ôm thân hộp */}
        <polygon points="46,18 54,21 54,42 46,39" fill={neonColor} opacity="0.8" />
        <polygon points="32,24 36,26 64,38 60,36" fill={neonColor} opacity="0.8" />
        <polygon points="46,45 54,42 54,81 46,80" fill={neonColor} opacity="0.8" />

        {/* Lõi năng lượng lượng tử ở trung tâm (Power Core) */}
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

        {/* Đèn laser neon quét quanh mép */}
        <circle cx="18" cy="30" r="2" fill={neonColor} />
        <circle cx="82" cy="30" r="2" fill={neonColor} />
        <circle cx="50" cy="82" r="2" fill={neonColor} />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CONCEPT GIÁNG SINH: VẬT PHẨM LỄ HỘI MÙA ĐÔNG 3D (CHRISTMAS WONDERLAND)
// ─────────────────────────────────────────────────────────────────────────────
function renderChristmasHero(item: MysteryPickItem, isSelected: boolean) {
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
          /* Item 0: Chiếc Tất Đỏ May Mắn */
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
          /* Item 1: Hộp Quà Nơ Vàng */
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
          /* Item 2: Quả Cầu Tuyết Pha Lê */
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
          /* Item 3: Chuông Vàng Giáng Sinh */
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
          /* Item 4: Bánh Gừng Mật Ong */
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
          /* Item 5: Ngôi Sao Bethlehem Đỉnh Thông */
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

// ─────────────────────────────────────────────────────────────────────────────
// 6. CONCEPT ĐẠI LỄ: BIỂU TRƯNG VĂN HÓA & TỰ HÀO DÂN TỘC 3D (NATIONAL HERITAGE)
// ─────────────────────────────────────────────────────────────────────────────
function renderDaiLeHero(item: MysteryPickItem, isSelected: boolean) {
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
          /* Item 0: Mặt Trống Đồng Đông Sơn */
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
          /* Item 1: Hoa Sen Tháp Mười */
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
          /* Item 2: Cờ Đỏ Sao Vàng Vinh Quang */
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
          /* Item 3: Nón Lá Quê Hương */
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
          /* Item 4: Khuê Văn Các */
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
          /* Item 5: Rồng Thiêng Thăng Long */
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

// ─────────────────────────────────────────────────────────────────────────────
// 7. CONCEPT CUSTOM / FALLBACK: RƯƠNG KHO BÁU OCOP DÁT VÀNG 3D (TREASURE CHEST)
// ─────────────────────────────────────────────────────────────────────────────
function renderCustomHero(item: MysteryPickItem, isSelected: boolean) {
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

// ─────────────────────────────────────────────────────────────────────────────
// PHÂN GIẢI HERO VISUAL TƯƠNG ỨNG TỪNG CONCEPT
// ─────────────────────────────────────────────────────────────────────────────
function renderHeroByConcept(
  conceptId: MysteryPickConceptId,
  item: MysteryPickItem,
  isSelected: boolean,
) {
  if (conceptId === 'TRUNG_THU') {
    return renderMooncakeHero(item, isSelected);
  }
  if (conceptId === 'TET_NGUYEN_DAN') {
    return renderTetEnvelopeHero(item, isSelected);
  }
  if (conceptId === 'MUA_VANG') {
    return renderHarvestHero(item, isSelected);
  }
  if (conceptId === 'MEGA_SALE') {
    return renderCyberMysteryBoxHero(item, isSelected);
  }
  if (conceptId === 'GIANG_SINH') {
    return renderChristmasHero(item, isSelected);
  }
  if (conceptId === 'DAI_LE') {
    return renderDaiLeHero(item, isSelected);
  }
  return renderCustomHero(item, isSelected);
}

// ─────────────────────────────────────────────────────────────────────────────
// PHÂN GIẢI NHÃN HUY HIỆU ĐỈNH THẺ (HEADER TAG) THEO CONCEPT
// ─────────────────────────────────────────────────────────────────────────────
function renderHeaderTag(conceptId: MysteryPickConceptId, item: MysteryPickItem) {
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

  // Custom / Fallback
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

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT CHÍNH: MYSTERY PICK CARD ITEM
// ─────────────────────────────────────────────────────────────────────────────
export function MysteryPickCardItem({
  item,
  conceptId,
  isSelected,
  isSpinning,
  disabled,
  actionLabel,
  spinningLabel,
  onPlay,
  className = '',
}: MysteryPickCardItemProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onPlay(item.id)}
      className={`group relative flex flex-col justify-between items-center text-center rounded-2xl p-2.5 sm:p-3 transition-all duration-300 cursor-pointer overflow-hidden border min-h-[14rem] sm:min-h-[15rem] md:h-64 ${
        isSelected
          ? 'scale-105 shadow-2xl ring-4 ring-amber-400/60'
          : 'hover:-translate-y-1.5 hover:shadow-xl'
      } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${className}`}
      style={
        {
          borderColor: isSelected
            ? 'var(--event-secondary, #F59E0B)'
            : 'var(--event-card-border, rgba(255, 255, 255, 0.2))',
          background: isSelected
            ? 'linear-gradient(180deg, color-mix(in srgb, var(--event-primary, #4F46E5) 45%, #0B0F19) 0%, #070A12 100%)'
            : 'linear-gradient(180deg, color-mix(in srgb, var(--event-primary, #4F46E5) 20%, #0F172A) 0%, #060910 100%)',
          boxShadow: isSelected
            ? '0 0 25px color-mix(in srgb, var(--event-secondary, #F59E0B) 50%, transparent)'
            : '0 6px 18px rgba(0, 0, 0, 0.35)',
        } as React.CSSProperties
      }
    >
      {/* ── 1. ĐỈNH THẺ: HUY HIỆU THEO TỪNG CONCEPT ───────────────────────── */}
      {renderHeaderTag(conceptId, item)}

      {/* ── 2. HERO VISUAL 3D CHUYÊN BIỆT CHO TỪNG CONCEPT ────────────────── */}
      <div className="my-auto text-center w-full px-1 flex flex-col items-center justify-center">
        {renderHeroByConcept(conceptId, item, isSelected)}

        {/* Tiêu đề món quà - hiển thị trọn vẹn 2 dòng trên mobile, không cắt ngắn ... */}
        <div className="w-full min-h-[2.25rem] sm:min-h-[2.5rem] flex items-center justify-center mt-1">
          <span
            className="font-extrabold text-[11px] sm:text-xs md:text-sm tracking-tight drop-shadow-xs line-clamp-2 leading-tight text-center break-words px-0.5"
            style={{ color: 'var(--event-secondary, #FDE68A)' }}
            title={item.name}
          >
            {item.name}
          </span>
        </div>

        {/* Mô tả nhân / đặc tính */}
        <div className="w-full min-h-[1.75rem] sm:min-h-[2rem] flex items-center justify-center">
          <span
            className="text-[9px] sm:text-[10px] text-white/80 line-clamp-2 leading-tight text-center break-words px-0.5"
            title={item.subTitle}
          >
            {item.subTitle}
          </span>
        </div>
      </div>

      {/* ── 3. NÚT HÀNH ĐỘNG ĐÁY THẺ (Bẻ bánh / Mở bao / Thu hoạch) ───────── */}
      <div
        className="w-full text-center text-[10px] sm:text-[11px] font-bold py-1.5 px-2 rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1 shrink-0 group-hover:brightness-110"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          color: 'var(--event-secondary, #FDE68A)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        {isSpinning && isSelected ? (
          <span className="flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3 animate-spin" /> {spinningLabel}
          </span>
        ) : (
          actionLabel
        )}
      </div>
    </button>
  );
}
