import React from 'react';
import { Metadata } from 'next';
import { PolicyPageWrapper } from '@/features/policies/components/PolicyPageWrapper';

export const metadata: Metadata = {
  title: 'Chính sách đặt hàng | IES Connect OCOP',
  description: 'Hướng dẫn quy trình đặt hàng, thanh toán, vận chuyển và đổi trả tại sàn OCOP.',
};

export default function OrderingPolicyPage() {
  return <PolicyPageWrapper id={3} fallbackTitle="Chính sách đặt hàng" />;
}
