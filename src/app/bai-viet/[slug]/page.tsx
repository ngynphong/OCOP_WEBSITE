import { BlogArticle } from '@/features/blog/components/public/BlogArticle';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function BlogDetailPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <BlogArticle />
      </main>
      <Footer />
    </div>
  );
}
