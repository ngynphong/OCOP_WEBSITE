export type GrowthOpportunityType =
  | 'LOW_CONVERSION'
  | 'LOW_STOCK'
  | 'HIGH_STOCK'
  | 'PRODUCT_IMPROVEMENT'
  | 'B2B_REQUEST'
  | 'VOUCHER'
  | 'FLASH_SALE'
  | 'AFFILIATE'
  | 'CUSTOMER_RETENTION'
  | 'REVIEW'
  | 'CAMPAIGN'
  | 'BANK_ACCOUNT';

export type GrowthPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type GrowthActionType =
  | 'CREATE_VOUCHER'
  | 'JOIN_FLASH_SALE'
  | 'UPDATE_PRODUCT_MEDIA'
  | 'REPLY_RFQ'
  | 'RESTOCK'
  | 'CREATE_COMMUNITY_POST'
  | 'LINK_BANK_ACCOUNT';

export type GrowthOpportunityStatus = 'OPEN' | 'VIEWED' | 'EXECUTED' | 'DISMISSED' | 'EXPIRED';

export interface GrowthExecuteResponse {
  opportunityId: number;
  status: GrowthOpportunityStatus;
  newGrowthScore: number;
  growthTier: string;
  message: string;
}

export interface GrowthOpportunity {
  id: number;
  shopId: number;
  type: GrowthOpportunityType;
  priority: GrowthPriority;
  title: string;
  description: string;
  productId?: number | null;
  productName?: string | null;
  productThumbnail?: string | null;
  metric?: string | null;
  estimatedLift?: string | null;
  actionType: GrowthActionType;
  actionUrl: string;
  actionPayload?: Record<string, unknown> | null;
  status: GrowthOpportunityStatus;
  createdAt: string;
  expiresAt?: string | null;
}

export interface GrowthKpis {
  monthlyRevenue: number;
  revenueGrowthRate: number;
  monthlyOrders: number;
  ordersGrowthRate: number;
  newCustomers: number;
  growthScore: number;
  growthTier: string;
  totalOpportunities: number;
  highPriorityCount: number;
}

export interface GrowthWalletSummary {
  availableBalance?: number;
  currentPeriodAccumulated?: number;
  pendingPayout?: number;
  totalPaidOut?: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  nextPayoutDate?: string;
  hasBankAccount?: boolean;
}

export interface GrowthOverviewResponse {
  kpis: GrowthKpis;
  wallet: GrowthWalletSummary;
  todayActions: GrowthOpportunity[];
  opportunities: GrowthOpportunity[];
}

export interface ProductGrowthItem {
  id: number;
  name: string;
  slug: string;
  thumbnail?: string | null;
  ocopStar?: number | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  viewCount: number;
  soldCount: number;
  totalStock: number;
  conversionRate: number;
  healthScore: number;
  healthStatus: 'EXCELLENT' | 'HEALTHY' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
  opportunityCount: number;
  suggestedAction: string;
  suggestedActionUrl: string;
}

export interface PaginatedOpportunities {
  content: GrowthOpportunity[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
