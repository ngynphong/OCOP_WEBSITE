'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiClock, FiPlus } from 'react-icons/fi';
import { Button } from '@/components/ui/AppButton';
import { useProductionBatch } from '@/features/supply-chain/hooks/useProductionBatch';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';
import { AddBatchEventForm } from '@/features/supply-chain/components/AddBatchEventForm';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import {
  ILotQrCode,
  ILotAuditLog,
  TLotStatus,
} from '@/features/supply-chain/types/supplyChainTypes';

export default function ProductionBatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lotId = Number(params.id);

  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'TIMELINE' | 'PACKAGING' | 'AUDIT'>('INFO');

  const { useGetProductionBatchDetail, useGenerateQrCodes, useGetLotQrCodes, useGetLotAuditLogs } =
    useProductionBatch();
  const { data: lotRes, isLoading } = useGetProductionBatchDetail(lotId);
  const lot = lotRes?.data;

  const { data: qrsRes } = useGetLotQrCodes(lotId);
  const qrs = qrsRes?.data || [];
  const generateQrMutation = useGenerateQrCodes();

  const { data: auditLogsRes } = useGetLotAuditLogs(lotId, 1, 50);
  const auditLogs = auditLogsRes?.content || [];

  const templateSteps = lot?.templateSteps || [];

  const handleGenerateQrs = () => {
    const count = parseInt(window.prompt('Nhập số lượng mã QR cần sinh:', '10') || '0', 10);
    if (count > 0) {
      generateQrMutation.mutate({ lotId, count });
    }
  };

  if (isLoading) return <div className="p-8 text-center text-stone-500">Đang tải dữ liệu...</div>;
  if (!lot) return <div className="p-8 text-center text-red-500">Không tìm thấy lô sản xuất</div>;

  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-stone-100 rounded-full transition-colors flex items-center gap-2 text-stone-600 font-medium"
        >
          <FiArrowLeft /> Quay lại
        </button>

        {lot?.status !== 'ACTIVE' && lot?.status !== 'SOLD_OUT' && (
          <Button
            variant="primary"
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={() => setIsAddEventModalOpen(true)}
          >
            <FiPlus className="mr-2" /> Ghi nhận công đoạn
          </Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-6 border-b border-stone-100">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-1">Lô SX: {lot.lotCode}</h1>
              <p className="text-stone-500 text-sm">
                Sản phẩm: <span className="font-medium text-stone-900">{lot.productName}</span>
              </p>
            </div>
            <div className="mt-1">
              <LotStatusBadge status={lot.status as TLotStatus} />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex border-b border-stone-200">
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'INFO'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('INFO')}
          >
            Thông tin chung
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'TIMELINE'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('TIMELINE')}
          >
            Nhật ký truy xuất
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'PACKAGING'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('PACKAGING')}
          >
            Đóng gói & Mã QR
          </button>
          <button
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'AUDIT'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
            }`}
            onClick={() => setActiveTab('AUDIT')}
          >
            Lịch sử thay đổi
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'INFO' && (
            <div className="bg-stone-50 rounded-xl p-5 border border-stone-100 flex flex-col gap-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Sản phẩm
                  </h3>
                  <p className="font-semibold text-stone-900">{lot.productName}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{lot.variantName}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Quy trình áp dụng
                  </h3>
                  <p className="font-semibold text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded border border-emerald-100">
                    {lot.processTemplateName || 'Không xác định'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Cơ sở sản xuất
                  </h3>
                  <p className="font-semibold text-stone-900">{lot.shopName}</p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Trạng thái
                  </h3>
                  <div>
                    <LotStatusBadge status={lot.status as TLotStatus} />
                  </div>
                </div>
              </div>

              <hr className="border-stone-200" />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Sản lượng
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-stone-900">{lot.quantity}</p>
                    <p className="text-sm font-medium text-stone-500">{lot.unit || 'sản phẩm'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Tồn kho hiện tại
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className="text-xl font-bold text-stone-900">{lot.remainingQuantity}</p>
                    <p className="text-sm font-medium text-stone-500">{lot.unit || 'sản phẩm'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Ngày sản xuất
                  </h3>
                  <p className="font-semibold text-stone-900">
                    {lot.productionDate
                      ? new Date(lot.productionDate).toLocaleDateString('vi-VN')
                      : 'Chưa có'}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                    Hạn sử dụng
                  </h3>
                  <p className="font-semibold text-stone-900">
                    {lot.expiryDate
                      ? new Date(lot.expiryDate).toLocaleDateString('vi-VN')
                      : 'Chưa xác định'}
                  </p>
                </div>
              </div>

              {lot.notes && (
                <>
                  <hr className="border-stone-200" />
                  <div>
                    <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">
                      Ghi chú
                    </h3>
                    <p className="text-sm text-stone-700 whitespace-pre-wrap">{lot.notes}</p>
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'TIMELINE' && (
            <div className="mt-4">
              <BatchEventTimeline events={lot.events || []} />
            </div>
          )}

          {activeTab === 'PACKAGING' && (
            <div className="space-y-6">
              {lot.status !== 'ACTIVE' && lot.status !== 'SOLD_OUT' ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg border border-amber-200">
                  Vui lòng thêm sự kiện &quot;Đóng gói&quot; vào Nhật ký truy xuất để Lô sản xuất
                  được kích hoạt. Sau khi kích hoạt, bạn mới có thể sinh mã QR và tự động cộng Tồn
                  kho.
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Danh sách Mã QR (GS1 Digital Link)</h3>
                    <Button
                      variant="primary"
                      onClick={handleGenerateQrs}
                      isLoading={generateQrMutation.isPending}
                    >
                      Sinh mã QR
                    </Button>
                  </div>

                  {qrs.length === 0 ? (
                    <div className="text-center text-stone-500 py-8 border-2 border-dashed border-stone-200 rounded-lg">
                      Chưa có mã QR nào được sinh cho lô này.
                    </div>
                  ) : (
                    <div className="border border-stone-200 rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-stone-200 text-sm">
                        <thead className="bg-stone-50">
                          <tr>
                            <th className="px-6 py-3 text-left font-medium text-stone-500">
                              Serial
                            </th>
                            <th className="px-6 py-3 text-left font-medium text-stone-500">
                              Link Truy xuất
                            </th>
                            <th className="px-6 py-3 text-left font-medium text-stone-500">
                              Trạng thái
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200 bg-white">
                          {qrs.map((qr: ILotQrCode) => (
                            <tr key={qr.id}>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {qr.serialNumber}
                              </td>
                              <td className="px-6 py-4 truncate max-w-xs text-emerald-600 hover:underline">
                                <a
                                  href={qr.qrUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={qr.qrUrl}
                                >
                                  {qr.qrUrl}
                                </a>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-stone-100 text-stone-800`}
                                >
                                  {qr.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          {activeTab === 'AUDIT' && (
            <div className="space-y-4">
              <h3 className="text-lg text-stone-800 font-semibold mb-4">
                Lịch sử thay đổi (Audit Log)
              </h3>
              {auditLogs.length === 0 ? (
                <div className="text-center text-stone-500 py-8 border-2 border-dashed border-stone-200 rounded-lg">
                  Chưa có lịch sử thay đổi nào.
                </div>
              ) : (
                <div className="border border-stone-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-stone-200 text-sm">
                    <thead className="bg-stone-50">
                      <tr>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">
                          Thời gian
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">
                          Người thực hiện
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">
                          Hành động
                        </th>
                        <th className="px-6 py-3 text-left font-medium text-stone-500">Dữ liệu</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200 bg-white">
                      {auditLogs.map((log: ILotAuditLog) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString('vi-VN')}
                          </td>
                          <td className="px-6 py-4 font-medium text-stone-900">{log.actorEmail}</td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-1 inline-flex text-xs font-semibold rounded-full bg-stone-100 text-stone-800">
                              {log.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-stone-600">
                            <details className="cursor-pointer">
                              <summary className="font-medium text-emerald-600 hover:text-emerald-700">
                                Xem chi tiết
                              </summary>
                              <div className="mt-2 p-2 bg-stone-50 rounded border border-stone-200 max-w-sm max-h-40 overflow-y-auto">
                                {log.beforeValue && (
                                  <div className="mb-2">
                                    <p className="font-semibold text-stone-700">Before:</p>
                                    <pre className="text-[10px]">
                                      {JSON.stringify(log.beforeValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                                {log.afterValue && (
                                  <div>
                                    <p className="font-semibold text-stone-700">After:</p>
                                    <pre className="text-[10px]">
                                      {JSON.stringify(log.afterValue, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </details>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {lot?.status !== 'ACTIVE' && lot?.status !== 'SOLD_OUT' && (
        <AddBatchEventForm
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          lotId={lotId}
          productId={lot.productId || 0}
          templateSteps={templateSteps}
        />
      )}
    </div>
  );
}
