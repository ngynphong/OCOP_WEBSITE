'use client';

import React from 'react';
import { Loader2, Newspaper, Sparkles } from 'lucide-react';
import { useBlogFeed } from '../../hooks/useBlogFeed';
import { BlogCard } from './BlogCard';

// Skeleton matching the 16:9 ratio and layout structure
const BlogFeaturedSkeleton = () => (
  <div className="bg-white rounded-2xl border border-stone-200/80 p-5 lg:p-8 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
      <div className="lg:col-span-7">
        <div className="aspect-video w-full rounded-xl bg-stone-100" />
      </div>
      <div className="lg:col-span-5 space-y-4">
        <div className="h-5 bg-stone-100 rounded-md w-28" />
        <div className="h-9 bg-stone-100 rounded-lg w-full" />
        <div className="h-9 bg-stone-100 rounded-lg w-4/5" />
        <div className="h-4 bg-stone-100 rounded w-full" />
        <div className="h-4 bg-stone-100 rounded w-2/3" />
        <div className="h-4 bg-stone-100 rounded w-40 pt-2" />
      </div>
    </div>
  </div>
);

const BlogGridSkeleton = () => (
  <div className="bg-white rounded-xl p-4 border border-stone-200/80 space-y-4 animate-pulse">
    <div className="aspect-video w-full rounded-lg bg-stone-100" />
    <div className="h-4 bg-stone-100 rounded w-20" />
    <div className="h-6 bg-stone-100 rounded w-full" />
    <div className="h-4 bg-stone-100 rounded w-3/4" />
    <div className="h-4 bg-stone-100 rounded w-1/2 pt-2" />
  </div>
);

export const BlogFeed = () => {
  const {
    tags,
    selectedTagId,
    blogs,
    featuredBlog,
    regularBlogs,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    loadMore,
    handleSelectTag,
    formatDate,
    getReadingTime,
  } = useBlogFeed(10);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="space-y-12">
          <BlogFeaturedSkeleton />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(6)].map((_, i) => (
              <BlogGridSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex p-4 rounded-full bg-red-50 text-red-600 mb-4">
          <Newspaper className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Không thể tải danh sách bài viết</h2>
        <p className="text-stone-500 max-w-md mx-auto mb-6 text-sm">
          Đã có lỗi xảy ra trong quá trình truy xuất dữ liệu. Quý độc giả vui lòng thử lại sau.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-full text-sm font-semibold border border-stone-300 text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer"
        >
          Tải lại trang
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-24">
      {/* ─────────────────────────────────────────────────────────────
          1. HEADER & INTRO SECTION (as specified in frame.md)
          - Category Tag
          - H1: Góc nhìn chuyên sâu & Tinh hoa bản sắc
          - Đoạn giới thiệu ngắn 1-2 dòng, font 18px, màu xám trung tính
          - Filter bar: [ Tất cả ] [ Tag 1 ] [ Tag 2 ] ...
      ───────────────────────────────────────────────────────────── */}
      <section className="pt-12 sm:pt-16 pb-10 border-b border-stone-200/60 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Category Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>Chuyên mục OCOP & Tinh hoa bản sắc</span>
            </div>

            {/* H1: Góc nhìn chuyên sâu & Tinh hoa bản sắc */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-[1.15] mb-4">
              Góc nhìn chuyên sâu & Tinh hoa bản sắc
            </h1>

            {/* Đoạn giới thiệu ngắn 1-2 dòng, font 18px (text-lg), màu xám trung tính (text-muted) */}
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
              Hành trình gìn giữ giá trị văn hóa bản địa, nâng tầm thương hiệu nông sản và đổi mới
              sản phẩm OCOP bền vững.
            </p>
          </div>

          {/* Filter bar: [ Tất cả ] [ Kỹ thuật / Tag... ] */}
          <div className="mt-8 sm:mt-10 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => handleSelectTag(null)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                selectedTagId === null
                  ? 'bg-stone-900 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
            >
              Tất cả
            </button>

            {tags.map((tag) => {
              const isSelected = selectedTagId === tag.id;
              return (
                <button
                  key={tag.id}
                  onClick={() => handleSelectTag(tag.id)}
                  className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shrink-0 cursor-pointer ${
                    isSelected
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                  }`}
                >
                  {tag.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200/80 my-8">
            <Newspaper className="mx-auto w-12 h-12 text-stone-300 mb-3" />
            <h2 className="text-lg font-bold text-stone-900 mb-1">Chưa có bài viết phù hợp</h2>
            <p className="text-sm text-stone-500 mb-4">
              Hiện chưa có bài viết nào trong chuyên mục đã chọn.
            </p>
            <button
              onClick={() => handleSelectTag(null)}
              className="text-xs font-semibold text-emerald-700 hover:underline cursor-pointer"
            >
              Xem lại tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="space-y-12 sm:space-y-16">
            {/* ─────────────────────────────────────────────────────────
                2. FEATURED POST (Tỷ lệ chia 7:5 hoặc 6:6, ảnh 16:9)
            ───────────────────────────────────────────────────────── */}
            {featuredBlog && (
              <section aria-label="Bài viết nổi bật">
                <BlogCard
                  blog={featuredBlog}
                  variant="featured"
                  formatDate={formatDate}
                  readingTime={getReadingTime(featuredBlog)}
                />
              </section>
            )}

            {/* ─────────────────────────────────────────────────────────
                3. DANH SÁCH BÀI VIẾT (Grid 3 cột chuẩn tối giản)
                Mỗi Card: Ảnh 16:9, Tag nhỏ, H3 2 dòng, Excerpt 2 dòng, Ngày · Thời gian đọc
            ───────────────────────────────────────────────────────── */}
            {regularBlogs.length > 0 && (
              <section aria-label="Danh sách bài viết" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {regularBlogs.map((blog, idx) => (
                    <BlogCard
                      key={blog.id}
                      blog={blog}
                      idx={idx}
                      variant="grid"
                      formatDate={formatDate}
                      readingTime={getReadingTime(blog)}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* ─────────────────────────────────────────────────────────
                4. NÚT "XEM THÊM BÀI VIẾT" (Ghost Button)
                Chuẩn wireframe frame.md
            ───────────────────────────────────────────────────────── */}
            <div className="pt-8 pb-4 text-center">
              {hasNextPage ? (
                <button
                  type="button"
                  onClick={loadMore}
                  disabled={isFetchingNextPage}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-stone-300 text-stone-800 text-sm font-semibold hover:border-stone-900 hover:bg-stone-50 active:scale-[0.98] transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-none"
                  aria-label="Xem thêm bài viết"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-stone-600" aria-hidden="true" />
                      <span>Đang tải thêm bài viết...</span>
                    </>
                  ) : (
                    <span>Xem thêm bài viết</span>
                  )}
                </button>
              ) : (
                blogs.length > 0 && (
                  <p className="text-xs font-medium text-stone-400">
                    Bạn đã xem hết tất cả bài viết.
                  </p>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
