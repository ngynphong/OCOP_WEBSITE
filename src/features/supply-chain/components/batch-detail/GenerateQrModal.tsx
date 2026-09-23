'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/AppButton';

interface GenerateQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  lotQuantity?: number;
  lotUnit?: string;
  qrCount: number;
  onQrCountChange: (count: number) => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function GenerateQrModal({
  isOpen,
  onClose,
  lotQuantity,
  lotUnit,
  qrCount,
  onQrCountChange,
  onConfirm,
  isPending,
}: GenerateQrModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sinh mã QR (GS1 Digital Link)"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Lô sản xuất này có số lượng sản phẩm dự kiến là{' '}
          <strong className="text-emerald-700">
            {lotQuantity} {lotUnit}
          </strong>
          . Bạn có thể sinh số lượng mã QR tương ứng với số lượng đóng gói thực tế.
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số lượng mã QR cần sinh
          </label>
          <input
            type="number"
            min="1"
            max="100000"
            value={qrCount}
            onChange={(e) => onQrCountChange(parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button variant="primary" onClick={onConfirm} isLoading={isPending}>
            Xác nhận sinh mã
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default GenerateQrModal;
