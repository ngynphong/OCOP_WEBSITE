'use client';

import React from 'react';
import { Eye, X } from 'lucide-react';

interface GalleryModalHeaderProps {
  onClose: () => void;
}

export const GalleryModalHeader: React.FC<GalleryModalHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur-md z-10">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
          <Eye className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-900">Bộ Sưu Tập Đồ Họa SVG Sự Kiện OCOP</h3>
          <p className="text-xs text-gray-500">
            Toàn bộ vector SVG được thiết kế độc quyền, tối ưu hóa kích thước nhẹ và sắc nét
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        aria-label="Đóng"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};
