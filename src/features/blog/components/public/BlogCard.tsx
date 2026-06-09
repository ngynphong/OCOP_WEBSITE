'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { Blog } from '../../types/blogTypes';

interface BlogCardProps {
  blog: Blog;
  idx?: number;
  variant?: 'featured' | 'compact' | 'grid';
}

export const BlogCard = React.memo(({ blog, idx = 0, variant = 'grid' }: BlogCardProps) => {
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden border border-stone-100 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] hover:-translate-y-1 transition-all duration-500"
      >
        <Link href={`/bai-viet/${blog.slug}`} className="flex flex-col md:flex-row w-full">
          <div className="relative w-full md:w-1/2 aspect-[16/10] md:aspect-auto overflow-hidden">
            {blog.thumbnailUrl ? (
              <Image
                src={blog.thumbnailUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
              />
            ) : (
              <div className="w-full h-full bg-stone-50 flex items-center justify-center text-stone-200">
                <FiImage className="w-16 h-16" />
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6">
              {blog.tags?.slice(0, 1).map((tag) => (
                <span
                  key={tag.id}
                  className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em]"
                >
                  {tag.name}
                </span>
              ))}
              <span className="w-1 h-1 rounded-full bg-stone-300" />
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-[1.2] group-hover:text-emerald-700 transition-colors duration-300">
              {blog.title}
            </h2>

            <p className="text-stone-500 text-lg leading-relaxed line-clamp-3 mb-8">
              {blog.shortDesc}
            </p>

            <div className="flex items-center gap-2 text-sm font-bold text-stone-900">
              Đọc bài viết{' '}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  if (variant === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1 }}
        className="group flex gap-4 items-center"
      >
        <Link href={`/bai-viet/${blog.slug}`} className="flex gap-4 items-center w-full">
          <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-stone-100">
            {blog.thumbnailUrl ? (
              <Image
                src={blog.thumbnailUrl}
                alt={blog.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <FiImage className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">
              {blog.tags?.[0]?.name || 'Tin tức'}
            </span>
            <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug mb-1">
              {blog.title}
            </h3>
            <span className="text-[10px] font-medium text-stone-400">
              {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group flex flex-col bg-white border border-transparent hover:border-emerald-100 p-3 rounded-2xl hover:shadow-[0_15px_30px_rgba(16,185,129,0.08)] hover:-translate-y-1 transition-all duration-500"
    >
      <Link href={`/bai-viet/${blog.slug}`} className="flex flex-col w-full">
        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 mb-6">
          {blog.thumbnailUrl ? (
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <FiImage className="w-10 h-10" />
            </div>
          )}
        </div>

        <div className="space-y-3 px-1">
          <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.15em]">
            {blog.tags?.[0]?.name || 'OCOP News'}
          </div>

          <h3 className="text-xl font-bold text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
            {blog.title}
          </h3>

          <p className="text-stone-500 text-sm leading-relaxed line-clamp-2">{blog.shortDesc}</p>
        </div>
      </Link>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';

import { FiImage } from 'react-icons/fi';
