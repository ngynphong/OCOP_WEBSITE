'use client';

import React, { useState } from 'react';
import { FiX, FiUserPlus, FiInfo, FiCheck } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { useProductionBatch } from '../hooks/useProductionBatch';
import { ISupplyChainLot, TAssignmentRole } from '../types/supplyChainTypes';

interface CreateAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  lot: ISupplyChainLot;
}

export const CreateAssignmentModal: React.FC<CreateAssignmentModalProps> = ({
  isOpen,
  onClose,
  lot,
}) => {
  const [userIdentifier, setUserIdentifier] = useState('');
  const [templateStepId, setTemplateStepId] = useState<string>('ALL');
  const [role, setRole] = useState<TAssignmentRole>('ASSIGNEE');
  const [notes, setNotes] = useState('');
  const [validationError, setValidationError] = useState('');

  const { useAssignUserToLot } = useProductionBatch();
  const assignMutation = useAssignUserToLot();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userIdentifier.trim()) {
      setValidationError('Vui lòng nhập Email hoặc Mã tài khoản của xã viên / nông dân');
      return;
    }

    setValidationError('');
    try {
      await assignMutation.mutateAsync({
        lotId: lot.id,
        data: {
          userIdentifier: userIdentifier.trim(),
          templateStepId: templateStepId !== 'ALL' ? Number(templateStepId) : undefined,
          role,
          notes: notes.trim() || undefined,
        },
      });
      setUserIdentifier('');
      setNotes('');
      setTemplateStepId('ALL');
      onClose();
    } catch {
      // Error handled by react-query hook toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-stone-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FiUserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-snug">Phân công nhân sự thực hiện</h3>
              <p className="text-xs text-emerald-100">
                Lô: <span className="font-semibold text-white">{lot.lotCode}</span> (
                {lot.productName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex gap-3 text-xs text-emerald-800">
            <FiInfo className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Nông dân/xã viên sau khi được phân công sẽ nhìn thấy nhiệm vụ trên{' '}
              <strong>App Mobile</strong> và có quyền ghi nhật ký trực tiếp cho công đoạn được giao
              mà không cần tài khoản Shop.
            </span>
          </div>

          {/* User identifier */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Email hoặc Mã ID xã viên / nông dân <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={userIdentifier}
              onChange={(e) => {
                setUserIdentifier(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="VD: nongdan1@gmail.com hoặc mã tài khoản"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
            />
            {validationError && (
              <p className="text-xs text-rose-500 mt-1 font-medium">{validationError}</p>
            )}
          </div>

          {/* Step selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Phạm vi công đoạn phụ trách
            </label>
            <select
              value={templateStepId}
              onChange={(e) => setTemplateStepId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 outline-none transition-all bg-white"
            >
              <option value="ALL">Toàn bộ công đoạn trong lô (Giao toàn diện)</option>
              {lot.templateSteps?.map((step) => (
                <option key={step.id} value={step.id}>
                  Bước {step.stepOrder}: {step.title} ({step.stepType})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-stone-500 mt-1">
              Chọn công đoạn cụ thể để nông dân chỉ phụ trách công việc đó, hoặc chọn giao toàn
              diện.
            </p>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Vai trò nhiệm vụ
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('ASSIGNEE')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                  role === 'ASSIGNEE'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-800 font-semibold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                Người thực hiện
              </button>
              <button
                type="button"
                onClick={() => setRole('SUPERVISOR')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                  role === 'SUPERVISOR'
                    ? 'border-amber-600 bg-amber-50/80 text-amber-800 font-semibold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                Giám sát viên
              </button>
              <button
                type="button"
                onClick={() => setRole('AUDITOR')}
                className={`px-3 py-2.5 rounded-xl border text-xs font-medium transition-all text-center ${
                  role === 'AUDITOR'
                    ? 'border-purple-600 bg-purple-50/80 text-purple-800 font-semibold shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                Kiểm toán / KCS
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Ghi chú / Hướng dẫn công việc
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Chú ý ghi chép đúng lượng phân hữu cơ và chụp ảnh thực địa..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-stone-100 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={assignMutation.isPending}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={assignMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[140px] flex items-center justify-center gap-2"
            >
              {assignMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang lưu...</span>
                </>
              ) : (
                <>
                  <FiCheck className="w-4 h-4" />
                  <span>Xác nhận phân công</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
