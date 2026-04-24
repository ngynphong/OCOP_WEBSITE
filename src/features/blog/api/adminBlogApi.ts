import { axiosClient } from '@/lib/axios';
import {
  BlogListParams,
  BlogListResponse,
  BlogDetailResponse,
  CreateBlogRequest,
  UpdateBlogRequest,
} from '../types/blogTypes';

const ADMIN_BLOG_API_URL = '/admin/blog';

export const adminBlogApi = {
  getBlogs: async (params?: BlogListParams): Promise<BlogListResponse> => {
    return await axiosClient.get(ADMIN_BLOG_API_URL, { params });
  },

  getBlogById: async (id: number): Promise<BlogDetailResponse> => {
    return await axiosClient.get(`${ADMIN_BLOG_API_URL}/${id}`);
  },

  createBlog: async (data: CreateBlogRequest): Promise<BlogDetailResponse> => {
    return await axiosClient.post(ADMIN_BLOG_API_URL, data);
  },

  updateBlog: async (id: number, data: UpdateBlogRequest): Promise<BlogDetailResponse> => {
    return await axiosClient.put(`${ADMIN_BLOG_API_URL}/${id}`, data);
  },

  deleteBlog: async (id: number): Promise<void> => {
    return await axiosClient.delete(`${ADMIN_BLOG_API_URL}/${id}`);
  },

  publishBlog: async (id: number): Promise<BlogDetailResponse> => {
    return await axiosClient.post(`${ADMIN_BLOG_API_URL}/${id}/publish`);
  },

  archiveBlog: async (id: number): Promise<BlogDetailResponse> => {
    return await axiosClient.post(`${ADMIN_BLOG_API_URL}/${id}/archive`);
  },
};
