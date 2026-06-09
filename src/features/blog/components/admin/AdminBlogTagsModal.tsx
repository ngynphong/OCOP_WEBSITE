'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiTrash2, FiPlus, FiLoader } from 'react-icons/fi';
import { useAdminTagsQuery, useAdminTagMutations } from '../../hooks/useAdminTags';
import { Button } from '@/components/ui/AppButton';

interface AdminBlogTagsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminBlogTagsModal = ({ isOpen, onClose }: AdminBlogTagsModalProps) => {
  const { data: tagsRes, isLoading } = useAdminTagsQuery();
  const { createTag, deleteTag, isCreating, isDeleting } = useAdminTagMutations();
  const tags = tagsRes?.data || [];

  const [newTagName, setNewTagName] = useState('');
  const [newTagSlug, setNewTagSlug] = useState('');

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewTagName(val);
    setNewTagSlug(
      val
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, ''),
    );
  };

  const handleCreate = async () => {
    if (!newTagName || !newTagSlug) return;
    try {
      await createTag({ name: newTagName, slug: newTagSlug });
      setNewTagName('');
      setNewTagSlug('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-xl shadow-2xl z-[70] overflow-hidden"
          >
            <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
              <h2 className="text-xl font-black text-stone-900">Quản lý Thẻ (Tags)</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-stone-400 hover:text-stone-900 shadow-sm border border-stone-200"
              >
                <FiX />
              </button>
            </div>

            <div className="p-6">
              <div className="flex gap-4 mb-6">
                <div className="flex-1 space-y-2">
                  <input
                    value={newTagName}
                    onChange={handleNameChange}
                    placeholder="Tên thẻ mới..."
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50 outline-none text-sm font-medium"
                  />
                  {newTagSlug && (
                    <p className="text-[10px] text-stone-400 px-1">Slug: {newTagSlug}</p>
                  )}
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={!newTagName || isCreating}
                  className="px-6 rounded-xl bg-emerald-600 text-white font-bold h-[42px] hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isCreating ? <FiLoader className="animate-spin" /> : <FiPlus />}
                </Button>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                {isLoading ? (
                  <div className="py-8 text-center text-stone-400">
                    <FiLoader className="animate-spin mx-auto text-2xl" />
                  </div>
                ) : tags.length === 0 ? (
                  <div className="py-8 text-center text-stone-400 text-sm">Chưa có thẻ nào</div>
                ) : (
                  tags.map((tag) => (
                    <div
                      key={tag.id}
                      className="flex justify-between items-center p-3 bg-stone-50 rounded-xl border border-stone-100"
                    >
                      <div>
                        <p className="text-sm font-bold text-stone-900">{tag.name}</p>
                        <p className="text-[10px] text-stone-400">{tag.slug}</p>
                      </div>
                      <button
                        onClick={() => deleteTag(tag.id)}
                        disabled={isDeleting}
                        className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
