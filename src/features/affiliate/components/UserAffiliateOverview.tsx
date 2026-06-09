import React, { useMemo } from 'react';
import { FiDollarSign, FiPercent, FiTrendingUp } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { AffiliateAccount } from '../types/affiliateTypes';
import { Button } from '@/components/ui/AppButton';
import { cn } from '@/lib/utils';
import { formatCurrencyVND } from '@/utils/format';

interface UserAffiliateOverviewProps {
  account: AffiliateAccount;
}

export const UserAffiliateOverview: React.FC<UserAffiliateOverviewProps> = ({ account }) => {
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  const stats = useMemo(
    () => [
      {
        label: 'Số dư khả dụng',
        value: formatCurrencyVND(account.availableBalance),
        icon: FiDollarSign,
        color: 'bg-emerald-500',
      },
      {
        label: 'Hoa hồng chờ',
        value: formatCurrencyVND(account.pendingBalance || 0),
        icon: FiTrendingUp,
        color: 'bg-orange-500',
      },
      {
        label: 'Tổng thu nhập',
        value: formatCurrencyVND(account.totalEarned),
        icon: FiTrendingUp,
        color: 'bg-blue-500',
      },
      {
        label: 'Tổng đã rút',
        value: formatCurrencyVND(account.totalWithdrawn),
        icon: FiDollarSign,
        color: 'bg-amber-500',
      },
      {
        label: 'Tỉ lệ hoa hồng',
        value: `${account.commissionRate}%`,
        icon: FiPercent,
        color: 'bg-purple-500',
      },
    ],
    [account],
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 md:p-6 rounded-xl border border-stone-100 shadow-xl shadow-stone-200/50 flex items-center gap-3 md:gap-4"
          >
            <div className={cn(stat.color, 'p-2.5 md:p-3 rounded-xl text-white shadow-lg')}>
              <stat.icon size={20} className="md:w-6 md:h-6" />
            </div>
            <div>
              <p className="text-[11px] md:text-sm text-stone-500 font-medium">{stat.label}</p>
              <p className="text-lg md:text-xl font-bold text-stone-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Affiliate Link Card */}
      <div className="bg-white p-5 md:p-8 rounded-xl border border-stone-100 shadow-xl shadow-stone-200/50">
        <h3 className="text-base md:text-lg font-bold text-stone-900 mb-3 md:mb-4 flex items-center gap-2">
          <FiTrendingUp className="text-emerald-600" />
          Link Giới Thiệu Của Bạn
        </h3>
        <p className="text-stone-500 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
          Chia sẻ đường dẫn này để nhận hoa hồng từ mỗi đơn hàng thành công của người được giới
          thiệu.
        </p>

        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          <div className="flex-1 flex items-center gap-3 bg-stone-50 px-4 md:px-5 py-3 md:py-4 rounded-xl border border-stone-200 font-mono text-[11px] md:text-sm text-stone-600 overflow-hidden break-all">
            {account.affiliateCode}
          </div>
          <div className="flex gap-2">
            <Button
              variant="primary"
              onClick={() => copyToClipboard(account.affiliateCode, 'Đã copy mã giới thiệu')}
              className="rounded-xl h-10 md:h-full px-4 md:px-6 w-full md:w-auto text-xs md:text-sm"
            >
              Copy Mã
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
