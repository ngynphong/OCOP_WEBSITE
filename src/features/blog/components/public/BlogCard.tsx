'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Clock, Image as ImageIcon } from 'lucide-react';
import { Blog } from '../../types/blogTypes';

interface BlogCardProps {
  blog: Blog;
  idx?: number;
  variant?: 'featured' | 'grid';
  formatDate?: (dateStr: string) => string;
  readingTime?: string;
}

const defaultFormatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
};

const defaultReadingTime = (blog: Blog) => {
  const text = (blog.content || '') + ' ' + (blog.shortDesc || '');
  const clean = text.replace(/<[^>]*>/g, '').trim();
  const words = clean ? clean.split(/\s+/).length : 0;
  const minutes = Math.max(3, Math.ceil(words / 180));
  return `${minutes} phút đọc`;
};

export const BlogCard = React.memo(
  ({
    blog,
    idx = 0,
    variant = 'grid',
    formatDate = defaultFormatDate,
    readingTime,
  }: BlogCardProps) => {
    const displayReadingTime = readingTime || defaultReadingTime(blog);
    const primaryTag = blog.tags?.[0]?.name || 'Tinh hoa OCOP';

    // FEATURED POST: 6:6 or 7:5 ratio split as defined in frame.md
    if (variant === 'featured') {
      return (
        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="group relative bg-white rounded-2xl border border-stone-200/80 p-5 lg:p-8 hover:border-stone-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.04)] transition-all duration-300"
        >
          <Link
            href={`/bai-viet/${blog.slug}`}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center cursor-pointer"
            aria-label={`Đọc bài viết nổi bật: ${blog.title}`}
          >
            {/* Hero Thumbnail (Tỷ lệ 16:9 - 7 cols) */}
            <div className="lg:col-span-7">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-100">
                {blog.thumbnailUrl ? (
                  <Image
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-300">
                    <ImageIcon className="w-12 h-12" aria-hidden="true" />
                  </div>
                )}
              </div>
            </div>

            {/* Content side (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <div className="mb-3">
                <span className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100/60">
                  {primaryTag}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2 leading-[1.25] tracking-tight">
                {blog.title}
              </h2>

              <p className="text-stone-600 text-base lg:text-lg leading-relaxed line-clamp-2 mt-3.5">
                {blog.shortDesc}
              </p>

              {/* Meta: 5 phút đọc · 18/09/2026 */}
              <div className="flex items-center gap-2 text-xs font-medium text-stone-500 mt-6">
                <Clock className="w-3.5 h-3.5 text-stone-400" aria-hidden="true" />
                <span>{displayReadingTime}</span>
                <span>·</span>
                <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
              </div>

              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 group-hover:text-emerald-700 transition-colors mt-5">
                <span>Đọc bài viết</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </motion.article>
      );
    }

    // DANH SÁCH BÀI VIẾT (Grid Card)
    return (
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: Math.min(idx * 0.05, 0.3), duration: 0.35 }}
        className="group flex flex-col h-full bg-white rounded-xl p-4 border border-stone-200/80 hover:border-stone-300 hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] transition-all duration-300 cursor-pointer"
      >
        <Link
          href={`/bai-viet/${blog.slug}`}
          className="flex flex-col h-full w-full"
          aria-label={`Đọc bài viết: ${blog.title}`}
        >
          {/* Ảnh tỷ lệ 16:9 */}
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-stone-100 mb-4">
            {blog.thumbnailUrl ? (
              <Image
                src={blog.thumbnailUrl}
                alt={blog.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <ImageIcon className="w-8 h-8" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="flex flex-col flex-grow">
            {/* Tag nhỏ (12px) */}
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-2">
              {primaryTag}
            </span>

            {/* H3: Tiêu đề bài (2 dòng) */}
            <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2 leading-snug mb-2">
              {blog.title}
            </h3>

            {/* Excerpt: Mô tả ngắn gọn (2 dòng) */}
            <p className="text-sm text-stone-600 leading-relaxed line-clamp-2 mb-4 flex-grow">
              {blog.shortDesc}
            </p>

            {/* Ngày · Thời gian đọc (12px) */}
            <div className="pt-3 mt-auto border-t border-stone-100 flex items-center justify-between text-xs text-stone-400 font-medium">
              <time dateTime={blog.createdAt}>{formatDate(blog.createdAt)}</time>
              <span>·</span>
              <span className="flex items-center gap-1 text-stone-500">
                <Clock className="w-3 h-3 text-stone-400" aria-hidden="true" />
                {displayReadingTime}
              </span>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  },
);

BlogCard.displayName = 'BlogCard';
