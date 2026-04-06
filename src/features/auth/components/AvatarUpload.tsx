'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import { FiCamera, FiTrash2, FiLoader } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

interface AvatarUploadProps {
  currentAvatar?: string;
  name?: string;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentAvatar, name }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateAvatar, deleteAvatar, isUpdatingAvatar, isDeletingAvatar } = useAuth();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await updateAvatar(file);
    }
  };

  const handleDelete = async () => {
    if (confirm('Bạn có chắc chắn muốn xóa ảnh đại diện?')) {
      await deleteAvatar();
    }
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '??';

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-linear-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-3xl font-bold">
          {currentAvatar ? (
            <Image
              src={currentAvatar}
              alt="Avatar"
              width={128}
              height={128}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <span>{initials}</span>
          )}

          {(isUpdatingAvatar || isDeletingAvatar) && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <FiLoader className="w-8 h-8 animate-spin text-white" />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUpdatingAvatar || isDeletingAvatar}
          className="absolute bottom-1 right-1 p-2 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50"
          title="Thay đổi ảnh"
        >
          <FiCamera size={18} />
        </button>

        {currentAvatar && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isUpdatingAvatar || isDeletingAvatar}
            className="absolute top-1 right-1 p-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 disabled:opacity-50 opacity-0 group-hover:opacity-100"
            title="Xóa ảnh"
          >
            <FiTrash2 size={18} />
          </button>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      <p className="text-xs text-gray-500 italic">Hỗ trợ JPG, PNG. Tối đa 2MB.</p>
    </div>
  );
};

export default AvatarUpload;
