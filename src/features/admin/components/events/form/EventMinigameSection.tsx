'use client';

import React from 'react';
import { Gift, Trophy } from 'lucide-react';
import type {
  MinigameType,
  MinigameReward,
  MysteryPickConceptId,
  MysteryPickItem,
  MysteryPickConceptConfig,
} from '@/features/events/types/eventMinigameTypes';
import { EventMysteryPickSettings } from './EventMysteryPickSettings';
import { EventMinigameRewardsConfig } from './EventMinigameRewardsConfig';

export interface EventMinigameSectionProps {
  minigameActive: boolean;
  onMinigameActiveChange: (active: boolean) => void;
  minigameType: MinigameType;
  onMinigameTypeChange: (type: MinigameType) => void;
  effectiveMysteryPickConcept: MysteryPickConceptConfig;
  mysteryPickConcept: MysteryPickConceptId;
  onSelectMysteryConcept: (conceptId: MysteryPickConceptId) => void;
  customPickTitle: string;
  onCustomPickTitleChange: (val: string) => void;
  customPickSubtitle: string;
  onCustomPickSubtitleChange: (val: string) => void;
  customPickItems: MysteryPickItem[];
  onPickItemChange: (index: number, field: keyof MysteryPickItem, val: string) => void;
  onResetPickItemsToConcept: () => void;
  minOrderValueForBonusSpin: number;
  onMinOrderValueForBonusSpinChange: (val: number) => void;
  spinsPerOrder: number;
  onSpinsPerOrderChange: (val: number) => void;
  freeSpinsPerDay: number;
  onFreeSpinsPerDayChange: (val: number) => void;
  minigameBudgetLimit: number;
  onMinigameBudgetLimitChange: (val: number) => void;
  minigameTotalClaimed: number | string;
  activeRewards: MinigameReward[];
  totalRewardWeight: number;
  onRewardFieldChange: <K extends keyof MinigameReward>(
    id: string,
    field: K,
    value: MinigameReward[K],
  ) => void;
  onRewardWeightChange: (id: string, weight: number) => void;
  onResetDefaultRewards: () => void;
}

export function EventMinigameSection({
  minigameActive,
  onMinigameActiveChange,
  minigameType,
  onMinigameTypeChange,
  effectiveMysteryPickConcept,
  mysteryPickConcept,
  onSelectMysteryConcept,
  customPickTitle,
  onCustomPickTitleChange,
  customPickSubtitle,
  onCustomPickSubtitleChange,
  customPickItems,
  onPickItemChange,
  onResetPickItemsToConcept,
  minOrderValueForBonusSpin,
  onMinOrderValueForBonusSpinChange,
  spinsPerOrder,
  onSpinsPerOrderChange,
  freeSpinsPerDay,
  onFreeSpinsPerDayChange,
  minigameBudgetLimit,
  onMinigameBudgetLimitChange,
  minigameTotalClaimed,
  activeRewards,
  totalRewardWeight,
  onRewardFieldChange,
  onRewardWeightChange,
  onResetDefaultRewards,
}: EventMinigameSectionProps) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-gray-200/80 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              6. Cấu Hình Minigame Lễ Hội & Vòng Quay May Mắn
            </h2>
            <p className="text-xs text-gray-500">
              Thiết lập trò chơi tương tác, quy định nhận lượt quay và kiểm soát ngân sách giải
              thưởng
            </p>
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={minigameActive}
            onChange={(e) => onMinigameActiveChange(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-xs font-bold text-gray-800">Kích hoạt Minigame</span>
        </label>
      </div>

      {minigameActive ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. Chọn thể loại Minigame */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Loại Trò Chơi Mặc Định
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => onMinigameTypeChange('WHEEL_SPIN')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition cursor-pointer ${
                  minigameType === 'WHEEL_SPIN'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">Vòng Quay May Mắn</h3>
                    {minigameType === 'WHEEL_SPIN' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Vòng quay 8 ô màu sắc với hiệu ứng âm thanh, kim chỉ và phân bổ xác suất thông
                    minh.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onMinigameTypeChange('LUCKY_ENVELOPE')}
                className={`p-4 rounded-xl border text-left flex items-start gap-3.5 transition cursor-pointer ${
                  minigameType === 'LUCKY_ENVELOPE'
                    ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-gray-900">
                      Bốc Quà Theo Concept ({effectiveMysteryPickConcept.tabLabel})
                    </h3>
                    {minigameType === 'LUCKY_ENVELOPE' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500 text-white">
                        Đang chọn
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    Mở quà tùy biến theo chủ đề sự kiện (Bánh Trung Thu, Bao Lì Xì, Hộp Quà Bí Ẩn,
                    Nông Sản Vàng...).
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Cấu hình Chủ Đề Concept Cho Trò Bốc Quà (Mystery Pick) */}
          <EventMysteryPickSettings
            effectiveMysteryPickConcept={effectiveMysteryPickConcept}
            mysteryPickConcept={mysteryPickConcept}
            onSelectMysteryConcept={onSelectMysteryConcept}
            customPickTitle={customPickTitle}
            onCustomPickTitleChange={onCustomPickTitleChange}
            customPickSubtitle={customPickSubtitle}
            onCustomPickSubtitleChange={onCustomPickSubtitleChange}
            customPickItems={customPickItems}
            onPickItemChange={onPickItemChange}
            onResetPickItemsToConcept={onResetPickItemsToConcept}
          />

          {/* 3. Điều kiện & lượt quay */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Đơn Tối Thiểu Nhận Lượt (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={50000}
                value={minOrderValueForBonusSpin}
                onChange={(e) => onMinOrderValueForBonusSpinChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                required
              />
              <p className="mt-1.5 text-[11px] text-amber-700 font-medium">
                Đơn từ {minOrderValueForBonusSpin.toLocaleString('vi-VN')} đ được tặng lượt quay.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Lượt Quay Tặng Mỗi Đơn Hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={spinsPerOrder}
                onChange={(e) => onSpinsPerOrderChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                required
              />
              <p className="mt-1.5 text-[11px] text-gray-500">
                Tự động cộng khi khách mua đơn hoàn tất.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Lượt Quay Miễn Phí Mỗi Ngày <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                max={5}
                value={freeSpinsPerDay}
                onChange={(e) => onFreeSpinsPerDayChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                required
              />
              <p className="mt-1.5 text-[11px] text-gray-500">
                Khách hàng đăng nhập nhận mỗi ngày 1 lần.
              </p>
            </div>
          </div>

          {/* 4. Ngân sách giải thưởng */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Hạn Mức Ngân Sách Minigame (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1000000}
                step={5000000}
                value={minigameBudgetLimit}
                onChange={(e) => onMinigameBudgetLimitChange(Number(e.target.value))}
                className="w-full px-4 py-2.5 text-gray-800 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
                required
              />
              <p className="mt-1.5 text-[11px] text-gray-500">
                Trần ngân sách: {minigameBudgetLimit.toLocaleString('vi-VN')} đ. Tự động khóa
                voucher khi chạm trần.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Đã Phát Thưởng Thực Tế
              </label>
              <div className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm font-semibold text-gray-700 flex items-center justify-between">
                <span>{Number(minigameTotalClaimed || 0).toLocaleString('vi-VN')} đ</span>
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {minigameBudgetLimit > 0
                    ? `${Math.min(100, Math.round(((Number(minigameTotalClaimed) || 0) / minigameBudgetLimit) * 100))}% trần`
                    : '0%'}
                </span>
              </div>
              <p className="mt-1.5 text-[11px] text-gray-400">
                Tổng giá trị quà & voucher đã cấp phát cho khách hàng.
              </p>
            </div>
          </div>

          {/* 5. Cơ cấu phần thưởng */}
          <EventMinigameRewardsConfig
            activeRewards={activeRewards}
            totalRewardWeight={totalRewardWeight}
            onRewardFieldChange={onRewardFieldChange}
            onRewardWeightChange={onRewardWeightChange}
            onResetDefaultRewards={onResetDefaultRewards}
          />
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200/60 text-xs text-gray-500 text-center">
          Minigame đang tắt cho sự kiện này. Khách hàng sẽ không nhìn thấy vòng quay may mắn hay
          phong bao lì xì.
        </div>
      )}
    </section>
  );
}
