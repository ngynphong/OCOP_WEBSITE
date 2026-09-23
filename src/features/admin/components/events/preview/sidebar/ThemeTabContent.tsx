import { Sparkles, RotateCcw } from 'lucide-react';
import type { AtmosphereEffectType } from '@/features/events/types/eventTypes';
import { THEME_PRESETS } from '@/features/events/constants/themePresets';
import { PRESET_ICONS, ATMOSPHERE_OPTIONS } from './constants';

interface ThemeTabContentProps {
  customThemePresetId: string | null;
  defaultThemePresetId?: string;
  enableAtmosphere: boolean | null;
  atmosphereType: AtmosphereEffectType | null;
  enableCornerStickers: boolean | null;
  onSelectThemePreset: (presetId: string | null) => void;
  onToggleAtmosphere: (enabled: boolean) => void;
  onSelectAtmosphereType: (type: AtmosphereEffectType) => void;
  onToggleCornerStickers: (enabled: boolean) => void;
  onResetTheme: () => void;
}

export const ThemeTabContent = ({
  customThemePresetId,
  defaultThemePresetId,
  enableAtmosphere,
  atmosphereType,
  enableCornerStickers,
  onSelectThemePreset,
  onToggleAtmosphere,
  onSelectAtmosphereType,
  onToggleCornerStickers,
  onResetTheme,
}: ThemeTabContentProps) => (
  <div className="space-y-6">
    {/* Theme Presets */}
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
);
