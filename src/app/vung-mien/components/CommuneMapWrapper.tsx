'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import type { CommuneMapDetailProps } from './CommuneMapDetail';

const CommuneMapNoSSR = dynamic(() => import('./CommuneMapDetail'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[540px] bg-stone-100 flex flex-col items-center justify-center rounded-2xl border border-emerald-100 gap-3">
      <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-stone-500 font-medium text-xs animate-pulse">
        Đang tải bản đồ vệ tinh xã/phường...
      </span>
    </div>
  ),
});

export default function CommuneMapWrapper(props: CommuneMapDetailProps) {
  return <CommuneMapNoSSR {...props} />;
}
