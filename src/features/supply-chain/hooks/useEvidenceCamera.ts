import { useCallback, useEffect, useRef, useState } from 'react';

export function useEvidenceCamera(onReady: () => void, onCapture: (file: File) => void) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [opening, setOpening] = useState(false);
  const [error, setError] = useState('');
  const [capturing, setCapturing] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const generation = useRef(0);

  const close = useCallback(() => {
    generation.current += 1;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setStream(null);
    setOpening(false);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) close();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      generation.current += 1;
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [close]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;
    video.srcObject = stream;
    void video
      .play()
      .catch(() => setError('Không hiển thị được camera. Hãy thử lại hoặc dùng camera hệ thống.'));
    return () => {
      video.srcObject = null;
    };
  }, [stream]);

  const open = useCallback(async () => {
    if (streamRef.current || opening) return;
    setError('');
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setError(
        'Camera trực tiếp cần HTTPS được thiết bị tin cậy. Bạn vẫn có thể dùng camera hệ thống bên dưới; vị trí cũng cần HTTPS.',
      );
      return;
    }
    const attempt = ++generation.current;
    setOpening(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      if (attempt !== generation.current) {
        media.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = media;
      setStream(media);
      onReady();
    } catch (cause) {
      if (attempt !== generation.current) return;
      const name = cause instanceof Error ? cause.name : '';
      setError(
        name === 'NotAllowedError' || name === 'SecurityError'
          ? 'Chưa được phép dùng camera. Hãy cho phép Camera trong cài đặt của trang rồi thử lại.'
          : 'Không mở được camera. Hãy kiểm tra camera hoặc dùng camera hệ thống bên dưới.',
      );
    } finally {
      if (attempt === generation.current) setOpening(false);
    }
  }, [onReady, opening]);

  const capture = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !streamRef.current || capturing) return;
    if (!video.videoWidth || !video.videoHeight) {
      setError('Camera chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }
    const attempt = generation.current;
    setCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Camera không sẵn sàng');
      context.drawImage(video, 0, 0);
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', 0.85),
      );
      if (attempt !== generation.current) return;
      if (!blob) throw new Error('Không tạo được ảnh');
      const file = new File([blob], `minh-chung-${Date.now()}.jpg`, { type: 'image/jpeg' });
      close();
      onCapture(file);
    } catch {
      if (attempt === generation.current)
        setError('Không chụp được ảnh. Hãy thử lại hoặc dùng camera hệ thống.');
    } finally {
      setCapturing(false);
    }
  }, [capturing, close, onCapture]);

  return { stream, opening, capturing, error, open, close, capture, videoRef };
}
