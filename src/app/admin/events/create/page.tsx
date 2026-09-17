import { Metadata } from 'next';
import { EventFormPage } from '@/features/admin/components/events/EventFormPage';

export const metadata: Metadata = {
  title: 'Tạo Sự Kiện Mới | OCOP Admin',
  description: 'Thiết lập sự kiện, theme và chiến dịch mới trên sàn OCOP',
};

export default function CreateEventPage() {
  return <EventFormPage />;
}
