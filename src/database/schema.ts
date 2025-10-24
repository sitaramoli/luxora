import {
  pgTable,
  text,
  integer,
  serial,
  varchar,
  boolean,
  decimal,
  timestamp,
  pgEnum,
  uuid,
  date,
  jsonb,
  index,
  numeric,
} from 'drizzle-orm/pg-core';

export const ACCOUNT_STATUS_ENUM = pgEnum('account_status', [
  'ACTIVE',
  'PENDING',
  'SUSPENDED',
  'UNDER_REVIEW',
]);
export const ORDER_STATUS_ENUM = pgEnum('order_status', [
  'PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
]);

export const USER_ROLE_ENUM = pgEnum('user_role', [
  'CUSTOMER',
  'ADMIN',
  'MERCHANT',
]);

export const GENDER_ENUM = pgEnum('gender', ['MALE', 'FEMALE', 'OTHER']);

export const PRODUCT_STATUS_ENUM = pgEnum('product_status', [
  'ACTIVE',
  'DRAFT',
  'ARCHIVED',
]);

export const ADDRESS_TYPE_ENUM = pgEnum('address_type', [
  'HOME',
  'WORK',
  'OTHER',
]);

export const PAYMENT_METHOD_TYPE_ENUM = pgEnum('payment_method_type', [
  'CREDIT_CARD',
  'DEBIT_CARD',
  'PAYPAL',
  'APPLE_PAY',
  'GOOGLE_PAY',
]);

export const CARD_BRAND_ENUM = pgEnum('card_brand', [
  'VISA',
  'MASTERCARD',
  'AMERICAN_EXPRESS',
  'DISCOVER',
  'JCB',
  'DINERS_CLUB',
  'OTHER',
]);

export const NOTIFICATION_TYPE_ENUM = pgEnum('notification_type', [
  'ORDER_UPDATE',
  'ORDER_SHIPPED',
  'ORDER_DELIVERED',
  'ORDER_CANCELLED',
  'PAYMENT_SUCCESS',
  'PAYMENT_FAILED',
  'PROMOTION',
  'SALE',
  'PRICE_DROP',
  'WISHLIST_ITEM_AVAILABLE',
  'WISHLIST_PRICE_DROP',
  'REVIEW_REQUEST',
  'REVIEW_RESPONSE',
  'ACCOUNT_SECURITY',
  'PASSWORD_CHANGED',
  'PROFILE_UPDATED',
  'NEWSLETTER',
  'SYSTEM_MAINTENANCE',
  'SYSTEM_UPDATE',
  'WELCOME',
  'BIRTHDAY',
  'ANNIVERSARY',
  'CUSTOM',
]);

export const NOTIFICATION_PRIORITY_ENUM = pgEnum('notification_priority', [
  'LOW',
  'NORMAL',
  'HIGH',
  'URGENT',
]);

export const NOTIFICATION_STATUS_ENUM = pgEnum('notification_status', [
  'PENDING',
  'SENT',
  'READ',
  'ARCHIVED',
  'FAILED',
]);

export const NOTIFICATION_CHANNEL_ENUM = pgEnum('notification_channel', [
  'IN_APP',
  'EMAIL',
  'SMS',
  'PUSH',
]);

export const COLLECTION_STATUS_ENUM = pgEnum('collection_status', [
  'ACTIVE',
  'DRAFT',
  'ARCHIVED',
]);

export const COLLECTION_SEASON_ENUM = pgEnum('collection_season', [
  'SPRING',
  'SUMMER',
  'FALL',
  'WINTER',
  'ALL_SEASON',
]);

export const users = pgTable('users', {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  phone: varchar('phone', { length: 10 }),
  status: ACCOUNT_STATUS_ENUM('status').notNull().default('PENDING'),
  role: USER_ROLE_ENUM('role').notNull().default('CUSTOMER'),
  image: text('image'),
  gender: GENDER_ENUM('gender').notNull().default('MALE'),
  lastActivityDate: timestamp('last_activity_date', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const merchants = pgTable('merchants', {
  id: uuid('id').notNull().unique().defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull().unique(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 20 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  website: varchar('website', { length: 255 }),
  logo: text('logo'), // Store logo URL
  coverImage: text('cover_image').notNull(),
  image: text('image').notNull(),
  address: text('address').notNull(),
  taxId: varchar('tax_id', { length: 20 }),
  businessLicense: varchar('business_license', { length: 100 }),
  founded: date('founded').notNull(),
  maintenanceMode: boolean('maintenance_mode').notNull().default(false),
  vacationMode: boolean('vacation_mode').notNull().default(false),
  vacationMessage: text('vacation_message'),
  metaTitle: varchar('meta_title', { length: 255 }),
  metaDescription: text('meta_description'),
  keywords: text('keywords'),
  status: ACCOUNT_STATUS_ENUM('status').notNull().default('PENDING'),
  isFeatured: boolean('is_featured').notNull().default(false),

  // Payment Settings
  paymentMethods: jsonb('payment_methods').$type<string[]>().default([]),
  currency: varchar('currency', { length: 10 }).notNull().default('USD'),
  taxRate: decimal('tax_rate', { precision: 5, scale: 2 }).default('0.00'),
  paymentProcessingFee: decimal('payment_processing_fee', {
    precision: 5,
    scale: 2,
  }).default('2.90'),

  // Shipping Settings
  freeShippingThreshold: decimal('free_shipping_threshold', {
    precision: 10,
    scale: 2,
  }).default('0.00'),
  standardShippingCost: decimal('standard_shipping_cost', {
    precision: 10,
    scale: 2,
  }).default('0.00'),
  expressShippingCost: decimal('express_shipping_cost', {
    precision: 10,
    scale: 2,
  }).default('0.00'),
  internationalShipping: boolean('international_shipping')
    .notNull()
    .default(false),
  shippingZones: jsonb('shipping_zones')
    .$type<Record<string, any>[]>()
    .default([]),
  processingTime: varchar('processing_time', { length: 100 }).default(
    '1-3 business days'
  ),

  // Notification Settings
  emailNewOrders: boolean('email_new_orders').notNull().default(true),
  emailLowStock: boolean('email_low_stock').notNull().default(true),
  emailCustomerMessages: boolean('email_customer_messages')
    .notNull()
    .default(true),
  emailPromotions: boolean('email_promotions').notNull().default(false),
  smsUrgentAlerts: boolean('sms_urgent_alerts').notNull().default(true),
  smsDailySummary: boolean('sms_daily_summary').notNull().default(false),
  pushNotifications: boolean('push_notifications').notNull().default(true),

  // Store Policies
  returnPolicy: text('return_policy'),
  shippingPolicy: text('shipping_policy'),
  privacyPolicy: text('privacy_policy'),
  termsOfService: text('terms_of_service'),
  refundPolicy: text('refund_policy'),

  // Advanced Settings
  apiKey: varchar('api_key', { length: 255 }),
  webhookUrl: varchar('webhook_url', { length: 500 }),
  customDomain: varchar('custom_domain', { length: 255 }),
  googleAnalyticsId: varchar('google_analytics_id', { length: 50 }),
  facebookPixelId: varchar('facebook_pixel_id', { length: 50 }),
  customCss: text('custom_css'),
  customJs: text('custom_js'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable('products', {
  id: serial('id').notNull().primaryKey(),
  merchantId: uuid('merchant_id')
    .notNull()
    .references(() => merchants.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  shortDescription: text('short_description'),
  description: text('description').notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  price: decimal('price', { precision: 10, scale: 2 })
    .notNull()
    .default('0.00'),
  originalPrice: decimal('original_price', { precision: 10, scale: 2 })
    .notNull()
    .default('0.00'),
  sizes: text('sizes').array(),
  colors: jsonb('colors').$type<Array<Record<string, any>>>(),
  features: text('features').array().notNull(),
  sku: varchar('sku').notNull(),
  barcode: varchar('barcode'),
  weight: numeric('weight', { precision: 10, scale: 2 }),
  length: numeric('length', { precision: 10, scale: 2 }),
  width: numeric('width', { precision: 10, scale: 2 }),
  height: numeric('height', { precision: 10, scale: 2 }),
  status: PRODUCT_STATUS_ENUM('status').notNull().default('ACTIVE'),
  stockCount: integer('stock_count').notNull().default(0),
  minStock: integer('min_stock').notNull().default(0),
  maxStock: integer('max_stock').notNull().default(0),
  tags: text('tags').array(),
  images: text('images').array(),
  isFeatured: boolean('is_featured').notNull().default(false),
  onSale: boolean('on_sale').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewProduct = typeof products.$inferInsert;

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  image: text('image'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const preferences = pgTable('preferences', {
  id: serial('id').notNull().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  preferenceValues: text('preference_values').array().notNull().default([]),
});

export const orders = pgTable(
  'orders',
  {
    id: text('id').primaryKey().notNull(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id),
    total: decimal('total').notNull(),
    status: ORDER_STATUS_ENUM('status').default('PENDING').notNull(),
    shippingAddress: text('shipping_address').notNull(),
    paymentMethod: text('payment_method'),
    paymentId: text('payment_id'),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  table => ({
    userIdIdx: index('orders_user_id_idx').on(table.userId),
    statusIdx: index('orders_status_idx').on(table.status),
    createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
    paymentIdIdx: index('orders_payment_id_idx').on(table.paymentId),
  })
);

export const orderItems = pgTable('order_items', {
  id: text('id').primaryKey().notNull(),
  orderId: text('order_id')
    .notNull()
    .references(() => orders.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => merchants.id),
  quantity: integer('quantity').notNull(),
  price: decimal('price').notNull(),
  total: decimal('total').notNull(),
  color: text('color'),
  size: text('size'),
});

export const carts = pgTable('carts', {
  id: text('id').primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id),
});

export const cartItems = pgTable('cart_items', {
  id: text('id').primaryKey().notNull(),
  cartId: text('cart_id')
    .notNull()
    .references(() => carts.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  quantity: integer('quantity').notNull(),
  selectedColor: text('selected_color'),
  selectedSize: text('selected_size'),
});

export const wishlists = pgTable('wishlists', {
  id: text('id').primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id),
});

export const wishlistItems = pgTable('wishlist_items', {
  id: text('id').primaryKey().notNull(),
  wishlistId: text('wishlist_id')
    .notNull()
    .references(() => wishlists.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Merchant application flow
export const MERCHANT_APPLICATION_STATUS_ENUM = pgEnum(
  'merchant_application_status',
  ['PENDING', 'APPROVED', 'REJECTED']
);

export const merchantApplications = pgTable('merchant_applications', {
  id: uuid('id').notNull().unique().defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Store information
  storeName: varchar('store_name', { length: 255 }).notNull(),
  storeSlug: varchar('store_slug', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  category: varchar('category', { length: 255 }).notNull(),
  description: text('description').notNull(),
  shortDescription: text('short_description').notNull(),
  website: varchar('website', { length: 255 }),
  address: text('address').notNull(),

  // Images
  logo: text('logo'),
  coverImage: text('cover_image').notNull(),
  image: text('image').notNull(),

  // Business info
  founded: date('founded').notNull(),
  taxId: varchar('tax_id', { length: 20 }),
  businessLicense: varchar('business_license', { length: 100 }),

  // Status & review
  status: MERCHANT_APPLICATION_STATUS_ENUM('status')
    .notNull()
    .default('PENDING'),
  adminNotes: text('admin_notes'),
  reviewedBy: uuid('reviewed_by').references(() => users.id),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const reviews = pgTable('reviews', {
  id: serial('id').primaryKey().notNull(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  productId: integer('product_id')
    .notNull()
    .references(() => products.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  private: boolean('private').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    name: varchar('name', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }),
    content: text('content').notNull(),
    rating: integer('rating').notNull(),
    avatar: text('avatar'),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    ratingIdx: index('testimonials_rating_idx').on(table.rating),
    isActiveIdx: index('testimonials_is_active_idx').on(table.isActive),
    createdAtIdx: index('testimonials_created_at_idx').on(table.createdAt),
  })
);

export type NewTestimonial = typeof testimonials.$inferInsert;
export type Testimonial = typeof testimonials.$inferSelect;

// Join table linking brands (merchants) to collections explicitly
export const brandCollections = pgTable('brand_collections', {
  id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
  brandId: uuid('brand_id')
    .notNull()
    .references(() => merchants.id, { onDelete: 'cascade' }),
  collectionId: uuid('collection_id')
    .notNull()
    .references(() => collections.id, { onDelete: 'cascade' }),
  displayOrder: integer('display_order').notNull().default(0),
  isHighlighted: boolean('is_highlighted').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewBrandCollection = typeof brandCollections.$inferInsert;
export type BrandCollection = typeof brandCollections.$inferSelect;

export const addresses = pgTable(
  'addresses',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: ADDRESS_TYPE_ENUM('type').notNull().default('HOME'),
    fullName: varchar('full_name', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }),
    addressLine1: text('address_line_1').notNull(),
    addressLine2: text('address_line_2'),
    city: varchar('city', { length: 100 }).notNull(),
    state: varchar('state', { length: 100 }).notNull(),
    postalCode: varchar('postal_code', { length: 20 }).notNull(),
    country: varchar('country', { length: 100 })
      .notNull()
      .default('United States'),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    userIdIdx: index('addresses_user_id_idx').on(table.userId),
    isDefaultIdx: index('addresses_is_default_idx').on(table.isDefault),
  })
);

export type NewAddress = typeof addresses.$inferInsert;
export type Address = typeof addresses.$inferSelect;

export const paymentMethods = pgTable(
  'payment_methods',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: PAYMENT_METHOD_TYPE_ENUM('type').notNull().default('CREDIT_CARD'),
    cardBrand: CARD_BRAND_ENUM('card_brand'),
    cardNumberLast4: varchar('card_number_last4', { length: 4 }),
    cardholderName: varchar('cardholder_name', { length: 255 }),
    expiryMonth: integer('expiry_month'),
    expiryYear: integer('expiry_year'),
    billingAddressId: uuid('billing_address_id').references(
      () => addresses.id,
      { onDelete: 'set null' }
    ),
    isDefault: boolean('is_default').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    userIdIdx: index('payment_methods_user_id_idx').on(table.userId),
    isDefaultIdx: index('payment_methods_is_default_idx').on(table.isDefault),
  })
);

export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
export type PaymentMethod = typeof paymentMethods.$inferSelect;

// Notification Templates Table
export const notificationTemplates = pgTable(
  'notification_templates',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    type: NOTIFICATION_TYPE_ENUM('type').notNull(),
    name: varchar('name', { length: 255 }).notNull(),
    subject: varchar('subject', { length: 500 }),
    title: varchar('title', { length: 500 }).notNull(),
    body: text('body').notNull(),
    htmlBody: text('html_body'),
    variables: jsonb('variables').$type<Record<string, string>>().default({}),
    isActive: boolean('is_active').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    typeIdx: index('notification_templates_type_idx').on(table.type),
    activeIdx: index('notification_templates_active_idx').on(table.isActive),
  })
);

export type NewNotificationTemplate = typeof notificationTemplates.$inferInsert;
export type NotificationTemplate = typeof notificationTemplates.$inferSelect;

// User Notification Preferences Table
export const notificationPreferences = pgTable(
  'notification_preferences',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' })
      .unique(),
    // Email preferences
    emailOrderUpdates: boolean('email_order_updates').notNull().default(true),
    emailPromotions: boolean('email_promotions').notNull().default(false),
    emailWishlistAlerts: boolean('email_wishlist_alerts')
      .notNull()
      .default(true),
    emailReviewRequests: boolean('email_review_requests')
      .notNull()
      .default(true),
    emailSystemNotifications: boolean('email_system_notifications')
      .notNull()
      .default(true),
    emailNewsletter: boolean('email_newsletter').notNull().default(true),
    emailSecurityAlerts: boolean('email_security_alerts')
      .notNull()
      .default(true),
    // Push notification preferences
    pushOrderUpdates: boolean('push_order_updates').notNull().default(true),
    pushPromotions: boolean('push_promotions').notNull().default(false),
    pushWishlistAlerts: boolean('push_wishlist_alerts').notNull().default(true),
    pushReviewRequests: boolean('push_review_requests')
      .notNull()
      .default(false),
    pushSystemNotifications: boolean('push_system_notifications')
      .notNull()
      .default(true),
    pushSecurityAlerts: boolean('push_security_alerts').notNull().default(true),
    // SMS preferences
    smsOrderUpdates: boolean('sms_order_updates').notNull().default(true),
    smsPromotions: boolean('sms_promotions').notNull().default(false),
    smsWishlistAlerts: boolean('sms_wishlist_alerts').notNull().default(false),
    smsReviewRequests: boolean('sms_review_requests').notNull().default(false),
    smsSystemNotifications: boolean('sms_system_notifications')
      .notNull()
      .default(false),
    smsSecurityAlerts: boolean('sms_security_alerts').notNull().default(true),
    // In-app preferences
    inAppOrderUpdates: boolean('in_app_order_updates').notNull().default(true),
    inAppPromotions: boolean('in_app_promotions').notNull().default(true),
    inAppWishlistAlerts: boolean('in_app_wishlist_alerts')
      .notNull()
      .default(true),
    inAppReviewRequests: boolean('in_app_review_requests')
      .notNull()
      .default(true),
    inAppSystemNotifications: boolean('in_app_system_notifications')
      .notNull()
      .default(true),
    inAppSecurityAlerts: boolean('in_app_security_alerts')
      .notNull()
      .default(true),
    // General preferences
    timezone: varchar('timezone', { length: 100 }).default('America/New_York'),
    language: varchar('language', { length: 10 }).default('en'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    userIdIdx: index('notification_preferences_user_id_idx').on(table.userId),
  })
);

export type NewNotificationPreferences =
  typeof notificationPreferences.$inferInsert;
export type NotificationPreferences =
  typeof notificationPreferences.$inferSelect;

// Main Notifications Table
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: NOTIFICATION_TYPE_ENUM('type').notNull(),
    priority: NOTIFICATION_PRIORITY_ENUM('priority')
      .notNull()
      .default('NORMAL'),
    status: NOTIFICATION_STATUS_ENUM('status').notNull().default('PENDING'),
    channel: NOTIFICATION_CHANNEL_ENUM('channel').notNull().default('IN_APP'),
    title: varchar('title', { length: 500 }).notNull(),
    body: text('body').notNull(),
    data: jsonb('data').$type<Record<string, any>>().default({}),
    actionUrl: varchar('action_url', { length: 1000 }),
    actionText: varchar('action_text', { length: 100 }),
    imageUrl: varchar('image_url', { length: 1000 }),
    // Related entities
    orderId: text('order_id').references(() => orders.id, {
      onDelete: 'set null',
    }),
    productId: integer('product_id').references(() => products.id, {
      onDelete: 'set null',
    }),
    merchantId: uuid('merchant_id').references(() => merchants.id, {
      onDelete: 'set null',
    }),
    // Scheduling
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }),
    sentAt: timestamp('sent_at', { withTimezone: true }),
    readAt: timestamp('read_at', { withTimezone: true }),
    archivedAt: timestamp('archived_at', { withTimezone: true }),
    // Metadata
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    isGlobal: boolean('is_global').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    userIdIdx: index('notifications_user_id_idx').on(table.userId),
    typeIdx: index('notifications_type_idx').on(table.type),
    statusIdx: index('notifications_status_idx').on(table.status),
    priorityIdx: index('notifications_priority_idx').on(table.priority),
    channelIdx: index('notifications_channel_idx').on(table.channel),
    scheduledForIdx: index('notifications_scheduled_for_idx').on(
      table.scheduledFor
    ),
    readAtIdx: index('notifications_read_at_idx').on(table.readAt),
    createdAtIdx: index('notifications_created_at_idx').on(table.createdAt),
    orderIdIdx: index('notifications_order_id_idx').on(table.orderId),
    productIdIdx: index('notifications_product_id_idx').on(table.productId),
    isGlobalIdx: index('notifications_is_global_idx').on(table.isGlobal),
  })
);

export type NewNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;

// Notification Delivery Tracking Table (for email, SMS, push notifications)
export const notificationDeliveries = pgTable(
  'notification_deliveries',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    notificationId: uuid('notification_id')
      .notNull()
      .references(() => notifications.id, { onDelete: 'cascade' }),
    channel: NOTIFICATION_CHANNEL_ENUM('channel').notNull(),
    recipient: varchar('recipient', { length: 255 }).notNull(), // email, phone, device token
    status: NOTIFICATION_STATUS_ENUM('status').notNull().default('PENDING'),
    externalId: varchar('external_id', { length: 255 }), // provider message ID
    errorMessage: text('error_message'),
    attempts: integer('attempts').notNull().default(0),
    lastAttemptAt: timestamp('last_attempt_at', { withTimezone: true }),
    deliveredAt: timestamp('delivered_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    notificationIdIdx: index('notification_deliveries_notification_id_idx').on(
      table.notificationId
    ),
    channelIdx: index('notification_deliveries_channel_idx').on(table.channel),
    statusIdx: index('notification_deliveries_status_idx').on(table.status),
    recipientIdx: index('notification_deliveries_recipient_idx').on(
      table.recipient
    ),
    createdAtIdx: index('notification_deliveries_created_at_idx').on(
      table.createdAt
    ),
  })
);

export type NewNotificationDelivery =
  typeof notificationDeliveries.$inferInsert;
export type NotificationDelivery = typeof notificationDeliveries.$inferSelect;

// Collections Table
export const collections = pgTable(
  'collections',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).notNull().unique(),
    description: text('description').notNull(),
    shortDescription: text('short_description'),
    image: text('image').notNull(),
    coverImage: text('cover_image'),
    season: COLLECTION_SEASON_ENUM('season').notNull().default('ALL_SEASON'),
    year: varchar('year', { length: 4 }).notNull(),
    status: COLLECTION_STATUS_ENUM('status').notNull().default('DRAFT'),
    isFeatured: boolean('is_featured').notNull().default(false),
    isNew: boolean('is_new').notNull().default(true),
    displayOrder: integer('display_order').default(0),
    metaTitle: varchar('meta_title', { length: 255 }),
    metaDescription: text('meta_description'),
    tags: text('tags').array().default([]),
    priceRangeMin: decimal('price_range_min', { precision: 10, scale: 2 }),
    priceRangeMax: decimal('price_range_max', { precision: 10, scale: 2 }),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    slugIdx: index('collections_slug_idx').on(table.slug),
    statusIdx: index('collections_status_idx').on(table.status),
    seasonIdx: index('collections_season_idx').on(table.season),
    featuredIdx: index('collections_featured_idx').on(table.isFeatured),
    createdAtIdx: index('collections_created_at_idx').on(table.createdAt),
    displayOrderIdx: index('collections_display_order_idx').on(
      table.displayOrder
    ),
  })
);

export type NewCollection = typeof collections.$inferInsert;
export type Collection = typeof collections.$inferSelect;

// Collection Items Table
export const collectionItems = pgTable(
  'collection_items',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom().unique(),
    collectionId: uuid('collection_id')
      .notNull()
      .references(() => collections.id, { onDelete: 'cascade' }),
    productId: integer('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    displayOrder: integer('display_order').default(0),
    isHighlighted: boolean('is_highlighted').notNull().default(false),
    customDescription: text('custom_description'),
    addedBy: uuid('added_by')
      .notNull()
      .references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  table => ({
    collectionIdIdx: index('collection_items_collection_id_idx').on(
      table.collectionId
    ),
    productIdIdx: index('collection_items_product_id_idx').on(table.productId),
    displayOrderIdx: index('collection_items_display_order_idx').on(
      table.displayOrder
    ),
    uniqueCollectionProduct: index(
      'collection_items_unique_collection_product_idx'
    ).on(table.collectionId, table.productId),
  })
);

export type NewCollectionItem = typeof collectionItems.$inferInsert;
export type CollectionItem = typeof collectionItems.$inferSelect;
