import { Suspense } from 'react';
import VungMienContent from './VungMienContent';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'Đặc Sản Vùng Miền - OCOP',
  description:
    'Khám phá và mua sắm các sản phẩm OCOP đặc trưng từ khắp các tỉnh thành trên cả nước.',
};

export default function VungMienPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-stone-50">
      <Header />

      <main className="flex-1 w-full pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="flex justify-center items-center h-96">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <VungMienContent />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
