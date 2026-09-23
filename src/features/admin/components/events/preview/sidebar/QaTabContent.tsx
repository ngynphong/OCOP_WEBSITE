import { CheckCircle2, AlertTriangle, XCircle, Send, Lightbulb } from 'lucide-react';
import type { QACheckItem } from '@/features/admin/hooks/useAdminEventPreview';

interface QaStats {
  total: number;
  passed: number;
  warnings: number;
  failed: number;
  score: number;
  isReady: boolean;
}

interface QaTabContentProps {
  qaChecklist: QACheckItem[];
  qaStats: QaStats;
  onOpenPublishModal: () => void;
}

export const QaTabContent = ({ qaChecklist, qaStats, onOpenPublishModal }: QaTabContentProps) => (
  <div className="space-y-6">
    {/* Score Card */}
    <div
      className={`p-4 rounded-2xl border ${
        qaStats.isReady
          ? 'bg-emerald-500/10 border-emerald-500/30'
          : 'bg-amber-500/10 border-amber-500/30'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400 block">
            Độ Sẵn Sàng Xuất Bản
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black text-white">{qaStats.score}%</span>
            <span
              className={`text-xs font-bold ${qaStats.isReady ? 'text-emerald-400' : 'text-amber-400'}`}
            >
              {qaStats.isReady ? 'Đạt chuẩn' : 'Chưa hoàn thiện'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>{qaStats.passed}</span>
          </span>
          {qaStats.warnings > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              <span>{qaStats.warnings}</span>
            </span>
          )}
          {qaStats.failed > 0 && (
            <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-300 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              <span>{qaStats.failed}</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            qaStats.isReady
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
              : 'bg-gradient-to-r from-amber-500 to-red-500'
          }`}
          style={{ width: `${qaStats.score}%` }}
        />
      </div>
    </div>

    {/* Checklist */}
    <div className="space-y-3">
      {qaChecklist.map((item) => (
        <div
          key={item.id}
          className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex flex-col gap-1.5"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              {item.status === 'PASSED' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              )}
              {item.status === 'WARNING' && (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              {item.status === 'FAILED' && <XCircle className="w-4 h-4 text-red-400 shrink-0" />}
              <span className="font-bold text-white text-xs">{item.label}</span>
            </div>

            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                item.status === 'PASSED'
                  ? 'bg-emerald-500/20 text-emerald-300'
                  : item.status === 'WARNING'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-red-500/20 text-red-300'
              }`}
            >
              {item.status}
            </span>
          </div>

          <p className="text-[11px] text-slate-400 pl-6">{item.description}</p>

          {item.recommendation && (
            <div className="pl-6 pt-1 text-[11px] text-amber-300 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{item.recommendation}</span>
            </div>
          )}
        </div>
      ))}
    </div>

    {/* Publish Button */}
    <div className="pt-4">
      <button
        type="button"
        onClick={onOpenPublishModal}
        className="w-full py-3 rounded-xl font-extrabold text-xs text-slate-950 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        <span>Kiểm Duyệt & Xuất Bản Sự Kiện</span>
      </button>
    </div>
  </div>
);
