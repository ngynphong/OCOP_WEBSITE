'use client';

import React, { useState } from 'react';
import {
  useRecordScanMutation,
  useTraceDetailQuery,
  usePublicProductLotsQuery,
} from '@/features/products/hooks/usePublicProducts';
import { useAppSelector } from '@/store/hooks';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import { ProductJournal, ProductQrCode } from '@/features/products/types/productTypes';
import {
  TraceabilityQrCard,
  TraceabilityLotsGrid,
  TraceabilityJournalTimeline,
  LotQrModal,
} from './traceability';

interface ProductTraceabilityProps {
  journals: ProductJournal[];
  qrCode?: ProductQrCode | null;
  productId?: number;
}

export function ProductTraceability({
  journals = [],
  qrCode,
  productId,
}: ProductTraceabilityProps) {
  const [selectedLotForQr, setSelectedLotForQr] = useState<ISupplyChainLot | null>(null);
  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);
  const code = qrCode?.qrCode;

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { mutate: recordScan } = useRecordScanMutation();
  const { data: traceData } = useTraceDetailQuery(code, {
    enabled: !!code && isAuthenticated,
  });

  const { data: lotsResp, isLoading: isLoadingLots } = usePublicProductLotsQuery(productId, 0, 6);

  const lots: ISupplyChainLot[] = lotsResp?.data?.content || [];

  const [origin, setOrigin] = React.useState('');

  React.useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  React.useEffect(() => {
    if (code && isAuthenticated) {
      recordScan(code);
    }
  }, [code, recordScan, isAuthenticated]);

  const scanCount = traceData?.data?.scanCount ?? qrCode?.scanCount ?? 0;

  return (
    <div className="flex flex-col gap-8 py-6 border-t border-stone-100">
      <TraceabilityQrCard qrCode={qrCode} scanCount={scanCount} origin={origin} />

      <TraceabilityLotsGrid
        lots={lots}
        isLoading={isLoadingLots}
        onSelectLotForQr={setSelectedLotForQr}
      />

      <TraceabilityJournalTimeline journals={sortedJournals} />

      {selectedLotForQr && (
        <LotQrModal
          lot={selectedLotForQr}
          origin={origin}
          onClose={() => setSelectedLotForQr(null)}
        />
      )}
    </div>
  );
}
