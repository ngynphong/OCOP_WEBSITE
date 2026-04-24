'use client';

import React, { useEffect, useMemo } from 'react';
import { useInfinitePublicBlogsQuery, usePublicBlogTagsQuery } from '../../hooks/usePublicBlogs';
import { useInView } from 'react-intersection-observer';
import { BlogCard } from './BlogCard';
import { FiLoader, FiSearch } from 'react-icons/fi';
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
      <div className="py-24 text-center text-red-500">
        Đã xảy ra lỗi khi tải danh sách bài viết.
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Featured Header */}
      <section className="bg-[#113B28] py-24 md:py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white italic mb-6"
          >
            Chuyện nghề & <br className="hidden md:block" /> Hành trình OCOP
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-emerald-50/80 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Khám phá những câu chuyện đầy cảm hứng từ những người nông dân, nghệ nhân và hợp tác xã
            trên khắp Việt Nam.
          </motion.p>
        </div>
      </section>

      {/* Main Feed */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2 mb-16 justify-center">
          <button className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#113B28] text-white shadow-lg">
            Tất cả
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              className="px-6 py-2.5 rounded-full text-sm font-bold bg-stone-50 text-stone-500 border border-stone-200 hover:bg-stone-100 hover:text-stone-900 transition-colors"
            >
              {tag.name}
            </button>
          ))}
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-24 bg-stone-50 rounded-[40px] border border-stone-100">
            <FiSearch className="mx-auto text-4xl text-stone-300 mb-4" />
            <h3 className="text-xl font-bold text-stone-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-stone-500">Chúng tôi đang cập nhật thêm nội dung mới.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {blogs.map((blog, idx) => (
              <BlogCard key={`${blog.id}-${idx}`} blog={blog} idx={idx % 12} />
            ))}
          </div>
        )}

        {/* Loading Indicator for Infinite Scroll */}
        <div ref={ref} className="mt-16 text-center">
          {isFetchingNextPage && (
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="animate-spin text-2xl text-emerald-600" />
              <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">
                Đang tải thêm...
              </p>
            </div>
          )}
          {!hasNextPage && blogs.length > 0 && (
            <div className="py-12 border-t border-stone-100 mt-12">
              <p className="text-sm font-bold text-stone-400">Bạn đã xem hết bài viết.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
