import React from 'react';
import { Metadata } from 'next';
import { SupportPageContent } from '@/features/support/components/SupportPageContent';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Hỗ trợ khách hàng | OCOP',
  description:
    'Trung tâm hỗ trợ khách hàng OCOP. Tìm kiếm câu trả lời nhanh chóng và liên hệ đội ngũ chăm sóc khách hàng.',
};

export default function SupportPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      <Header />

      <main className="flex-1 pb-20">
        <SupportPageContent />
      </main>

      <Footer />
    </div>
  );
}
