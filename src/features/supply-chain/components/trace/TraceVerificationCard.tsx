import React from 'react';
import { ShieldCheck, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';
import { CodeStatusInfo } from './traceStatusUtils';

export interface TraceVerificationCardProps {
  codeStatus: CodeStatusInfo;
  scanCount: number;
  serial?: string | null;
  digitalLink?: string;
}

export const TraceVerificationCard: React.FC<TraceVerificationCardProps> = ({
  codeStatus,
  scanCount,
  serial,
  digitalLink,
}) => {
  const handleCopyDigitalLink = () => {
    if (!digitalLink) return;
    const fullUrl = digitalLink.startsWith('http')
      ? digitalLink
      : typeof window !== 'undefined'
        ? `${window.location.origin}${digitalLink}`
        : digitalLink;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      toast.success('Đã sao chép Digital Link');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center shrink-0 border border-stone-200/60">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-700" />
          </div>
          <div>
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Xác minh sản phẩm
            </h2>
            <p className="text-[11px] text-stone-400">Chứng thực nguồn gốc số OCOP</p>
          </div>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-500">Trạng thái mã</span>
          <span
            className={cn(
              'text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5',
              codeStatus.color,
              codeStatus.bg,
              codeStatus.border,
            )}
          >
            {codeStatus.icon}
            <span>{codeStatus.label}</span>
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-stone-500">Lượt quét mã</span>
          <span className="text-sm font-bold text-stone-900">{scanCount} lần</span>
        </div>
        {serial && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-stone-500">Số Serial tem</span>
            <span className="text-xs font-mono font-bold text-stone-800 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
              #{serial}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-1.5 pt-2.5 border-t border-stone-100 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-500 font-medium">Tiêu chuẩn định danh</span>
            <span className="font-semibold text-stone-800">GS1 Digital Link</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-stone-500 font-medium shrink-0">Digital Link</span>
            {digitalLink ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="font-mono text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 truncate max-w-[170px]"
                  title={digitalLink}
                >
                  {digitalLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyDigitalLink}
                  className="p-1 text-stone-400 hover:text-emerald-700 hover:bg-stone-100 rounded transition shrink-0 cursor-pointer"
                  title="Sao chép Digital Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-xs text-stone-400 font-medium italic">Chưa cập nhật</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
