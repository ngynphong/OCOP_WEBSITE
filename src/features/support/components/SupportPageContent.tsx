'use client';

import React, { useState } from 'react';
import { SupportHero } from './SupportHero';
import { SupportCategories } from './SupportCategories';
import { FAQSection } from './FAQSection';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';

export const SupportPageContent = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      {/* 1. Hero Section with Search */}
      <SupportHero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      {/* 2. Categories Section */}
      <SupportCategories />

      {/* 3. FAQ Section (filtered by search) */}
      <FAQSection searchQuery={searchQuery} />

      {/* 4. Contact Section */}
      <section id="contact" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
    </>
  );
};
