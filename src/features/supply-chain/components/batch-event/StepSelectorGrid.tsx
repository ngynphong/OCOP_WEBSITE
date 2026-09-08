import React from 'react';
import { FiCheckSquare } from 'react-icons/fi';
import { IProcessTemplateStep } from '../../types/supplyChainTypes';
import { JournalStepType } from '@/features/products/types/productTypes';
import { FARMING_PHASES, PROCESSING_PHASES } from '@/features/products/utils/ProductConstants';

export interface StepSelectorGridProps {
  templateSteps: IProcessTemplateStep[];
  activeTab: 'FARMING' | 'PROCESSING';
  selectedStepId: string;
  onSelectStep: (stepId: string) => void;
  isStepCompleted: (stepId: number) => boolean;
  errorMessage?: string;
}

export const StepSelectorGrid: React.FC<StepSelectorGridProps> = ({
  templateSteps,
  activeTab,
  selectedStepId,
  onSelectStep,
  isStepCompleted,
  errorMessage,
}) => {
  const filteredSteps = templateSteps?.filter((step) => {
    if (activeTab === 'FARMING') {
      return FARMING_PHASES.includes(step.stepType as JournalStepType);
    }
    return PROCESSING_PHASES.includes(step.stepType as JournalStepType);
  });

  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider mb-4 pb-2 border-b border-stone-100 flex items-center gap-2">
        <FiCheckSquare className="text-emerald-600" /> Chọn công đoạn thực hiện
      </h3>
      <div className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredSteps?.map((step) => {
            const completed = isStepCompleted(step.id);
            const isSelected = selectedStepId === step.id.toString();

            return (
              <label
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                  completed
                    ? 'border-stone-200 bg-stone-50 opacity-60 cursor-not-allowed'
                    : isSelected
                      ? 'border-emerald-500 bg-emerald-50 shadow-sm cursor-pointer'
                      : 'border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 cursor-pointer'
                }`}
              >
                <div className="pt-0.5">
                  <input
                    type="radio"
                    name="templateStepId"
                    value={step.id.toString()}
                    checked={isSelected}
                    onChange={(e) => {
                      if (!completed) onSelectStep(e.target.value);
                    }}
                    disabled={completed}
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 mt-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold text-sm ${
                      completed
                        ? 'text-stone-500 line-through'
                        : isSelected
                          ? 'text-emerald-900'
                          : 'text-stone-800'
                    }`}
                  >
                    Bước {step.stepOrder}: {step.title}{' '}
                    {completed && (
                      <span className="text-xs font-normal text-emerald-600 ml-1">
                        (Đã hoàn thành)
                      </span>
                    )}
                  </p>
                  {step.description && (
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${completed ? 'text-stone-400' : 'text-stone-500'}`}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {errorMessage && <p className="text-red-500 text-xs mt-2">{errorMessage}</p>}
      </div>
    </div>
  );
};
