import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../api/adminApi';
import { CategorySchemaType, CategoryFormSchemaType } from '../types/categorySchema';
import toast from 'react-hot-toast';

type ApiError = { response?: { data?: { message?: string } } };

// ─── Standalone Query Hooks ──────

export const useAdminCategoriesQuery = () => {
  return useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminApi.getCategories(),
    staleTime: 5 * 60 * 1000, // Categories change less frequently, cache for 5m
  });
};

export const useAdminCategoryDetailQuery = (id: number | null | undefined) => {
  return useQuery({
    queryKey: ['admin-category', id],
    queryFn: () => (id ? adminApi.getCategoryDetail(id) : null),
    enabled: !!id,
  });
};

// ─── Mutation Hook ─────────────────────────────────────────────────────────────

export const useAdminCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
  };

  const createCategoriesMutation = useMutation({
    mutationFn: (data: CategorySchemaType[]) => adminApi.createCategoriesFromForm(data),
    onSuccess: () => {
      toast.success('Tạo danh mục thành công');
      invalidateCategories();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi tạo danh mục');
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryFormSchemaType }) =>
      adminApi.updateCategoryMultipart(id, data),
    onSuccess: () => {
      toast.success('Cập nhật danh mục thành công');
      invalidateCategories();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi cập nhật danh mục');
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: () => {
      toast.success('Xóa danh mục thành công');
      invalidateCategories();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi xóa danh mục');
    },
  });

  const createCategoriesMultipartMutation = useMutation({
    mutationFn: (data: CategoryFormSchemaType[]) => adminApi.createCategoriesMultipart(data),
    onSuccess: () => {
      toast.success('Tạo danh mục thành công');
      invalidateCategories();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message || 'Có lỗi khi tạo danh mục');
    },
  });

  const checkSlugMutation = useMutation({
    mutationFn: (slug: string) => adminApi.checkCategorySlug(slug),
  });

  return {
    createCategories: createCategoriesMutation.mutateAsync,
    isCreating: createCategoriesMutation.isPending,
    createCategoriesMultipart: createCategoriesMultipartMutation.mutateAsync,
    isCreatingMultipart: createCategoriesMultipartMutation.isPending,
    updateCategory: updateCategoryMutation.mutateAsync,
    isUpdating: updateCategoryMutation.isPending,
    isUpdatingMultipart: updateCategoryMutation.isPending,
    deleteCategory: deleteCategoryMutation.mutateAsync,
    isDeleting: deleteCategoryMutation.isPending,
    checkSlug: checkSlugMutation.mutateAsync,
    isCheckingSlug: checkSlugMutation.isPending,
  };
};

/**
 * @deprecated Dùng useAdminCategoriesQuery hoặc useAdminCategoryMutations trực tiếp.
 */
export const useAdminCategories = () => useAdminCategoryMutations();
