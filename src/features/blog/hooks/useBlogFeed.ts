'use client';

import { useState, useMemo, useCallback } from 'react';
import { useInfinitePublicBlogsQuery, usePublicBlogTagsQuery } from './usePublicBlogs';
import { Blog, BlogTag } from '../types/blogTypes';

export interface UseBlogFeedReturn {
  tags: BlogTag[];
  selectedTagId: number | null;
  blogs: Blog[];
  featuredBlog: Blog | null;
  regularBlogs: Blog[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  loadMore: () => void;
  handleSelectTag: (tagId: number | null) => void;
  formatDate: (dateStr: string) => string;
  getReadingTime: (blog: Blog) => string;
}

export function useBlogFeed(pageSize = 10): UseBlogFeedReturn {
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);

  const { data: tagsRes } = usePublicBlogTagsQuery();
  const tags = useMemo(() => tagsRes?.data || [], [tagsRes]);

  const queryParams = useMemo(() => {
    return {
      pageSize,
      status: 'PUBLISHED' as const,
      ...(selectedTagId !== null ? { tagId: selectedTagId } : {}),
    };
  }, [pageSize, selectedTagId]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfinitePublicBlogsQuery(queryParams);

  const blogs = useMemo(() => {
    return data?.pages.flatMap((page) => page.data.content) || [];
  }, [data]);

  // The first blog is the hero featured post
  const featuredBlog = useMemo(() => {
    return blogs.length > 0 ? blogs[0] : null;
  }, [blogs]);

  // The rest of the blogs are shown in the 3-column grid
  const regularBlogs = useMemo(() => {
    return blogs.length > 1 ? blogs.slice(1) : [];
  }, [blogs]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handleSelectTag = useCallback((tagId: number | null) => {
    setSelectedTagId(tagId);
  }, []);

  const formatDate = useCallback((dateStr: string) => {
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
  }, []);

  const getReadingTime = useCallback((blog: Blog) => {
    const text = (blog.content || '') + ' ' + (blog.shortDesc || '');
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const minutes = Math.max(3, Math.ceil(words / 180));
    return `${minutes} phút đọc`;
  }, []);

  return {
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
  };
}
