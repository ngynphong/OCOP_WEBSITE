'use client';

import React, { useState } from 'react';
import { useLocation } from '@/features/admin/hooks/useLocation';
import { FiUpload, FiFileText, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

type ApiError = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function LocationImportSection() {
  const { useImportLocationsMutation } = useLocation();
  const importMutation = useImportLocationsMutation();
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === 'application/json' || droppedFile.name.endsWith('.json')) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) return;
    await importMutation.mutateAsync(file);
    setFile(null);
  };

  return (
    <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm">
      <div className="mb-6">
        <h3 className="text-xl font-black text-stone-900 tracking-tight mb-2">
          Nhập dữ liệu Tỉnh thành
        </h3>
        <p className="text-sm text-stone-500 font-medium">
          Tải lên file JSON chứa thông tin Tỉnh, Quận/Huyện và Phường/Xã để cập nhật hệ thống.
        </p>
      </div>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-10 transition-all flex flex-col items-center justify-center ${
          dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-stone-200 bg-stone-50/50'
        } ${file ? 'border-emerald-500 bg-emerald-50/30' : ''}`}
      >
        <input
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-stone-100">
                <FiUpload className="text-stone-400 text-2xl" />
              </div>
              <p className="text-sm font-bold text-stone-700 mb-1">
                Kéo thả file vào đây hoặc nhấp để chọn
              </p>
              <p className="text-xs text-stone-400 font-medium">Chỉ hỗ trợ định dạng .json</p>
            </motion.div>
          ) : (
            <motion.div
              key="selected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                <FiFileText className="text-emerald-600 text-2xl" />
              </div>
              <p className="text-sm font-black text-emerald-900 mb-1">{file.name}</p>
              <p className="text-xs text-emerald-600 font-bold">
                {(file.size / 1024).toFixed(2)} KB
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="mt-4 text-xs font-black text-red-500 uppercase tracking-widest hover:text-red-600 transition-colors"
              >
                Gỡ bỏ file
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-end">
        <button
          onClick={handleImport}
          disabled={!file || importMutation.isPending}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-black text-sm transition-all shadow-lg ${
            !file || importMutation.isPending
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed shadow-none'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20 active:scale-95'
          }`}
        >
          {importMutation.isPending ? (
            <>
              <FiLoader className="animate-spin" /> Đang xử lý...
            </>
          ) : (
            <>
              <FiCheckCircle /> Bắt đầu Nhập dữ liệu
            </>
          )}
        </button>
      </div>

      {importMutation.isError && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3"
        >
          <FiXCircle className="text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-red-800">Lỗi nhập liệu</p>
            <p className="text-xs text-red-600 font-medium mt-1">
              {(importMutation.error as ApiError)?.message ||
                'Vui lòng kiểm tra lại cấu trúc file JSON.'}
            </p>
          </div>
        </motion.div>
      )}

      {importMutation.isSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3"
        >
          <FiCheckCircle className="text-emerald-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-black text-emerald-800">Thành công!</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              Dữ liệu tỉnh thành đã được cập nhật vào hệ thống.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
