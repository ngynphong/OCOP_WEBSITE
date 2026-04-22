export type TLotStatus =
  | 'CREATED'
  | 'PRODUCTION_STARTED'
  | 'PROCESSING'
  | 'STORAGE'
  | 'IN_TRANSIT'
  | 'DISTRIBUTED'
  | 'CANCELLED';

export type TStepType = 'PRODUCTION' | 'PROCESSING' | 'STORAGE' | 'TRANSPORT' | 'DISTRIBUTION';

export type TStorageType = 'AMBIENT' | 'REFRIGERATED' | 'FROZEN' | 'CONTROLLED_ATMOSPHERE';

export interface ISupplyChainStep {
  stepType: TStepType;
  recordedAt: string;
  data:
    | IProductionStepReq
    | IProcessingStepReq
    | IStorageStepReq
    | ITransportStepReq
    | IDistributionStepReq;
}

export interface ISupplyChainLot {
  id: number;
  lotCode: string;
  productId: number;
  productName: string;
  shopId: number;
  shopName: string;
  productionDate?: string;
  expiryDate?: string;
  quantity: number;
  unit?: string;
  status: TLotStatus;
  notes?: string;
  createdAt: string;
  steps: ISupplyChainStep[] | null;
}

export interface ICreateLotReq {
  lotCode: string;
  productId: number;
  productionDate?: string;
  expiryDate?: string;
  quantity: number;
  unit?: string;
  notes?: string;
}

export interface ILotListReq {
  status?: TLotStatus;
  page: number;
  size: number;
}

export interface IPublicLotListReq extends ILotListReq {
  shopId?: number;
  productId?: number;
}

export interface IProductionStepReq {
  farmName: string;
  farmLocation: string;
  productionMethod: string;
  plantingDate?: string;
  harvestDate?: string;
  responsiblePerson: string;
  notes?: string;
  imageUrls: string; // Serialized JSON string for now
}

export interface IProcessingStepReq {
  facilityName: string;
  facilityAddress: string;
  processType: string;
  processDate: string;
  outputQuantity: number;
  unit: string;
  qualityCheckResult: string;
  notes?: string;
  imageUrls: string;
}

export interface IStorageStepReq {
  warehouseName: string;
  warehouseAddress: string;
  storageType: TStorageType;
  storageTemperature?: number;
  storageHumidity?: number;
  storedDate: string;
  expectedReleaseDate?: string;
  notes?: string;
}

export interface ITransportStepReq {
  carrierName: string;
  vehicleInfo: string;
  originAddress: string;
  destinationAddress: string;
  departedAt: string;
  arrivedAt?: string;
  trackingNumber: string;
  notes?: string;
}

export interface IDistributionStepReq {
  distributorName: string;
  distributorAddress: string;
  distributionDate: string;
  distributedQuantity: number;
  unit: string;
  salesChannel: string;
  notes?: string;
}
