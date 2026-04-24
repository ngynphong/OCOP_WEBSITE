import { z } from 'zod';
import { ResponseBase } from '@/features/admin/types/adminTypes';

export type BlogStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

// ─── Interfaces ──────────────────────────────────────────────────────────────

export interface BlogTag {
  id: number;
  name: string;
  slug: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  thumbnailUrl: string;
  shortDesc: string;
  content: string;
  status: BlogStatus;
  authorEmail: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags: BlogTag[];
}

export interface CreateBlogRequest {
  title: string;
  slug: string;
  thumbnailUrl: string;
  shortDesc: string;
  content: string;
  status: BlogStatus;
  tagIds: number[];
}

export type UpdateBlogRequest = CreateBlogRequest;

export interface CreateTagRequest {
  name: string;
  slug: string;
}

export type UpdateTagRequest = CreateTagRequest;

export interface BlogListParams {
  pageNo?: number;
  pageSize?: number;
  status?: BlogStatus;
  tagId?: number;
}

// ─── Responses ───────────────────────────────────────────────────────────────

export interface BlogPaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

export type BlogDetailResponse = ResponseBase<Blog>;
export type BlogListResponse = ResponseBase<BlogPaginatedResponse<Blog>>;
export type BlogTagListResponse = ResponseBase<BlogTag[]>;
export type BlogTagDetailResponse = ResponseBase<BlogTag>;

// ─── Validation Schemas ──────────────────────────────────────────────────────

export const tagSchema = z.object({
  name: z.string().min(2, 'Tên thẻ phải có ít nhất 2 ký tự'),
  slug: z.string().min(2, 'Đường dẫn (slug) phải có ít nhất 2 ký tự'),
});

export type TagFormValues = z.infer<typeof tagSchema>;

export const blogSchema = z.object({
  title: z.string().min(5, 'Tiêu đề phải có ít nhất 5 ký tự'),
  slug: z.string().min(5, 'Đường dẫn (slug) phải có ít nhất 5 ký tự'),
  thumbnailUrl: z.string().url('Vui lòng nhập URL hợp lệ cho ảnh bìa').or(z.literal('')),
  shortDesc: z.string().min(10, 'Mô tả ngắn phải có ít nhất 10 ký tự'),
  content: z.string().min(20, 'Nội dung bài viết quá ngắn'),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  tagIds: z.array(z.number()).default([]),
});

export type BlogFormValues = z.input<typeof blogSchema>;
