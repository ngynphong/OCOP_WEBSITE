import dynamic from 'next/dynamic';
import React from 'react';

const MapPickerNoSSR = dynamic(() => import('./MapPicker'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[350px] bg-stone-100 flex items-center justify-center rounded-lg border border-stone-200">
      <span className="text-stone-500 font-medium text-sm animate-pulse">Đang tải bản đồ...</span>
    </div>
  ),
});

import type { MapPickerProps } from './MapPicker';

export default function MapPickerWrapper(props: MapPickerProps) {
  return <MapPickerNoSSR {...props} />;
}
