'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { Modal } from './Modal';
import { useRouter } from 'next/navigation';
import { QrCode, Camera, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './AppButton';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QRScannerModal = ({ isOpen, onClose }: QRScannerModalProps) => {
  const router = useRouter();
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const qrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = 'qr-reader-container';

  const stopScanner = useCallback(async () => {
    if (qrCodeRef.current && qrCodeRef.current.isScanning) {
      try {
        await qrCodeRef.current.stop();
        setIsScanning(false);
      } catch (err) {
        console.error('Failed to stop scanner', err);
      }
    }
  }, []);

  const startScanner = useCallback(async () => {
    if (!qrCodeRef.current) return;

    setError(null);
    setIsScanning(true);

    try {
      await qrCodeRef.current.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          stopScanner();
          onClose();

          // Xử lý mã QR: Nếu là URL truy xuất nguồn gốc thì lấy code, nếu không thì dùng nguyên text
          let code = decodedText;
          if (decodedText.includes('/trace/')) {
            const parts = decodedText.split('/trace/');
            code = parts[parts.length - 1];
            // Xóa các query params nếu có
            code = code.split('?')[0];
          }

          router.push(`/trace/${code}`);
        },
        () => {
          // Frame error - skip to keep scanning
        },
      );
    } catch (err) {
      console.error('Failed to start scanner', err);
      setIsScanning(false);
      setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
    }
  }, [onClose, router, stopScanner]);

  useEffect(() => {
    if (isOpen) {
      // Small delay to ensure the container is rendered and avoid synchronous setState in effect
      const timer = setTimeout(() => {
        qrCodeRef.current = new Html5Qrcode(scannerId);
        startScanner();
      }, 100);
      return () => {
        clearTimeout(timer);
        stopScanner();
      };
    }
  }, [isOpen, startScanner, stopScanner]);

  const handleRetry = () => {
    startScanner();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quét mã QR Truy xuất" maxWidth="max-w-md">
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="relative w-full aspect-square max-w-[300px] overflow-hidden rounded-2xl bg-stone-900 border-4 border-emerald-500/30 shadow-inner flex items-center justify-center">
          <div id={scannerId} className="w-full h-full"></div>

          {!isScanning && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/80 text-white p-4 text-center">
              <Camera className="w-12 h-12 mb-3 text-emerald-400 opacity-50" />
              <p className="text-sm font-medium">Đang khởi động camera...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/90 text-white p-6 text-center">
              <AlertCircle className="w-12 h-12 mb-3 text-red-400" />
              <p className="text-sm font-medium mb-4">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRetry}
                className="bg-white/10 border-white/20 hover:bg-white/20 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Thử lại
              </Button>
            </div>
          )}

          {/* Scanning Overlay UI */}
          {isScanning && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] border-2 border-emerald-400 rounded-lg shadow-[0_0_0_1000px_rgba(0,0,0,0.5)]">
                <div className="absolute inset-0 border-2 border-emerald-400 animate-pulse rounded-lg"></div>
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-500 -mt-1 -ml-1"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-500 -mt-1 -mr-1"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-500 -mb-1 -ml-1"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-500 -mb-1 -mr-1"></div>
              </div>
              <div className="absolute top-[30%] left-0 w-full h-[2px] bg-emerald-400/50 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-scan"></div>
            </div>
          )}
        </div>

        <div className="text-center space-y-3 w-full">
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
            <QrCode className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Mã QR OCOP Việt Nam</span>
          </div>
          <p className="text-sm text-stone-500 leading-relaxed px-4">
            Căn chỉnh mã QR vào khung hình để hệ thống tự động nhận diện và truy xuất thông tin sản
            phẩm.
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 30%;
          }
          50% {
            top: 70%;
          }
          100% {
            top: 30%;
          }
        }
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        #qr-reader-container video {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
        }
      `}</style>
    </Modal>
  );
};
