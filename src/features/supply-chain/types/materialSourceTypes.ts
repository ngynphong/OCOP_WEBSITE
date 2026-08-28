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
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;
  boundary?: string;
  cropName?: string;
  cropVariety?: string;
  createdAt: string;
}

export interface ISourceFacilityReq {
  name: string;
  type: FacilityType;
  address?: string;
  areaSize?: number;
  description?: string;
  provinceCode?: string;
  districtCode?: string;
  wardCode?: string;
  latitude?: number;
  longitude?: number;
  boundary?: string;
  cropName?: string;
  cropVariety?: string;
}

export type CycleStatus = 'PLANNED' | 'IN_PROGRESS' | 'HARVESTING' | 'COMPLETED';

export interface ISourceCycle {
  id: number;
  facilityId: number;
  facilityName: string;
  name: string;
  startDate?: string;
  endDate?: string;
  expectedYield?: number;
  actualYield?: number;
  unit?: string;
  status: CycleStatus;
  description?: string;
  processTemplateId?: number;
  processTemplateName?: string;
  createdAt: string;
}

export interface ISourceCycleReq {
  name: string;
  startDate?: string;
  endDate?: string;
  expectedYield?: number;
  actualYield?: number;
  unit?: string;
  status?: CycleStatus;
  description?: string;
  processTemplateId?: number;
}

export interface IHarvest {
  id: number;
  cycleId: number;
  cycleName?: string;
  harvestDate: string;
  quantity: number;
  unit: string;
  qualityGrade?: string;
  harvestArea?: number;
  description?: string;
  createdAt: string;
}

export interface IHarvestReq {
  cycleId: number;
  harvestDate: string;
  quantity: number;
  unit: string;
  qualityGrade?: string;
  harvestArea?: number;
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
  createdBy?: string;
  templateStepId?: number;
}

export interface ISourceCycleLogReq {
  eventTime: string;
  activityName: string;
  description?: string;
  materialsUsed?: string;
  evidenceUrls?: string;
  templateStepId?: number;
}

export interface IMaterialLot {
  id: number;
  code: string;
  materialName: string;
  sourceType: MaterialSourceType;
  sourceCycleId?: number;
  sourceCycleName?: string;
  harvestId?: number;
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
  harvestId?: number;
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
