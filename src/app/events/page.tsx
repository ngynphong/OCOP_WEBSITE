import { redirect } from 'next/navigation';
import { getActiveEventServer } from '@/features/events/api/eventApi';

export const revalidate = 60;

export default async function EventsIndexPage() {
  const activeEvent = await getActiveEventServer();

  if (activeEvent && activeEvent.slug) {
    redirect(`/events/${activeEvent.slug}`);
  }

  // Nếu không có sự kiện đang diễn ra, quay về trang chủ
  redirect('/');
}
