'use client';

import React from 'react';
import { Sparkles, Flag, Moon, Snowflake } from 'lucide-react';
import { MOONCAKE_PETALS_R28 } from './galleryConstants';

export const GalleryMascotIconsSection: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-500" />
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          1. Cụm Linh Vật & Biểu Tượng Lễ Hội Đặc Trưng
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Bánh Chưng Xanh & Bao Lì Xì */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center gap-4">
          <div className="w-24 h-20 bg-white rounded-lg p-1.5 shadow-xs border border-amber-100 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 120 100" className="w-full h-full drop-shadow-md">
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
                <text
                  x="14"
                  y="25"
                  textAnchor="middle"
                  fill="#78350F"
                  fontSize="7"
                  fontWeight="bold"
                >
                  LỘC
                </text>
              </g>
            </svg>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase mb-1">
              <Sparkles className="w-3 h-3 text-red-600" />
              <span>Tết Cổ Truyền</span>
            </span>
            <h5 className="text-sm font-bold text-gray-900">Bánh Chưng Xanh & Bao Lì Xì</h5>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Bánh chưng vuông xanh lá dong buộc lạt tre đỏ, nhãn chữ TẾT vàng và phong bao lì xì
              chữ LỘC may mắn.
            </p>
          </div>
        </div>

        {/* Lá Cờ Đỏ Sao Vàng */}
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/40 flex items-center gap-4">
          <div className="w-24 h-20 bg-white rounded-lg p-1.5 shadow-xs border border-red-100 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 110 80" className="w-full h-full drop-shadow-md">
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
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase mb-1">
              <Flag className="w-3 h-3 text-red-600" />
              <span>Đại Lễ 2/9 • 30/4</span>
            </span>
            <h5 className="text-sm font-bold text-gray-900">Lá Cờ Đỏ Sao Vàng Việt Nam</h5>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Quốc kỳ đỏ thắm với ngôi sao vàng 5 cánh kiêu hãnh uốn lượn trong gió, tôn vinh bản
              sắc nông sản quê hương.
            </p>
          </div>
        </div>

        {/* Bánh Trung Thu Cổ Truyền */}
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center gap-4">
          <div className="w-24 h-20 bg-white rounded-lg p-1.5 shadow-xs border border-amber-100 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
              <g transform="translate(42, 40)">
                <circle cx="0" cy="0" r="30" fill="#D97706" stroke="#B45309" strokeWidth="2" />
                {MOONCAKE_PETALS_R28.map((petal) => (
                  <circle
                    key={petal.deg}
                    cx={petal.cx}
                    cy={petal.cy}
                    r="5.5"
                    fill="#F59E0B"
                    stroke="#B45309"
                    strokeWidth="0.8"
                  />
                ))}
                <circle cx="0" cy="0" r="23" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
                <circle cx="0" cy="0" r="16" fill="#F59E0B" opacity="0.6" />
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="#78350F"
                  fontSize="13"
                  fontWeight="bold"
                  fontFamily="serif"
                />
              </g>
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
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase mb-1">
              <Moon className="w-3 h-3 text-amber-700" />
              <span>Đêm Hội Trăng Rằm</span>
            </span>
            <h5 className="text-sm font-bold text-gray-900">Bánh Trung Thu Cổ Truyền</h5>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Bánh nướng vàng ươm hoa cúc truyền thống dập chữ THU cổ kính, kết hợp lồng đèn ông sao
              mini rực rỡ.
            </p>
          </div>
        </div>

        {/* Chú Người Tuyết Mùa Đông */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center gap-4">
          <div className="w-24 h-20 bg-white rounded-lg p-1.5 shadow-xs border border-blue-100 flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 90 90" className="w-full h-full drop-shadow-md">
              <circle cx="45" cy="62" r="24" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="45" cy="56" r="2.5" fill="#1E293B" />
              <circle cx="45" cy="67" r="2.5" fill="#1E293B" />
              <circle cx="45" cy="30" r="17" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
              <circle cx="39" cy="26" r="2" fill="#1E293B" />
              <circle cx="51" cy="26" r="2" fill="#1E293B" />
              <polygon points="45,29 57,32 45,34" fill="#F97316" />
              <path d="M31 42 Q45 49 59 42 L56 47 Q45 53 34 47 Z" fill="#DC2626" />
              <path d="M30 20 Q45 10 60 20 L58 8 Q45 3 32 8 Z" fill="#DC2626" />
              <circle cx="45" cy="3" r="4.5" fill="#FFFFFF" />
            </svg>
          </div>
          <div>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase mb-1">
              <Snowflake className="w-3 h-3 text-blue-600" />
              <span>Noel & Năm Mới</span>
            </span>
            <h5 className="text-sm font-bold text-gray-900">Chú Người Tuyết Mùa Đông</h5>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
              Chú người tuyết trắng muốt đội nón len đỏ ấm áp, quàng khăn đỏ xinh xắn mang không khí
              Giáng Sinh an lành.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
