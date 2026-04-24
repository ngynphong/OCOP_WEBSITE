import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { publicBlogApi } from '../api/publicBlogApi';
import { BlogListParams } from '../types/blogTypes';

export const PUBLIC_BLOG_KEYS = {
  all: ['public-blogs'] as const,
  lists: () => [...PUBLIC_BLOG_KEYS.all, 'list'] as const,
  list: (params: BlogListParams) => [...PUBLIC_BLOG_KEYS.lists(), params] as const,
  details: () => [...PUBLIC_BLOG_KEYS.all, 'detail'] as const,
  detail: (slug: string) => [...PUBLIC_BLOG_KEYS.details(), slug] as const,
  tags: () => [...PUBLIC_BLOG_KEYS.all, 'tags'] as const,
};

export const useInfinitePublicBlogsQuery = (params: Omit<BlogListParams, 'pageNo'>) => {
  return useInfiniteQuery({
    queryKey: PUBLIC_BLOG_KEYS.list(params),
    queryFn: async ({ pageParam = 1 }) => {
      return publicBlogApi.getBlogs({ ...params, pageNo: pageParam });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const { totalPages } = lastPage.data;
      return allPages.length < totalPages ? allPages.length + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const usePublicBlogDetailQuery = (slug: string) => {
  return useQuery({
    queryKey: PUBLIC_BLOG_KEYS.detail(slug),
    queryFn: () => publicBlogApi.getBlogBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

export const usePublicBlogTagsQuery = () => {
  return useQuery({
    queryKey: PUBLIC_BLOG_KEYS.tags(),
    queryFn: () => publicBlogApi.getTags(),
    staleTime: 24 * 60 * 60 * 1000, // Ít khi thay đổi
  });
};
