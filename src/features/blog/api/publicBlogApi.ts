import { publicAxiosClient } from '@/lib/axios';
import {
  BlogListParams,
  BlogListResponse,
  BlogDetailResponse,
  BlogTagListResponse,
} from '../types/blogTypes';

const PUBLIC_BLOG_API_URL = '/blog';

export const publicBlogApi = {
  getBlogs: async (params?: BlogListParams): Promise<BlogListResponse> => {
    const headers = params?.pageNo && params.pageNo > 1 ? { 'X-Silent-Loading': 'true' } : {};
    return await publicAxiosClient.get(PUBLIC_BLOG_API_URL, { params, headers });
  },

  getBlogBySlug: async (slug: string): Promise<BlogDetailResponse> => {
    return await publicAxiosClient.get(`${PUBLIC_BLOG_API_URL}/${slug}`);
  },

  getTags: async (): Promise<BlogTagListResponse> => {
    return await publicAxiosClient.get(`${PUBLIC_BLOG_API_URL}/tags`);
  },
};
