import { Metadata } from 'next';
import { PublicShopList } from '@/features/shop/components/PublicShopList';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Danh sách cửa hàng OCOP | Nền tảng TMĐT OCOP',
  description:
    'Khám phá hàng ngàn cửa hàng và gian hàng tiêu chuẩn OCOP trên toàn quốc. Tìm kiếm đặc sản vùng miền chất lượng cao.',
};

export default function ShopsPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      <Header />
      <div className="flex-grow py-8 md:py-12">
        <PublicShopList />
      </div>
      <Footer />
    </main>
  );
}
