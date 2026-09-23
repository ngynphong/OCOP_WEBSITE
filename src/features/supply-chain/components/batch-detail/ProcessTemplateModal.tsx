'use client';

import React from 'react';
import { FiZap } from 'react-icons/fi';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';
import type { IProcessTemplateStep } from '@/features/supply-chain/types/supplyChainTypes';

interface ProcessTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateName?: string;
  steps?: IProcessTemplateStep[];
}

export function ProcessTemplateModal({
  isOpen,
  onClose,
  templateName,
  steps = [],
}: ProcessTemplateModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quy trình: ${templateName || 'Không xác định'}`}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-stone-500">
          Dưới đây là danh sách các bước chuẩn để thực hiện cho lô sản xuất này.
        </p>
        {steps.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-xl text-stone-500 text-sm">
            Không có chi tiết quy trình.
          </div>
        ) : (
          <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className="p-4 bg-stone-50 border border-stone-100 rounded-xl flex gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1 flex flex-col gap-1.5">
                  <h4 className="font-bold text-stone-800 text-sm">{step.title}</h4>
                  {step.description && (
                    <p className="text-xs text-stone-600 leading-relaxed bg-white p-2 rounded border border-stone-100">
                      {step.description}
                    </p>
                  )}
                  {step.estimatedDays !== undefined && step.estimatedDays !== null && (
                    <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-1 bg-emerald-50/50 w-fit px-2 py-0.5 rounded">
                      <FiZap size={10} />
                      {idx === 0
                        ? `Sau khi tạo lô: ${step.estimatedDays} ngày`
                        : `Sau bước "${steps[idx - 1]?.title || 'trước'}": ${step.estimatedDays} ngày`}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-end pt-2 border-t border-stone-100 mt-2">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ProcessTemplateModal;
