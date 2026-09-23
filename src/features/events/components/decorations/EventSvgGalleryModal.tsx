'use client';

import React from 'react';
import {
  GalleryModalHeader,
  GalleryMascotIconsSection,
  GalleryCornerDecorSection,
  GalleryAtmosphereSection,
  MOONCAKE_PETALS_R28,
} from './gallery';

export { MOONCAKE_PETALS_R28 };

export interface EventSvgGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EventSvgGalleryModal({ isOpen, onClose }: EventSvgGalleryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-gray-100">
        <GalleryModalHeader onClose={onClose} />

        <div className="p-6 space-y-8">
          <GalleryMascotIconsSection />
          <GalleryCornerDecorSection />
          <GalleryAtmosphereSection />
        </div>
      </div>
    </div>
  );
}
