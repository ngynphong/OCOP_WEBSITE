export type TLotStatus =
  | 'DRAFT'
  | 'ACTIVE'
  | 'SOLD_OUT'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'RECALLED'
  | 'ARCHIVED'
  | 'CREATED'
  | 'PRODUCTION_STARTED'
  | 'PROCESSING'
  | 'STORAGE'
  | 'IN_TRANSIT'
  | 'DISTRIBUTED'
  | 'CANCELLED';

export type TStepType =
  | 'PRODUCTION'
  | 'PROCESSING'
  | 'STORAGE'
  | 'TRANSPORT'
  | 'DISTRIBUTION'
  | 'TESTING';

export type TVerificationLevel = 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3';
export type TVerificationStatus =
  | 'DRAFT'
  | 'SUBMITTED_FOR_VERIFICATION'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'REJECTED'
  | 'REQUEST_CHANGES';

export type TStorageType = 'AMBIENT' | 'REFRIGERATED' | 'FROZEN' | 'CONTROLLED_ATMOSPHERE';

export interface ISupplyChainStep {
  stepType: TStepType;
  recordedAt: string;
  data:
    | IProductionStepReq
    | IProcessingStepReq
    | IStorageStepReq
    | ITransportStepReq
    | IDistributionStepReq
    | ITestingStepReq;
}

export interface ISupplyChainLot {
  id: number;
  lotCode: string;
  productId: number;
  productName: string;
  variantId?: number;
  variantName?: string;
  shopId: number;
  shopName: string;
  productionDate?: string;
  expiryDate?: string;
  quantity: number;
  unit?: string;
  status: TLotStatus;
  verificationLevel?: TVerificationLevel;
  verificationStatus?: TVerificationStatus;
  trustScore?: number;
  qrUrl?: string;
  qrToken?: string;
  notes?: string;
  inputMaterials?: string;
  createdAt: string;
  steps: ISupplyChainStep[] | null;
}

export interface ILotQrCode {
  id: number;
  token: string;
  serialNumber?: string;
  isMaster: boolean;
  qrUrl: string;
  status: string;
  createdAt: string;
}

export interface ICreateLotReq {
  lotCode: string;
  productId: number;
  variantId: number;
  productionDate?: string;
  expiryDate?: string;
  quantity: number;
  unit?: string;
  notes?: string;
  inputMaterials?: string;
}

export interface ILotListReq {
  status?: TLotStatus;
  productId?: number;
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
  qualityDocumentUrl?: string;
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

export interface IEvidenceDocument {
  id: number;
  documentType: string;
  fileName: string;
  fileUrl: string;
  mimeType: string;
  fileSize: number;
  issuedBy: string;
  issuedDate: string;
  expiryDate: string;
  verificationStatus: TVerificationStatus;
  uploadedAt: string;
}

export interface ITestingStepReq {
  id?: number; // Included for response
  testType: string;
  result: string;
  certificateNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  testingCenterId?: number;
  testingCenterName?: string;
  standardsMet?: string;
  inspectorName?: string;
  verificationStatus?: TVerificationStatus;
  verifiedAt?: string;
  notes?: string;
  documentUrls?: string;
}
