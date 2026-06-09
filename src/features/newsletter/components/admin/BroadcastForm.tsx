'use client';

import React, { useState } from 'react';
import { useBroadcastMutation } from '../../hooks/useNewsletter';
import { Button } from '@/components/ui/AppButton';
import { FiSend, FiFileText, FiType, FiEye, FiCheckCircle } from 'react-icons/fi';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import toast from 'react-hot-toast';

export const BroadcastForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    htmlContent: '',
  });
  const [isPreview, setIsPreview] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const broadcastMutation = useBroadcastMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.htmlContent.trim()) {
      toast.error('Vui lòng nhập đầy đủ tiêu đề và nội dung.');
      return;
    }
    setIsConfirmOpen(true);
  };

  const handleConfirmSend = () => {
    broadcastMutation.mutate(formData, {
      onSuccess: () => {
        setFormData({ subject: '', htmlContent: '' });
        setIsConfirmOpen(false);
      },
      onError: () => {
        setIsConfirmOpen(false);
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-sm border border-stone-100 space-y-8"
        >
          <div className="flex justify-between items-center border-b border-stone-50 pb-6">
            <h3 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <FiType className="text-emerald-500" /> Soạn bản tin mới
            </h3>
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                isPreview
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-50 text-stone-400 hover:bg-stone-100'
              }`}
            >
              <FiEye /> {isPreview ? 'Chế độ soạn thảo' : 'Xem trước'}
            </button>
          </div>

          {isPreview ? (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="bg-stone-50 p-6 rounded-xl border border-stone-100">
                <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-2">
                  Tiêu đề:
                </span>
                <h4 className="text-xl font-black text-stone-800">
                  {formData.subject || '(Chưa có tiêu đề)'}
                </h4>
              </div>
              <div className="bg-white border border-stone-100 rounded-xl p-8 min-h-[400px]">
                <div
                  className="prose prose-stone max-w-none newsletter-preview"
                  dangerouslySetInnerHTML={{
                    __html:
                      formData.htmlContent ||
                      '<p class="text-stone-300 italic">Chưa có nội dung...</p>',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Tiêu đề bản tin
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Nhập tiêu đề thu hút người đọc..."
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-base font-bold text-stone-800 placeholder:text-stone-300"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest ml-1">
                  Nội dung (HTML)
                </label>
                <textarea
                  value={formData.htmlContent}
                  onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
                  rows={15}
                  placeholder="<h1>Xin chào các subscriber...</h1><p>Nội dung bản tin...</p>"
                  className="w-full px-6 py-4 bg-stone-50 border border-stone-100 rounded-xl outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-medium text-stone-700 leading-relaxed font-mono placeholder:text-stone-300"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={broadcastMutation.isPending}
              className="bg-stone-900 text-white px-10 py-5 rounded-xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-stone-900/10 hover:bg-stone-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {broadcastMutation.isPending ? (
                <>Đang gửi bản tin...</>
              ) : (
                <>
                  Gửi bản tin ngay <FiSend />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-emerald-900 p-8 rounded-xl text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10 space-y-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400 border border-white/10">
              <FiCheckCircle size={24} />
            </div>
            <h3 className="text-xl font-black tracking-tight">Hướng dẫn gửi</h3>
            <ul className="space-y-3">
              {[
                'Nội dung hỗ trợ mã HTML cơ bản.',
                'Nên chèn ảnh bằng thẻ <img> với URL đầy đủ.',
                'Gắn link sản phẩm để tăng tỷ lệ chuyển đổi.',
                'Bản tin sẽ được gửi đến TẤT CẢ các subscriber đang ở trạng thái ACTIVE.',
              ].map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs font-medium text-emerald-100/70 leading-relaxed"
                >
                  <span className="text-emerald-400 mt-1">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>
          {/* Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="bg-white p-8 rounded-xl border border-stone-100 space-y-4">
          <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
            <FiFileText /> Gần đây
          </h4>
          <div className="space-y-3">
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">
                  24/04/2026
                </p>
                <p className="text-xs font-bold text-stone-700 line-clamp-1">
                  Bản tin tháng 4 — Sản phẩm mới
                </p>
              </div>
              <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FiCheckCircle size={12} />
              </div>
            </div>
            <p className="text-[10px] text-center text-stone-400 italic">
              Chỉ hiển thị lịch sử gửi gần nhất
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .newsletter-preview h1 {
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 1rem;
          color: #1c1917;
        }
        .newsletter-preview p {
          margin-bottom: 1rem;
          color: #44403c;
          line-height: 1.6;
        }
        .newsletter-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1.5rem 0;
        }
        .newsletter-preview a {
          color: #059669;
          text-decoration: underline;
          font-weight: 700;
        }
      `}</style>
      <ConfirmModal
        isOpen={isConfirmOpen}
        title="Xác nhận gửi bản tin"
        message="Bạn có chắc chắn muốn gửi bản tin này đến tất cả người đăng ký đang hoạt động? Hành động này không thể hoàn tác."
        confirmText="Gửi ngay"
        cancelText="Hủy"
        onConfirm={handleConfirmSend}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={broadcastMutation.isPending}
        type="warning"
      />
    </div>
  );
};
