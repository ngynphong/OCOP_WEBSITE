'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import { cn } from '@/lib/utils';
import { ISupplyChainLot, TLotStatus } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { SupplyChainTimeline } from '@/features/supply-chain/components/SupplyChainTimeline';
import { BatchEventTimeline } from '@/features/supply-chain/components/BatchEventTimeline';
import { StandardProcessWorkflow } from '@/features/supply-chain/components/StandardProcessWorkflow';
import { TraceabilityReportModal } from '@/features/supply-chain/components/TraceabilityReportModal';
import { FiPackage, FiShield, FiCheckCircle, FiAlertTriangle, FiStar } from 'react-icons/fi';
import { Sprout, UserCheck, CalendarRange } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';

const PublicTraceabilityPage = () => {
  const { lotCode } = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<ISupplyChainLot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchLotByCode = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await supplyChainApi.getLotByCode(lotCode as string);
      setLot(resp.data);
    } catch (error) {
      console.error('Fetch lot error', error);
    } finally {
      setLoading(false);
    }
  }, [lotCode]);

  useEffect(() => {
    if (lotCode) {
      fetchLotByCode();
    }
  }, [lotCode, fetchLotByCode]);

  if (loading)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-stone-500 font-medium animate-pulse">Đang truy xuất nguồn gốc...</p>
        </div>
      </div>
    );

  if (!lot)
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-10 text-center border border-stone-100">
          <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiShield size={40} />
          </div>
          <h1 className="text-2xl font-black text-stone-900 mb-2">Thông tin không hợp lệ</h1>
          <p className="text-stone-500 leading-relaxed">
            Xin lỗi, hệ thống không thể tìm thấy thông tin cho mã truy xuất này. Vui lòng kiểm tra
            lại mã QR hoặc URL.
          </p>
          <button
            onClick={() => router.push('/')}
            className="mt-8 w-full py-4 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-all"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );

  const isRecalled = lot.status === 'RECALLED';

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      {/* Header bar */}
      <div
        className={cn(
          'text-white px-4 py-3 flex flex-col items-center justify-center shadow-sm relative z-10',
          isRecalled ? 'bg-red-700' : 'bg-green-700',
        )}
      >
        {isRecalled ? (
          <span className="text-[10px] font-black uppercase tracking-widest text-yellow-300 flex items-center gap-1">
            <FiAlertTriangle /> Cảnh báo thu hồi
          </span>
        ) : (
          <span className="text-[10px] font-black uppercase tracking-widest text-green-200 flex items-center gap-1">
            <FiCheckCircle /> Hệ thống OCOP
          </span>
        )}
        <span className="text-sm font-black uppercase tracking-widest mt-1">
          TRUY XUẤT NGUỒN GỐC
        </span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Khối Xác minh Sản phẩm */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center gap-3">
            <FiShield className="w-5 h-5 text-green-600" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Thông tin Lô sản phẩm
            </h2>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Mã Lô</span>
              <span className="text-sm font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
                {lot.lotCode}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Trạng thái</span>
              <LotStatusBadge status={lot.status as TLotStatus} />
            </div>
            {lot.verificationLevel && (
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-stone-500">Mức độ xác minh</span>
                <span className="text-sm font-bold text-indigo-700">
                  {lot.verificationLevel.replace('_', ' ')}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Số lượng xuất</span>
              <span className="text-sm font-bold text-stone-900">
                {lot.quantity} {lot.unit}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-stone-500">Hạn sử dụng</span>
              <span className="text-sm font-bold text-stone-900">
                {lot.expiryDate ? format(new Date(lot.expiryDate), 'dd/MM/yyyy') : '---'}
              </span>
            </div>

            {/* Vùng trồng & Nhật ký mùa vụ */}
            {(lot.farmName || lot.responsiblePerson || lot.sourceCycleName) && (
              <div className="border-t border-stone-100 pt-3 flex flex-col gap-2.5">
                <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">
                  Vùng trồng & Nhật ký mùa vụ:
                </span>

                {lot.farmName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-500 flex items-center gap-1.5">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      Vườn / Trang trại
                    </span>
                    <span className="text-sm font-bold text-stone-900">{lot.farmName}</span>
                  </div>
                )}

                {lot.responsiblePerson && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-500 flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-blue-600" />
                      Người phụ trách
                    </span>
                    <span className="text-sm font-bold text-stone-900">
                      {lot.responsiblePerson}
                    </span>
                  </div>
                )}

                {lot.sourceCycleName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-500 flex items-center gap-1.5">
                      <CalendarRange className="w-4 h-4 text-amber-600" />
                      Vụ mùa
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-stone-900">
                        {lot.sourceCycleName}
                      </span>
                      {lot.sourceCycleStatus && (
                        <span
                          className={cn(
                            'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                            lot.sourceCycleStatus === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200',
                          )}
                        >
                          {lot.sourceCycleStatus === 'COMPLETED'
                            ? 'Đã hoàn tất vụ'
                            : 'Đang canh tác'}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Khối Thông tin Sản phẩm */}
        <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center gap-3">
            <FiPackage className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
              Thông tin Sản phẩm
            </h2>
          </div>
          <div className="p-4">
            <h3 className="text-base font-black text-stone-900 leading-tight mb-2">
              {lot.productName}
            </h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs text-stone-500">Cơ sở sản xuất:</span>
              <span className="text-xs font-bold text-emerald-700">{lot.shopName}</span>
            </div>
            {lot.trustScore !== undefined && (
              <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-lg border border-amber-100">
                <FiStar className="text-amber-500" />
                <span className="text-xs font-bold text-amber-900">
                  Điểm Tin Cậy: {lot.trustScore}/100
                </span>
              </div>
            )}
          </div>
        </div>

        {isRecalled && (
          <div className="w-full bg-red-50 border border-red-200 rounded-xl p-4 text-left">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <FiAlertTriangle size={18} />
              <h4 className="font-black">SẢN PHẨM BỊ THU HỒI</h4>
            </div>
            <p className="text-sm text-red-600 font-medium">
              Lô sản phẩm này đang nằm trong diện thu hồi. Vui lòng không sử dụng và liên hệ với nhà
              cung cấp.
            </p>
          </div>
        )}

        {/* Standard Process Workflow */}
        {lot.templateSteps && lot.templateSteps.length > 0 && (
          <StandardProcessWorkflow
            processTemplateName={lot.processTemplateName}
            templateSteps={lot.templateSteps}
            events={lot.events || []}
          />
        )}

        {/* Timeline Section */}
        <div className="bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden mt-1">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiCheckCircle className="w-5 h-5 text-indigo-500" />
              <h2 className="text-sm font-black text-stone-900 uppercase tracking-wider">
                Nhật ký chuỗi cung ứng Lô hàng
              </h2>
            </div>
          </div>
          <div className="p-5">
            {isRecalled ? (
              <div className="text-center py-8 bg-stone-50/50 rounded-xl border border-dashed border-red-200">
                <FiAlertTriangle className="mx-auto text-red-300 mb-2" size={24} />
                <p className="text-sm text-red-500 font-bold">
                  Thông tin hành trình đã bị ẩn do sản phẩm bị thu hồi.
                </p>
              </div>
            ) : lot.events && lot.events.length > 0 ? (
              <BatchEventTimeline events={lot.events} templateSteps={lot.templateSteps || []} />
            ) : lot.steps && lot.steps.length > 0 ? (
              <SupplyChainTimeline steps={lot.steps} compact={true} />
            ) : (
              <div className="text-center py-8 space-y-2">
                <FiPackage className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-sm font-bold text-stone-700">
                  Chưa có nhật ký sự kiện nào được ghi nhận cho lô sản xuất này
                </p>
                <p className="text-xs text-stone-400 max-w-sm mx-auto">
                  Các sự kiện canh tác, chế biến và kiểm định thực tế sẽ xuất hiện tại đây khi cơ sở
                  sản xuất cập nhật.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Report Button */}
        <div className="mt-4">
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="w-full py-3.5 bg-stone-200 text-stone-600 font-bold rounded-xl hover:bg-stone-300 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <FiAlertTriangle /> Báo cáo vấn đề
          </button>
        </div>

        <p className="text-center text-xs text-stone-400 font-medium mt-2">
          Thông tin được xác thực bởi Hệ thống OCOP •{' '}
          <Link href="/" className="text-green-700 font-bold hover:underline">
            ocop.vn
          </Link>
        </p>
      </div>

      <TraceabilityReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lotCode={lot.lotCode}
      />
    </div>
  );
};

export default PublicTraceabilityPage;
