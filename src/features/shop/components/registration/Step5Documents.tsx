'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiFileText,
  FiUser,
  FiUploadCloud,
  FiCheckCircle,
  FiLoader,
  FiAlertCircle,
  FiArrowRight,
} from 'react-icons/fi';
import { useSellerShop } from '@/features/shop/hooks/useSellerShop';
import { ShopDocumentType } from '@/features/shop/types/shopTypes';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const REQUIRED_DOCS = [
  {
    type: 'BUSINESS_LICENSE' as ShopDocumentType,
    label: 'Giấy phép kinh doanh',
    icon: FiFileText,
    desc: 'Bản sao công chứng hoặc ảnh chụp GGPKD',
  },
  {
    type: 'CCCD_FRONT' as ShopDocumentType,
    label: 'CCCD mặt trước',
    icon: FiUser,
    desc: 'Ảnh chụp mặt trước Căn cước công dân',
  },
  {
    type: 'CCCD_BACK' as ShopDocumentType,
    label: 'CCCD mặt sau',
    icon: FiUser,
    desc: 'Ảnh chụp mặt sau Căn cước công dân',
  },
];

const Step5Documents = () => {
  const router = useRouter();
  const { useDocumentsQuery, uploadDocument, isUploadingDocument } = useSellerShop();

  const { data: documentsData, isLoading } = useDocumentsQuery();
  const existingDocs = useMemo(() => documentsData?.data || [], [documentsData]);

  const uploadProgress = useMemo(() => {
    const uploadedCount = REQUIRED_DOCS.filter((req) =>
      existingDocs.some((d) => d.docType === req.type),
    ).length;
    return {
      count: uploadedCount,
      total: REQUIRED_DOCS.length,
      isFinished: uploadedCount === REQUIRED_DOCS.length,
    };
  }, [existingDocs]);

  const handleFileUpload = async (type: ShopDocumentType, file: File) => {
    try {
      await uploadDocument({ docType: type, file });
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const onFinish = () => {
    router.push('/dashboard/cua-hang');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-stone-400">
        <FiLoader size={24} className="animate-spin text-green-500" />
        <p className="text-sm font-medium">Đang tải trạng thái hồ sơ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 text-green-600 rounded-full mb-2">
          <FiCheckCircle size={32} />
        </div>
        <h3 className="text-2xl font-black text-stone-900">Chúc mừng! Shop đã được khởi tạo</h3>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          Bước cuối cùng: Tải lên các giấy tờ pháp lý để chúng tôi xác minh và kích hoạt shop của
          bạn.
        </p>
      </div>

      {/* Upload Progress */}
      <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-green-600">
            <span className="font-bold">
              {uploadProgress.count}/{uploadProgress.total}
            </span>
          </div>
          <span className="text-sm font-bold text-stone-700">Tài liệu đã tải lên</span>
        </div>
        {!uploadProgress.isFinished && (
          <span className="text-[10px] font-black text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-wider">
            Đang thiếu hồ sơ
          </span>
        )}
      </div>

      {/* Document grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {REQUIRED_DOCS.map((doc) => {
          const uploadedDoc = existingDocs.find((d) => d.docType === doc.type);
          const isUploaded = !!uploadedDoc;

          return (
            <div
              key={doc.type}
              className={cn(
                'relative group flex flex-col p-5 rounded-xl border-2 transition-all duration-300',
                isUploaded
                  ? 'bg-green-50/50 border-green-100'
                  : 'bg-white border-stone-100 hover:border-green-200',
              )}
            >
              {isUploaded && uploadedDoc?.fileUrl ? (
                <div className="w-full h-32 mb-4 rounded-xl overflow-hidden bg-stone-50 border border-stone-100 relative">
                  <Image
                    src={uploadedDoc.fileUrl}
                    alt={doc.label}
                    fill
                    unoptimized
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors shrink-0',
                    isUploaded
                      ? 'bg-green-100 text-green-600'
                      : 'bg-stone-50 text-stone-400 group-hover:bg-green-50',
                  )}
                >
                  <doc.icon size={20} />
                </div>
              )}

              <h4 className="font-bold text-stone-900 text-sm mb-1">{doc.label}</h4>
              <p className="text-[10px] text-stone-400 font-medium leading-tight mb-6">
                {doc.desc}
              </p>

              {isUploaded ? (
                <div className="mt-auto flex items-center gap-1.5 text-green-600 font-black text-[10px] uppercase tracking-wider">
                  <FiCheckCircle size={14} /> Đã tải lên
                </div>
              ) : (
                <label className="mt-auto relative cursor-pointer">
                  {isUploadingDocument ? (
                    <div className="flex items-center gap-2 text-stone-400 text-[10px] font-bold uppercase">
                      <FiLoader size={12} className="animate-spin" /> Đang tải...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-green-600 hover:text-green-700 font-black text-[10px] uppercase tracking-wider transition-colors">
                      <FiUploadCloud size={14} /> Tải tài liệu
                    </div>
                  )}
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*,application/pdf"
                    disabled={isUploadingDocument}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(doc.type, file);
                    }}
                  />
                </label>
              )}
            </div>
          );
        })}
      </div>

      {/* Disclaimer */}
      <div className="flex gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
        <FiAlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <p className="text-[11px] text-amber-800 leading-relaxed">
          <strong>Lưu ý:</strong> Nút <strong>Hoàn tất</strong> sẽ chỉ hiện khi bạn đã tải lên đủ 3
          loại giấy tờ pháp lý bắt buộc ở trên. Vui lòng đảm bảo thông tin trên ảnh rõ nét.
        </p>
      </div>

      {/* Action */}
      <div className="pt-4">
        {uploadProgress.isFinished ? (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onFinish}
            className="w-full flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-xl font-black shadow-xl shadow-green-500/25 hover:bg-green-700 hover:-translate-y-0.5 transition-all cursor-pointer"
          >
            Hoàn tất & Về Dashboard <FiArrowRight />
          </motion.button>
        ) : (
          <div className="w-full py-4 bg-stone-100 text-stone-400 rounded-xl font-black text-center text-sm cursor-not-allowed border border-stone-200">
            Vui lòng tải đủ hồ sơ để tiếp tục
          </div>
        )}
      </div>
    </div>
  );
};

export default Step5Documents;
