'use client';

import type {
  TimeScenario,
  SidebarTab,
  QACheckItem,
} from '@/features/admin/hooks/useAdminEventPreview';
import type { EventDetailResponse, AtmosphereEffectType } from '@/features/events/types/eventTypes';
import type { EventFlashSale } from '@/features/events/types/eventCommerceTypes';
import {
  SidebarHeader,
  SidebarTabNav,
  SimulatorTabContent,
  ThemeTabContent,
  QaTabContent,
} from './sidebar';

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
      <SidebarHeader eventName={event.name} onClose={onClose} />

      <SidebarTabNav
        activeTab={activeTab}
        qaStats={qaStats}
        qaChecklist={qaChecklist}
        onTabChange={onTabChange}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-slate-300 text-xs">
        {activeTab === 'simulator' && (
          <SimulatorTabContent
            timeScenario={timeScenario}
            selectedSlotId={selectedSlotId}
            isCustomerView={isCustomerView}
            flashSales={flashSales}
            onTimeScenarioChange={onTimeScenarioChange}
            onSelectSlot={onSelectSlot}
            onToggleCustomerView={onToggleCustomerView}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeTabContent
            customThemePresetId={customThemePresetId}
            defaultThemePresetId={defaultThemePresetId}
            enableAtmosphere={enableAtmosphere}
            atmosphereType={atmosphereType}
            enableCornerStickers={enableCornerStickers}
            onSelectThemePreset={onSelectThemePreset}
            onToggleAtmosphere={onToggleAtmosphere}
            onSelectAtmosphereType={onSelectAtmosphereType}
            onToggleCornerStickers={onToggleCornerStickers}
            onResetTheme={onResetTheme}
          />
        )}

        {activeTab === 'qa' && (
          <QaTabContent
            qaChecklist={qaChecklist}
            qaStats={qaStats}
            onOpenPublishModal={onOpenPublishModal}
          />
        )}
      </div>
    </aside>
  );
}
