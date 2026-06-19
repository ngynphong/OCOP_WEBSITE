import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminBlogApi } from '../api/adminBlogApi';
import { BlogListParams, CreateBlogRequest, UpdateBlogRequest } from '../types/blogTypes';
import { toast } from 'react-hot-toast';

export const ADMIN_BLOG_KEYS = {
  all: ['admin-blogs'] as const,
  lists: () => [...ADMIN_BLOG_KEYS.all, 'list'] as const,
  list: (params: BlogListParams) => [...ADMIN_BLOG_KEYS.lists(), params] as const,
  details: () => [...ADMIN_BLOG_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...ADMIN_BLOG_KEYS.details(), id] as const,
};

export const useAdminBlogsQuery = (params: BlogListParams) => {
  return useQuery({
    queryKey: ADMIN_BLOG_KEYS.list(params),
    queryFn: () => adminBlogApi.getBlogs(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminBlogDetailQuery = (id: number) => {
  return useQuery({
    queryKey: ADMIN_BLOG_KEYS.detail(id),
    queryFn: () => adminBlogApi.getBlogById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminBlogMutations = () => {
  const queryClient = useQueryClient();

  const invalidateLists = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_BLOG_KEYS.lists() });
  };

  const createBlog = useMutation({
    mutationFn: (data: CreateBlogRequest) => adminBlogApi.createBlog(data),
    onSuccess: () => {
      toast.success('Tạo bài viết thành công');
      invalidateLists();
    },
  });

  const updateBlog = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateBlogRequest }) =>
      adminBlogApi.updateBlog(id, data),
    onSuccess: (_, variables) => {
      toast.success('Cập nhật bài viết thành công');
      invalidateLists();
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOG_KEYS.detail(variables.id) });
    },
  });

  const deleteBlog = useMutation({
    mutationFn: (id: number) => adminBlogApi.deleteBlog(id),
    onSuccess: () => {
      toast.success('Xóa bài viết thành công');
      invalidateLists();
    },
  });

  const publishBlog = useMutation({
    mutationFn: (id: number) => adminBlogApi.publishBlog(id),
    onSuccess: (_, id) => {
      toast.success('Đã xuất bản bài viết');
      invalidateLists();
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOG_KEYS.detail(id) });
    },
  });

  const archiveBlog = useMutation({
    mutationFn: (id: number) => adminBlogApi.archiveBlog(id),
    onSuccess: (_, id) => {
      toast.success('Đã lưu trữ bài viết');
      invalidateLists();
      queryClient.invalidateQueries({ queryKey: ADMIN_BLOG_KEYS.detail(id) });
    },
  });

  const uploadBlogImage = useMutation({
    mutationFn: (file: File) => adminBlogApi.uploadImage(file),
    onSuccess: () => {
      toast.success('Tải ảnh lên thành công');
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tải ảnh lên');
    },
  });

  return {
    createBlog: createBlog.mutateAsync,
    isCreating: createBlog.isPending,
    updateBlog: updateBlog.mutateAsync,
    isUpdating: updateBlog.isPending,
    deleteBlog: deleteBlog.mutateAsync,
    isDeleting: deleteBlog.isPending,
    publishBlog: publishBlog.mutateAsync,
    isPublishing: publishBlog.isPending,
    archiveBlog: archiveBlog.mutateAsync,
    isArchiving: archiveBlog.isPending,
    uploadBlogImage: uploadBlogImage.mutateAsync,
    isUploadingImage: uploadBlogImage.isPending,
  };
};
