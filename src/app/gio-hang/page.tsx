import type { Metadata } from 'next';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartPageClient } from '@/features/cart/components/CartPageClient';

export const metadata: Metadata = {
  title: 'Giỏ hàng | OCOP Market',
  description: 'Xem và quản lý các sản phẩm OCOP trong giỏ hàng của bạn trước khi thanh toán.',
};

export default function CartPage() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Header />
      <main className="flex-1">
        <CartPageClient />
      </main>
      <Footer />
    </div>
  );
}
