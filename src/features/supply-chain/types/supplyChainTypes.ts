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

export interface ILotTaskResponse {
  id: string;
  lotId: number;
  lotCode: string;
  productName: string;
  stepId: number;
  stepTitle: string;
  dueDate: string;
  isOverdue: boolean;
  daysRemaining: number;
  assignmentId?: number;
  assigneeName?: string;
}

export type TAssignmentRole = 'ASSIGNEE' | 'SUPERVISOR' | 'AUDITOR';
export type TAssignmentStatus = 'ACTIVE' | 'REVOKED' | 'COMPLETED';

export interface ILotAssignment {
  id: number;
  lotId: number;
  lotCode: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhoneNumber?: string;
  templateStepId?: number;
  stepTitle?: string;
  role: TAssignmentRole;
  status: TAssignmentStatus;
  assignedAt: string;
  notes?: string;
}

export interface ICreateLotAssignmentReq {
  userIdentifier: string;
  templateStepId?: number;
  role?: TAssignmentRole;
  notes?: string;
}

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

export interface IEventInfo {
  id: number;
  templateStepId: number;
  stepTitle: string;
  stepType: string;
  sourceType: string;
  eventAt: string;
  recordedAt: string;
  recordedBy: string;
  eventData: string | Record<string, unknown> | null;
  dataHash?: string;
  previousHash?: string;
  evidenceDocuments?: IEvidenceDocument[];
  aiAnalysisResult?: string;
  isFlaggedByAi?: boolean;
}

export interface IMaterialUsageInfo {
  materialLotId: number;
  materialLotCode: string;
  materialName: string;
  sourceType: string;
  supplierName?: string;
  facilityName?: string;
  cycleName?: string;
  quantityUsed: number;
  unit: string;
}

export type TStepFieldType = 'TEXT' | 'NUMBER' | 'DATE' | 'DATETIME' | 'SELECT' | 'BOOLEAN';

export interface IStepField {
  id?: string;
  key: string;
  name?: string;
  label: string;
  type: TStepFieldType;
  required: boolean;
  unit?: string;
  options?: string[];
  min?: number;
  max?: number;
  placeholder?: string;
  helpText?: string;
  order?: number;
}

export type TRuleRequirement = 'REQUIRED' | 'OPTIONAL' | 'DISABLED';

export interface IEvidenceRule {
  photo: TRuleRequirement;
  gps: TRuleRequirement;
  video: TRuleRequirement;
}

export interface IProcessTemplateStep {
  id: number;
  stepOrder: number;
  stepType: string;
  title: string;
  description?: string;
  estimatedDays?: number;
  dynamicFieldsSchema?: string;
  evidenceRule?: string;
}

export interface IProcessTemplate {
  id: number;
  name: string;
  description?: string;
  status: string;
  versionNumber?: number;
  steps: IProcessTemplateStep[];
}

export interface ICreateProcessTemplateReq {
  productId: number;
  name: string;
  description?: string;
  status?: string;
  steps: (Omit<IProcessTemplateStep, 'id'> & {
    dynamicFieldsSchema?: string;
    evidenceRule?: string;
  })[];
}

export interface IRecallInfo {
  reason: string;
  recalledAt?: string;
  recalledBy?: string;
  notes?: string;
}

export interface ISupplyChainLot {
  id: number;
  lotCode: string;
  gtinCode?: string;
  digitalLink?: string;
  productId: number;
  productName: string;
  variantId: number;
  variantName: string;
  shopId: number;
  shopName: string;
  glnCode?: string;
  productionDate?: string;
  expiryDate?: string;
  quantity: number;
  remainingQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  unit: string;
  status: string;
  verificationLevel?: string;
  verificationStatus?: string;
  trustScore?: number;
  isFlaggedByAi?: boolean;
  qrUrl?: string;
  qrToken?: string;
  notes?: string;
  inputMaterials?: string;
  createdAt: string;
  warnings?: string[];
  sourceCycleId?: number;
  sourceCycleStatus?: string;
  sourceCycleName?: string;
  sourceCycleExpectedYield?: number;
  sourceCycleActualYield?: number;
  sourceCycleUnit?: string;
  farmName?: string;
  responsiblePerson?: string;
  rawYieldUsed?: number;
  rawYieldUnit?: string;
  packagingYieldRate?: number;
  packagingRatioNotes?: string;
  recallInfo?: IRecallInfo;
  steps?: ISupplyChainStep[];
  events?: IEventInfo[];
  eventCount?: number;
  materialsUsed?: IMaterialUsageInfo[];
  processTemplateId?: number;
  processTemplateName?: string;
  templateSteps?: IProcessTemplateStep[];
}

export type TQrStatus =
  | 'RESERVED'
  | 'PRINTED'
  | 'ACTIVATED'
  | 'RECALLED'
  | 'DESTROYED'
  | 'SUSPENDED'
  | 'EXPIRED'
  | 'SOLD_OUT';

export interface ILotQrCode {
  id: number;
  token: string;
  serialNumber?: string;
  isMaster: boolean;
  qrUrl: string;
  status: TQrStatus | string;
  createdAt: string;
  revokedAt?: string;
}

export interface IUpdateQrStatusReq {
  qrIds?: number[];
  status: TQrStatus;
  note?: string;
}

export interface ILotAuditLog {
  id: number;
  actorEmail?: string;
  entityType?: string;
  entityId?: string;
  action: string;
  beforeValue?: Record<string, unknown>;
  afterValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ICreateBatchEventReq {
  templateStepId: number;
  eventAt: string;
  eventData?: string;
  evidenceIds?: number[];
  force?: boolean;
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
  processTemplateId: number;
  materialsUsed?: {
    materialLotId: number;
    quantity: number;
  }[];
  isClosedLoop?: boolean;
  facilityId?: number;
  sourceCycleId?: number;
  rawYieldUsed?: number;
  rawYieldUnit?: string;
  packagingYieldRate?: number;
  packagingRatioNotes?: string;
  activateImmediately?: boolean;
}

export interface ILotListReq {
  status?: TLotStatus;
  productId?: number;
  flaggedByAi?: boolean;
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
  mimeType?: string;
  fileSize?: number;
  issuedBy?: string | null;
  issuedDate?: string | null;
  expiryDate?: string | null;
  verificationStatus?: TVerificationStatus;
  uploadedAt?: string;
  uploadedBy?: string;
  deviceInfo?: string;
  latitude?: number;
  longitude?: number;
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
