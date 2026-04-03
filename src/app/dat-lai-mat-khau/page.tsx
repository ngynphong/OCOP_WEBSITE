'use client';

import { Suspense } from 'react';
import { ResetPasswordForm } from '@/features/auth/components/ResetPasswordForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-green-950 flex items-center justify-center text-white">
          Đang tải...
        </div>
      }
    >
      <AuthLayout
        subtitle="Nhớ ra mật khẩu?"
        linkText="Đăng nhập"
        linkActionText="Đăng nhập"
        linkHref="/dang-nhap"
        rightPanelLine1="MẬT KHẨU MỚI"
        rightPanelLine2="An toàn & Bảo mật"
      >
        <ResetPasswordForm />
      </AuthLayout>
    </Suspense>
  );
}
