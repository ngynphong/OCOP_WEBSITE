import React from 'react';
import { FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';

export const TraceabilityEvidenceSection: React.FC = () => {
  return (
    <div className="mt-6 border border-blue-100 rounded-xl overflow-hidden bg-blue-50/30">
      <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
        <h4 className="font-semibold text-blue-900 text-sm flex items-center gap-2">
          Bằng chứng Truy xuất
        </h4>
        <p className="text-xs text-blue-600/80 mt-0.5">
          Chụp ảnh trực tiếp tại hiện trường. Hệ thống sẽ tự động lấy Tọa độ (GPS) và Thời gian
          thực.
        </p>
      </div>
      <div className="p-4">
        <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-white">
          <Button
            type="button"
            variant="primary"
            className="bg-blue-600 hover:bg-blue-700 rounded-full mb-3"
            onClick={() => alert('Mở Camera trên App Native/Trình duyệt')}
          >
            <FiPlus className="mr-2" />
            Mở Camera Chụp Ảnh
          </Button>
          <p className="text-xs text-stone-500 max-w-xs">
            Yêu cầu cấp quyền Vị trí (Location) để đính kèm Tọa độ chống giả mạo.
          </p>
        </div>
      </div>
    </div>
  );
};
