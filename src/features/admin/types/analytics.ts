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
