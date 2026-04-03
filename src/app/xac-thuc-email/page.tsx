'use client';

import { Suspense } from 'react';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { VerifyEmailForm } from '@/features/auth/components/VerifyEmailForm';

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-green-950 flex items-center justify-center text-white">
          Đang tải...
        </div>
      }
    >
      <AuthLayout
        subtitle="Xác thực tài khoản"
        linkHref="/dang-ky"
        linkActionText="Quay lại đăng ký"
        rightPanelLine1="XÁC THỰC EMAIL"
        rightPanelLine2="BẢO MẬT TÀI KHOẢN OCOP"
        linkText="Quay lại đăng nhập"
      >
        <VerifyEmailForm />
      </AuthLayout>
    </Suspense>
  );
}
