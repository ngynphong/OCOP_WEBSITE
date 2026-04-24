'use client';

import { AdminBlogForm } from '@/features/blog/components/admin/AdminBlogForm';
import { useAdminBlogDetailQuery } from '@/features/blog/hooks/useAdminBlogs';
import { useParams } from 'next/navigation';

export default function EditBlogPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data: blogRes, isLoading } = useAdminBlogDetailQuery(id);

  if (isLoading)
    return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu bài viết...</div>;
  if (!blogRes?.data)
    return <div className="p-8 text-center text-red-500">Không tìm thấy bài viết</div>;

  return <AdminBlogForm initialData={blogRes.data} isEdit={true} />;
}
