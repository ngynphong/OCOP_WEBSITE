'use client';

import React from 'react';
import { X, Sparkles, Eye } from 'lucide-react';

interface EventSvgGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventSvgGalleryModal({ isOpen, onClose }: EventSvgGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Bộ Sưu Tập Đồ Họa SVG Sự Kiện OCOP
              </h3>
              <p className="text-xs text-gray-500">
                Toàn bộ vector SVG được thiết kế độc quyền, tối ưu hóa kích thước nhẹ và sắc nét
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Nhóm 1: Cụm Linh Vật Hero */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🌟</span>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                1. Cụm Linh Vật & Biểu Tượng Lễ Hội Đặc Trưng
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Bánh chưng & Lì xì (Tết) */}
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
                      <path
                        d="M0 0 L14 12 L28 0 Z"
                        fill="#EF4444"
                        stroke="#B91C1C"
                        strokeWidth="0.8"
                      />
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
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase mb-1">
                    🧧 Tết Cổ Truyền
                  </span>
                  <h5 className="text-sm font-bold text-gray-900">Bánh Chưng Xanh & Bao Lì Xì</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Bánh chưng vuông xanh lá dong buộc lạt tre đỏ, nhãn chữ TẾT vàng và phong bao lì
                    xì chữ LỘC may mắn.
                  </p>
                </div>
              </div>

              {/* 2. Lá cờ Việt Nam (2/9, 30/4) */}
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
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase mb-1">
                    🇻🇳 Đại Lễ 2/9 • 30/4
                  </span>
                  <h5 className="text-sm font-bold text-gray-900">Lá Cờ Đỏ Sao Vàng Việt Nam</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Quốc kỳ đỏ thắm với ngôi sao vàng 5 cánh kiêu hãnh uốn lượn trong gió, tôn vinh
                    bản sắc nông sản quê hương.
                  </p>
                </div>
              </div>

              {/* 3. Bánh Trung Thu (Trung Thu) */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex items-center gap-4">
                <div className="w-24 h-20 bg-white rounded-lg p-1.5 shadow-xs border border-amber-100 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 100 80" className="w-full h-full drop-shadow-md">
                    <g transform="translate(42, 40)">
                      <circle
                        cx="0"
                        cy="0"
                        r="30"
                        fill="#D97706"
                        stroke="#B45309"
                        strokeWidth="2"
                      />
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
                      <circle
                        cx="0"
                        cy="0"
                        r="23"
                        fill="#FBBF24"
                        stroke="#B45309"
                        strokeWidth="1.2"
                      />
                      <circle cx="0" cy="0" r="16" fill="#F59E0B" opacity="0.6" />
                      <text
                        x="0"
                        y="5"
                        textAnchor="middle"
                        fill="#78350F"
                        fontSize="13"
                        fontWeight="bold"
                        fontFamily="serif"
                      ></text>
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
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 uppercase mb-1">
                    🥮 Đêm Hội Trăng Rằm
                  </span>
                  <h5 className="text-sm font-bold text-gray-900">Bánh Trung Thu Cổ Truyền</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Bánh nướng vàng ươm hoa cúc truyền thống dập chữ THU cổ kính, kết hợp lồng đèn
                    ông sao mini rực rỡ.
                  </p>
                </div>
              </div>

              {/* 4. Người Tuyết (Noel) */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 flex items-center gap-4">
                <div className="w-24 h-20 bg-white rounded-lg p-1.5 shadow-xs border border-blue-100 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 90 90" className="w-full h-full drop-shadow-md">
                    <circle
                      cx="45"
                      cy="62"
                      r="24"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      strokeWidth="1.5"
                    />
                    <circle cx="45" cy="56" r="2.5" fill="#1E293B" />
                    <circle cx="45" cy="67" r="2.5" fill="#1E293B" />
                    <circle
                      cx="45"
                      cy="30"
                      r="17"
                      fill="#FFFFFF"
                      stroke="#CBD5E1"
                      strokeWidth="1.5"
                    />
                    <circle cx="39" cy="26" r="2" fill="#1E293B" />
                    <circle cx="51" cy="26" r="2" fill="#1E293B" />
                    <polygon points="45,29 57,32 45,34" fill="#F97316" />
                    <path d="M31 42 Q45 49 59 42 L56 47 Q45 53 34 47 Z" fill="#DC2626" />
                    <path d="M30 20 Q45 10 60 20 L58 8 Q45 3 32 8 Z" fill="#DC2626" />
                    <circle cx="45" cy="3" r="4.5" fill="#FFFFFF" />
                  </svg>
                </div>
                <div>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 uppercase mb-1">
                    ❄️ Noel & Năm Mới
                  </span>
                  <h5 className="text-sm font-bold text-gray-900">Chú Người Tuyết Mùa Đông</h5>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Chú người tuyết trắng muốt đội nón len đỏ ấm áp, quàng khăn đỏ xinh xắn mang
                    không khí Giáng Sinh an lành.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Nhóm 2: Họa Tiết Góc Màn Hình (Corner Stickers) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                2. Họa Tiết Trang Trí Góc Màn Hình & Banner
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Cành mai vàng */}
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

              {/* Lồng đèn đỏ */}
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
                      <path
                        d="M-8 30 L-8 55 M0 30 L0 60 M8 30 L8 55"
                        stroke="#F59E0B"
                        strokeWidth="2"
                      />
                    </g>
                    <line x1="115" y1="0" x2="115" y2="25" stroke="#DC2626" strokeWidth="1.5" />
                    <g transform="translate(115, 48) scale(0.75)">
                      <rect x="-16" y="-30" width="32" height="6" rx="2" fill="#F59E0B" />
                      <ellipse cx="0" cy="0" rx="24" ry="28" fill="#DC2626" />
                      <rect x="-16" y="24" width="32" height="6" rx="2" fill="#F59E0B" />
                      <path
                        d="M-8 30 L-8 55 M0 30 L0 60 M8 30 L8 55"
                        stroke="#F59E0B"
                        strokeWidth="2"
                      />
                    </g>
                  </svg>
                </div>
                <h5 className="text-xs font-bold text-gray-900">Cặp Lồng Đèn Đỏ Góc Phải</h5>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Đèn lồng truyền thống đung đưa với tua rua vàng kim may mắn.
                </p>
              </div>

              {/* Lồng đèn ông sao */}
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
                    <circle cx="80,48" cy="48" r="8" fill="#FDE047" />
                  </svg>
                </div>
                <h5 className="text-xs font-bold text-gray-900">Lồng Đèn Ông Sao Trung Thu</h5>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  Biểu tượng Trung Thu truyền thống, ánh đỏ viền vàng rực rỡ.
                </p>
              </div>

              {/* Bông lúa vàng */}
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

              {/* Vầng trăng rằm */}
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

              {/* Tia chớp Mega Sale */}
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

          {/* Nhóm 3: Hạt Khí Quyển Rơi (Atmospheric Particles) */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">🌸</span>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                3. Hiệu Ứng Khí Quyển Động & Cánh Hoa Rơi
              </h4>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {/* Hoa mai */}
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

              {/* Hoa đào */}
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

              {/* Lá lúa vàng */}
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

              {/* Ánh sao */}
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

              {/* Confetti */}
              <div className="p-3 rounded-xl border border-gray-200 bg-purple-50/40 text-center flex flex-col items-center">
                <div className="w-12 h-12 flex items-center justify-center gap-1 mb-1.5">
                  <div className="w-3.5 h-3.5 rounded-2xs bg-red-500 rotate-12" />
                  <div className="w-3 h-3 rounded-2xs bg-yellow-400 -rotate-12" />
                  <div className="w-3.5 h-3.5 rounded-2xs bg-purple-600 rotate-45" />
                </div>
                <span className="text-xs font-bold text-gray-800">Pháo Giấy</span>
                <span className="text-[10px] text-gray-500">Siêu Sale</span>
              </div>

              {/* Bông tuyết */}
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
        </div>
      </div>
    </div>
  );
}
