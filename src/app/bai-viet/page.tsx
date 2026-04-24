import { BlogFeed } from '@/features/blog/components/public/BlogFeed';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

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
