import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, AlertCircle, Clock, Package } from 'lucide-react';
import { ISupplyChainLot } from '@/features/supply-chain/types/supplyChainTypes';
import { TraceQrInfo } from '@/features/products/types/productTypes';

export interface CodeStatusInfo {
  label: string;
  color: string;
  bg: string;
  border: string;
  icon: React.ReactNode;
}

export function getCodeStatus(lot?: ISupplyChainLot, qr?: TraceQrInfo): CodeStatusInfo {
  if (lot) {
    const isExpired = lot.expiryDate ? new Date(lot.expiryDate).getTime() < Date.now() : false;

    if (lot.status === 'RECALLED') {
      return {
        label: 'Cảnh báo thu hồi',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <AlertTriangle className="w-4 h-4 text-red-600" />,
      };
    }
    if (lot.status === 'SUSPENDED') {
      return {
        label: 'Tạm ngưng lưu hành',
        color: 'text-amber-700',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
      };
    }
    if (lot.status === 'EXPIRED' || isExpired) {
      return {
        label: 'Hết hạn sử dụng',
        color: 'text-red-700',
        bg: 'bg-red-50',
        border: 'border-red-200',
        icon: <Clock className="w-4 h-4 text-red-500" />,
      };
    }
    if (lot.status === 'CANCELLED') {
      return {
        label: 'Mã đã bị hủy',
        color: 'text-stone-700',
        bg: 'bg-stone-100',
        border: 'border-stone-200',
        icon: <XCircle className="w-4 h-4 text-stone-500" />,
      };
    }
    if (lot.status === 'ACTIVE' || lot.status === 'DISTRIBUTED') {
      return {
        label: 'Hợp lệ (Đang lưu hành)',
        color: 'text-emerald-800',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      };
    }
    if (lot.status === 'SOLD_OUT') {
      return {
        label: 'Lô đã bán hết',
        color: 'text-stone-700',
        bg: 'bg-stone-100',
        border: 'border-stone-200',
        icon: <Package className="w-4 h-4 text-stone-500" />,
      };
    }
    return {
      label: 'Đang sản xuất (Chưa kích hoạt)',
      color: 'text-stone-700',
      bg: 'bg-stone-100',
      border: 'border-stone-200',
      icon: <Clock className="w-4 h-4 text-stone-500" />,
    };
  }

  const statusStr = qr?.status?.toUpperCase() || qr?.certificationStatus?.toUpperCase();
  if (qr?.isCertified || statusStr === 'CERTIFIED' || statusStr === 'ACTIVE') {
    return {
      label: 'Hợp lệ (Đã chứng thực OCOP)',
      color: 'text-emerald-800',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
    };
  }
  if (statusStr === 'REJECTED' || statusStr === 'CANCELLED') {
    return {
      label: 'Không hợp lệ / Đã hủy',
      color: 'text-red-700',
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: <XCircle className="w-4 h-4 text-red-600" />,
    };
  }
  if (statusStr === 'SUSPENDED') {
    return {
      label: 'Mã đang tạm khóa',
      color: 'text-amber-800',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: <AlertCircle className="w-4 h-4 text-amber-600" />,
    };
  }

  return {
    label: 'Chưa xác minh hồ sơ',
    color: 'text-stone-700',
    bg: 'bg-stone-100',
    border: 'border-stone-200',
    icon: <Clock className="w-4 h-4 text-stone-500" />,
  };
}
