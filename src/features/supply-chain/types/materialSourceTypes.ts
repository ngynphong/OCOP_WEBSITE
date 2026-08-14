export type MaterialSourceType = 'INTERNAL' | 'EXTERNAL';
export type FacilityType = 'PLANTING' | 'LIVESTOCK' | 'AQUACULTURE' | 'PROCESSING';
export type LotStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'SOLD_OUT'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'RECALLED'
  | 'ARCHIVED';

export interface ISupplier {
  id: number;
  name: string;
  taxCode?: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
  createdAt: string;
}

export interface ISupplierReq {
  name: string;
  taxCode?: string;
  address?: string;
  phoneNumber?: string;
  description?: string;
}

export interface ISourceFacility {
  id: number;
  name: string;
  type: FacilityType;
  address?: string;
  areaSize?: number;
  description?: string;
  createdAt: string;
}

export interface ISourceFacilityReq {
  name: string;
  type: FacilityType;
  address?: string;
  areaSize?: number;
  description?: string;
}

export interface ISourceCycle {
  id: number;
  facilityId: number;
  facilityName: string;
  name: string;
  startDate?: string;
  endDate?: string;
  expectedYield?: number;
  unit?: string;
  description?: string;
  createdAt: string;
}

export interface ISourceCycleReq {
  name: string;
  startDate?: string;
  endDate?: string;
  expectedYield?: number;
  unit?: string;
  description?: string;
}

export interface ISourceCycleLog {
  id: number;
  cycleId: number;
  eventTime: string;
  activityName: string;
  description?: string;
  materialsUsed?: string;
  evidenceUrls?: string;
  createdAt: string;
  createdBy: string;
}

export interface ISourceCycleLogReq {
  eventTime: string;
  activityName: string;
  description?: string;
  materialsUsed?: string;
  evidenceUrls?: string;
}

export interface IMaterialLot {
  id: number;
  code: string;
  materialName: string;
  sourceType: MaterialSourceType;
  sourceCycleId?: number;
  sourceCycleName?: string;
  supplierId?: number;
  supplierName?: string;
  supplierLotCode?: string;
  originalQuantity: number;
  availableQuantity: number;
  unit: string;
  receivedAt?: string;
  expiresAt?: string;
  evidences?: string; // JSON String
  status: LotStatus;
  createdAt: string;
}

export interface IMaterialLotReq {
  code?: string;
  materialName: string;
  sourceType: MaterialSourceType;
  sourceCycleId?: number;
  supplierId?: number;
  supplierLotCode?: string;
  originalQuantity: number;
  unit: string;
  receivedAt?: string;
  expiresAt?: string;
  evidences?: string;
}

export interface IMaterialLotUsage {
  id: number;
  quantityUsed: number;
  unit: string;
  usedAt: string;
  productionBatch: {
    id: number;
    lotCode: string;
    status: string;
    mfgDate?: string;
    expDate?: string;
    product?: {
      id: number;
      name: string;
      mainImageUrl?: string;
    };
    variant?: {
      id: number;
      sku: string;
      title: string;
      image?: string;
    };
  };
}

export interface IPageResponse<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  content: T[];
}
