'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useNotificationSettings } from '../hooks/useNotificationSettings';
import {
  FiBell,
  FiMail,
  FiPackage,
  FiMessageSquare,
  FiTrendingUp,
  FiShoppingBag,
  FiTag,
  FiDollarSign,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { UpdateNotificationSettingRequest } from '../types/settings';

const ToggleSwitch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2',
        checked ? 'bg-green-600' : 'bg-stone-200',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <span className="sr-only">Toggle</span>
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  );
};

export const NotificationSettings = () => {
  const { settings, isLoading, updateSettings } = useNotificationSettings();

  if (isLoading || !settings) {
    return (
      <div className="py-20 flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-stone-200 border-t-green-700 rounded-full animate-spin" />
        <p className="text-stone-500 font-medium animate-pulse">Đang tải cấu hình...</p>
      </div>
    );
  }

  const handleToggle = (key: keyof UpdateNotificationSettingRequest, value: boolean) => {
    updateSettings({ [key]: value });
  };

  const sections = [
    {
      title: 'Kênh nhận thông báo',
      description: 'Chọn các phương thức bạn muốn nhận thông báo từ hệ thống.',
      items: [
        {
          key: 'pushEnabled',
          label: 'Thông báo đẩy (Push)',
          description: 'Nhận thông báo trực tiếp trên trình duyệt hoặc điện thoại.',
          icon: FiBell,
        },
        {
          key: 'emailEnabled',
          label: 'Email',
          description: 'Nhận email tóm tắt thông báo quan trọng hàng ngày.',
          icon: FiMail,
        },
      ],
    },
    {
      title: 'Đơn hàng & Giao nhận',
      description: 'Thông báo liên quan đến trạng thái mua và bán hàng.',
      items: [
        {
          key: 'orderUpdate',
          label: 'Cập nhật đơn hàng',
          description: 'Thông báo khi đơn hàng được xác nhận, hủy hoặc hoàn thành.',
          icon: FiPackage,
        },
        {
          key: 'paymentNotify',
          label: 'Thông báo thanh toán',
          description: 'Xác nhận thanh toán thành công hoặc thất bại.',
          icon: FiDollarSign,
        },
        {
          key: 'shipmentNotify',
          label: 'Cập nhật vận chuyển',
          description: 'Khi đơn hàng bắt đầu giao hoặc đã giao thành công.',
          icon: FiTrendingUp,
        },
      ],
    },
    {
      title: 'Tương tác & Cộng đồng',
      description: 'Thông báo khi có tương tác từ người dùng khác hoặc hệ thống.',
      items: [
        {
          key: 'chatMessage',
          label: 'Tin nhắn Chat',
          description: 'Khi có khách hàng hoặc cửa hàng nhắn tin cho bạn.',
          icon: FiMessageSquare,
        },
        {
          key: 'reviewNotify',
          label: 'Đánh giá sản phẩm',
          description: 'Khi sản phẩm của bạn nhận được đánh giá mới.',
          icon: FiMessageSquare,
        },
        {
          key: 'systemNotify',
          label: 'Thông báo hệ thống',
          description: 'Cập nhật chính sách, bảo trì hoặc sự kiện quan trọng.',
          icon: FiBell,
        },
      ],
    },
    {
      title: 'Khuyến mãi & Ưu đãi',
      description: 'Không bỏ lỡ các cơ hội tiết kiệm và kiếm tiền.',
      items: [
        {
          key: 'voucherNotify',
          label: 'Mã giảm giá mới',
          description: 'Khi có mã giảm giá phù hợp với bạn.',
          icon: FiTag,
        },
        {
          key: 'wishlistPriceDrop',
          label: 'Sản phẩm yêu thích giảm giá',
          description: 'Khi sản phẩm trong danh sách yêu thích giảm giá.',
          icon: FiShoppingBag,
        },
        {
          key: 'affiliateCommission',
          label: 'Hoa hồng tiếp thị liên kết',
          description: 'Khi có đơn hàng thành công từ link chia sẻ của bạn.',
          icon: FiDollarSign,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-stone-900">Cài đặt thông báo</h2>
        <p className="text-sm text-stone-500 mt-1">
          Tùy chỉnh các loại thông báo bạn muốn nhận để không bị làm phiền.
        </p>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm shadow-stone-200/50"
          >
            <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
              <h3 className="font-bold text-stone-900">{section.title}</h3>
              <p className="text-xs text-stone-500 mt-0.5">{section.description}</p>
            </div>
            <div className="divide-y divide-stone-100">
              {section.items.map((item) => {
                const ItemIcon = item.icon;
                const isChecked = Boolean(settings[item.key as keyof typeof settings]);

                return (
                  <div key={item.key} className="p-6 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center shrink-0">
                      <ItemIcon className="text-stone-500" size={18} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-stone-900 text-sm">{item.label}</h4>
                      <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      <ToggleSwitch
                        checked={isChecked}
                        onChange={(val) =>
                          handleToggle(item.key as keyof UpdateNotificationSettingRequest, val)
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
