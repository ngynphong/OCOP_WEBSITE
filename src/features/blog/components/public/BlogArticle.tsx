'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock, FiEye, FiShare2, FiChevronLeft } from 'react-icons/fi';
import { usePublicBlogDetailQuery } from '../../hooks/usePublicBlogs';
import { useParams, useRouter } from 'next/navigation';

export const BlogArticle = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const { data: blogRes, isLoading, isError } = usePublicBlogDetailQuery(slug);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-500 font-bold uppercase tracking-widest animate-pulse">
        Đang tải nội dung...
      </div>
    );
  if (isError || !blogRes?.data)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Bài viết không tồn tại hoặc đã bị xóa.
      </div>
    );

  const blog = blogRes.data;

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Header / Hero */}
      <header className="relative h-[60vh] md:h-[70vh] bg-stone-900 flex items-end">
        {blog.thumbnailUrl && (
          <div className="absolute inset-0 opacity-50">
            <Image
              src={blog.thumbnailUrl}
              alt={blog.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-linear-to-t from-stone-900 via-stone-900/40 to-transparent" />
          </div>
        )}

        <div className="relative z-10 w-full max-w-4xl mx-auto px-6 pb-16">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-stone-300 hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <FiChevronLeft /> Quay lại
          </button>

          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags?.map((tag) => (
              <span
                key={tag.id}
                className="bg-[#D4AF37] text-[#113B28] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                {tag.name}
              </span>
            ))}
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-serif italic mb-6 leading-tight"
          >
            {blog.title}
          </motion.h1>

          <div className="flex flex-wrap items-center gap-6 text-stone-300 text-sm font-medium border-t border-stone-700 pt-6">
            <span className="flex items-center gap-2">
              <FiClock /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
            </span>
            <span className="flex items-center gap-2">
              <FiEye /> {blog.viewCount || 0} Lượt xem
            </span>
            <span className="flex items-center gap-2">Bởi: {blog.authorEmail || 'OCOP Admin'}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-16">
        <p className="text-xl md:text-2xl text-stone-500 font-serif italic leading-relaxed mb-12 border-l-4 border-[#D4AF37] pl-6">
          {blog.shortDesc}
        </p>

        {/* 
          Dùng prose của Tailwind để format bài viết (yêu cầu @tailwindcss/typography).
          Tạm thời dùng các class tuỳ chỉnh nếu chưa cài plugin typography. 
        */}
        <div
          className="prose prose-emerald prose-lg max-w-none text-stone-800 leading-relaxed font-serif
          prose-headings:font-black prose-headings:font-sans
          prose-a:text-emerald-600 prose-img:rounded-3xl prose-img:shadow-lg"
          dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br/>') }}
        />

        {/* Share & Interaction */}
        <div className="mt-16 pt-8 border-t border-stone-200 flex items-center justify-between">
          <div className="flex gap-2">
            {blog.tags?.map((tag) => (
              <span
                key={`bottom-${tag.id}`}
                className="bg-stone-50 text-stone-500 px-3 py-1 rounded-full text-xs font-bold border border-stone-100"
              >
                #{tag.name}
              </span>
            ))}
          </div>
          <button className="w-12 h-12 rounded-full bg-stone-50 border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors shadow-sm">
            <FiShare2 />
          </button>
        </div>
      </main>
    </article>
  );
};
