import React from 'react';
import { NotificationSettings } from '@/features/notifications/components/NotificationSettings';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cài đặt thông báo - OCOP Dashboard',
  description: 'Tùy chỉnh cấu hình nhận thông báo OCOP',
};

export default function NotificationSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl w-full">
      <NotificationSettings />
    </div>
  );
}
