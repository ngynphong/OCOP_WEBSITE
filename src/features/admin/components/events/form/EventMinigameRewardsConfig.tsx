'use client';

import React from 'react';
import { AlertTriangle, Check, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type { MinigameReward } from '@/features/events/types/eventMinigameTypes';

export interface EventMinigameRewardsConfigProps {
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

export function EventMinigameRewardsConfig({
  activeRewards,
  totalRewardWeight,
  onRewardFieldChange,
  onRewardWeightChange,
  onResetDefaultRewards,
}: EventMinigameRewardsConfigProps) {
  return (
    <div className="pt-2 border-t border-gray-100 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
            Cơ Cấu Phần Thưởng (Tùy Chỉnh Toàn Bộ)
          </span>
          <p className="text-[11px] text-gray-500 mt-0.5">
            Điều chỉnh tên, loại, giá trị, mã voucher, mô tả và xác suất % của từng phần thưởng.
            Thuật toán Server-side Weighted Random sẽ căn cứ theo cấu hình này.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <span
            className={`text-xs font-bold px-3 py-1.5 rounded-full border flex items-center gap-1.5 transition-colors ${
              totalRewardWeight > 100
                ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-red-400'
                : totalRewardWeight === 100
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
            }`}
          >
            {totalRewardWeight > 100 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-bounce" />
            ) : totalRewardWeight === 100 ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            )}
            Tổng: {totalRewardWeight}%
            {totalRewardWeight > 100 ? (
              <span className="text-[10px] font-bold text-red-600">(VƯỢT 100% - KHÓA LƯU)</span>
            ) : totalRewardWeight !== 100 ? (
              <span className="text-[10px] font-medium text-amber-600">(Nên đạt 100%)</span>
            ) : null}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onResetDefaultRewards}
            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-gray-500" />}
            className="text-xs text-gray-600 hover:text-gray-900 border-gray-300 cursor-pointer"
            title="Khôi phục toàn bộ phần thưởng về mặc định"
          >
            Khôi phục mặc định
          </Button>
        </div>
      </div>

      {/* Danh sách phần thưởng – full editable */}
      <div className="space-y-3">
        {activeRewards.map((item, idx) => {
          const isHighValue = item.value >= 50000;
          const isWish = item.type === 'WISH';
          const isVoucher = item.type === 'VOUCHER' || item.type === 'FREESHIP';

          return (
            <div
              key={item.id || idx}
              className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                isHighValue
                  ? 'border-amber-300/80 shadow-sm'
                  : isWish
                    ? 'border-gray-200'
                    : 'border-gray-200 shadow-2xs'
              }`}
            >
              {/* Header strip */}
              <div
                className={`px-3.5 py-2 flex items-center justify-between ${
                  isHighValue ? 'bg-amber-50' : isWish ? 'bg-gray-50' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-slate-800 text-white">
                    #{idx + 1}
                  </span>
                  <span
                    className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                    style={{ backgroundColor: item.themeColor || '#6B7280' }}
                    title={`Màu lát cắt: ${item.themeColor}`}
                  />
                  <span className="text-xs font-bold text-gray-800 truncate max-w-[180px]">
                    {item.name || `Phần thưởng ${idx + 1}`}
                  </span>
                </div>
                {/* Tỷ lệ inline nổi bật */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[11px] font-bold text-gray-500">Tỷ lệ:</span>
                  <div className="relative w-20">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={1}
                      value={item.weight ?? 0}
                      onChange={(e) => onRewardWeightChange(item.id, Number(e.target.value))}
                      className="w-full pl-2.5 pr-5 py-1 text-xs font-black text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-right bg-white"
                    />
                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 pointer-events-none">
                      %
                    </span>
                  </div>
                </div>
              </div>

              {/* Editable body */}
              <div className="px-3.5 py-3 bg-white border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Tên phần thưởng */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Tên phần thưởng
                  </label>
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => onRewardFieldChange(item.id, 'name', e.target.value)}
                    placeholder="Ví dụ: Voucher 50K OCOP"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Loại phần thưởng */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Loại phần thưởng
                  </label>
                  <select
                    value={item.type}
                    onChange={(e) =>
                      onRewardFieldChange(item.id, 'type', e.target.value as typeof item.type)
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  >
                    <option value="VOUCHER">Voucher giảm giá</option>
                    <option value="FREESHIP">Freeship</option>
                    <option value="POINTS">Điểm thưởng</option>
                    <option value="WISH">Chúc may mắn</option>
                  </select>
                </div>

                {/* Giá trị */}
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Giá trị (VNĐ / Điểm)
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={item.value ?? 0}
                    onChange={(e) => onRewardFieldChange(item.id, 'value', Number(e.target.value))}
                    placeholder="0"
                    className="w-full px-2.5 py-1.5 text-xs font-semibold text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Mã voucher – chỉ show khi VOUCHER hoặc FREESHIP */}
                {isVoucher && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Mã voucher
                    </label>
                    <input
                      type="text"
                      value={item.voucherCode ?? ''}
                      onChange={(e) =>
                        onRewardFieldChange(item.id, 'voucherCode', e.target.value.toUpperCase())
                      }
                      placeholder="Ví dụ: OCOP50K"
                      className="w-full px-2.5 py-1.5 text-xs font-mono font-bold text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 uppercase"
                    />
                  </div>
                )}

                {/* Đơn hàng tối thiểu – chỉ khi VOUCHER hoặc FREESHIP */}
                {isVoucher && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                      Đơn tối thiểu (VNĐ)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1}
                      value={item.minOrderValue ?? 0}
                      onChange={(e) =>
                        onRewardFieldChange(item.id, 'minOrderValue', Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full px-2.5 py-1.5 text-xs font-semibold text-gray-800 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* Mô tả */}
                <div className={isVoucher ? '' : 'sm:col-span-2 lg:col-span-3'}>
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">
                    Mô tả hiển thị cho khách
                  </label>
                  <input
                    type="text"
                    value={item.description ?? ''}
                    onChange={(e) => onRewardFieldChange(item.id, 'description', e.target.value)}
                    placeholder="Ví dụ: Áp dụng cho đơn hàng từ 199.000đ"
                    className="w-full px-2.5 py-1.5 text-xs text-gray-600 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
