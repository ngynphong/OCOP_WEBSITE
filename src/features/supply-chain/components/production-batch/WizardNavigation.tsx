'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/AppButton';

interface WizardNavigationProps {
  step: number;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
}

export default function WizardNavigation({
  step,
  onPrev,
  onNext,
  onSubmit,
  onCancel,
  isPending,
}: WizardNavigationProps) {
  return (
    <div className="flex justify-between items-center pt-2">
      <Button
        type="button"
        variant="outline"
        onClick={step === 1 ? onCancel : onPrev}
        className="px-6 py-2.5 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 hover:text-slate-900"
      >
        {step === 1 ? (
          'Hủy bỏ'
        ) : (
          <>
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </>
        )}
      </Button>

      {step < 4 ? (
        <Button
          type="button"
          onClick={onNext}
          className="px-8 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-md"
        >
          Tiếp tục <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isPending}
          className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md shadow-blue-500/20"
        >
          {isPending ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Đang xử lý...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" /> Xác nhận & Tạo lô
            </>
          )}
        </Button>
      )}
    </div>
  );
}
