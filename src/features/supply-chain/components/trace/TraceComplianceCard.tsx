import React from 'react';
import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TraceProductInfo } from '@/features/products/types/productTypes';

export interface TraceComplianceCardProps {
  product: TraceProductInfo;
}

export const TraceComplianceCard: React.FC<TraceComplianceCardProps> = ({ product }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
          <FileText className="w-4.5 h-4.5 text-stone-600" />
        </div>
        <div>
          <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
            Thông tin bổ sung
          </h2>
          <p className="text-[11px] text-stone-400">Tiêu chuẩn & tài liệu công bố</p>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Thành phần</span>
          <span
            className={cn(
              'text-xs',
              product.ingredients?.trim() ? 'text-stone-800' : 'text-stone-400 italic',
            )}
          >
            {product.ingredients?.trim() ? product.ingredients : 'Chưa cập nhật'}
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Chất liệu bao bì</span>
          <span
            className={cn(
              'text-xs',
              product.packagingMaterial?.trim() ? 'text-stone-800' : 'text-stone-400 italic',
            )}
          >
            {product.packagingMaterial?.trim() ? product.packagingMaterial : 'Chưa cập nhật'}
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Tiêu chuẩn áp dụng</span>
          <span
            className={cn(
              'text-xs',
              product.appliedStandards?.trim() ? 'text-stone-800' : 'text-stone-400 italic',
            )}
          >
            {product.appliedStandards?.trim() ? product.appliedStandards : 'Chưa cập nhật'}
          </span>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Tài liệu công bố</span>
          {product.complianceDocuments?.trim() ? (
            <div className="flex flex-col gap-2 mt-1">
              {product.complianceDocuments.split(',').map((docLink, idx) => (
                <a
                  key={idx}
                  href={docLink.trim()}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 font-medium"
                >
                  <FileText className="w-3.5 h-3.5" /> Xem tài liệu {idx + 1}
                </a>
              ))}
            </div>
          ) : (
            <span className="text-xs text-stone-400 italic">Chưa cập nhật</span>
          )}
        </div>
      </div>
    </div>
  );
};
