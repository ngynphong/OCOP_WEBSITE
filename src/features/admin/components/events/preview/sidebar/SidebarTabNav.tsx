import { Clock, Palette, ShieldCheck } from 'lucide-react';
import type { SidebarTab, QACheckItem } from '@/features/admin/hooks/useAdminEventPreview';

interface QaStats {
  failed: number;
  warnings: number;
}

interface SidebarTabNavProps {
  activeTab: SidebarTab;
  qaStats: QaStats;
  qaChecklist: QACheckItem[];
  onTabChange: (tab: SidebarTab) => void;
}

export const SidebarTabNav = ({ activeTab, qaStats, onTabChange }: SidebarTabNavProps) => (
  <div className="flex border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-xs">
    <button
      type="button"
      onClick={() => onTabChange('simulator')}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
        activeTab === 'simulator'
          ? 'bg-slate-800 text-white shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
    >
      <Clock className="w-3.5 h-3.5 text-amber-400" />
      <span>Giả lập</span>
    </button>

    <button
      type="button"
      onClick={() => onTabChange('theme')}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition cursor-pointer ${
        activeTab === 'theme'
          ? 'bg-slate-800 text-white shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
    >
      <Palette className="w-3.5 h-3.5 text-amber-400" />
      <span>Theme</span>
    </button>

    <button
      type="button"
      onClick={() => onTabChange('qa')}
      className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition cursor-pointer relative ${
        activeTab === 'qa'
          ? 'bg-slate-800 text-white shadow-sm'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
    >
      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
      <span>QA</span>
      {qaStats.failed > 0 ? (
        <span className="w-2 h-2 rounded-full bg-red-500 ml-0.5" />
      ) : qaStats.warnings > 0 ? (
        <span className="w-2 h-2 rounded-full bg-amber-500 ml-0.5" />
      ) : (
        <span className="w-2 h-2 rounded-full bg-emerald-500 ml-0.5" />
      )}
    </button>
  </div>
);
