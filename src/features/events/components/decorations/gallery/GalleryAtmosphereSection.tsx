'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

export const GalleryAtmosphereSection: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-pink-500" />
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
          3. Hiệu Ứng Khí Quyển Động & Cánh Hoa Rơi
        </h4>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {/* Hoa Mai Vàng */}
        <div className="p-3 rounded-xl border border-gray-200 bg-amber-50/40 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center mb-1.5">
            <svg viewBox="0 0 40 40" className="w-10 h-10 drop-shadow-xs">
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
          </div>
          <span className="text-xs font-bold text-gray-800">Hoa Mai Vàng</span>
          <span className="text-[10px] text-gray-500">Tết Cổ Truyền</span>
        </div>

        {/* Hoa Đào Phai */}
        <div className="p-3 rounded-xl border border-gray-200 bg-pink-50/40 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center mb-1.5">
            <svg viewBox="0 0 30 30" className="w-9 h-9 drop-shadow-xs">
              <path
                d="M15 2 C8 7, 5 16, 12 25 C15 28, 17 28, 19 25 C26 16, 23 7, 15 2 Z"
                fill="#F472B6"
                stroke="#EC4899"
                strokeWidth="0.8"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-800">Hoa Đào Phai</span>
          <span className="text-[10px] text-gray-500">Xuân Miền Bắc</span>
        </div>

        {/* Lá Lúa Vàng */}
        <div className="p-3 rounded-xl border border-gray-200 bg-amber-50/40 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center mb-1.5">
            <svg viewBox="0 0 32 32" className="w-9 h-9 drop-shadow-xs">
              <path
                d="M6 26 C12 20, 24 16, 28 6 C20 10, 10 18, 6 26 Z"
                fill="#F59E0B"
                stroke="#D97706"
                strokeWidth="1"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-800">Lá Lúa Vàng</span>
          <span className="text-[10px] text-gray-500">Mùa Bội Thu</span>
        </div>

        {/* Ánh Sao Thu */}
        <div className="p-3 rounded-xl border border-gray-200 bg-yellow-50/40 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center mb-1.5">
            <svg viewBox="0 0 24 24" className="w-8 h-8">
              <polygon
                points="12,2 15,9 22,12 15,15 12,22 9,15 2,12 9,9"
                fill="#FDE047"
                stroke="#F59E0B"
                strokeWidth="0.5"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-800">Ánh Sao Thu</span>
          <span className="text-[10px] text-gray-500">Đêm Trung Thu</span>
        </div>

        {/* Pháo Giấy */}
        <div className="p-3 rounded-xl border border-gray-200 bg-purple-50/40 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center gap-1 mb-1.5">
            <div className="w-3.5 h-3.5 rounded-2xs bg-red-500 rotate-12" />
            <div className="w-3 h-3 rounded-2xs bg-yellow-400 -rotate-12" />
            <div className="w-3.5 h-3.5 rounded-2xs bg-purple-600 rotate-45" />
          </div>
          <span className="text-xs font-bold text-gray-800">Pháo Giấy</span>
          <span className="text-[10px] text-gray-500">Siêu Sale</span>
        </div>

        {/* Bông Tuyết */}
        <div className="p-3 rounded-xl border border-gray-200 bg-blue-50/40 text-center flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center mb-1.5">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-400" fill="none">
              <path
                d="M12 2v20M2 12h20M5 5l14 14M5 19L19 5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="text-xs font-bold text-gray-800">Bông Tuyết</span>
          <span className="text-[10px] text-gray-500">Giáng Sinh</span>
        </div>
      </div>
    </div>
  );
};
