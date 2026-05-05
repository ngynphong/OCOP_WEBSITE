'use client';

import React from 'react';
import { usePolicyDetail } from '../hooks/usePolicies';
import { PolicyPageLayout } from '@/components/layout/PolicyPageLayout';
import { FiLoader } from 'react-icons/fi';

interface PolicyPageWrapperProps {
  id: number;
  fallbackTitle: string;
}

export const PolicyPageWrapper = ({ id, fallbackTitle }: PolicyPageWrapperProps) => {
  const { data: policy, isLoading, isError } = usePolicyDetail(id);

  if (isLoading) {
    return (
      <PolicyPageLayout title={fallbackTitle}>
        <div className="flex justify-center items-center py-20 text-emerald-600">
          <FiLoader className="animate-spin text-4xl" />
        </div>
      </PolicyPageLayout>
    );
  }

  if (isError || !policy) {
    return (
      <PolicyPageLayout title={fallbackTitle}>
        <div className="py-20 text-center text-red-500 font-bold">
          Không thể tải nội dung chính sách (ID: {id}). Vui lòng thử lại sau.
        </div>
      </PolicyPageLayout>
    );
  }

  return (
    <PolicyPageLayout title={policy.title} lastUpdated={policy.effectiveDate}>
      <div
        className="prose prose-sm prose-emerald max-w-none text-emerald-800
        [&>section]:mb-10 
        [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-emerald-900 [&_h1]:mb-6
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-emerald-900 [&_h2]:mb-4 [&_h2]:flex [&_h2]:items-center [&_h2]:gap-3
        [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-emerald-900 [&_h3]:mb-3
        [&_h4]:text-lg [&_h4]:font-bold [&_h4]:text-emerald-900 [&_h4]:mb-2
        [&_h5]:text-base [&_h5]:font-bold [&_h5]:text-emerald-900 [&_h5]:mb-2
        [&_h6]:text-sm [&_h6]:font-bold [&_h6]:text-emerald-900 [&_h6]:mb-2
        [&_p]:text-emerald-800 [&_p]:leading-relaxed [&_p]:mb-4
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:text-emerald-800
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:mb-4 [&_ol]:text-emerald-800
        [&_li]:leading-relaxed
        [&_strong]:text-emerald-900 [&_strong]:font-semibold"
        dangerouslySetInnerHTML={{ __html: policy.content.replace(/\n/g, '<br/>') }}
      />
    </PolicyPageLayout>
  );
};
