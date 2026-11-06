import React from 'react';
import { FiCamera, FiTrash2 } from 'react-icons/fi';
import { EvidencePhoto } from '../../hooks/useEvidenceCapture';
import { useEvidenceCamera } from '../../hooks/useEvidenceCamera';

interface Props {
  photos: EvidencePhoto[];
  onAdd: (file: File) => void;
  onRemove: (key: string) => void;
  onRequestLocation: (photoKey?: string) => void;
  locationMessage: string;
  disabled: boolean;
}

export const TraceabilityEvidenceSection = ({
  photos,
  onAdd,
  onRemove,
  onRequestLocation,
  locationMessage,
  disabled,
}: Props) => {
  const {
    stream,
    opening,
    capturing,
    error: cameraError,
    open,
    close,
    capture,
    videoRef,
  } = useEvidenceCamera(onRequestLocation, onAdd);
  return (
    <section
      className="mt-6 rounded-xl border border-blue-100 bg-blue-50/30 p-4"
      aria-label="Bằng chứng truy xuất"
    >
      <h4 className="font-semibold text-blue-900">Bằng chứng truy xuất</h4>
      <p className="mt-1 text-xs text-blue-700">
        Dùng camera của thiết bị để chụp ảnh. Sau khi chụp, trình duyệt có thể hỏi quyền Vị trí. Ảnh
        JPG, PNG hoặc WebP tối đa 10 MB.
      </p>
      <label
        className={`mt-3 mr-2 inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white ${disabled || opening || !!stream || photos.length >= 3 ? 'opacity-50' : 'cursor-pointer'}`}
      >
        <FiCamera /> Chụp bằng camera hệ thống
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          disabled={disabled || opening || !!stream || photos.length >= 3}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onAdd(file);
            event.target.value = '';
          }}
        />
      </label>
      {!stream && (
        <button
          type="button"
          onClick={() => void open()}
          disabled={disabled || opening || photos.length >= 3}
          className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg border border-blue-300 bg-white px-4 text-sm font-semibold text-blue-800 disabled:opacity-50"
        >
          {opening ? 'Đang mở camera…' : 'Mở camera trong web'}
        </button>
      )}
      {stream && (
        <div className="mt-3 rounded-xl bg-stone-900 p-2">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            aria-label="Xem trước camera"
            className="aspect-[4/3] w-full rounded-lg object-contain"
          />
          <div className="flex flex-wrap justify-center gap-2 p-2">
            <button
              type="button"
              onClick={() => void capture()}
              disabled={disabled || capturing}
              className="min-h-11 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white disabled:opacity-50"
            >
              {capturing ? 'Đang chụp…' : 'Chụp ảnh'}
            </button>
            <button
              type="button"
              onClick={close}
              className="min-h-11 rounded-lg bg-white px-4 text-sm font-semibold text-stone-800"
            >
              Đóng camera
            </button>
          </div>
        </div>
      )}
      {cameraError && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {cameraError}
        </p>
      )}
      <p role="status" className="mt-2 text-xs text-stone-600">
        {locationMessage}
      </p>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((photo) => (
          <div key={photo.key} className="min-w-0 rounded-lg border bg-white p-2">
            {/* Local previews are generated from the selected file. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.preview}
              alt="Ảnh minh chứng đã chọn"
              className="h-28 w-full rounded object-cover"
            />
            <p className="mt-1 text-xs text-stone-500">
              {photo.latitude !== null ? 'Đã có vị trí' : 'Chưa có vị trí'}
            </p>
            {photo.latitude === null && !photo.uploaded && (
              <button
                type="button"
                disabled={disabled}
                onClick={() => onRequestLocation(photo.key)}
                className="min-h-10 text-sm font-semibold text-blue-700"
              >
                Lấy lại vị trí
              </button>
            )}
            <button
              type="button"
              disabled={disabled}
              onClick={() => onRemove(photo.key)}
              className="mt-1 inline-flex min-h-10 items-center gap-1 text-sm text-red-700"
            >
              <FiTrash2 /> Xóa ảnh
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
