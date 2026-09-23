import { X, Sliders } from 'lucide-react';

interface SidebarHeaderProps {
  eventName: string;
  onClose: () => void;
}

export const SidebarHeader = ({ eventName, onClose }: SidebarHeaderProps) => (
  <div className="p-4 border-b border-slate-800 flex items-center justify-between">
    <div className="flex items-center gap-2 truncate pr-2">
      <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
      <div className="truncate">
        <h3 className="font-bold text-sm text-white">Studio Simulator & QA</h3>
        <p className="text-[10px] text-slate-400 truncate">{eventName}</p>
      </div>
    </div>
    <button
      type="button"
      onClick={onClose}
      aria-label="Đóng Simulator"
      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
    >
      <X className="w-4 h-4" />
    </button>
  </div>
);
