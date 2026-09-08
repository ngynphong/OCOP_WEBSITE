import React from 'react';
import { Button } from '@/components/ui/AppButton';
import { IProcessTemplateStep } from '../../types/supplyChainTypes';

export interface FarmingHarvestBannerProps {
  isAllFarmingStepsCompleted: boolean;
  uncompletedFarmingSteps: IProcessTemplateStep[];
  onOpenHarvestModal: () => void;
}

export const FarmingHarvestBanner: React.FC<FarmingHarvestBannerProps> = ({
  isAllFarmingStepsCompleted,
  uncompletedFarmingSteps,
  onOpenHarvestModal,
}) => {
  return (
    <div
      className={`p-4 rounded-xl mb-6 border transition-all ${
        isAllFarmingStepsCompleted
          ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
          : 'bg-amber-50/80 text-amber-900 border-amber-200'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-sm flex items-center gap-2">
            <span className="text-lg">🌾</span>{' '}
            {isAllFarmingStepsCompleted
              ? 'Đủ điều kiện thu hoạch vụ mùa!'
              : 'Điều kiện tiên quyết: Thu hoạch vụ mùa'}
          </h4>
          <p className="text-xs mt-1 leading-relaxed">
            {isAllFarmingStepsCompleted
              ? '100% công đoạn canh tác đã được hoàn tất. Bấm Hoàn tất thu hoạch để chuyển sang Giai đoạn 2 (Chế biến/Đóng gói).'
              : `Chưa thể thu hoạch: Cần ghi nhận đủ ${uncompletedFarmingSteps.length} công đoạn canh tác còn thiếu theo quy trình chuẩn OCOP.`}
          </p>
          {!isAllFarmingStepsCompleted && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="text-[11px] font-semibold text-amber-800 mr-1">Còn thiếu:</span>
              {uncompletedFarmingSteps.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-0.5 bg-amber-100/90 text-amber-900 rounded-md text-[11px] font-medium border border-amber-200"
                >
                  Bước {s.stepOrder}: {s.title}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="primary"
          disabled={!isAllFarmingStepsCompleted}
          onClick={onOpenHarvestModal}
          className={`whitespace-nowrap ${
            isAllFarmingStepsCompleted
              ? 'bg-emerald-600 hover:bg-emerald-700 shadow-sm'
              : 'bg-stone-300 text-stone-700 cursor-not-allowed border-none shadow-none hover:bg-stone-300 opacity-60'
          }`}
          title={!isAllFarmingStepsCompleted ? 'Chưa hoàn thành các bước canh tác' : ''}
        >
          Hoàn tất thu hoạch
        </Button>
      </div>
    </div>
  );
};
