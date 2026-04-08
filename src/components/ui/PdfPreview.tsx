'use client';

import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { FiLoader, FiAlertCircle, FiFileText } from 'react-icons/fi';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  fileUrl: string;
  className?: string;
  scale?: number;
  width?: number;
  showAllPages?: boolean;
}

const PdfPreview = ({ fileUrl, className, scale, width }: PdfPreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function onDocumentLoadSuccess() {
    setLoading(false);
  }

  function onDocumentLoadError() {
    setError(true);
    setLoading(false);
  }

  return (
    <div className={className}>
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={
          <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-400">
            <FiLoader size={24} className="animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Đang tải PDF...</span>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center h-full gap-2 text-rose-400 p-4 text-center">
            <FiAlertCircle size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Lỗi tải PDF</span>
          </div>
        }
        noData={
          <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-300">
            <FiFileText size={48} />
          </div>
        }
      >
        {!loading && !error && (
          <Page
            pageNumber={1}
            scale={scale}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="flex justify-center"
          />
        )}
      </Document>
    </div>
  );
};

export default PdfPreview;
