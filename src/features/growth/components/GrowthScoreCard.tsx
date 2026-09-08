'use client';

import React from 'react';
import { Target, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface Props {
  score?: number;
  tier?: string;
  isLoading?: boolean;
}

export const GrowthScoreCard: React.FC<Props> = ({
  score = 70,
  tier = 'TIẾN TRIỂN TỐT',
  isLoading = false,
}) => {
  if (isLoading) {
    return <div className="h-64 rounded-2xl bg-gray-100 animate-pulse" />;
  }

  // Determine progress color
  const getColorClass = () => {
    if (score >= 80) return 'text-emerald-600 stroke-emerald-500';
    if (score >= 60) return 'text-blue-600 stroke-blue-500';
    return 'text-amber-600 stroke-amber-500';
  };

  const getTierMessage = () => {
    if (score >= 80) {
      return 'Gian hàng của bạn đạt chuẩn Top Seller OCOP. Tiếp tục duy trì để được ưu tiên vị trí trang chủ và chiến dịch.';
    }
    if (score >= 60) {
      return 'Gian hàng hoạt động ổn định. Cải thiện thêm câu chuyện OCOP và tồn kho để nâng hạng lên Xuất sắc (+15đ).';
    }
    return 'Gian hàng cần tối ưu gấp hồ sơ sản phẩm, câu chuyện OCOP và bổ sung mã giảm giá kích hoạt doanh số.';
  };

  const pillars = [
    {
      name: 'Hồ sơ & Bản sắc OCOP',
      score: score >= 75 ? 90 : 65,
      status: score >= 75 ? 'Tốt' : 'Cần tối ưu',
    },
    { name: 'Uy tín & Đánh giá', score: score >= 60 ? 85 : 70, status: 'Ổn định' },
    {
      name: 'Tốc độ hoàn tất đơn',
      score: score >= 70 ? 80 : 60,
      status: score >= 70 ? 'Nhanh' : 'Trung bình',
    },
    { name: 'Sức khoẻ kho hàng', score: score >= 80 ? 95 : 75, status: 'Sẵn sàng' },
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-sm">Điểm Năng Lực Tăng Trưởng</h3>
            <p className="text-xs text-gray-500">Đo lường toàn diện hiệu quả kinh doanh OCOP</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          {tier}
        </span>
      </div>

      {/* Circular Score and Tier Message */}
      <div className="my-4 flex flex-col sm:flex-row items-center gap-5">
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-gray-100"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={getColorClass()}
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-2xl font-black text-gray-900">{score}</span>
            <span className="text-[10px] text-gray-400 block font-medium">/ 100</span>
          </div>
        </div>

        <div className="flex-1 w-full">
          <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 p-3.5 rounded-xl border border-gray-100">
            {getTierMessage()}
          </p>
        </div>
      </div>

      {/* 4 Pillars - Full width across card to prevent any text truncation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-2">
        {pillars.map((p, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-xl bg-gray-50/80 border border-gray-100/80 flex flex-col gap-1.5"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-700 font-medium whitespace-nowrap">{p.name}</span>
              <span className="font-bold text-gray-900">{p.score}%</span>
            </div>
            <div className="w-full h-1.5 bg-gray-200/70 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  p.score >= 80 ? 'bg-emerald-500' : p.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${p.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          {score >= 70 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
          <span>
            {score >= 70
              ? 'Đủ điều kiện tham gia Flash Sale OCOP'
              : 'Cần đạt 70+ điểm để mở khóa quyền lợi'}
          </span>
        </div>
        <a
          href="#opportunities-section"
          className="font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
        >
          Cải thiện điểm <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
