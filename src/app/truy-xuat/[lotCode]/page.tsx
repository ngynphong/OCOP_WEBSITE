import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{ lotCode: string }>;
}

export default async function PublicTraceabilityPage({ params }: PageProps) {
  const { lotCode } = await params;
  redirect(`/trace/${lotCode}`);
}
