import { axiosClient } from '@/lib/axios';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import {
  BlogListParams,
  BlogListResponse,
  BlogDetailResponse,
  CreateBlogRequest,
  UpdateBlogRequest,
} from '../types/blogTypes';

const ADMIN_BLOG_API_URL = API_ENDPOINTS.ADMIN.BLOG;

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

  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await axiosClient.post(`${ADMIN_BLOG_API_URL}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },
};
