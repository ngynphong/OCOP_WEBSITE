'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useTraceDetailQuery,
  useRecordScanMutation,
  usePublicLotByCodeQuery,
  usePublicProductDetailQuery,
  usePublicProductLotsQuery,
} from '@/features/products/hooks/usePublicProducts';
import {
  ProductJournal,
  TraceQrInfo,
  TraceProductInfo,
} from '@/features/products/types/productTypes';
import { StandardProcessWorkflow } from '@/features/supply-chain/components/StandardProcessWorkflow';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';

import {
  getCodeStatus,
  TraceVerificationCard,
  TraceProductCard,
  TraceFarmSeasonCard,
  TraceComplianceCard,
  TraceLotSpecsCard,
  TraceMaterialsCard,
  TraceSupplyChainTimelineCard,
  TraceStoryCard,
} from '@/features/supply-chain/components/trace';

interface PageProps {
  params: Promise<{ code: string }>;
}

function TraceContent({ code }: { code: string }) {
  const searchParams = useSearchParams();
  const serial = searchParams.get('serial');

  const isLotCode = code.startsWith('LOT-');
  const isGs1Code = code.startsWith('01-') && code.includes('-10-');

  const { data: traceData, isLoading: isTraceLoading } = useTraceDetailQuery(
    isLotCode ? undefined : code,
    {
      enabled: !isLotCode && !!code,
    },
  );

  const { mutate: recordScan } = useRecordScanMutation();

  useEffect(() => {
    if (code && !isLotCode && !isGs1Code) {
      recordScan(code);
    }
  }, [code, isLotCode, isGs1Code, recordScan]);

  const { data: lotResp, isLoading: isLotLoading } = usePublicLotByCodeQuery(code, isLotCode);

  const lotFromDirectApi = lotResp?.data;
  const targetProductId = !traceData?.data?.product ? lotFromDirectApi?.productId : undefined;

  const { data: productResp, isLoading: isProductLoading } = usePublicProductDetailQuery(
    targetProductId,
    { retry: false },
  );

  const fallbackProductInfo: TraceProductInfo | undefined = productResp?.data
    ? {
        id: productResp.data.id,
        name: productResp.data.name || lotFromDirectApi?.productName || 'Chưa cập nhật',
        ocopStar: String(productResp.data.ocopStar ?? 0),
        certificationNumber: 'Chưa cập nhật',
        thumbnailUrl:
          productResp.data.images?.find((img) => img.isPrimary)?.url ||
          productResp.data.images?.[0]?.url ||
          productResp.data.thumbnailUrl ||
          '',
        ingredients: productResp.data.ingredients,
        packagingMaterial: productResp.data.packagingMaterial,
        appliedStandards: productResp.data.appliedStandards,
        complianceDocuments: productResp.data.complianceDocuments,
        shop: {
          id: productResp.data.shop?.id,
          name: productResp.data.shop?.name || lotFromDirectApi?.shopName || 'Chưa cập nhật',
          province: productResp.data.province?.name || productResp.data.provinceName || undefined,
        },
      }
    : lotFromDirectApi
      ? {
          id: lotFromDirectApi.productId,
          name: lotFromDirectApi.productName || 'Chưa cập nhật',
          ocopStar: '3',
          certificationNumber: 'Chưa cập nhật',
          thumbnailUrl: '',
          shop: {
            name: lotFromDirectApi.shopName || 'Chưa cập nhật',
          },
        }
      : undefined;

  const product: TraceProductInfo | undefined = traceData?.data?.product || fallbackProductInfo;

  const { data: productLotsResp } = usePublicProductLotsQuery(product?.id, 0, 10, !isLotCode);
  const productLots: ISupplyChainLot[] = productLotsResp?.data?.content || [];

  const [selectedLotCode, setSelectedLotCode] = useState<string | null>(null);

  const { data: selectedLotDetailResp } = usePublicLotByCodeQuery(
    selectedLotCode || undefined,
    !!selectedLotCode,
  );

  const activeLot: ISupplyChainLot | undefined = selectedLotCode
    ? selectedLotDetailResp?.data || productLots.find((l) => l.lotCode === selectedLotCode)
    : traceData?.data?.lot ||
      lotFromDirectApi ||
      (productLots.length > 0 ? productLots[0] : undefined);

  const lot: ISupplyChainLot | undefined = activeLot;

  const qr: TraceQrInfo = traceData?.data?.qr || {
    qrCode: lot?.lotCode || code,
    digitalLink: lot?.digitalLink,
    status: lot?.status || 'ACTIVE',
    certificationStatus: productResp?.data?.qrCode ? 'CERTIFIED' : 'UNVERIFIED',
    isCertified: true,
  };
  const journals: ProductJournal[] = traceData?.data?.journals || productResp?.data?.journals || [];
  const scanCount = traceData?.data?.scanCount ?? productResp?.data?.qrCode?.scanCount ?? 0;

  const isLoading = isLotCode
    ? isLotLoading || (!!targetProductId && isProductLoading)
    : isTraceLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3 text-stone-400">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-700" />
          <p className="text-sm font-medium">Đang tải thông tin truy xuất...</p>
        </div>
      </div>
    );
  }

  if (!product && !lot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <XCircle className="w-12 h-12 text-red-400" />
          <h1 className="text-xl font-black text-stone-900">Không tìm thấy thông tin</h1>
          <p className="text-stone-500 text-sm">
            Mã định danh <span className="font-mono font-bold text-stone-700">{code}</span> không
            hợp lệ hoặc chưa được đăng ký trên hệ thống.
          </p>
          <Link
            href="/"
            className="mt-2 px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const sortedJournals = [...journals].sort((a, b) => a.stepOrder - b.stepOrder);
  const codeStatus = getCodeStatus(lot, qr);
  const isRecalled = lot?.status === 'RECALLED';

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <div
        className={cn(
          'text-white px-4 py-3 flex items-center justify-center shadow-xs relative z-10 transition-colors',
          isRecalled ? 'bg-red-700' : 'bg-emerald-800',
        )}
      >
        <span className="text-sm font-black uppercase tracking-widest flex items-center gap-1.5">
          {isRecalled ? (
            <>
              <AlertTriangle className="w-4 h-4 text-yellow-300" /> CẢNH BÁO THU HỒI • TRUY XUẤT
              NGUỒN GỐC
            </>
          ) : (
            'TRUY XUẤT NGUỒN GỐC'
          )}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex flex-col gap-6">
        {isRecalled && (
          <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 text-left shadow-xs">
            <div className="flex items-center gap-2 text-red-700 mb-1">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h4 className="font-black text-sm">CẢNH BÁO: LÔ SẢN PHẨM BỊ THU HỒI</h4>
            </div>
            <p className="text-xs text-red-600 font-medium leading-relaxed">
              Lô sản phẩm này đang nằm trong diện thu hồi của cơ sở sản xuất hoặc cơ quan quản lý.
              Vui lòng không tiếp tục sử dụng sản phẩm.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 lg:sticky lg:top-6 flex flex-col gap-5">
            <TraceVerificationCard
              codeStatus={codeStatus}
              scanCount={scanCount}
              serial={serial}
              digitalLink={qr?.digitalLink || lot?.digitalLink}
            />

            {product && <TraceProductCard product={product} />}

            {lot && <TraceFarmSeasonCard lot={lot} />}

            {product && <TraceComplianceCard product={product} />}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <TraceLotSpecsCard
              lot={lot}
              productLots={productLots}
              selectedLotCode={selectedLotCode}
              onSelectLotCode={setSelectedLotCode}
            />

            {lot && <TraceMaterialsCard materials={lot.materialsUsed} />}

            {lot?.templateSteps && lot.templateSteps.length > 0 && (
              <StandardProcessWorkflow
                processTemplateName={lot.processTemplateName}
                templateSteps={lot.templateSteps}
                events={lot.events || []}
              />
            )}

            {lot ? (
              <TraceSupplyChainTimelineCard lot={lot} />
            ) : (
              sortedJournals.length > 0 && (
                <TraceStoryCard journals={sortedJournals} variant="standard" />
              )
            )}

            {lot && sortedJournals.length > 0 && (
              <TraceStoryCard journals={sortedJournals} variant="reference" />
            )}
          </div>
        </div>

        <p className="text-center text-xs text-stone-400 font-medium mt-4 pt-4 border-t border-stone-200/60">
          Thông tin được xác thực bởi Hệ thống OCOP •{' '}
          <Link href="/" className="text-emerald-800 font-bold hover:underline">
            ocop.vn
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function TracePage({ params }: PageProps) {
  const { code } = use(params);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <div className="flex flex-col items-center gap-3 text-stone-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <p className="text-sm font-medium">Đang tải thông tin truy xuất...</p>
          </div>
        </div>
      }
    >
      <TraceContent code={code} />
    </Suspense>
  );
}
