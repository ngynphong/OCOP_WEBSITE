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
        subtitle=""
        linkText=""
        linkActionText=""
        linkHref=""
        rightPanelLine1="XÁC THỰC DANH TÍNH"
        rightPanelLine2="Đảm bảo an toàn"
      >
        <VerifyOtpForm />
      </AuthLayout>
    </Suspense>
  );
}
