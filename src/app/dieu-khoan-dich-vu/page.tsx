import React from 'react';
import { Metadata } from 'next';
import { PolicyPageWrapper } from '@/features/policies/components/PolicyPageWrapper';

export const metadata: Metadata = {
  title: 'Điều khoản dịch vụ | IES Connect OCOP',
  description:
    'Quy định và điều khoản sử dụng khi tham gia mua bán trên sàn thương mại điện tử OCOP.',
};

export default function TermsOfServicePage() {
  return <PolicyPageWrapper slug="dieu-khoan-dich-vu" fallbackTitle="Điều khoản dịch vụ" />;
}
