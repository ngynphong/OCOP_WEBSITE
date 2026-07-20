'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiClock, FiChevronRight, FiHome } from 'react-icons/fi';
import { usePublicBlogDetailQuery } from '../../hooks/usePublicBlogs';
import { useParams } from 'next/navigation';
import { BlogLeftSidebar } from './BlogLeftSidebar';
import { BlogRightSidebar, TOCItem } from './BlogRightSidebar';

const generateTOCAndProcessHTML = (html: string) => {
  const toc: TOCItem[] = [];
  const seenIds = new Set<string>();

  const processedHtml = html.replace(/<h([2-3])[^>]*>(.*?)<\/h\1>/gi, (match, level, text) => {
    const cleanText = text.replace(/<[^>]+>/g, '').trim();
    // basic slugify for vietnamese
    let id = cleanText
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Handle duplicate IDs
    if (seenIds.has(id)) {
      let suffix = 1;
      while (seenIds.has(`${id}-${suffix}`)) {
        suffix++;
      }
      id = `${id}-${suffix}`;
    }
    seenIds.add(id);

    // Only push if there's text
    if (cleanText) {
      toc.push({ id, text: cleanText, level: parseInt(level) });
    }

    // add id attribute to the heading tag
    return `<h${level} id="${id}">${text}</h${level}>`;
  });
  return { toc, processedHtml };
};

export const BlogArticle = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { data: blogRes, isLoading, isError } = usePublicBlogDetailQuery(slug);

  const { toc, processedHtml } = (() => {
    if (!blogRes?.data?.content) return { toc: [], processedHtml: '' };
    return generateTOCAndProcessHTML(blogRes.data.content.replace(/\n/g, '<br/>'));
  })();

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

  // Assuming 250 words per minute reading speed
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 250));

  return (
    <article className="bg-stone-50 min-h-screen pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Breadcrumbs - Moved above the grid for better mobile flow */}
        <nav className="flex items-center text-sm text-stone-500 font-medium mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link
            href="/"
            className="hover:text-emerald-600 transition-colors flex items-center gap-1"
          >
            <FiHome /> Trang chủ
          </Link>
          <FiChevronRight className="mx-2 text-stone-300" />
          <Link href="/bai-viet" className="hover:text-emerald-600 transition-colors">
            Bài viết
          </Link>
          <FiChevronRight className="mx-2 text-stone-300" />
          <span className="text-slate-900 truncate max-w-[200px] md:max-w-md">{blog.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          {/* Left Column - Actions */}
          <div className="lg:col-span-1 hidden lg:block sticky top-38 z-10">
            <BlogLeftSidebar />
          </div>

          {/* Center Column - Main Content */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-stone-100">
            {/* Tags / Categories */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-4xl lg:text-[44px] font-black text-slate-900 mb-6 leading-[1.2]"
            >
              {blog.title}
            </motion.h1>

            {/* Unified Meta Info */}
            <div className="flex flex-wrap items-center gap-4 text-stone-500 text-sm font-medium mb-8 pb-6 border-b border-stone-100">
              <span className="flex items-center gap-2 text-slate-700">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800 font-bold text-xs uppercase">
                  {blog.authorEmail ? blog.authorEmail.charAt(0) : 'O'}
                </div>
                {blog.authorEmail?.split('@')[0] || 'OCOP Admin'}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-stone-300">•</span>
              <span className="flex items-center gap-1.5">
                <FiClock className="text-emerald-600" />{' '}
                {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="hidden sm:flex items-center gap-1 text-stone-300">•</span>
              <span className="flex items-center gap-1.5">{readTime} phút đọc</span>
              <span className="hidden sm:flex items-center gap-1 text-stone-300">•</span>
              <span className="flex items-center gap-1.5">{blog.viewCount || 0} lượt xem</span>
            </div>

            {/* Short Description */}
            {blog.shortDesc && (
              <p className="text-lg md:text-xl text-stone-600 font-medium leading-relaxed mb-10 border-l-4 border-emerald-500 pl-4 py-1">
                {blog.shortDesc}
              </p>
            )}

            {/* Hero Image */}
            {blog.thumbnailUrl && (
              <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-sm border border-stone-100 group">
                <Image
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  priority
                />
              </div>
            )}

            {/* Article Body */}
            <div
              className="prose prose-emerald prose-lg max-w-none text-stone-700 leading-loose
              prose-headings:font-black prose-headings:text-slate-900 prose-headings:font-sans
              prose-headings:scroll-mt-32
              prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-2xl prose-img:shadow-md prose-img:border prose-img:border-stone-100
              prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:text-emerald-800 prose-blockquote:font-medium prose-blockquote:not-italic
              prose-strong:text-slate-900 prose-strong:font-bold"
              dangerouslySetInnerHTML={{ __html: processedHtml }}
            />

            {/* Bottom Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-stone-100">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
                  Chủ đề bài viết
                </h3>
                <div className="flex flex-wrap gap-2">
                  {blog.tags.map((tag) => (
                    <span
                      key={`bottom-${tag.id}`}
                      className="bg-stone-50 text-stone-600 px-4 py-2 rounded-xl text-sm font-medium border border-stone-200 hover:border-emerald-300 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="lg:col-span-3 sticky top-38 z-10">
            <BlogRightSidebar toc={toc} />
          </div>
        </div>
      </div>
    </article>
  );
};
