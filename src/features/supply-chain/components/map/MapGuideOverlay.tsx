'use client';

import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export interface MapGuideOverlayProps {
  showGuide: boolean;
  onToggleGuide: (show: boolean) => void;
}

export function MapGuideOverlay({ showGuide, onToggleGuide }: MapGuideOverlayProps) {
  if (!showGuide) {
    return (
      <button
        type="button"
        onClick={() => onToggleGuide(true)}
        className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl shadow-md text-xs font-semibold text-stone-600 hover:text-emerald-700 z-[400] border border-stone-200 flex items-center gap-1.5 cursor-pointer pointer-events-auto transition-colors"
        title="Hiện bảng hướng dẫn thao tác"
      >
        <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
        <span>Hướng dẫn</span>
      </button>
    );
  }

  return (
    <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-md p-2.5 rounded-xl shadow-md text-[11px] text-stone-600 z-[400] max-w-[260px] border border-stone-200 pointer-events-auto">
      <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-stone-100">
        <div className="font-bold text-emerald-700 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Hướng dẫn thao tác</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleGuide(false)}
          className="text-stone-400 hover:text-stone-700 hover:bg-stone-100 px-1.5 py-0.5 rounded text-[10px] font-medium flex items-center gap-0.5 transition-colors cursor-pointer"
          title="Ẩn hướng dẫn để nhìn rõ bản đồ"
        >
          <X className="w-3 h-3" />
          <span>Ẩn</span>
        </button>
      </div>
      <ul className="list-disc pl-3.5 space-y-1 text-stone-600">
        <li>
          <b>Click bản đồ:</b> Chọn toạ độ ghim cơ sở.
        </li>
        <li>
          <b>Vẽ vùng trồng:</b> Click liên tiếp các điểm để tạo đa giác ranh giới.
        </li>
        <li>
          <b>Khép kín:</b> Click lại điểm đầu tiên hoặc bấm &quot;Hoàn tất&quot;.
        </li>
      </ul>
    </div>
  );
}

export default MapGuideOverlay;
