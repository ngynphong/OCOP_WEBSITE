import { PaymentCallbackManager } from '@/features/payment/components/PaymentCallbackManager';

interface PageProps {
  params: {
    provider: string;
  };
  searchParams: Record<string, string | string[]>;
}

export default function PaymentCallbackPage({ params, searchParams }: PageProps) {
  return (
    <div className="container mx-auto">
      <PaymentCallbackManager provider={params.provider} searchParams={searchParams} />
    </div>
  );
}
