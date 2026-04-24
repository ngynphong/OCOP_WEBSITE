import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminTagApi } from '../api/adminTagApi';
import { CreateTagRequest, UpdateTagRequest } from '../types/blogTypes';
import { toast } from 'react-hot-toast';

export const ADMIN_TAG_KEYS = {
  all: ['admin-blog-tags'] as const,
};

export const useAdminTagsQuery = () => {
  return useQuery({
    queryKey: ADMIN_TAG_KEYS.all,
    queryFn: () => adminTagApi.getTags(),
    staleTime: 10 * 60 * 1000,
  });
};

export const useAdminTagMutations = () => {
  const queryClient = useQueryClient();

  const invalidateTags = () => {
    queryClient.invalidateQueries({ queryKey: ADMIN_TAG_KEYS.all });
  };

  const createTag = useMutation({
    mutationFn: (data: CreateTagRequest) => adminTagApi.createTag(data),
    onSuccess: () => {
      toast.success('Thêm thẻ thành công');
      invalidateTags();
    },
  });

  const updateTag = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTagRequest }) =>
      adminTagApi.updateTag(id, data),
    onSuccess: () => {
      toast.success('Cập nhật thẻ thành công');
      invalidateTags();
    },
  });

  const deleteTag = useMutation({
    mutationFn: (id: number) => adminTagApi.deleteTag(id),
    onSuccess: () => {
      toast.success('Xóa thẻ thành công');
      invalidateTags();
    },
  });

  return {
    createTag: createTag.mutateAsync,
    isCreating: createTag.isPending,
    updateTag: updateTag.mutateAsync,
    isUpdating: updateTag.isPending,
    deleteTag: deleteTag.mutateAsync,
    isDeleting: deleteTag.isPending,
  };
};
