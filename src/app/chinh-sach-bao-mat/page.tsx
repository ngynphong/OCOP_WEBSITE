import React from 'react';
import { Metadata } from 'next';
import { PolicyPageWrapper } from '@/features/policies/components/PolicyPageWrapper';

export const metadata: Metadata = {
  title: 'Chính sách bảo mật | IES Connect OCOP',
  description:
    'Chính sách bảo mật thông tin cá nhân của người dùng tại sàn thương mại điện tử OCOP.',
};

export default function PrivacyPolicyPage() {
  return <PolicyPageWrapper id={2} fallbackTitle="Chính sách bảo mật" />;
}
