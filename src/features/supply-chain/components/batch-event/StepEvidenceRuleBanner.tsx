import React from 'react';
import { FiCamera } from 'react-icons/fi';
import { IEvidenceRule } from '../../types/supplyChainTypes';

export interface StepEvidenceRuleBannerProps {
  stepEvidenceRule: IEvidenceRule;
}

export const StepEvidenceRuleBanner: React.FC<StepEvidenceRuleBannerProps> = ({
  stepEvidenceRule,
}) => {
  if (stepEvidenceRule.photo !== 'REQUIRED' && stepEvidenceRule.gps !== 'REQUIRED') {
    return null;
  }

  return (
    <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <FiCamera className="text-amber-700 shrink-0" size={16} />
        <span className="text-xs font-bold text-amber-900">
          Quy tắc bằng chứng OCOP của bước này:
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        {stepEvidenceRule.photo === 'REQUIRED' && (
          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200">
            📷 Ảnh bắt buộc
          </span>
        )}
        {stepEvidenceRule.gps === 'REQUIRED' && (
          <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-md border border-blue-200">
            📍 GPS bắt buộc
          </span>
        )}
      </div>
    </div>
  );
};
