export interface NotificationSettingResponse {
  id: number;
  orderUpdate: boolean;
  paymentNotify: boolean;
  shipmentNotify: boolean;
  reviewNotify: boolean;
  voucherNotify: boolean;
  wishlistPriceDrop: boolean;
  affiliateCommission: boolean;
  chatMessage: boolean;
  systemNotify: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export interface UpdateNotificationSettingRequest {
  orderUpdate?: boolean;
  paymentNotify?: boolean;
  shipmentNotify?: boolean;
  reviewNotify?: boolean;
  voucherNotify?: boolean;
  wishlistPriceDrop?: boolean;
  affiliateCommission?: boolean;
  chatMessage?: boolean;
  systemNotify?: boolean;
  pushEnabled?: boolean;
  emailEnabled?: boolean;
}

export type PushPlatform = 'WEB' | 'ANDROID' | 'IOS';

export interface RegisterPushTokenRequest {
  token: string;
  platform: PushPlatform;
  deviceId?: string;
}
