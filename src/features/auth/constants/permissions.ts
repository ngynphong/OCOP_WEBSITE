export const PERMISSIONS = {
  // Quản lý người dùng & Phân quyền
  USER_VIEW: 'user.view',
  USER_MANAGE: 'user.manage',
  PERMISSION_MANAGE: 'user.permission.manage',
  STAFF_VIEW: 'staff.profile.view',
  STAFF_MANAGE: 'staff.profile.manage',

  // Sản phẩm & Ngành hàng
  PRODUCT_VIEW: 'product.view',
  PRODUCT_MANAGE: 'product.manage',
  PRODUCT_APPROVE: 'product.approve',
  PRODUCT_FEATURE: 'product.feature',
  CATEGORY_MANAGE: 'category.manage',
  BRAND_MANAGE: 'brand.manage',
  SELLER_PRODUCT_MANAGE: 'seller.product.manage',

  // Kinh doanh
  SHOP_VIEW: 'shop.view',
  SHOP_MANAGE: 'shop.manage',
  SHOP_VERIFY: 'shop.document.verify',
  SHOP_PLAN_OVERRIDE: 'shop.plan.override',
  ORDER_VIEW: 'order.view',
  ORDER_MANAGE: 'order.manage',
  INVENTORY_VIEW: 'inventory.view',
  INVENTORY_ADJUST: 'inventory.adjust',

  // Marketing
  VOUCHER_VIEW: 'voucher.view',
  VOUCHER_MANAGE: 'voucher.manage',
  FLASH_SALE_VIEW: 'flash.sale.view',
  FLASH_SALE_MANAGE: 'flash.sale.manage',
  AFFILIATE_MANAGE: 'affiliate.manage',
  NEWSLETTER_MANAGE: 'newsletter.manage',
  LOYALTY_MANAGE: 'loyalty.manage',

  // Nội dung & Hỗ trợ
  BLOG_MANAGE: 'blog.manage',
  REVIEW_MANAGE: 'review.manage',
  COMPLAINT_MANAGE: 'complaint.manage',
  SUPPORT_TICKET_MANAGE: 'support.ticket.manage',

  // Hạ tầng & Hệ thống
  LOCATION_MANAGE: 'location.manage',
  PAYMENT_GATEWAY_MANAGE: 'payment.gateway.manage',
  SHIPPING_PROVIDER_MANAGE: 'shipping.provider.manage',
  SUBSCRIPTION_PLAN_MANAGE: 'subscription.plan.manage',
  AUDIT_LOG_VIEW: 'audit.log.view',
  ANALYTICS_VIEW: 'analytics.view',
} as const;

export type PermissionValue = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
