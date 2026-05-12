import React from 'react';
import { Metadata } from 'next';
import { SupportHero } from '@/features/support/components/SupportHero';
import { SupportCategories } from '@/features/support/components/SupportCategories';
import { FAQSection } from '@/features/support/components/FAQSection';
import { ContactForm } from '@/features/support/components/ContactForm';
import { ContactInfo } from '@/features/support/components/ContactInfo';
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
        {/* 1. Hero Section */}
        <SupportHero />

        {/* 2. Categories Section */}
        <SupportCategories />

        {/* 3. FAQ Section */}
        <FAQSection />

        {/* 4. Contact Section */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
              Bạn vẫn cần sự trợ giúp?
            </h2>
            <p className="mt-2 text-stone-500 max-w-2xl mx-auto">
              Nếu bạn không tìm thấy câu trả lời trong phần FAQ, đừng ngần ngại gửi yêu cầu hỗ trợ
              trực tiếp. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Contact Info (Left Side on Desktop) */}
            <div className="lg:col-span-5 h-full">
              <ContactInfo />
            </div>

            {/* Contact Form (Right Side on Desktop) */}
            <div className="lg:col-span-7 h-full">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
