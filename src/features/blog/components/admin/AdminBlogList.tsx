'use client';

import React, { useState } from 'react';
import { useAdminBlogsQuery, useAdminBlogMutations } from '../../hooks/useAdminBlogs';
import { BlogListParams, BlogStatus } from '../../types/blogTypes';
import { FiEdit2, FiTrash2, FiPlus, FiTag, FiEye, FiArchive, FiCheckCircle } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import Link from 'next/link';
import { AdminBlogTagsModal } from './AdminBlogTagsModal';
import Image from 'next/image';

const StatusBadge = React.memo(({ status }: { status: BlogStatus }) => {
  const statusMap = {
    DRAFT: { label: 'Bản nháp', class: 'bg-stone-100 text-stone-600' },
    PUBLISHED: { label: 'Công khai', class: 'bg-emerald-100 text-emerald-700' },
    ARCHIVED: { label: 'Lưu trữ', class: 'bg-amber-100 text-amber-700' },
  };
  const s = statusMap[status];
  return (
    <span
      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${s.class}`}
    >
      {s.label}
    </span>
  );
});

StatusBadge.displayName = 'StatusBadge';

export const AdminBlogList = () => {
  const [params, setParams] = useState<BlogListParams>({ pageNo: 1, pageSize: 10 });
  const { data: blogsRes, isLoading } = useAdminBlogsQuery(params);
  const { deleteBlog, publishBlog, archiveBlog } = useAdminBlogMutations();
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);

  const blogs = blogsRes?.data?.content || [];
  const totalPages = blogsRes?.data?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Quản lý bài viết</h1>
          <p className="text-sm text-stone-500">Quản lý tin tức, blog và kiến thức</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsTagModalOpen(true)}
            variant="outline"
            className="flex items-center gap-2 rounded-xl text-stone-600 border-stone-200 hover:bg-stone-50"
          >
            <FiTag /> Quản lý Thẻ (Tags)
          </Button>
          <Link href="/admin/blogs/create">
            <Button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-600/20">
              <FiPlus /> Viết bài mới
            </Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex gap-4 bg-stone-50/50">
          <select
            className="px-4 py-2 rounded-lg border text-gray-700 border-stone-200 text-sm font-medium outline-none"
            value={params.status || ''}
            onChange={(e) =>
              setParams({ ...params, status: e.target.value as BlogStatus | undefined, pageNo: 1 })
            }
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PUBLISHED">Công khai</option>
            <option value="DRAFT">Bản nháp</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-stone-600">
            <thead className="bg-stone-50 text-xs uppercase font-bold text-stone-400 border-b border-stone-100">
              <tr>
                <th className="px-6 py-4">Bài viết</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Lượt xem</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    Đang tải...
                  </td>
                </tr>
              ) : blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-8">
                    Chưa có bài viết nào
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                          {blog.thumbnailUrl && (
                            <Image
                              src={blog.thumbnailUrl}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-stone-900 line-clamp-1">{blog.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {blog.tags?.slice(0, 2).map((t) => (
                              <span
                                key={t.id}
                                className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold"
                              >
                                #{t.name}
                              </span>
                            ))}
                            {blog.tags && blog.tags.length > 2 && (
                              <span className="text-[10px] text-stone-400">
                                +{blog.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={blog.status} />
                    </td>
                    <td className="px-6 py-4 font-medium flex items-center gap-2">
                      <FiEye className="text-stone-400" /> {blog.viewCount || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {blog.status === 'DRAFT' && (
                          <button
                            title="Xuất bản"
                            onClick={() => publishBlog(blog.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-emerald-600 hover:bg-emerald-50"
                          >
                            <FiCheckCircle />
                          </button>
                        )}
                        {blog.status === 'PUBLISHED' && (
                          <button
                            title="Lưu trữ"
                            onClick={() => archiveBlog(blog.id)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-amber-600 hover:bg-amber-50"
                          >
                            <FiArchive />
                          </button>
                        )}
                        <Link href={`/admin/blogs/${blog.id}/edit`}>
                          <button
                            title="Sửa"
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <FiEdit2 />
                          </button>
                        </Link>
                        <button
                          title="Xóa"
                          onClick={() => {
                            if (confirm('Bạn có chắc chắn muốn xóa bài viết này?'))
                              deleteBlog(blog.id);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination placeholder */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-stone-100 flex justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setParams({ ...params, pageNo: i + 1 })}
                className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center ${params.pageNo === i + 1 ? 'bg-emerald-600 text-white' : 'bg-stone-50 text-stone-600 hover:bg-stone-100'}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <AdminBlogTagsModal isOpen={isTagModalOpen} onClose={() => setIsTagModalOpen(false)} />
    </div>
  );
};
