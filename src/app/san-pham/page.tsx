import { Metadata } from 'next';
import { ProductListClient } from '@/features/products/components/ProductListClient';

export const metadata: Metadata = {
  title: 'Danh sách Sản phẩm | Sàn OCOP',
  description: 'Khám phá hàng ngàn sản phẩm đặc sản vùng miền, đạt chứng nhận OCOP.',
};

export default function ProductsPage() {
  return <ProductListClient />;
}
