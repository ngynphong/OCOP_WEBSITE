import { axiosClient } from '@/lib/axios';
import {
  BlogTagListResponse,
  BlogTagDetailResponse,
  CreateTagRequest,
  UpdateTagRequest,
} from '../types/blogTypes';

const ADMIN_TAG_API_URL = '/admin/blog/tags';

export const adminTagApi = {
  getTags: async (): Promise<BlogTagListResponse> => {
    return await axiosClient.get(ADMIN_TAG_API_URL);
  },

  createTag: async (data: CreateTagRequest): Promise<BlogTagDetailResponse> => {
    return await axiosClient.post(ADMIN_TAG_API_URL, data);
  },

  updateTag: async (id: number, data: UpdateTagRequest): Promise<BlogTagDetailResponse> => {
    return await axiosClient.put(`${ADMIN_TAG_API_URL}/${id}`, data);
  },

  deleteTag: async (id: number): Promise<void> => {
    return await axiosClient.delete(`${ADMIN_TAG_API_URL}/${id}`);
  },
};
