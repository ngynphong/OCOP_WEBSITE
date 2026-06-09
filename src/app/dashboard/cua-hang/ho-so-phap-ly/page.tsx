'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiUploadCloud,
  FiTrash2,
  FiEye,
  FiPlus,
  FiHash,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { ShopDocumentType } from '@/features/shop/types/shopTypes';
import { cn } from '@/lib/utils';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import Image from 'next/image';
import dynamic from 'next/dynamic';

const PdfPreview = dynamic(() => import('@/components/ui/PdfPreview'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <FiLoader className="animate-spin text-stone-300" size={24} />
    </div>
  ),
});

const DOCUMENT_CONFIG: Record<
  string,
  { label: string; description: string; icon: React.ElementType }
> = {
  BUSINESS_LICENSE: {
    label: 'Giấy phép kinh doanh',
    description: 'Bản sao công chứng hoặc chứng nhận đăng ký kinh doanh.',
    icon: FiFileText,
  },
  CCCD_FRONT: {
    label: 'CCCD mặt trước',
    description: 'Ảnh chụp mặt trước của Căn cước công dân hoặc CMND.',
    icon: FiUser,
  },
  CCCD_BACK: {
    label: 'CCCD mặt sau',
    description: 'Ảnh chụp mặt sau của Căn cước công dân hoặc CMND.',
    icon: FiUser,
  },
  TAX_CERT: {
    label: 'Chứng nhận mã số thuế',
    description: 'Tài liệu xác nhận đăng ký mã số thuế của shop.',
    icon: FiHash,
  },
  OCOP_CERT: {
    label: 'Chứng nhận OCOP',
    description: 'Chứng nhận sản phẩm đạt chuẩn OCOP quốc gia.',
    icon: FiCheckCircle,
  },
  OTHER: {
    label: 'Tài liệu khác',
    description: 'Các loại giấy tờ bổ trợ khác liên quan đến shop.',
    icon: FiPlus,
  },
};

const DOC_TYPES = Object.keys(DOCUMENT_CONFIG) as ShopDocumentType[];

export default function LegalDocumentsPage() {
  const {
    useDocumentsQuery,
    uploadDocument,
    isUploadingDocument,
    deleteDocument,
    isDeletingDocument,
  } = useSellerShop();

  const { data: documentsData, isLoading } = useDocumentsQuery();
  const existingDocs = useMemo(() => documentsData?.data || [], [documentsData]);

  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);

  const handleFileUpload = async (type: ShopDocumentType, file: File) => {
    try {
      await uploadDocument({ docType: type, file });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;
    try {
      await deleteDocument(documentToDelete);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-stone-400">
        <FiLoader size={28} className="animate-spin text-green-500" />
        <p className="text-sm">Đang tải hồ sơ pháp lý...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-100 rounded-xl">
        <FiAlertCircle size={20} className="text-blue-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-sm font-bold text-blue-900">Quy định về hồ sơ pháp lý</p>
          <p className="text-xs text-blue-700 leading-relaxed">
            Hồ sơ pháp lý là bắt buộc để xác minh danh tính và hoạt động kinh doanh của bạn. Các tài
            liệu đã duyệt sẽ không thể thay đổi. Vui lòng đảm bảo hình ảnh rõ nét, không bị mờ hoặc
            mất góc.
          </p>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DOC_TYPES.map((type, index) => {
          const config = DOCUMENT_CONFIG[type];
          const doc = existingDocs.find((d) => d.docType === type);

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'group relative rounded-xl border transition-all duration-300 overflow-hidden',
                doc?.isVerified
                  ? 'bg-green-50/30 border-green-100 hover:border-green-200'
                  : 'bg-white border-stone-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5',
              )}
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                    <config.icon size={22} />
                  </div>
                  {doc && <StatusBadge isVerified={doc.isVerified} note={doc.note} />}
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-stone-900 text-base">{config.label}</h3>
                  <p className="text-[11px] text-stone-400 leading-relaxed font-medium">
                    {config.description}
                  </p>
                </div>
              </div>

              {/* Content / Preview */}
              <div className="px-6 pb-6">
                {doc ? (
                  <div className="space-y-4">
                    {/* Preview Area */}
                    <div className="relative aspect-video rounded-xl bg-stone-50 border border-dashed border-stone-200 overflow-hidden group/preview">
                      {doc.fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                        <Image src={doc.fileUrl} alt={config.label} fill className="object-cover" />
                      ) : doc.fileUrl.toLowerCase().endsWith('.pdf') ? (
                        <div className="flex items-center justify-center h-full scale-90">
                          <PdfPreview fileUrl={doc.fileUrl} scale={0.35} />
                        </div>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <FiFileText size={48} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-stone-700 hover:text-green-600 shadow-lg"
                        >
                          <FiEye size={18} />
                        </a>
                        {!doc.isVerified && (
                          <button
                            onClick={() => setDocumentToDelete(doc.id)}
                            className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-500 hover:bg-red-50 shadow-lg"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                      <span>Tải lên lúc</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {/* Rejection Note */}
                    {!doc.isVerified && doc.note && (
                      <div className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-start gap-2">
                        <FiXCircle size={14} className="text-red-500 mt-0.5 shrink-0" />
                        <p className="text-[11px] text-red-700 leading-relaxed font-medium">
                          {doc.note}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="relative flex flex-col items-center justify-center py-8 px-4 bg-stone-50/50 border-2 border-dashed border-stone-100 rounded-xl cursor-pointer hover:bg-green-50 hover:border-green-200 hover:text-green-600 transition-all group/upload">
                    {isUploadingDocument ? (
                      <FiLoader size={24} className="animate-spin" />
                    ) : (
                      <>
                        <FiUploadCloud
                          size={24}
                          className="text-stone-300 group-hover/upload:text-green-500 group-hover/upload:-translate-y-1 transition-all"
                        />
                        <span className="mt-2 text-[11px] font-bold uppercase tracking-widest">
                          Tải tài liệu lên (PDF hoặc Ảnh)
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*,application/pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(type, file);
                      }}
                    />
                  </label>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <ConfirmModal
        isOpen={!!documentToDelete}
        title="Xóa tài liệu hồ sơ"
        message="Bạn có chắc chắn muốn xóa tài liệu này không? Hành động này không thể hoàn tác."
        confirmText={isDeletingDocument ? 'Đang xóa...' : 'Xác nhận xóa'}
        cancelText="Hủy"
        type="danger"
        onConfirm={handleDelete}
        onCancel={() => setDocumentToDelete(null)}
      />
    </div>
  );
}

const StatusBadge = ({ isVerified, note }: { isVerified: boolean; note: string | null }) => {
  if (isVerified) {
    return (
      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-green-200">
        <FiCheckCircle size={12} /> Đã duyệt
      </div>
    );
  }
  if (note) {
    return (
      <div className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-red-200">
        <FiXCircle size={12} /> Bị từ chối
      </div>
    );
  }
  return (
    <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-amber-200">
      <FiClock size={12} /> Chờ duyệt
    </div>
  );
};
