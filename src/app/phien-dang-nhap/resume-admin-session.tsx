'use client';

import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { refreshWebSession } from '@/lib/axios';

export function ResumeAdminSession({ destination }: { destination: string }) {
  const resume = useMutation({
    mutationFn: refreshWebSession,
    onSuccess: () => window.location.replace(destination),
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        window.location.replace('/dang-nhap?redirect=' + encodeURIComponent(destination));
      }
    },
  });

  return (
    <main className="mx-auto max-w-md px-6 py-20">
      <h1 className="text-2xl font-semibold">Tiếp tục phiên quản trị</h1>
      <p className="my-4">Xác nhận để làm mới phiên và quay lại trang quản trị.</p>
      <button
        type="button"
        className="rounded-lg bg-emerald-700 px-4 py-2 text-white disabled:opacity-50"
        disabled={resume.isPending}
        onClick={() => resume.mutate()}
      >
        {resume.isPending ? 'Đang xác minh…' : 'Tiếp tục'}
      </button>
      {resume.isError && (
        <p role="alert" className="mt-4">
          Không thể làm mới phiên. Vui lòng thử lại.
        </p>
      )}
    </main>
  );
}
