'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export const SupportHero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic tìm kiếm FAQ có thể thêm sau
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="relative bg-[#113B28] text-white overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-[100px]"></div>
        <div className="absolute bottom-10 -right-20 w-80 h-80 rounded-full bg-[#D4AF37]/20 blur-[100px]"></div>
      </div>

      <div className="relative max-w-3xl mx-auto text-center z-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-white">
          Xin chào, chúng tôi có thể giúp gì cho bạn?
        </h1>
        <p className="text-lg sm:text-xl text-emerald-50/80 mb-8 max-w-2xl mx-auto">
          Tìm kiếm câu trả lời nhanh chóng hoặc gửi yêu cầu hỗ trợ trực tiếp đến đội ngũ OCOP.
        </p>

        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-[#113B28] transition-colors">
            <Search className="h-5 w-5" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-4 rounded-full border-0 text-stone-900 bg-white shadow-xl focus:ring-4 focus:ring-[#D4AF37]/30 placeholder:text-stone-400 sm:text-lg transition-shadow"
            placeholder="Nhập câu hỏi, ví dụ: 'Thời gian giao hàng'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="absolute inset-y-2 right-2 flex items-center px-6 py-2 bg-gradient-to-r from-[#D4AF37] to-[#C2A052] text-[#113B28] font-bold rounded-full hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D4AF37] transition-all shadow-md active:scale-95 cursor-pointer"
          >
            Tìm kiếm
          </button>
        </form>
      </div>
    </div>
  );
};
