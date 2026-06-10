import React from 'react';

interface RejectModalProps {
  isOpen: boolean;
  rejectNote: string;
  setRejectNote: (note: string) => void;
  onClose: () => void;
  onConfirm: () => void;
  isRejecting: boolean;
}

export const AdminProductRejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  rejectNote,
  setRejectNote,
  onClose,
  onConfirm,
  isRejecting,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h3 className="text-lg font-black text-stone-900 mb-4">Lý do từ chối</h3>
        <textarea
          value={rejectNote}
          onChange={(e) => setRejectNote(e.target.value)}
          placeholder="Nhập lý do từ chối chi tiết cho Seller..."
          rows={4}
          className="w-full border border-stone-200 rounded-xl p-3 text-sm text-stone-700 resize-none outline-none focus:border-emerald-400 transition"
        />
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-bold text-stone-500 hover:text-stone-700 transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isRejecting || !rejectNote.trim()}
            className="px-6 py-2 bg-red-500 text-white text-sm font-bold rounded-xl hover:bg-red-600 disabled:opacity-50 transition cursor-pointer"
          >
            {isRejecting ? 'Đang xử lý...' : 'Xác nhận từ chối'}
          </button>
        </div>
      </div>
    </div>
  );
};
