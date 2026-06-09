/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/AppButton';

interface B2BShippingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    carrierName: string;
    trackingNumber: string;
    driverName: string;
    driverPhone: string;
    licensePlate: string;
    note: string;
  }) => void;
  isLoading: boolean;
  initialData?: {
    carrierName?: string;
    trackingNumber?: string;
    driverName?: string;
    driverPhone?: string;
    licensePlate?: string;
    note?: string;
  };
}

export function B2BShippingModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  initialData,
}: B2BShippingModalProps) {
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (initialData) {
      setCarrierName(initialData.carrierName || '');
      setTrackingNumber(initialData.trackingNumber || '');
      setDriverName(initialData.driverName || '');
      setDriverPhone(initialData.driverPhone || '');
      setLicensePlate(initialData.licensePlate || '');
      setNote(initialData.note || '');
    } else {
      setCarrierName('');
      setTrackingNumber('');
      setDriverName('');
      setDriverPhone('');
      setLicensePlate('');
      setNote('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onConfirm({
      carrierName,
      trackingNumber,
      driverName,
      driverPhone,
      licensePlate,
      note,
    });
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-4xl max-w-lg w-full p-8 border border-stone-100 shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <h3 className="text-xl font-black text-stone-900 mb-4">Cập Nhật Xe Giao Hàng Sỉ B2B</h3>
        <p className="text-stone-500 text-sm mb-6 leading-relaxed">
          Thiết lập thông tin nhà xe chành xe, tài xế vận chuyển và mã số theo dõi cho lô hàng sỉ
          này.
        </p>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                Tên nhà xe / Chành xe
              </label>
              <input
                type="text"
                value={carrierName}
                onChange={(e) => setCarrierName(e.target.value)}
                placeholder="VD: Thành Bưởi, Phương Trang..."
                className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                Mã vận đơn nhà xe
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Nhập mã vận đơn..."
                className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                Tên tài xế
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Nhập tên tài xế..."
                className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600"
              />
            </div>
            <div>
              <label className="text-xs font-black uppercase text-stone-500 block mb-2">
                Số điện thoại tài xế
              </label>
              <input
                type="text"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="Nhập SĐT tài xế..."
                className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-black uppercase text-stone-500 block mb-2">
              Biển số xe giao
            </label>
            <input
              type="text"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="VD: 29C-123.45..."
              className="w-full p-3 rounded-xl border text-gray-700 border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600"
            />
          </div>

          <div>
            <label className="text-xs font-black uppercase text-stone-500 block mb-2">
              Ghi chú giao nhận
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Xe xuất bến lúc 9h sáng, liên hệ tài xế trước khi đến..."
              className="w-full h-20 p-4 rounded-xl border text-gray-700 border-stone-200 focus:outline-none focus:ring-2 focus:ring-green-600/40 focus:border-green-600 text-sm resize-none"
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 rounded-xl font-black uppercase text-xs tracking-wider"
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit}
            isLoading={isLoading}
            className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-black uppercase text-xs tracking-wider"
          >
            Lưu thông tin
          </Button>
        </div>
      </div>
    </div>
  );
}
