'use client';

import React from 'react';
import { Sparkles, TrendingUp, Award } from 'lucide-react';

interface Props {
  growthScore?: number;
  growthTier?: string;
  totalOpportunities?: number;
}

export const GrowthOverviewHeader: React.FC<Props> = ({
  growthScore = 70,
  growthTier = 'TIẾN TRIỂN TỐT',
  totalOpportunities = 0,
}) => {
  const getTierColor = () => {
    if (growthScore >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (growthScore >= 60) return 'bg-blue-50 text-blue-700 border-blue-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-green-900 p-6 sm:p-8 text-white shadow-xl">
      {/* Decorative background element */}
      <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      <div className="absolute right-1/4 -top-12 h-48 w-48 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-emerald-200">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seller Growth Center • Tăng trưởng toàn diện</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Trung tâm Tăng trưởng OCOP
            <TrendingUp className="w-7 h-7 text-emerald-300 hidden sm:inline" />
          </h1>

          <p className="text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
            Hệ thống phát hiện cơ hội tự động theo mô hình{' '}
            <span className="font-semibold text-white">
              Đăng dễ → Bán được → Làm nhàn → Tiền rõ → Được đẩy
            </span>
            . Giúp sản phẩm OCOP tiếp cận đúng khách hàng và tối đa hóa doanh thu.
          </p>
        </div>

        <div className="flex flex-row md:flex-col items-center md:items-end gap-3 shrink-0">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
            <Award className="w-5 h-5 text-amber-300" />
            <div>
              <div className="text-[11px] uppercase tracking-wider text-emerald-200 font-medium">
                Hạng năng lực
              </div>
              <div className="text-sm font-bold text-white">{growthTier}</div>
            </div>
          </div>

          {totalOpportunities > 0 && (
            <div className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getTierColor()}`}>
              {totalOpportunities} cơ hội hành động mở
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
