'use client';

import React, { useEffect, useMemo } from 'react';
import { useInfinitePublicBlogsQuery, usePublicBlogTagsQuery } from '../../hooks/usePublicBlogs';
import { useInView } from 'react-intersection-observer';
import { BlogCard } from './BlogCard';
import { FiSearch } from 'react-icons/fi';
import { motion } from 'framer-motion';

const BlogSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="aspect-[4/3] bg-stone-100 rounded-[32px]" />
    <div className="space-y-3">
      <div className="h-4 bg-stone-100 rounded w-1/3" />
      <div className="h-8 bg-stone-100 rounded w-full" />
      <div className="h-4 bg-stone-100 rounded w-2/3" />
    </div>
  </div>
);

export const BlogFeed = () => {
  const { ref, inView } = useInView();
  const { data: tagsRes } = usePublicBlogTagsQuery();
  const tags = useMemo(() => tagsRes?.data || [], [tagsRes]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfinitePublicBlogsQuery({ pageSize: 12 });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const blogs = useMemo(() => data?.pages.flatMap((page) => page.data.content) || [], [data]);

  // Logic to separate blogs for the new layout
  const primaryFeatured = blogs[0];
  const secondaryFeatured = blogs.slice(1, 4);
  const remainingBlogs = blogs.slice(4);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {[...Array(6)].map((_, i) => (
            <BlogSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-24 text-center text-red-500 font-bold">
        Đã xảy ra lỗi khi tải danh sách bài viết. Vui lòng thử lại sau.
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAF8] min-h-screen">
      {/* Inspirational Hero */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 mb-6 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-[0.2em]"
          >
            Chuyện nghề & Hành trình
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-stone-900 mb-8 leading-[1.1] tracking-tight"
          >
            Nơi lưu giữ những <br className="hidden md:block" />
            <span className="text-emerald-700 italic">giá trị bản sắc</span> Việt
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-stone-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Khám phá những câu chuyện đầy cảm hứng từ những người nông dân, nghệ nhân và hành trình
            đưa sản phẩm OCOP vươn xa.
          </motion.p>
        </div>
      </section>

      {/* Featured Section - Latest News */}
      {blogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
          <div className="flex flex-col gap-12">
            <div className="flex items-end justify-between border-b border-stone-200 pb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900">Bài viết mới nhất</h2>
              <div className="hidden md:block h-[1px] flex-grow mx-8 bg-stone-100" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Primary Featured */}
              <div className="lg:col-span-8">
                {primaryFeatured && <BlogCard blog={primaryFeatured} variant="featured" />}
              </div>

              {/* Secondary Featured List */}
              <div className="lg:col-span-4 flex flex-col gap-8">
                {secondaryFeatured.map((blog, idx) => (
                  <BlogCard key={blog.id} blog={blog} idx={idx} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Feed with Filters */}
      <section className="bg-white border-t border-stone-100 pt-24 pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-12">Tất cả bài viết</h2>

            {/* Category Filter - Refined */}
            <div className="flex flex-wrap gap-3 justify-center">
              <button className="px-6 py-2.5 rounded-full text-xs font-bold bg-stone-900 text-white shadow-xl shadow-stone-900/10 transition-all hover:scale-105 active:scale-95">
                Tất cả chủ đề
              </button>
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className="px-6 py-2.5 rounded-full text-xs font-bold bg-white text-stone-500 border border-stone-200 hover:border-emerald-500 hover:text-emerald-700 hover:bg-emerald-50/50 transition-all hover:scale-105 active:scale-95"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {remainingBlogs.length === 0 && blogs.length <= 4 ? (
            blogs.length === 0 ? (
              <div className="text-center py-24 bg-stone-50 rounded-[40px] border border-stone-100">
                <FiSearch className="mx-auto text-4xl text-stone-300 mb-4" />
                <h3 className="text-xl font-bold text-stone-900 mb-2">Chưa có bài viết nào</h3>
                <p className="text-stone-500">Chúng tôi đang cập nhật thêm nội dung mới.</p>
              </div>
            ) : null
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {remainingBlogs.map((blog, idx) => (
                <BlogCard key={`${blog.id}-${idx}`} blog={blog} idx={idx % 12} variant="grid" />
              ))}
            </div>
          )}

          {/* Infinite Scroll Indicator */}
          <div ref={ref} className="mt-24 text-center">
            {isFetchingNextPage ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                  Đang tải thêm câu chuyện...
                </p>
              </div>
            ) : hasNextPage ? (
              <div className="h-20" />
            ) : (
              blogs.length > 0 && (
                <div className="pt-16 border-t border-stone-50 mt-16">
                  <p className="text-sm font-medium text-stone-400 italic">
                    Bạn đã khám phá hết các câu chuyện của chúng tôi.
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
