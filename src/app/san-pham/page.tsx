import { Metadata } from 'next';
import { ProductListClient } from '@/features/products/components/ProductListClient';
import { getPublicProductsServer } from '@/features/products/api/publicProductServerApi';

export const metadata: Metadata = {
  title: 'Danh sách Sản phẩm | Sàn OCOP',
  description: 'Khám phá hàng ngàn sản phẩm đặc sản vùng miền, đạt chứng nhận OCOP.',
};

const INITIAL_PRODUCT_PARAMS = {
  pageNo: 1,
  pageSize: 12,
  sort: 'newest',
};

export default async function ProductsPage() {
  const initialProducts = await getPublicProductsServer(INITIAL_PRODUCT_PARAMS);

  return <ProductListClient initialProducts={initialProducts} />;
}
