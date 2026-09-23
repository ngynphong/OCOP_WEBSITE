'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiCheckCircle, FiXCircle, FiClock, FiFileText } from 'react-icons/fi';
import {
  useAdminLotDetailQuery,
  useVerifyLotMutation,
} from '@/features/admin/hooks/useAdminSupplyChain';
import { Button } from '@/components/ui/AppButton';
import { Modal } from '@/components/ui/Modal';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';

export default function AdminLotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lotId = Number(params.id);

  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [comment, setComment] = useState('');

  const { data: lotRes, isLoading } = useAdminLotDetailQuery(lotId);
  const verifyLotMutation = useVerifyLotMutation();

  const lot = lotRes?.data;

  const handleVerify = async () => {
    try {
      await verifyLotMutation.mutateAsync({
        id: lotId,
        data: {
          newStatus: 'VERIFIED',
          newLevel: 'LEVEL_3',
          comment,
        },
      });
      setIsVerifyModalOpen(false);
      setComment('');
    } catch {
      // error toast already handled in mutation
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    try {
      await verifyLotMutation.mutateAsync({
        id: lotId,
        data: {
          newStatus: 'REJECTED',
          comment,
        },
      });
      setIsRejectModalOpen(false);
      setComment('');
    } catch {
      // error toast already handled in mutation
    }
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu...</div>;
  if (!lot) return <div className="p-8 text-center text-red-500">Không tìm thấy lô hàng</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2 text-stone-600 font-medium"
        >
          <FiArrowLeft /> Quay lại
        </button>

        {lot.verificationStatus === 'SUBMITTED_FOR_VERIFICATION' && (
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                setComment('');
                setIsRejectModalOpen(true);
              }}
            >
              <FiXCircle className="mr-2" /> Từ chối
            </Button>
            <Button
              variant="primary"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => {
                setComment('');
                setIsVerifyModalOpen(true);
              }}
            >
              <FiCheckCircle className="mr-2" /> Phê duyệt (Level 3)
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-stone-900">{lot.lotCode}</h1>
                <p className="text-stone-500 mt-1">Sản phẩm: {lot.productName}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  lot.verificationStatus === 'VERIFIED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : lot.verificationStatus === 'REJECTED'
                      ? 'bg-red-100 text-red-800'
                      : lot.verificationStatus === 'SUBMITTED_FOR_VERIFICATION'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-stone-100 text-stone-800'
                }`}
              >
                {lot.verificationStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-stone-500 font-medium">Số lượng</p>
                <p className="text-stone-900">
                  {lot.quantity} {lot.unit}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Cửa hàng</p>
                <p className="text-stone-900">{lot.shopName}</p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Ngày sản xuất</p>
                <p className="text-stone-900">
                  {lot.productionDate ? format(new Date(lot.productionDate), 'dd/MM/yyyy') : '---'}
                </p>
              </div>
              <div>
                <p className="text-stone-500 font-medium">Hạn sử dụng</p>
                <p className="text-stone-900">
                  {lot.expiryDate ? format(new Date(lot.expiryDate), 'dd/MM/yyyy') : '---'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h3 className="font-bold text-stone-900 text-lg mb-4 flex items-center gap-2">
              <FiFileText className="text-emerald-600" /> Tài liệu & Kiểm định
            </h3>
            {(() => {
              const allDocs = (lot.events || []).flatMap((e) =>
                (e.evidenceDocuments || []).map((doc) => ({
                  ...doc,
                  stepTitle: e.stepTitle,
                  stepType: e.stepType,
                })),
              );

              if (allDocs.length === 0) {
                return (
                  <p className="text-stone-500 italic">
                    Lô hàng này chưa cập nhật tài liệu hoặc bằng chứng kiểm định.
                  </p>
                );
              }

              return (
                <div className="space-y-4">
                  {allDocs.map((doc, index) => (
                    <div
                      key={doc.id || index}
                      className="p-4 bg-stone-50 rounded-lg border border-stone-200"
                    >
                      <p className="font-medium text-stone-900">
                        {doc.fileName || doc.documentType || 'Tài liệu minh chứng'}
                      </p>
                      <p className="text-sm text-stone-500">
                        Công đoạn: {doc.stepTitle || doc.stepType || '---'}
                      </p>
                      {doc.issuedBy && (
                        <p className="text-sm text-stone-500">Đơn vị phát hành: {doc.issuedBy}</p>
                      )}
                      {doc.fileUrl && (
                        <div className="mt-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-600 text-sm hover:underline block"
                          >
                            <FiFileText className="inline mr-1" /> Xem tài liệu / chứng nhận
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-6">
            <h3 className="font-bold text-stone-900 text-lg mb-6 flex items-center gap-2">
              <FiClock className="text-emerald-600" /> Hành trình Truy xuất
            </h3>
            {lot.events && lot.events.length > 0 ? (
              <BatchEventTimeline events={lot.events} templateSteps={lot.templateSteps || []} />
            ) : (
              <div className="text-center py-8 bg-stone-50 rounded-lg border border-stone-200 border-dashed">
                <p className="text-stone-500">Chưa có dữ liệu hành trình sự kiện</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isVerifyModalOpen}
        onClose={() => setIsVerifyModalOpen(false)}
        title="Phê duyệt Lô hàng"
      >
        <div className="space-y-4">
          <p className="text-stone-600">
            Bạn đang phê duyệt lô hàng <strong>{lot.lotCode}</strong>. Lô hàng sẽ đạt Truy xuất
            nguồn gốc Level 3.
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Ghi chú phê duyệt (Tùy chọn)
            </label>
            <input
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
              placeholder="Nhập ghi chú..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsVerifyModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleVerify}
              isLoading={verifyLotMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              Xác nhận Phê duyệt
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Từ chối Lô hàng"
      >
        <div className="space-y-4">
          <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">
            Vui lòng cung cấp lý do từ chối để Seller có thể bổ sung hoặc khắc phục.
          </p>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-stone-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              rows={4}
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
              placeholder="VD: Thiếu giấy kiểm nghiệm chất lượng..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)}>
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleReject}
              isLoading={verifyLotMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              Xác nhận Từ chối
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
