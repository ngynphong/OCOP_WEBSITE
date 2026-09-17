'use client';

import React from 'react';
import { X, Copy, ShoppingBag, Sparkles, Check, Gift, Ticket, Truck, Coins } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';
import type { MinigameReward } from '../../types/eventMinigameTypes';

interface MinigameRewardModalProps {
  isOpen: boolean;
  reward: MinigameReward | null;
  spinsLeft: number;
  onClose: () => void;
  onCopyCode: (code: string) => void;
  onPlayAgain?: () => void;
}

export function MinigameRewardModal({
  isOpen,
  reward,
  spinsLeft,
  onClose,
  onCopyCode,
  onPlayAgain,
}: MinigameRewardModalProps) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    setCopied(false);
  }, [reward]);

  if (!isOpen || !reward) return null;

  const handleCopy = () => {
    if (reward.voucherCode) {
      onCopyCode(reward.voucherCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isVoucherOrShip = reward.type === 'VOUCHER' || reward.type === 'FREESHIP';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog with Max Height Guard for Mobile */}
      <div className="relative w-full max-w-md max-h-[92vh] flex flex-col bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden z-10 border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon / Banner */}
        <div
          className="relative px-4 pt-6 pb-7 sm:px-6 sm:pt-8 sm:pb-10 text-center text-white overflow-hidden shrink-0"
          style={{
            background: `linear-gradient(135deg, ${reward.themeColor} 0%, #0F172A 140%)`,
          }}
        >
          {/* Subtle decoration circles */}
          <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10 blur-lg pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Icon Badge */}
          <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-2xl sm:rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-xl mb-2 sm:mb-3 animate-bounce duration-1000">
            {reward.type === 'VOUCHER' ? (
              <Ticket className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            ) : reward.type === 'FREESHIP' ? (
              <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            ) : reward.type === 'POINTS' ? (
              <Coins className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
            ) : (
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300" />
            )}
          </div>

          <span className="inline-block px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs border border-white/30 text-white mb-1">
            Chúc Mừng May Mắn!
          </span>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-tight">
            {reward.name}
          </h3>
        </div>

        {/* Reward Details Body */}
        <div className="p-4 sm:p-7 space-y-3.5 sm:space-y-5 text-center overflow-y-auto flex-1">
          {/* Voucher Box */}
          {reward.voucherCode && (
            <div className="p-3 sm:p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                Mã Giảm Giá Độc Quyền Của Bạn
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-amber-900 tracking-wider bg-white px-3 py-1 rounded-xl border border-amber-300 shadow-xs">
                  {reward.voucherCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition shadow-sm cursor-pointer flex items-center gap-1 text-xs font-bold"
                  title="Sao chép mã voucher"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="hidden sm:inline">{copied ? 'Đã sao chép' : 'Chép mã'}</span>
                </button>
              </div>
              <p className="text-xs text-amber-700 font-medium">{reward.description}</p>
            </div>
          )}

          {/* Loyalty Points info */}
          {reward.type === 'POINTS' && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <p className="text-sm font-bold text-emerald-800">
                +{reward.points} Điểm OCOP Loyalty
              </p>
              <p className="text-xs text-emerald-600">
                Điểm thưởng đã được ghi nhận vào tài khoản của bạn để đổi quà và giảm giá cho các
                đơn hàng tiếp theo.
              </p>
            </div>
          )}

          {/* Wish info */}
          {reward.type === 'WISH' && (
            <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
              <p className="text-sm font-bold text-purple-900">
                🌸 Vạn Sự Hanh Thông - Nông Sản Sung Túc
              </p>
              <p className="text-xs text-purple-700">
                Cảm ơn bạn đã đồng hành và ủng hộ nông sản đặc sản quê hương Việt Nam!
              </p>
            </div>
          )}

          {/* Commercial Condition Notice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-[11px] text-slate-500 text-left flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              {isVoucherOrShip
                ? 'Mã voucher được lưu tự động vào tài khoản. Hãy nhanh tay sử dụng trong thời gian diễn ra sự kiện để không bỏ lỡ ưu đãi.'
                : 'Mỗi ngày điểm danh sự kiện sẽ nhận thêm 1 lượt chơi miễn phí. Đơn hàng từ 300K tặng thêm +1 lượt.'}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
            {spinsLeft > 0 && onPlayAgain ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onPlayAgain}
                className="w-full sm:w-auto"
                leftIcon={<Gift className="w-4 h-4" />}
              >
                Chơi tiếp (Còn {spinsLeft} lượt)
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onClose}
                className="w-full sm:w-auto"
                leftIcon={<ShoppingBag className="w-4 h-4" />}
              >
                Mua sắm áp dụng mã ngay
              </Button>
            )}

            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
