import { BlogFeed } from '@/features/blog/components/public/BlogFeed';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog & Tin tức | Sàn OCOP',
  description:
    'Cập nhật tin tức, câu chuyện và kiến thức về các sản phẩm OCOP và tinh hoa vùng miền.',
};

export default function BlogListPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BlogFeed />
      </main>
      <Footer />
    </div>
  );
}
