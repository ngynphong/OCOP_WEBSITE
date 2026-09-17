'use client';

import React from 'react';
import {
  X,
  Clock,
  Palette,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  RotateCcw,
  Zap,
  Eye,
  Send,
  Sliders,
  Flower2,
  Moon,
  Wheat,
  Leaf,
  Award,
  Mountain,
  Waves,
  PartyPopper,
  Snowflake,
  Lightbulb,
} from 'lucide-react';
import type {
  TimeScenario,
  SidebarTab,
  QACheckItem,
} from '@/features/admin/hooks/useAdminEventPreview';
import type { EventDetailResponse, AtmosphereEffectType } from '@/features/events/types/eventTypes';
import type { EventFlashSale } from '@/features/events/types/eventCommerceTypes';
import { THEME_PRESETS } from '@/features/events/constants/themePresets';

const PRESET_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  tet_xuan: Flower2,
  mua_vang: Wheat,
  ocop_xanh: Leaf,
  le_hoi_viet: Award,
  sieu_sale: Zap,
  tay_bac: Mountain,
  miet_vuon: Waves,
  trung_thu: Moon,
};

const ATMOSPHERE_OPTIONS: Array<{
  type: AtmosphereEffectType;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    type: 'apricot_petals',
    label: 'Hoa Mai Vàng',
    desc: 'Cánh hoa mai rơi lất phất',
    icon: Flower2,
  },
  { type: 'peach_petals', label: 'Hoa Đào Hồng', desc: 'Cánh hoa đào mùa xuân', icon: Flower2 },
  { type: 'golden_leaves', label: 'Lá Lúa Vàng', desc: 'Lá lúa thu hoạch bay nhẹ', icon: Wheat },
  { type: 'starlight', label: 'Ánh Sao Đêm Thu', desc: 'Đom đóm & sao lung linh', icon: Moon },
  {
    type: 'confetti',
    label: 'Pháo Giấy Siêu Sale',
    desc: 'Kim tuyến & giấy màu rực rỡ',
    icon: PartyPopper,
  },
  { type: 'snowflakes', label: 'Bông Tuyết', desc: 'Tuyết rơi mùa lễ hội', icon: Snowflake },
];

interface PreviewSimulatorSidebarProps {
  isOpen: boolean;
  activeTab: SidebarTab;
  event: EventDetailResponse;
  flashSales: EventFlashSale[];
  timeScenario: TimeScenario;
  selectedSlotId: number | null;
  customThemePresetId: string | null;
  defaultThemePresetId?: string;
  enableAtmosphere: boolean | null;
  atmosphereType: AtmosphereEffectType | null;
  enableCornerStickers: boolean | null;
  isCustomerView: boolean;
  qaChecklist: QACheckItem[];
  qaStats: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
    score: number;
    isReady: boolean;
  };
  onClose: () => void;
  onTabChange: (tab: SidebarTab) => void;
  onTimeScenarioChange: (scenario: TimeScenario) => void;
  onSelectSlot: (slotId: number) => void;
  onSelectThemePreset: (presetId: string | null) => void;
  onToggleAtmosphere: (enabled: boolean) => void;
  onSelectAtmosphereType: (type: AtmosphereEffectType) => void;
  onToggleCornerStickers: (enabled: boolean) => void;
  onToggleCustomerView: (enabled: boolean) => void;
  onResetTheme: () => void;
  onOpenPublishModal: () => void;
}

export function PreviewSimulatorSidebar({
  isOpen,
  activeTab,
  event,
  flashSales,
  timeScenario,
  selectedSlotId,
  customThemePresetId,
  defaultThemePresetId,
  enableAtmosphere,
  atmosphereType,
  enableCornerStickers,
  isCustomerView,
  qaChecklist,
  qaStats,
  onClose,
  onTabChange,
  onTimeScenarioChange,
  onSelectSlot,
  onSelectThemePreset,
  onToggleAtmosphere,
  onSelectAtmosphereType,
  onToggleCornerStickers,
  onToggleCustomerView,
  onResetTheme,
  onOpenPublishModal,
}: PreviewSimulatorSidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="w-80 sm:w-96 bg-slate-900/95 border-l border-slate-800 backdrop-blur-xl flex flex-col h-[calc(100vh-57px)] shrink-0 z-30 shadow-2xl">
      {/* ── SIDEBAR HEADER ──────────────────────────────────────────────── */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 truncate pr-2">
          <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
          <div className="truncate">
            <h3 className="font-bold text-sm text-white">Studio Simulator & QA</h3>
            <p className="text-[10px] text-slate-400 truncate">{event.name}</p>
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

      {/* ── TAB SELECTOR ────────────────────────────────────────────────── */}
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

      {/* ── TAB BODY (SCROLLABLE) ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-slate-300 text-xs">
        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 1: TIME & SCENARIO SIMULATOR                                 */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    <span>Góc nhìn khách hàng</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Ẩn các ghi chú & khung hướng dẫn Admin
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleCustomerView(!isCustomerView)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    isCustomerView ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isCustomerView ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Time Scenarios */}
            <div>
              <label className="font-bold text-white text-xs block mb-2">
                Mô Phỏng Mốc Thời Gian Sự Kiện
              </label>
              <p className="text-[11px] text-slate-400 mb-3">
                Thay đổi trạng thái thời gian để kiểm tra đồng hồ đếm ngược và luồng tương tác.
              </p>

              <div className="space-y-2">
                {/* 1. Upcoming */}
                <button
                  type="button"
                  onClick={() => onTimeScenarioChange('UPCOMING')}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    timeScenario === 'UPCOMING'
                      ? 'bg-amber-500/15 border-amber-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold block">1. Sắp diễn ra (Upcoming)</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Đếm ngược mở màn, nút đăng ký tham gia hoặc nhận thông báo.
                    </span>
                  </div>
                </button>

                {/* 2. Live */}
                <button
                  type="button"
                  onClick={() => onTimeScenarioChange('LIVE')}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    timeScenario === 'LIVE'
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 animate-ping" />
                  <div>
                    <span className="font-bold block">2. Đang diễn ra (Giờ vàng Live)</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Flash sale bùng nổ, voucher có thể bấm lưu, đồng hồ đếm ngược kết thúc.
                    </span>
                  </div>
                </button>

                {/* 3. Ended */}
                <button
                  type="button"
                  onClick={() => onTimeScenarioChange('ENDED')}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    timeScenario === 'ENDED'
                      ? 'bg-slate-700 border-slate-500 text-white'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70 text-slate-300'
                  }`}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-400 mt-1 shrink-0" />
                  <div>
                    <span className="font-bold block">3. Đã kết thúc (Ended)</span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Hiển thị thông báo sự kiện đã khép lại, tổng kết chiến dịch.
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Flash Sale Slot Switcher */}
            {flashSales && flashSales.length > 0 && (
              <div>
                <label className="font-bold text-white text-xs block mb-1">
                  Kiểm Tra Khung Giờ Flash Sale
                </label>
                <p className="text-[11px] text-slate-400 mb-2">
                  Chọn khung giờ để xem thử danh sách sản phẩm hiển thị.
                </p>

                <div className="space-y-1.5">
                  {flashSales.map((slot) => {
                    const isSelected = slot.id === selectedSlotId;
                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => onSelectSlot(slot.id)}
                        className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/20 border-amber-500/60 text-white'
                            : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Zap
                            className={`w-3.5 h-3.5 ${
                              isSelected ? 'text-amber-400' : 'text-slate-500'
                            }`}
                          />
                          <span className="font-semibold">{slot.name}</span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {slot.items?.length || 0} món
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 2: LIVE THEME TESTER                                         */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">Thử Nghiệm Bảng Màu & Theme</h4>
                <p className="text-[11px] text-slate-400">Xem trước tức thì không lưu vào CSDL</p>
              </div>
              <button
                type="button"
                onClick={onResetTheme}
                title="Khôi phục lại Theme mặc định của sự kiện"
                className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 bg-amber-500/10 px-2 py-1 rounded-lg transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Gốc</span>
              </button>
            </div>

            {/* Theme Presets Grid */}
            <div className="space-y-2">
              {THEME_PRESETS.map((preset) => {
                const activePresetId = customThemePresetId || defaultThemePresetId;
                const isSelected = activePresetId === preset.id;
                const isDefault = defaultThemePresetId === preset.id;
                const isCustomOverride = customThemePresetId === preset.id && !isDefault;
                const PresetIcon = PRESET_ICONS[preset.id] || Sparkles;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      if (customThemePresetId === preset.id) {
                        onSelectThemePreset(null);
                      } else if (preset.id === defaultThemePresetId) {
                        onSelectThemePreset(null);
                      } else {
                        onSelectThemePreset(preset.id);
                      }
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-slate-800 border-amber-400 text-white shadow-md ring-1 ring-amber-400/30'
                        : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Theme Icon Badge */}
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                        style={{ backgroundColor: preset.primary }}
                      >
                        <PresetIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold block text-xs">{preset.name}</span>
                          {isDefault && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Gốc
                            </span>
                          )}
                          {isCustomOverride && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-md font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Thử nghiệm
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block truncate max-w-[170px]">
                          {preset.subtitle}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/70 text-slate-300 shrink-0 font-medium">
                      {preset.badge}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Atmosphere Effects */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hiệu ứng Khí quyển (Atmosphere)</span>
                  </h4>
                  <p className="text-[11px] text-slate-400">Hiệu ứng hoa lá & pháo rơi</p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleAtmosphere(!enableAtmosphere)}
                  className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                    enableAtmosphere ? 'bg-amber-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      enableAtmosphere ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Atmosphere type selector */}
              {enableAtmosphere && (
                <div className="grid grid-cols-2 gap-1.5 pt-2">
                  {ATMOSPHERE_OPTIONS.map((opt) => {
                    const isCurrent = atmosphereType === opt.type;
                    const OptIcon = opt.icon;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => onSelectAtmosphereType(opt.type)}
                        className={`p-2 rounded-xl border text-left transition cursor-pointer flex items-center gap-2 ${
                          isCurrent
                            ? 'bg-amber-500/20 border-amber-400 text-white font-bold'
                            : 'bg-slate-800/40 border-slate-700 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <OptIcon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="block text-[11px] truncate">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Corner Stickers */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-xs">Họa tiết góc (Corner Stickers)</h4>
                <p className="text-[11px] text-slate-400">Cành mai, lồng đèn, dải lụa góc</p>
              </div>
              <button
                type="button"
                onClick={() => onToggleCornerStickers(!enableCornerStickers)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                  enableCornerStickers ? 'bg-amber-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                    enableCornerStickers ? 'translate-x-5' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════════════════════════════════ */}
        {/* TAB 3: PRE-PUBLISH QA CHECKLIST                                  */}
        {/* ═════════════════════════════════════════════════════════════════ */}
        {activeTab === 'qa' && (
          <div className="space-y-6">
            {/* Score & Summary Card */}
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
                      className={`text-xs font-bold ${
                        qaStats.isReady ? 'text-emerald-400' : 'text-amber-400'
                      }`}
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

            {/* Checklist Items */}
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
                      {item.status === 'FAILED' && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
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

            {/* Publish CTA Button */}
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
        )}
      </div>
    </aside>
  );
}
