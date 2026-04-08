'use client';

import React from 'react';
import Image from 'next/image';
import {
  FiFileText,
  FiMaximize,
  FiExternalLink,
  FiDownload,
  FiCheck,
  FiXCircle,
} from 'react-icons/fi';
import { cn } from '@/lib/utils';
import { ShopListItem, ShopDocument } from '../types/adminTypes';

import dynamic from 'next/dynamic';

const PdfPreview = dynamic(() => import('@/components/ui/PdfPreview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <FiFileText className="animate-spin text-stone-200" size={32} />
    </div>
  ),
});

interface ShopDetailLegalityProps {
  shop: ShopListItem;
  activeDoc: ShopDocument | null;
  setActiveDoc: (doc: ShopDocument) => void;
  onVerifyDoc: (documentId: number) => void;
  onRejectDoc: (documentId: number) => void;
  isVerifying: boolean;
  isRejecting: boolean;
}

const ShopDetailLegality: React.FC<ShopDetailLegalityProps> = React.memo(
  ({ shop, activeDoc, setActiveDoc, onVerifyDoc, onRejectDoc, isVerifying, isRejecting }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-full">
        {/* Document Sidebar (inside Tab) */}
        <div className="md:col-span-12 lg:col-span-4 space-y-3 max-h-[600px] overflow-y-auto no-scrollbar">
          {shop.documents?.length ? (
            shop.documents.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setActiveDoc(doc)}
                className={cn(
                  'w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between group',
                  activeDoc?.id === doc.id
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'bg-white border-stone-100 hover:border-emerald-200',
                )}
              >
                <div className="flex items-center gap-3">
                  <FiFileText
                    className={cn(activeDoc?.id === doc.id ? 'text-emerald-600' : 'text-stone-300')}
                  />
                  <div>
                    <p className="text-xs font-black text-stone-800 uppercase tracking-tight">
                      {doc.docType.replace(/_/g, ' ')}
                    </p>
                    <span
                      className={cn(
                        'text-[9px] font-bold uppercase',
                        doc.isVerified ? 'text-emerald-500' : 'text-amber-500',
                      )}
                    >
                      {doc.isVerified ? 'Đã duyệt' : 'Chờ xác minh'}
                    </span>
                  </div>
                </div>
                <FiMaximize className="text-stone-300 opacity-0 group-hover:opacity-100" />
              </button>
            ))
          ) : (
            <div className="py-20 text-center space-y-2 opacity-30">
              <FiFileText size={32} className="mx-auto" />
              <p className="text-[10px] font-black uppercase">Chưa nộp hồ sơ</p>
            </div>
          )}
        </div>

        {/* Previewer */}
        <div className="md:col-span-12 lg:col-span-8">
          {activeDoc ? (
            <div className="bg-stone-50 rounded-3xl border border-stone-100 p-6 flex flex-col h-full min-h-[500px]">
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-[10px] font-black text-stone-400 uppercase">
                  Xem trước tài liệu
                </h5>
                <div className="flex gap-2">
                  {activeDoc.fileUrl && (
                    <>
                      <a
                        href={activeDoc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 bg-white rounded-xl border border-stone-100 text-stone-400 hover:text-emerald-600 shadow-sm"
                      >
                        <FiExternalLink size={14} />
                      </a>
                      <a
                        href={activeDoc.fileUrl}
                        download
                        className="p-2 bg-white rounded-xl border border-stone-100 text-stone-400 hover:text-emerald-600 shadow-sm"
                      >
                        <FiDownload size={14} />
                      </a>
                    </>
                  )}
                </div>
              </div>
              <div className="flex-1 bg-white rounded-2xl border border-stone-100 shadow-inner overflow-hidden relative flex items-center justify-center min-h-[300px]">
                {activeDoc.fileUrl && activeDoc.fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                  <Image
                    src={activeDoc.fileUrl}
                    alt="Preview"
                    fill
                    className="object-contain p-4"
                  />
                ) : activeDoc.fileUrl && activeDoc.fileUrl.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-full p-4 overflow-auto bg-stone-100/50 flex justify-center custom-scrollbar rounded-xl">
                    <PdfPreview fileUrl={activeDoc.fileUrl} scale={0.7} />
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <FiFileText size={48} className="text-stone-200 mx-auto" />
                    <p className="text-xs text-stone-400 font-bold uppercase">
                      Không hỗ trợ xem trước
                    </p>
                  </div>
                )}
              </div>
              {!activeDoc.isVerified && (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => onVerifyDoc(activeDoc.id)}
                    disabled={isVerifying}
                    className="flex-1 py-4 bg-[#0D631B] text-white rounded-2xl text-xs font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    <FiCheck /> {isVerifying ? 'Đang duyệt...' : 'Chấp nhận'}
                  </button>
                  <button
                    onClick={() => onRejectDoc(activeDoc.id)}
                    disabled={isRejecting}
                    className="flex-1 py-4 bg-white text-red-600 border border-red-100 rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-red-50 transition-all disabled:opacity-50"
                  >
                    <FiXCircle /> {isRejecting ? 'Đang xử lý...' : 'Từ chối'}
                  </button>
                </div>
              )}
              {activeDoc.isVerified && (
                <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                  <FiCheck className="text-emerald-600" />
                  <span className="text-xs font-black text-emerald-900 uppercase">
                    Tài liệu đã được xác nhận
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-stone-300 space-y-4 py-20">
              <FiFileText size={64} />
              <p className="font-black text-sm uppercase tracking-widest">Chọn tài liệu để xem</p>
            </div>
          )}
        </div>
      </div>
    );
  },
);

ShopDetailLegality.displayName = 'ShopDetailLegality';

export default ShopDetailLegality;
