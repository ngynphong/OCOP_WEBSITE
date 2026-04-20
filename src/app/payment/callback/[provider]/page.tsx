import { PaymentCallbackManager } from '@/features/payment/components/PaymentCallbackManager';

interface PageProps {
  params: Promise<{
    provider: string;
  }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

export default async function PaymentCallbackPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  return (
    <div className="container mx-auto">
      <PaymentCallbackManager
        provider={resolvedParams.provider}
        searchParams={resolvedSearchParams}
      />
    </div>
  );
}
