'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <h2 className="text-xl font-bold">Đã có lỗi xảy ra!</h2>
      <button className="mt-4 bg-blue-500 px-4 py-2 text-white rounded" onClick={() => reset()}>
        Thử lại
      </button>
    </div>
  );
}
