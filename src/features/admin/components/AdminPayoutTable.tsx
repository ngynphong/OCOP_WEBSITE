'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { formatCurrencyVND } from '@/utils/format';
import {
  IAdminPayoutRes,
  IAdminPayoutParams,
  IPayoutProcessReq,
  ShopListItem,
} from '../types/adminTypes';
import { useShopsQuery } from '../hooks/useAdminShops';
import { Pagination } from '@/components/ui/Pagination';
import { Button } from '@/components/ui/AppButton';
import { FiRefreshCw, FiCheck, FiX } from 'react-icons/fi';

interface AdminPayoutTableProps {
  payouts: IAdminPayoutRes[];
  isLoading: boolean;
  totalPage: number;
  totalElement: number;
  params: IAdminPayoutParams;
  setParams: (params: IAdminPayoutParams) => void;
  onProcessPayout?: (data: { payoutId: number; data: IPayoutProcessReq }) => Promise<unknown>;
  isProcessing?: boolean;
  onGeneratePayouts?: (data: {
    shopId: number | string;
    periodStart: string;
    periodEnd: string;
  }) => Promise<unknown>;
  isGenerating?: boolean;
}

export const AdminPayoutTable: React.FC<AdminPayoutTableProps> = ({
  payouts,
  isLoading,
  totalPage,
  totalElement,
  params,
  setParams,
  onProcessPayout,
  isProcessing,
  onGeneratePayouts,
  isGenerating,
}) => {
  const [selectedPayout, setSelectedPayout] = useState<IAdminPayoutRes | null>(null);
  const [paymentRef, setPaymentRef] = useState('');
  const [note, setNote] = useState('');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [genShopId, setGenShopId] = useState('');
  const [genStartDate, setGenStartDate] = useState('');
  const [genEndDate, setGenEndDate] = useState('');

  // Fetch shops for the dropdown
  const { data: shopsData, isLoading: isLoadingShops } = useShopsQuery({
    pageSize: 100,
    status: 'ACTIVE',
  });
  const shopsList: ShopListItem[] = shopsData?.data?.items || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
            Đã thanh toán
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
            Chờ xử lý
          </span>
        );
      case 'APPROVED':
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            Đã duyệt
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold">
            Đang xử lý
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
            Thất bại
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-xs font-bold">
            {status}
          </span>
        );
    }
  };

  const handleProcess = async () => {
    if (!onProcessPayout || !selectedPayout || !paymentRef) return;
    try {
      await onProcessPayout({
        payoutId: selectedPayout.id,
        data: {
          paymentRef,
          note,
        },
      });
      setSelectedPayout(null);
      setPaymentRef('');
      setNote('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleGenerate = async () => {
    if (!onGeneratePayouts || !genShopId || !genStartDate || !genEndDate) return;
    try {
      await onGeneratePayouts({
        shopId: genShopId,
        periodStart: genStartDate,
        periodEnd: genEndDate,
      });
      setShowGenerateModal(false);
      setGenShopId('');
      setGenStartDate('');
      setGenEndDate('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Header Actions */}
      <div className="p-4 border-b border-stone-200 flex justify-between items-center bg-stone-50/50">
        <h3 className="font-bold text-stone-800">Danh sách đối soát</h3>
        <Button onClick={() => setShowGenerateModal(true)} className="flex items-center gap-2">
          <FiRefreshCw />
          Tạo đối soát mới
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200 text-sm">
              <th className="px-6 py-4 font-black text-stone-500 uppercase tracking-wider">
                Mã / Kỳ đối soát
              </th>
              <th className="px-6 py-4 font-black text-stone-500 uppercase tracking-wider">
                Doanh thu / Khấu trừ
              </th>
              <th className="px-6 py-4 font-black text-stone-500 uppercase tracking-wider">
                Thực nhận
              </th>
              <th className="px-6 py-4 font-black text-stone-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-4 font-black text-stone-500 uppercase tracking-wider">
                Tài khoản Bank
              </th>
              <th className="px-6 py-4 font-black text-stone-500 uppercase tracking-wider text-right">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-8 h-8 border-4 border-stone-200 border-t-[#00490E] rounded-full animate-spin mb-4" />
                    <p className="font-medium">Đang tải dữ liệu đối soát...</p>
                  </div>
                </td>
              </tr>
            ) : payouts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4">
                      <FiCheck className="w-8 h-8 text-stone-300" />
                    </div>
                    <p className="font-bold text-stone-500">Chưa có dữ liệu đối soát</p>
                  </div>
                </td>
              </tr>
            ) : (
              payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-stone-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-800">#{payout.id}</div>
                    <div className="text-sm text-stone-500 mt-1">
                      {format(new Date(payout.periodStart), 'dd/MM/yyyy', { locale: vi })} -{' '}
                      {format(new Date(payout.periodEnd), 'dd/MM/yyyy', { locale: vi })}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-stone-800" title="Tổng doanh thu">
                      {formatCurrencyVND(payout.grossRevenue)}
                    </div>
                    {payout.commissionFee > 0 && (
                      <div className="text-xs text-rose-500 mt-1">
                        - {formatCurrencyVND(payout.commissionFee)} (Phí)
                      </div>
                    )}
                    {payout.refundDeducted > 0 && (
                      <div className="text-xs text-rose-500 mt-0.5">
                        - {formatCurrencyVND(payout.refundDeducted)} (Hoàn tiền)
                      </div>
                    )}
                    {payout.cashbackAmount > 0 && (
                      <div className="text-xs text-rose-500 mt-0.5">
                        - {formatCurrencyVND(payout.cashbackAmount)} (Cashback)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black text-[#00490E] text-lg">
                      {formatCurrencyVND(payout.netPayout)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col items-start gap-2">
                      {getStatusBadge(payout.status)}
                      <span className="text-xs text-stone-400">
                        Hẹn trả:{' '}
                        {format(new Date(payout.scheduledPayoutDate), 'dd/MM/yyyy', { locale: vi })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {payout.bankAccount ? (
                      <div>
                        <div className="font-bold text-sm text-stone-700">
                          {payout.bankAccount.bankCode}
                        </div>
                        <div className="text-sm text-stone-600">
                          {payout.bankAccount.accountNumber}
                        </div>
                        <div className="text-xs text-stone-400 uppercase">
                          {payout.bankAccount.accountName}
                        </div>
                      </div>
                    ) : (
                      <span className="text-stone-400 text-sm italic">Chưa cập nhật</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {(payout.status === 'PENDING' || payout.status === 'APPROVED') && (
                      <Button size="sm" onClick={() => setSelectedPayout(payout)}>
                        Thanh toán
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-stone-200">
        <Pagination
          currentPage={params.pageNo || 1}
          totalPages={totalPage}
          pageSize={params.pageSize || 10}
          totalElements={totalElement}
          onPageChange={(page) => setParams({ ...params, pageNo: page })}
          onPageSizeChange={(size) => setParams({ ...params, pageSize: size, pageNo: 1 })}
        />
      </div>

      {/* Process Payout Modal */}
      {selectedPayout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-black text-[#00490E]">Xác nhận thanh toán</h3>
              <button
                onClick={() => setSelectedPayout(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="bg-stone-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-stone-500 text-sm">Kỳ đối soát:</span>
                <span className="font-bold text-stone-700">#{selectedPayout.id}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-stone-500 text-sm">Doanh thu:</span>
                <span className="font-bold text-stone-700">
                  {formatCurrencyVND(selectedPayout.grossRevenue)}
                </span>
              </div>
              {selectedPayout.commissionFee > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-stone-500 text-sm">Phí hoa hồng:</span>
                  <span className="font-bold text-rose-500">
                    - {formatCurrencyVND(selectedPayout.commissionFee)}
                  </span>
                </div>
              )}
              {selectedPayout.refundDeducted > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-stone-500 text-sm">Hoàn tiền khách:</span>
                  <span className="font-bold text-rose-500">
                    - {formatCurrencyVND(selectedPayout.refundDeducted)}
                  </span>
                </div>
              )}
              {selectedPayout.cashbackAmount > 0 && (
                <div className="flex justify-between mb-2">
                  <span className="text-stone-500 text-sm">Hoàn tiền (Cashback):</span>
                  <span className="font-bold text-rose-500">
                    - {formatCurrencyVND(selectedPayout.cashbackAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between mb-2 mt-2 pt-2 border-t border-stone-200">
                <span className="text-stone-500 text-sm">Số tiền cần thanh toán:</span>
                <span className="font-black text-[#00490E] text-lg">
                  {formatCurrencyVND(selectedPayout.netPayout)}
                </span>
              </div>
              {selectedPayout.bankAccount && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <div className="text-sm font-bold text-stone-700 mb-1">
                    Thông tin chuyển khoản:
                  </div>
                  <div className="text-sm text-stone-600">
                    Ngân hàng: {selectedPayout.bankAccount.bankCode}
                  </div>
                  <div className="text-sm text-stone-600">
                    Số tài khoản: {selectedPayout.bankAccount.accountNumber}
                  </div>
                  <div className="text-sm text-stone-600 uppercase">
                    Tên: {selectedPayout.bankAccount.accountName}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                  Mã giao dịch (Mã UNC/Tham chiếu) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="w-full bg-stone-50 border text-stone-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  placeholder="Nhập mã giao dịch..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                  Ghi chú (Tùy chọn)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full bg-stone-50 border text-stone-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none resize-none"
                  placeholder="Ghi chú nội bộ..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setSelectedPayout(null);
                  setPaymentRef('');
                  setNote('');
                }}
              >
                Hủy
              </Button>
              <Button
                className="flex-1"
                disabled={isProcessing || !paymentRef.trim()}
                onClick={handleProcess}
              >
                {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Generate Payout Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-black text-[#00490E]">Tạo đối soát mới</h3>
              <button
                onClick={() => setShowGenerateModal(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                  Cửa hàng <span className="text-rose-500">*</span>
                </label>
                <select
                  value={genShopId}
                  onChange={(e) => setGenShopId(e.target.value)}
                  className="w-full bg-stone-50 border text-stone-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  disabled={isLoadingShops}
                >
                  <option value="">-- Chọn cửa hàng --</option>
                  {shopsList.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name} (ID: {shop.id})
                    </option>
                  ))}
                </select>
                {isLoadingShops && (
                  <p className="text-xs text-stone-400 mt-1 ml-1">Đang tải danh sách cửa hàng...</p>
                )}
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                    Từ ngày <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={genStartDate}
                    onChange={(e) => setGenStartDate(e.target.value)}
                    className="w-full bg-stone-50 border text-stone-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-stone-500 uppercase mb-1.5 ml-1">
                    Đến ngày <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={genEndDate}
                    onChange={(e) => setGenEndDate(e.target.value)}
                    className="w-full bg-stone-50 border text-stone-700 border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowGenerateModal(false)}
              >
                Hủy
              </Button>
              <Button
                className="flex-1"
                disabled={isGenerating || !genShopId || !genStartDate || !genEndDate}
                onClick={handleGenerate}
              >
                {isGenerating ? 'Đang tạo...' : 'Tạo đối soát'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
