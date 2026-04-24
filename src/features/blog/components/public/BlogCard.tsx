'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiArrowRight } from 'react-icons/fi';
import { Blog } from '../../types/blogTypes';

interface BlogCardProps {
  blog: Blog;
  idx?: number;
}

export const BlogCard = React.memo(({ blog, idx = 0 }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.1 }}
      className="group"
    >
      <Link href={`/bai-viet/${blog.slug}`} className="block">
        <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden bg-stone-100 mb-6">
          {blog.thumbnailUrl ? (
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <FiImage className="w-12 h-12" />
            </div>
          )}

          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            {blog.tags?.slice(0, 2).map((tag) => (
              <span
                key={tag.id}
                className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-emerald-700 uppercase tracking-widest shadow-sm"
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <FiClock /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="flex items-center gap-1.5">
              <FiEye /> {blog.viewCount || 0} Lượt xem
            </span>
          </div>

          <h3 className="text-2xl font-black text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-tight">
            {blog.title}
          </h3>

          <p className="text-stone-500 leading-relaxed line-clamp-2">{blog.shortDesc}</p>

          <div className="flex items-center gap-2 text-sm font-bold text-emerald-600 pt-2">
            Đọc tiếp <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';

// Add FiImage import if missing above
import { FiImage } from 'react-icons/fi';
