'use client';

import { useQuery } from '@tanstack/react-query';
import { sellerProductApi } from '@/features/products/api/sellerProductApi';

export interface CertificationEligibilityResult {
  isLoading: boolean;
  isError: boolean;
  isEligible: boolean;
  completedLotId?: number;
  completedLotCode?: string;
  hasLots: boolean;
  lotsCount: number;
}

/**
 * Kiểm tra điều kiện mở form nộp Giấy chứng nhận OCOP:
 * Chỉ khi sản phẩm có ít nhất một Lô hàng (Production Batch) đã hoàn thành bước
 * Chứng nhận (CERTIFICATION) hoặc Kiểm định chất lượng (QUALITY_CHECK).
 */
export function useProductCertificationEligibility(
  productId: number,
  enabled = true,
): CertificationEligibilityResult {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['seller-product-certification-eligibility', productId],
    queryFn: () => sellerProductApi.getCertificationEligibility(productId),
    enabled: enabled && productId > 0,
    staleTime: 30 * 1000,
  });
  const eligibility = data?.data;

  return {
    isLoading,
    isError,
    isEligible: eligibility?.eligible ?? false,
    completedLotId: eligibility?.qualifyingLotId ?? undefined,
    completedLotCode: eligibility?.qualifyingLotCode ?? undefined,
    hasLots: (eligibility?.lotsCount ?? 0) > 0,
    lotsCount: eligibility?.lotsCount ?? 0,
  };
}
