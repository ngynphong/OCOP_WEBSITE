import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const ProductDetailSkeleton = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 overflow-hidden">
        {/* Breadcrumb Skeleton */}
        <div className="mb-8 flex items-center gap-2">
          <div className="h-4 w-16 bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-4 bg-stone-50 rounded animate-pulse" />
          <div className="h-4 w-20 bg-stone-100 rounded animate-pulse" />
          <div className="h-4 w-4 bg-stone-50 rounded animate-pulse" />
          <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
        </div>

        {/* Hero Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 items-start">
          {/* Left: Gallery Skeleton */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full aspect-square md:aspect-[4/3] bg-stone-100 rounded-2xl animate-pulse" />
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-20 bg-stone-100 rounded-xl animate-pulse shrink-0" />
              ))}
            </div>
          </div>

          {/* Right: Info Skeleton */}
          <div className="lg:col-span-5 space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              <div className="w-16 h-6 bg-stone-100 rounded-full animate-pulse" />
              <div className="w-24 h-6 bg-stone-100 rounded-full animate-pulse" />
            </div>

            {/* Title & Price */}
            <div className="space-y-4">
              <div className="h-8 md:h-10 w-3/4 bg-stone-200 rounded-xl animate-pulse" />
              <div className="h-10 md:h-12 w-1/2 bg-stone-100 rounded-xl animate-pulse" />
            </div>

            {/* Shop Info */}
            <div className="flex items-center gap-3 p-4 border border-stone-100 rounded-xl">
              <div className="w-12 h-12 bg-stone-100 rounded-full animate-pulse" />
              <div className="space-y-2 flex-1">
                <div className="h-4 w-32 bg-stone-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-stone-100 rounded animate-pulse" />
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-3 pt-6 border-t border-stone-100">
              <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
              <div className="flex gap-3">
                <div className="h-10 w-24 bg-stone-100 rounded-xl animate-pulse" />
                <div className="h-10 w-32 bg-stone-100 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="space-y-4 pt-6 border-t border-stone-100">
              <div className="h-4 w-20 bg-stone-200 rounded animate-pulse" />
              <div className="flex gap-4">
                <div className="h-12 w-32 bg-stone-100 rounded-xl animate-pulse" />
                <div className="h-12 flex-1 bg-stone-200 rounded-xl animate-pulse" />
              </div>
              <div className="h-14 w-full bg-green-100 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
