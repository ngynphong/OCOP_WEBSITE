import { Metadata } from 'next';
import { CategoriesClient } from './CategoriesClient';

export const metadata: Metadata = {
  title: 'Danh mục sản phẩm | Sàn thương mại điện tử OCOP',
  description: 'Khám phá tất cả các danh mục sản phẩm đặc sản vùng miền đạt chuẩn OCOP.',
  alternates: {
    canonical: '/danh-muc',
  },
  openGraph: {
    title: 'Danh mục sản phẩm | Sàn thương mại điện tử OCOP',
    description: 'Khám phá tất cả các danh mục sản phẩm đặc sản vùng miền đạt chuẩn OCOP.',
    url: '/danh-muc',
    type: 'website',
  },
};

export default function CategoriesPage() {
  return <CategoriesClient />;
}
