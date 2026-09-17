'use client';

import React from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  Layers,
  Gift,
  AlertCircle,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import type { EventAnalyticsResponse } from '@/features/events/types/eventTypes';

interface EventAnalyticsContentProps {
  analytics: EventAnalyticsResponse | null;
  loading: boolean;
  isFetching?: boolean;
  error?: string | null;
  onRefresh?: () => void;
}

const formatCurrency = (val?: number | null) => {
  if (!val) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(val);
};

export function EventAnalyticsContent({
  analytics,
  loading,
  isFetching = false,
  error,
  onRefresh,
}: EventAnalyticsContentProps) {
  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
        <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-sm font-medium text-stone-600">
          Đang tổng hợp số liệu thời gian thực...
        </p>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-stone-900">Không thể tải dữ liệu thống kê</h4>
          <p className="text-sm text-stone-500 mt-1">
            {error || 'Sự kiện không tồn tại hoặc đã bị xóa.'}
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Thử lại
          </button>
        )}
      </div>
    );
  }

  const { minigameStats } = analytics;
  const burnRate = minigameStats?.budgetBurnRate ?? 0;
  const burnRateColor =
    burnRate > 90 ? 'bg-rose-500' : burnRate > 70 ? 'bg-amber-500' : 'bg-emerald-500';

  const burnRateTextClass =
    burnRate > 90 ? 'text-rose-600' : burnRate > 70 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="space-y-6">
      {/* Header bar with live indicator & refresh button */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-50/80 p-4 rounded-xl border border-stone-200/70">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">{analytics.eventName}</h3>
            <span className="font-mono text-xs text-stone-500 px-2 py-0.5 bg-stone-200/60 rounded">
              {analytics.eventCode}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Dữ liệu được tổng hợp trực tiếp từ đơn hàng thực tế và lượt quay Minigame
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white hover:bg-stone-100 border border-stone-200 rounded-lg shadow-sm transition-all"
            title="Cập nhật số liệu mới nhất"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-emerald-600' : ''}`}
            />
            <span>Làm mới</span>
          </button>
        )}
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* GMV */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Tổng GMV Chiến Dịch
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 tracking-tight">
            {formatCurrency(analytics.totalGmv)}
          </div>
          <div className="mt-1 text-xs text-stone-500">Doanh số từ sản phẩm sự kiện</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
        </div>

        {/* Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Tổng Đơn Hàng
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 tracking-tight">
            {analytics.totalOrders.toLocaleString('vi-VN')}
          </div>
          <div className="mt-1 text-xs text-stone-500">Đơn hàng thanh toán thành công</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
        </div>

        {/* Participating Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Sản Phẩm Tham Gia
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 tracking-tight">
            {analytics.totalParticipatingProducts.toLocaleString('vi-VN')}
          </div>
          <div className="mt-1 text-xs text-stone-500">Trong các bộ sưu tập sự kiện</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 to-yellow-400" />
        </div>

        {/* Participating Shops */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Chủ Thể OCOP
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-black text-stone-900 tracking-tight">
            {analytics.totalParticipatingShops.toLocaleString('vi-VN')}
          </div>
          <div className="mt-1 text-xs text-stone-500">Gian hàng tham gia chiến dịch</div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-400" />
        </div>
      </div>

      {/* Minigame Analytics Section */}
      <div className="bg-white rounded-2xl border border-stone-200/80 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-emerald-600" />
            <h4 className="text-base font-bold text-stone-900">
              Ngân Sách & Hiệu Suất Minigame Vòng Quay OCOP
            </h4>
          </div>
          {minigameStats?.isActive ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Đang hoạt động
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-600">
              Chưa bật minigame
            </span>
          )}
        </div>

        {minigameStats ? (
          <div className="space-y-4">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs font-medium text-stone-600 mb-1.5">
                <span>
                  Đã giải ngân: <strong>{formatCurrency(minigameStats.totalClaimedValue)}</strong> /
                  Hạn mức: <strong>{formatCurrency(minigameStats.budgetLimit)}</strong>
                </span>
                <span className={`font-bold ${burnRateTextClass}`}>
                  Tỷ lệ đốt: {burnRate.toFixed(1)}%
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-3 overflow-hidden border border-stone-200/60">
                <div
                  className={`h-full transition-all duration-500 ${burnRateColor}`}
                  style={{ width: `${Math.min(100, Math.max(0, burnRate))}%` }}
                />
              </div>
            </div>

            {/* Sub stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div className="text-xs text-stone-500">Tổng Lượt Quay</div>
                <div className="text-lg font-bold text-stone-900 mt-0.5">
                  {minigameStats.totalSpins.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div className="text-xs text-stone-500">Lượt Trúng Thưởng</div>
                <div className="text-lg font-bold text-stone-900 mt-0.5">
                  {minigameStats.totalWinners.toLocaleString('vi-VN')}
                </div>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div className="text-xs text-stone-500">Tỷ Lệ Trúng Thưởng</div>
                <div className="text-lg font-bold text-stone-900 mt-0.5">
                  {minigameStats.totalSpins > 0
                    ? ((minigameStats.totalWinners / minigameStats.totalSpins) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/60">
                <div className="text-xs text-stone-500">Lượt Miễn Phí/Ngày</div>
                <div className="text-lg font-bold text-stone-900 mt-0.5">
                  {minigameStats.freeSpinsPerDay || 1} lượt
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center text-stone-400 text-sm">
            Sự kiện chưa được cấu hình Minigame quà tặng OCOP.
          </div>
        )}
      </div>

      {/* Top Products & Top Shops Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Products */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h4 className="text-base font-bold text-stone-900">Top Sản Phẩm OCOP Bán Chạy</h4>
          </div>
          {analytics.topProducts.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              Chưa phát sinh đơn hàng từ các sản phẩm trong sự kiện.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {analytics.topProducts.map((p, idx) => (
                <div key={p.productId} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0
                          ? 'bg-amber-100 text-amber-700'
                          : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">
                        {p.productName}
                      </div>
                      <div className="text-xs text-stone-500 truncate">{p.shopName}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-stone-900">
                      {formatCurrency(p.totalRevenue)}
                    </div>
                    <div className="text-xs text-stone-500">Đã bán: {p.soldQty}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top 5 Shops */}
        <div className="bg-white rounded-2xl border border-stone-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-purple-600" />
            <h4 className="text-base font-bold text-stone-900">Top Gian Hàng OCOP Dẫn Đầu</h4>
          </div>
          {analytics.topShops.length === 0 ? (
            <div className="py-8 text-center text-stone-400 text-sm">
              Chưa phát sinh đơn hàng từ các gian hàng trong sự kiện.
            </div>
          ) : (
            <div className="divide-y divide-stone-100">
              {analytics.topShops.map((s, idx) => (
                <div key={s.shopId ?? idx} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        idx === 0
                          ? 'bg-purple-100 text-purple-700'
                          : idx === 1
                            ? 'bg-slate-200 text-slate-700'
                            : idx === 2
                              ? 'bg-purple-50 text-purple-600'
                              : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-stone-900 truncate">
                        {s.shopName}
                      </div>
                      <div className="text-xs text-stone-500">{s.orderCount} đơn hàng hoàn tất</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-stone-900">
                      {formatCurrency(s.totalRevenue)}
                    </div>
                    <div className="text-xs text-stone-500">Doanh thu</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
