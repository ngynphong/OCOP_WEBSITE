'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supplyChainApi } from '@/features/supply-chain/api/supplyChainApi';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import { LotStatusBadge } from '@/features/supply-chain/components/LotStatusBadge';
import { SupplyChainTimeline } from '@/features/supply-chain/components/SupplyChainTimeline';
import { FiPackage, FiShield, FiCheckCircle } from 'react-icons/fi';
import { format } from 'date-fns';

const PublicTraceabilityPage = () => {
  const { lotCode } = useParams();
  const router = useRouter();
  const [lot, setLot] = useState<ISupplyChainLot | null>(null);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-20">
      {/* Visual Header */}
      <div className="h-48 bg-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400 rounded-full -ml-10 -mb-10" />
        </div>
        <div className="max-w-xl mx-auto px-6 pt-10 relative z-10 flex flex-col items-center">
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-4 scale-90">
            <span className="text-white text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <FiCheckCircle className="text-yellow-400" /> Hệ thống OCOP Quốc Gia
            </span>
          </div>
          <h1 className="text-white text-xl font-bold tracking-tight text-center">
            TRUY XUẤT NGUỒN GỐC
          </h1>
        </div>
      </div>

      {/* Product Info Floating Card */}
      <div className="max-w-xl mx-auto px-6 -mt-16 relative z-20">
        <div className="bg-white rounded-xl shadow-2xl shadow-stone-200/60 p-8 border border-stone-100 ring-4 ring-white/50">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 mb-6 shadow-inner ring-1 ring-emerald-100">
              <FiPackage size={40} />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black tracking-widest uppercase">
                {lot.lotCode}
              </span>
              <LotStatusBadge status={lot.status} />
            </div>

            <h2 className="text-2xl font-black text-stone-900 leading-tight mb-2">
              {lot.productName}
            </h2>
            <p className="text-emerald-700 font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{' '}
              {lot.shopName}
            </p>

            <div className="w-full grid grid-cols-2 gap-4 pt-6 border-t border-stone-50">
              <div className="bg-stone-50/50 p-4 rounded-xl text-left">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
                  Số lượng
                </span>
                <span className="font-black text-stone-900">
                  {lot.quantity} {lot.unit}
                </span>
              </div>
              <div className="bg-stone-50/50 p-4 rounded-xl text-left">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-1">
                  Hạn sử dụng
                </span>
                <span className="font-black text-stone-900">
                  {lot.expiryDate ? format(new Date(lot.expiryDate), 'dd/MM/yyyy') : '---'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="max-w-xl mx-auto px-6 mt-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-black text-stone-900 flex items-center gap-4">
            HÀNH TRÌNH SẢN PHẨM
            <span className="h-[2px] flex-1 bg-stone-200 rounded-full min-w-[50px]" />
          </h3>
        </div>

        <SupplyChainTimeline steps={lot.steps || []} />
      </div>

      {/* Verification Badge */}
      <div className="max-w-xl mx-auto px-6 mt-12 text-center text-stone-400">
        <div className="inline-flex items-center gap-2 px-4 py-2 opacity-50">
          <FiShield />
          <span className="text-[10px] font-bold uppercase tracking-widest">
            Xác thực bởi Hệ thống OCOP
          </span>
        </div>
      </div>
    </div>
  );
};

export default PublicTraceabilityPage;
