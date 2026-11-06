import { useCallback, useEffect, useRef, useState } from 'react';
import { axiosClient } from '@/lib/axios';
import { toVietnamLocalDateTime } from '../utils/evidenceTime';

interface UploadedEvidence {
  id: number;
  fileUrl: string;
}
export interface EvidencePhoto {
  key: string;
  file: File;
  preview: string;
  capturedAt: string;
  latitude: number | null;
  longitude: number | null;
  uploaded?: UploadedEvidence;
}

export function useEvidenceCapture() {
  const [photos, setPhotos] = useState<EvidencePhoto[]>([]);
  const photosRef = useRef<EvidencePhoto[]>([]);
  const [locationMessage, setLocationMessage] = useState('');
  const [locating, setLocating] = useState(false);
  const update = useCallback((next: EvidencePhoto[]) => {
    photosRef.current = next;
    setPhotos(next);
  }, []);
  const clear = useCallback(() => {
    photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview));
    update([]);
    setLocationMessage('');
  }, [update]);
  useEffect(
    () => () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.preview));
    },
    [],
  );
  const remove = useCallback(
    (key: string) => {
      const item = photosRef.current.find((photo) => photo.key === key);
      if (item) URL.revokeObjectURL(item.preview);
      update(photosRef.current.filter((photo) => photo.key !== key));
    },
    [update],
  );
  const requestLocation = useCallback(
    (photoKey?: string) => {
      if (!window.isSecureContext) {
        setLocationMessage('Vị trí cần kết nối HTTPS được thiết bị tin cậy.');
        return;
      }
      if (!navigator.geolocation) {
        setLocationMessage('Trình duyệt không hỗ trợ vị trí.');
        return;
      }
      setLocating(true);
      setLocationMessage('Đang xin quyền và lấy vị trí…');
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          if (photoKey)
            update(
              photosRef.current.map((item) =>
                item.key === photoKey
                  ? { ...item, latitude: coords.latitude, longitude: coords.longitude }
                  : item,
              ),
            );
          setLocationMessage(
            photoKey
              ? 'Đã lấy vị trí cho ảnh.'
              : 'Đã cho phép vị trí. Vị trí sẽ được lấy lại khi chụp ảnh.',
          );
          setLocating(false);
        },
        (error) => {
          setLocationMessage(
            error.code === 1
              ? 'Chưa được phép dùng vị trí. Hãy cho phép Vị trí trong cài đặt của trang rồi thử lại.'
              : 'Không lấy được vị trí. Hãy kiểm tra GPS và thử lại.',
          );
          setLocating(false);
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 },
      );
    },
    [update],
  );
  const add = useCallback(
    (file: File) => {
      if (
        !/\.(jpe?g|png|webp)$/i.test(file.name) ||
        (file.type && !['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
      ) {
        setLocationMessage('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP.');
        return;
      }
      if (file.size === 0 || file.size > 10 * 1024 * 1024) {
        setLocationMessage('Ảnh phải có dung lượng lớn hơn 0 và không quá 10 MB.');
        return;
      }
      if (photosRef.current.length >= 3) {
        setLocationMessage('Tối đa 3 ảnh minh chứng.');
        return;
      }
      const photo: EvidencePhoto = {
        key: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        file,
        preview: URL.createObjectURL(file),
        capturedAt: new Date().toISOString(),
        latitude: null,
        longitude: null,
      };
      update([...photosRef.current, photo]);
      requestLocation(photo.key);
    },
    [requestLocation, update],
  );
  const upload = useCallback(async () => {
    const results: UploadedEvidence[] = [];
    for (const photo of photosRef.current) {
      let uploaded = photo.uploaded;
      if (!uploaded) {
        const body = new FormData();
        body.append('file', photo.file);
        body.append('ownerType', 'TEMP_LOG');
        body.append('ownerId', '0');
        if (photo.latitude !== null && photo.longitude !== null) {
          body.append('latitude', String(photo.latitude));
          body.append('longitude', String(photo.longitude));
        }
        body.append('capturedAt', toVietnamLocalDateTime(new Date(photo.capturedAt)));
        body.append('deviceInfo', navigator.userAgent.slice(0, 200));
        const response = await axiosClient.post<unknown, { data: UploadedEvidence }>(
          '/seller/evidences/upload',
          body,
          { headers: { 'Content-Type': 'multipart/form-data' } },
        );
        uploaded = response.data;
        if (!uploaded?.id || !uploaded.fileUrl)
          throw new Error('Máy chủ không trả về thông tin ảnh minh chứng.');
        const saved = uploaded;
        update(
          photosRef.current.map((item) =>
            item.key === photo.key ? { ...item, uploaded: saved } : item,
          ),
        );
      }
      results.push(uploaded);
    }
    return results;
  }, [update]);
  return { photos, add, remove, clear, upload, locating, locationMessage, requestLocation };
}
