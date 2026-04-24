'use client';

import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { blogSchema, BlogFormValues, Blog } from '../../types/blogTypes';
import { useAdminBlogMutations } from '../../hooks/useAdminBlogs';
import { useAdminTagsQuery, useAdminTagMutations } from '../../hooks/useAdminTags';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/AppButton';
import { FiSave, FiArrowLeft, FiImage, FiFileText, FiPlus, FiLoader } from 'react-icons/fi';
import Image from 'next/image';
import { slugify } from '@/utils/slugify';

interface AdminBlogFormProps {
  initialData?: Blog;
  isEdit?: boolean;
}

export const AdminBlogForm = ({ initialData, isEdit }: AdminBlogFormProps) => {
  const router = useRouter();
  const { createBlog, updateBlog, isCreating, isUpdating } = useAdminBlogMutations();
  const { data: tagsRes } = useAdminTagsQuery();
  const { createTag, isCreating: isCreatingTag } = useAdminTagMutations();
  const tagsList = tagsRes?.data || [];

  const [newTagName, setNewTagName] = useState('');

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      thumbnailUrl: initialData?.thumbnailUrl || '',
      shortDesc: initialData?.shortDesc || '',
      content: initialData?.content || '',
      status: initialData?.status || 'DRAFT',
      tagIds: initialData?.tags?.map((t) => t.id) || [],
    },
  });

  const title = useWatch({ control, name: 'title' });
  const thumbnailUrl = useWatch({ control, name: 'thumbnailUrl' });
  const selectedTagIds = useWatch({ control, name: 'tagIds' });

  // Auto-generate slug
  useEffect(() => {
    if (!isEdit && title) {
      const generatedSlug = slugify(title);
      setValue('slug', generatedSlug, { shouldValidate: true });
    }
  }, [title, isEdit, setValue]);

  const toggleTag = (id: number) => {
    const current = selectedTagIds || [];
    if (current.includes(id)) {
      setValue(
        'tagIds',
        current.filter((t) => t !== id),
        { shouldValidate: true },
      );
    } else {
      setValue('tagIds', [...current, id], { shouldValidate: true });
    }
  };

  const handleCreateTag = async () => {
    if (!newTagName.trim() || isCreatingTag) return;
    const slug = slugify(newTagName);
    try {
      const res = await createTag({ name: newTagName.trim(), slug });
      if (res?.data?.id) {
        toggleTag(res.data.id);
      }
      setNewTagName('');
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const payload = {
        ...data,
        tagIds: data.tagIds || [],
      };

      if (isEdit && initialData) {
        await updateBlog({ id: initialData.id, data: payload });
      } else {
        await createBlog(payload);
      }
      router.push('/admin/blogs');
    } catch (error) {
      console.error(error);
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <div className="max-w-5xl mx-auto py-8 px-6">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-stone-200 hover:bg-stone-50 transition-colors"
        >
          <FiArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-black text-stone-900">
            {isEdit ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
          </h1>
          <p className="text-stone-500 text-sm mt-1">Cập nhật nội dung cho trang tin tức</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col lg:flex-row gap-8">
        {/* Main Content Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Tiêu đề bài viết
              </label>
              <input
                {...register('title')}
                placeholder="Nhập tiêu đề..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 outline-none text-xl font-black text-stone-900"
              />
              {errors.title && (
                <p className="text-xs text-red-500 font-bold">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Đường dẫn (Slug)
              </label>
              <input
                {...register('slug')}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 outline-none text-stone-500"
              />
              {errors.slug && (
                <p className="text-xs text-red-500 font-bold">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Mô tả ngắn
              </label>
              <textarea
                {...register('shortDesc')}
                rows={3}
                placeholder="Tóm tắt nội dung bài viết..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 outline-none text-stone-700"
              />
              {errors.shortDesc && (
                <p className="text-xs text-red-500 font-bold">{errors.shortDesc.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-widest">
                <FiFileText /> Nội dung chi tiết
              </label>
              {/* Tạm thời dùng textarea. Nếu có Tiptap/Quill sẽ thay vào đây */}
              <textarea
                {...register('content')}
                rows={15}
                placeholder="Viết nội dung tại đây..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 outline-none text-stone-800 leading-relaxed "
              />
              {errors.content && (
                <p className="text-xs text-red-500 font-bold">{errors.content.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-6">
            <h3 className="font-black text-stone-900 border-b border-stone-100 pb-3">Xuất bản</h3>

            <div className="space-y-3">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">
                Trạng thái
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 outline-none font-bold text-stone-700"
              >
                <option value="DRAFT">Bản nháp</option>
                <option value="PUBLISHED">Công khai</option>
                <option value="ARCHIVED">Lưu trữ</option>
              </select>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-sm flex items-center justify-center gap-2"
            >
              <FiSave /> {isLoading ? 'Đang lưu...' : 'Lưu bài viết'}
            </Button>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-4">
            <h3 className="font-black text-stone-900 border-b border-stone-100 pb-3 flex items-center gap-2">
              <FiImage /> Ảnh bìa
            </h3>

            {thumbnailUrl ? (
              <div className="relative aspect-video rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                <Image src={thumbnailUrl} alt="Thumbnail" fill className="object-cover" />
              </div>
            ) : (
              <div className="aspect-video rounded-xl bg-stone-50 border border-dashed border-stone-300 flex items-center justify-center text-stone-400 text-xs">
                Chưa có ảnh bìa
              </div>
            )}

            <div className="space-y-1 mt-2">
              <input
                {...register('thumbnailUrl')}
                placeholder="Dán URL ảnh vào đây..."
                className="w-full px-3 py-2 text-sm rounded-lg border text-gray-700 border-stone-200 focus:border-emerald-500 outline-none"
              />
              {errors.thumbnailUrl && (
                <p className="text-[10px] text-red-500 font-bold">{errors.thumbnailUrl.message}</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-100 space-y-4">
            <h3 className="font-black text-stone-900 border-b border-stone-100 pb-3">Thẻ (Tags)</h3>

            <div className="flex gap-2">
              <input
                type="text"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateTag();
                  }
                }}
                placeholder="Thêm thẻ mới..."
                className="flex-1 px-3 py-2 text-sm rounded-lg border text-gray-700 border-stone-200 focus:border-emerald-500 outline-none"
              />
              <Button
                type="button"
                onClick={handleCreateTag}
                disabled={!newTagName.trim() || isCreatingTag}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-lg text-sm font-bold flex items-center justify-center disabled:opacity-50"
              >
                {isCreatingTag ? <FiLoader className="animate-spin" /> : <FiPlus />}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {tagsList.map((tag) => {
                const isSelected = selectedTagIds?.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                      isSelected
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    #{tag.name}
                  </button>
                );
              })}
              {tagsList.length === 0 && (
                <span className="text-xs text-stone-400">Chưa có thẻ nào</span>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
