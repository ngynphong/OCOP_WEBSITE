'use client';

import React from 'react';
import { FiHeart, FiShare2, FiBookmark, FiType, FiPrinter } from 'react-icons/fi';

interface BlogLeftSidebarProps {
  bookmarkCount?: number;
}

export const BlogLeftSidebar = ({ bookmarkCount }: BlogLeftSidebarProps) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center gap-4 hidden lg:flex">
      <button
        className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm group"
        title="Yêu thích"
      >
        <FiHeart className="text-xl group-hover:scale-110 transition-transform" />
      </button>

      <button
        className="w-12 h-12 rounded-full bg-white border border-stone-200 flex flex-col items-center justify-center text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm group"
        title="Lưu bài viết"
      >
        <FiBookmark
          className={`text-lg group-hover:scale-110 transition-transform ${bookmarkCount !== undefined ? 'mb-0.5' : ''}`}
        />
        {bookmarkCount !== undefined && (
          <span className="text-[9px] font-bold">{bookmarkCount}</span>
        )}
      </button>

      <div className="w-8 h-px bg-stone-200 my-2"></div>

      <button
        className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm group"
        title="Chia sẻ"
      >
        <FiShare2 className="text-xl group-hover:scale-110 transition-transform" />
      </button>

      <button
        className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm group"
        title="Tùy chỉnh cỡ chữ"
      >
        <FiType className="text-xl group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={handlePrint}
        className="w-12 h-12 rounded-full bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm group"
        title="In bài viết"
      >
        <FiPrinter className="text-xl group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};
