import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiCheck,
  FiXCircle,
  FiFileText,
  FiDownload,
  FiMaximize,
  FiExternalLink,
  FiUser,
  FiMapPin,
  FiHash,
  FiInfo,
  FiClock,
} from 'react-icons/fi';
import { ShopListItem, ShopDocument } from '../types/adminTypes';
import Image from 'next/image';
import ShopStatusBadge from './ShopStatusBadge';
import { useAdminShops } from '../hooks/useAdminShops';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ShopDetailDrawerProps {
  shop: ShopListItem | null;
  onClose: () => void;
}

const ShopDetailDrawer = ({ shop, onClose }: ShopDetailDrawerProps) => {
  const { verifyDocument, rejectDocument } = useAdminShops();
  const [activeDoc, setActiveDoc] = React.useState<ShopDocument | null>(
    shop?.documents?.[0] || null,
  );

  React.useEffect(() => {
    if (shop?.documents?.length) {
      setActiveDoc(shop.documents[0]);
    } else {
      setActiveDoc(null);
    }
  }, [shop]);

  if (!shop) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex justify-end"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm overflow-hidden border border-stone-100 flex items-center justify-center">
                {shop.logoUrl ? (
                  <Image
                    src={shop.logoUrl}
                    alt={shop.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <span className="text-emerald-700 font-black text-xl">{shop.name[0]}</span>
                )}
              </div>
              <div>
                <h3 className="text-xl font-black text-emerald-900 leading-tight">{shop.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <ShopStatusBadge status={shop.status} />
                  <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">
                    ID: {shop.id}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white rounded-full transition-colors text-stone-400 hover:text-stone-600 shadow-sm border border-transparent hover:border-stone-100"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            <div className="grid grid-cols-12 gap-8">
              {/* Left Column: Info */}
              <div className="col-span-12 lg:col-span-5 space-y-8">
                {/* Basic Info */}
                <section>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiInfo className="text-emerald-500" /> Thông tin cơ bản
                  </h4>
                  <div className="space-y-4 bg-stone-50 p-5 rounded-2xl border border-stone-100">
                    <div className="flex items-start gap-3">
                      <FiUser className="text-stone-300 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                          Chủ cửa hàng
                        </p>
                        <p className="text-sm font-bold text-stone-800">{shop.ownerName}</p>
                        <p className="text-xs text-stone-500">{shop.ownerEmail}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiMapPin className="text-stone-300 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                          Địa chỉ
                        </p>
                        <p className="text-sm font-bold text-stone-800">{shop.addressLine}</p>
                        <p className="text-xs text-stone-500">
                          {shop.wardName}, {shop.districtName}, {shop.provinceName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiHash className="text-stone-300 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                          Mã số thuế / ĐKKD
                        </p>
                        <p className="text-sm font-bold text-stone-800">
                          {shop.taxCode || 'Chưa cập nhật'}
                        </p>
                        <p className="text-xs text-stone-500">Giấy phép: {shop.businessRegNo}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <FiClock className="text-stone-300 mt-0.5" />
                      <div>
                        <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                          Ngày đăng ký
                        </p>
                        <p className="text-sm font-bold text-stone-800">
                          {format(new Date(shop.createdAt), 'dd MMMM yyyy', { locale: vi })}
                        </p>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Documents List */}
                <section>
                  <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <FiFileText className="text-emerald-500" /> Hồ sơ pháp lý
                  </h4>
                  <div className="space-y-3">
                    {shop.documents?.length ? (
                      shop.documents.map((doc) => (
                        <button
                          key={doc.id}
                          onClick={() => setActiveDoc(doc)}
                          className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${
                            activeDoc?.id === doc.id
                              ? 'bg-emerald-50 border-emerald-200 shadow-sm'
                              : 'bg-white border-stone-100 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${activeDoc?.id === doc.id ? 'bg-emerald-200 text-emerald-700' : 'bg-stone-100 text-stone-400 group-hover:bg-emerald-100 group-hover:text-emerald-600'}`}
                            >
                              <FiFileText size={18} />
                            </div>
                            <div>
                              <p
                                className={`text-sm font-bold ${activeDoc?.id === doc.id ? 'text-emerald-900' : 'text-stone-700'}`}
                              >
                                {doc.docType === 'BUSINESS_LICENSE'
                                  ? 'Giấy phép kinh doanh'
                                  : doc.docType}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {doc.isVerified ? (
                                  <span className="text-[9px] font-bold text-emerald-600 uppercase">
                                    Đã xác minh
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold text-amber-600 uppercase">
                                    Chờ xử lý
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <FiMaximize
                            className={`text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity ${activeDoc?.id === doc.id ? 'opacity-100' : ''}`}
                          />
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-stone-400 font-bold italic py-4">
                        Chưa có tài liệu nào được tải lên.
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column: Preview & Actions */}
              <div className="col-span-12 lg:col-span-7 space-y-6">
                {activeDoc ? (
                  <div className="bg-stone-50 rounded-3xl border border-stone-100 p-6 h-full flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                      <h5 className="text-sm font-black text-emerald-900 uppercase">
                        Xem trước tài liệu
                      </h5>
                      <div className="flex gap-2">
                        <a
                          href={activeDoc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-white rounded-lg border border-stone-100 text-stone-500 hover:text-emerald-600 shadow-sm transition-all"
                        >
                          <FiExternalLink size={16} />
                        </a>
                        <a
                          href={activeDoc.fileUrl}
                          download
                          className="p-2 bg-white rounded-lg border border-stone-100 text-stone-500 hover:text-emerald-600 shadow-sm transition-all"
                        >
                          <FiDownload size={16} />
                        </a>
                      </div>
                    </div>

                    <div className="flex-1 min-h-[400px] relative rounded-2xl overflow-hidden bg-white border border-stone-100 shadow-inner flex items-center justify-center">
                      {activeDoc.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <Image
                          src={activeDoc.fileUrl}
                          alt="Document Preview"
                          fill
                          className="object-contain p-4"
                        />
                      ) : (
                        <div className="text-center space-y-3">
                          <FiFileText size={48} className="text-stone-200 mx-auto" />
                          <p className="text-sm font-bold text-stone-400">
                            Định dạng file không hỗ trợ xem trước
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Doc Actions */}
                    {!activeDoc.isVerified && (
                      <div className="mt-6 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() =>
                              verifyDocument({
                                documentId: activeDoc.id,
                                data: { note: 'Verified by admin' },
                              })
                            }
                            className="py-4 bg-[#0D631B] text-white rounded-2xl text-sm font-black shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 transition-all"
                          >
                            <FiCheck /> Chấp nhận
                          </button>
                          <button
                            onClick={() =>
                              rejectDocument({
                                documentId: activeDoc.id,
                                data: { note: 'Rejected by admin' },
                              })
                            }
                            className="py-4 bg-white text-red-600 border-2 border-red-100 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-red-50 active:scale-95 transition-all"
                          >
                            <FiXCircle /> Từ chối
                          </button>
                        </div>
                        <p className="text-[10px] text-center text-stone-400 font-bold uppercase tracking-widest leading-relaxed">
                          Việc thay đổi trạng thái tài liệu sẽ được ghi lại vào nhật ký hệ thống.
                        </p>
                      </div>
                    )}

                    {activeDoc.isVerified && (
                      <div className="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center shadow-sm">
                          <FiCheck />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-black text-emerald-900 uppercase">
                            Tài liệu đã được xác minh
                          </p>
                          <p className="text-[10px] text-emerald-700/70 font-bold italic">
                            Bởi {activeDoc.verifiedByEmail} lúc{' '}
                            {activeDoc.verifiedAt &&
                              format(new Date(activeDoc.verifiedAt), 'HH:mm dd/MM/yyyy')}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-stone-50 rounded-3xl border border-stone-100 p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center text-stone-200">
                      <FiFileText size={40} />
                    </div>
                    <div>
                      <p className="text-lg font-black text-stone-300 uppercase tracking-widest">
                        Chưa có tài liệu
                      </p>
                      <p className="text-sm text-stone-400 font-medium">
                        Hãy chọn một tài liệu ở cột bên trái để xem chi tiết.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ShopDetailDrawer;
