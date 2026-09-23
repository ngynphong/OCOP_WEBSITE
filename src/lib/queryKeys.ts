/**
 * Type-Safe Centralized Query Key Factory
 *
 * Ensures consistent cache key hierarchies across TanStack Query hooks and invalidation calls.
 * Pattern follows TanStack Query best practices:
 * domain: {
 *   all: ['domain'] as const,
 *   lists: () => [...domain.all, 'list'] as const,
 *   list: (filters) => [...domain.lists(), filters] as const,
 *   details: () => [...domain.all, 'detail'] as const,
 *   detail: (id) => [...domain.details(), id] as const,
 * }
 */

export const queryKeys = {
  // --- AUTH ---
  auth: {
    all: ['auth'] as const,
    profile: () => ['user-profile'] as const,
  },

  // --- CART ---
  cart: {
    all: ['cart'] as const,
  },

  // --- PRODUCTS (PUBLIC) ---
  products: {
    all: ['products'] as const,
    list: (params?: unknown) => ['products', params] as const,
    detail: (slugOrId: string | number) => ['product-detail', slugOrId] as const,
    categories: () => ['public-categories'] as const,
    featured: () => ['featured-products'] as const,
    newArrivals: () => ['new-arrivals'] as const,
    bestSellers: () => ['best-sellers'] as const,
    search: (query: string, limit?: number) => ['ai-semantic-search', query, limit] as const,
    recommendations: (productId?: string | number | null, limit?: number) =>
      ['ai-recommendations', productId, limit] as const,
    lots: (productId?: number, page?: number, size?: number) =>
      ['public-product-lots', productId, page, size] as const,
    lotByCode: (code?: string) => ['supply-chain-lot-public', code] as const,
  },

  // --- ADMIN PRODUCTS ---
  adminProducts: {
    all: ['admin-products'] as const,
    list: (params?: unknown) => ['admin-products', params] as const,
    detail: (id?: number | null) => ['admin-product', id] as const,
    brands: (params?: unknown) => ['admin-brands', params] as const,
  },

  // --- SELLER PRODUCTS ---
  sellerProducts: {
    all: ['seller-products'] as const,
    list: (params?: unknown) => ['seller-products', params] as const,
    detail: (id?: number | string | null) => ['seller-product-detail', id] as const,
    variants: (productId?: number | null) => ['seller-variants', productId] as const,
    journals: (productId?: number | null) => ['seller-journals', productId] as const,
    images: (productId?: number | null) => ['seller-images', productId] as const,
  },

  // --- ORDERS ---
  orders: {
    all: ['orders'] as const,
    list: (status?: string, page?: number) => ['orders', status, page] as const,
    detail: (id?: string | number) => ['order-detail', id] as const,
    tracking: (code?: string) => ['order-tracking', code] as const,
  },

  // --- SELLER ORDERS ---
  sellerOrders: {
    all: ['seller-orders'] as const,
    list: (params?: unknown) => ['seller-orders', params] as const,
    detail: (id?: string | number) => ['seller-order-detail', id] as const,
    shipments: (orderId?: string | number) => ['seller-shipments', orderId] as const,
  },

  // --- SUPPLY CHAIN & TRACEABILITY ---
  supplyChain: {
    all: ['supply-chain'] as const,
    adminLots: (params?: unknown) => ['admin_lots', params] as const,
    adminLotDetail: (id?: number | null) => ['admin_lot_detail', id] as const,
    facilities: (params?: unknown) => ['facilities', params] as const,
    facilityDetail: (id?: number | null) => ['facility-detail', id] as const,
    materialLots: (params?: unknown) => ['material-lots', params] as const,
    materialLotDetail: (id?: number | null) => ['material-lot-detail', id] as const,
    suppliers: (params?: unknown) => ['suppliers', params] as const,
    productionBatches: (params?: unknown) => ['production-batches', params] as const,
    productionBatchDetail: (id?: number | null) => ['production-batch-detail', id] as const,
    cycleLogs: (cycleId?: number | string | null) => ['cycle-logs', cycleId] as const,
  },

  // --- LOCATIONS ---
  locations: {
    all: ['locations'] as const,
    provinces: (region?: string) => ['location-provinces', region] as const,
    provinces34: (region?: string) => ['location-provinces-34', region] as const,
    districts: (provinceId?: number) => ['location-districts', provinceId] as const,
    wards: (districtId?: number) => ['location-wards', districtId] as const,
    allWards34: (provinceId?: number) => ['location-all-wards-34', provinceId] as const,
  },

  // --- SHOPS ---
  shops: {
    all: ['shops'] as const,
    publicProfile: (shopIdOrSlug?: string | number) => ['public-shop', shopIdOrSlug] as const,
    publicProducts: (shopId?: number, params?: unknown) =>
      ['shop-products', shopId, params] as const,
    sellerProfile: () => ['seller-shop-profile'] as const,
    sellerDashboard: () => ['seller-dashboard'] as const,
    follows: (shopId?: number) => ['shop-follow', shopId] as const,
  },

  // --- VOUCHERS ---
  vouchers: {
    all: ['vouchers'] as const,
    list: (params?: unknown) => ['vouchers', params] as const,
    shopVouchers: (shopId?: number) => ['shop-vouchers', shopId] as const,
    myVouchers: () => ['my-vouchers'] as const,
  },

  // --- NOTIFICATIONS ---
  notifications: {
    all: ['notifications'] as const,
    list: (page?: number) => ['notifications', page] as const,
    unreadCount: () => ['notifications-unread-count'] as const,
    settings: () => ['notification-settings'] as const,
  },

  // --- REVIEWS ---
  reviews: {
    all: ['reviews'] as const,
    product: (productId?: number, page?: number) => ['product-reviews', productId, page] as const,
    seller: (shopId?: number, page?: number) => ['seller-reviews', shopId, page] as const,
    admin: (params?: unknown) => ['admin-reviews', params] as const,
  },

  // --- EVENTS ---
  events: {
    all: ['events'] as const,
    list: (params?: unknown) => ['events', params] as const,
    detail: (id?: number | string) => ['event-detail', id] as const,
    minigame: (eventId?: number) => ['minigame', eventId] as const,
  },
} as const;
