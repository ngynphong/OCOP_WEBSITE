'use client';

import { Suspense } from 'react';
import { VerifyOtpForm } from '@/features/auth/components/VerifyOtpForm';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-full bg-green-950 flex items-center justify-center text-white">
          Đang tải...
        </div>
      }
    >
      <AuthLayout
        subtitle="Chưa nhận được mã?"
        linkText="Gửi lại mã"
        linkActionText="Gửi lại mã"
        linkHref="/quen-mat-khau"
        rightPanelLine1="XÁC THỰC DANH TÍNH"
        rightPanelLine2="Đảm bảo an toàn"
      >
        <VerifyOtpForm />
      </AuthLayout>
    </Suspense>
  );
}
