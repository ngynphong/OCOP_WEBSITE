'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const GalleryCornerDecorSection: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-amber-600" />
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          2. Họa Tiết Trang Trí Góc Màn Hình & Banner
        </h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Cành Mai Vàng Rủ Góc Trái */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-amber-300 transition-colors">
          <div className="w-full h-32 bg-amber-50/50 rounded-lg p-2 flex items-center justify-center mb-2.5">
            <svg viewBox="0 0 200 200" className="w-28 h-28 drop-shadow-md">
              <path
                d="M0 0 Q60 30 110 55 T180 80 M70 38 Q95 70 125 95 M120 60 Q145 35 170 25"
                fill="none"
                stroke="#78350F"
                strokeWidth="4"
                strokeLinecap="round"
              />
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
              <circle cx="95" cy="45" r="4" fill="#84CC16" />
              <circle cx="140" cy="40" r="4" fill="#EF4444" />
            </svg>
          </div>
          <h5 className="text-xs font-bold text-gray-900">Cành Mai Vàng Rủ Góc Trái</h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Thân gỗ nâu, 3 đóa hoa mai nở rộ nhị đỏ, nụ xanh tài lộc.
          </p>
        </div>

        {/* Cặp Lồng Đèn Đỏ Góc Phải */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-red-300 transition-colors">
          <div className="w-full h-32 bg-red-50/40 rounded-lg p-2 flex items-center justify-center mb-2.5">
            <svg viewBox="0 0 160 180" className="w-24 h-28 drop-shadow-md">
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
          </div>
          <h5 className="text-xs font-bold text-gray-900">Cặp Lồng Đèn Đỏ Góc Phải</h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Đèn lồng truyền thống đung đưa với tua rua vàng kim may mắn.
          </p>
        </div>

        {/* Lồng Đèn Ông Sao Trung Thu */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-amber-300 transition-colors">
          <div className="w-full h-32 bg-amber-50/40 rounded-lg p-2 flex items-center justify-center mb-2.5">
            <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md">
              <line x1="80" y1="0" x2="80" y2="35" stroke="#DC2626" strokeWidth="2" />
              <polygon
                points="80,20 88,40 110,40 92,55 98,75 80,62 62,75 68,55 50,40 72,40"
                fill="#EF4444"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              <circle cx="80" cy="48" r="8" fill="#FDE047" />
            </svg>
          </div>
          <h5 className="text-xs font-bold text-gray-900">Lồng Đèn Ông Sao Trung Thu</h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Biểu tượng Trung Thu truyền thống, ánh đỏ viền vàng rực rỡ.
          </p>
        </div>

        {/* Bông Lúa Vàng Mùa Bội Thu */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-amber-300 transition-colors">
          <div className="w-full h-32 bg-amber-50/40 rounded-lg p-2 flex items-center justify-center mb-2.5">
            <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-md">
              <path d="M20 140 Q60 80 120 20" fill="none" stroke="#D97706" strokeWidth="3" />
              {[30, 50, 70, 90, 110].map((pos, i) => (
                <g key={i} transform={`translate(${pos}, ${140 - pos * 0.9})`}>
                  <ellipse
                    cx="-8"
                    cy="-3"
                    rx="8"
                    ry="4"
                    fill="#FBBF24"
                    stroke="#D97706"
                    strokeWidth="0.8"
                    transform="rotate(-30)"
                  />
                  <ellipse
                    cx="8"
                    cy="-3"
                    rx="8"
                    ry="4"
                    fill="#FBBF24"
                    stroke="#D97706"
                    strokeWidth="0.8"
                    transform="rotate(30)"
                  />
                </g>
              ))}
            </svg>
          </div>
          <h5 className="text-xs font-bold text-gray-900">Bông Lúa Vàng Mùa Bội Thu</h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Hạt ngọc trời trĩu hạt mạ vàng, đại diện cho nông sản OCOP.
          </p>
        </div>

        {/* Vầng Trăng Rằm Tỏa Hào Quang */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-amber-300 transition-colors">
          <div className="w-full h-32 bg-slate-900 rounded-lg p-2 flex items-center justify-center mb-2.5">
            <svg viewBox="0 0 160 160" className="w-24 h-24 drop-shadow-lg">
              <circle cx="80" cy="80" r="48" fill="#FEF9C3" opacity="0.25" />
              <circle cx="80" cy="80" r="38" fill="#FEF08A" opacity="0.9" />
            </svg>
          </div>
          <h5 className="text-xs font-bold text-gray-900">Vầng Trăng Rằm Tỏa Hào Quang</h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Ánh trăng tròn đêm rằm tháng 8, tạo không gian huyền ảo.
          </p>
        </div>

        {/* Tia Chớp Neon Mega Sale */}
        <div className="p-3.5 rounded-xl border border-gray-200 bg-white hover:border-purple-300 transition-colors">
          <div className="w-full h-32 bg-purple-50/50 rounded-lg p-2 flex items-center justify-center mb-2.5">
            <svg viewBox="0 0 120 120" className="w-20 h-20 drop-shadow-md">
              <polygon
                points="55,10 20,65 52,65 30,110 95,50 62,50"
                fill="#FACC15"
                stroke="#E11D48"
                strokeWidth="2.5"
              />
            </svg>
          </div>
          <h5 className="text-xs font-bold text-gray-900">Tia Chớp Neon Mega Sale</h5>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Đồ họa 3D bùng nổ, kích thích thị giác cho chiến dịch Flash Sale.
          </p>
        </div>
      </div>
    </div>
  );
};
