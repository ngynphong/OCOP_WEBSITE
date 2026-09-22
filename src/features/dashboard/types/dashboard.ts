export interface IRecentOrder {
  orderId: string;
  shopName?: string; // Cho User
  customerName?: string; // Cho Seller
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface IUserDashboardStats {
  totalOrders: number;
  shippingOrders: number;
  completedOrders: number;
  loyaltyPoints: number;
}

export interface IUserDashboard {
  userStats: IUserDashboardStats;
  recentOrders: IRecentOrder[];
}

export interface ISellerDashboardStats {
  monthlyRevenue: number;
  newOrders: number;
  totalProducts: number;
  shopRating: number;
}

export interface ISellerDashboardOverview {
  pendingProducts: number;
  shopViews: number;
}

export interface IActionRequiredProduct {
  id: number;
  name: string;
  thumbnailUrl: string;
  missingGroups: string[];
}

export interface ISellerDashboard {
  sellerStats: ISellerDashboardStats;
  overview: ISellerDashboardOverview;
  recentOrders: IRecentOrder[];
  actionRequiredProducts?: IActionRequiredProduct[];
}

export interface IAdminDashboardKpi {
  value: number;
  trend: number;
}

export interface IAdminDashboardKpiStats {
  revenue: IAdminDashboardKpi;
  completedOrders: IAdminDashboardKpi;
  newUsers: IAdminDashboardKpi;
  newShops: IAdminDashboardKpi;
}

export interface IAdminDashboardOrderOverview {
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface IAdminDashboardActionRequired {
  pendingShops: number;
  pendingProducts: number;
  pendingRefunds: number;
  pendingPayouts: number;
  openSupportTickets: number;
  openComplaints: number;
  lowStockItems: number;
}

export interface IAdminDashboardChartData {
  date: string;
  revenue: number;
  orders: number;
}

export interface IAdminDashboardTopCategory {
  id: number | string;
  name: string;
  sharePercentage: number;
  totalProducts: number;
  revenue: number;
  trend: number;
}

export interface IAdminDashboardActivity {
  id: string;
  title: string;
  action: string;
  status: string;
  createdAt: string;
  href: string;
}

export interface IAdminDashboard {
  fromDate: string;
  toDate: string;
  generatedAt: string;
  kpiStats: IAdminDashboardKpiStats;
  orderOverview: IAdminDashboardOrderOverview;
  actionRequired: IAdminDashboardActionRequired;
  revenueChart: IAdminDashboardChartData[];
  topCategories: IAdminDashboardTopCategory[];
  recentActivities: IAdminDashboardActivity[];
}

export interface IAdminDashboardParams {
  from: string;
  to: string;
}

export interface IDashboardApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface IAnalyticsPlatformDaily {
  id?: number;
  statDate: string;
  newUsers: number;
  activeUsers: number;
  newOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  totalRefunded: number;
  newShops: number;
  newProducts: number;
}
