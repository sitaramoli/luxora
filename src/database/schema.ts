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
} from "drizzle-orm/pg-core";

export const ACCOUNT_STATUS_ENUM = pgEnum("account_status", [
  "ACTIVE",
  "PENDING",
  "SUSPENDED",
  "UNDER_REVIEW",
]);
export const ORDER_STATUS_ENUM = pgEnum("order_status", [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
]);

export const USER_ROLE_ENUM = pgEnum("user_role", [
  "CUSTOMER",
  "ADMIN",
  "MERCHANT",
]);

export const GENDER_ENUM = pgEnum("gender", ["MALE", "FEMALE", "OTHER"]);

export const PRODUCT_STATUS_ENUM = pgEnum("product_status", [
  "ACTIVE",
  "DRAFT",
  "ARCHIVED",
]);

export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  phone: varchar("phone", { length: 10 }),
  status: ACCOUNT_STATUS_ENUM("status").notNull().default("PENDING"),
  role: USER_ROLE_ENUM("role").notNull().default("CUSTOMER"),
  image: text("image"),
  gender: GENDER_ENUM("gender").notNull().default("MALE"),
  lastActivityDate: timestamp("last_activity_date", { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const merchants = pgTable("merchants", {
  id: uuid("id").notNull().unique().defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull().unique(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  coverImage: text("cover_image").notNull(),
  image: text("image").notNull(),
  address: text("address").notNull(),
  taxId: varchar("tax_id", { length: 20 }).notNull(),
  founded: date("founded").notNull(),
  status: ACCOUNT_STATUS_ENUM("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const products = pgTable("products", {
  id: serial("id").notNull().primaryKey(),
  merchantId: uuid("merchant_id")
    .notNull()
    .references(() => merchants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  sizes: text("sizes").array(),
  colors: jsonb("colors").$type<Array<Record<string, any>>>(),
  features: text("features").array().notNull(),
  sku: varchar("sku").notNull(),
  barcode: varchar("barcode"),
  weight: numeric("weight", { precision: 10, scale: 2 }),
  length: numeric("length", { precision: 10, scale: 2 }),
  width: numeric("width", { precision: 10, scale: 2 }),
  height: numeric("height", { precision: 10, scale: 2 }),
  status: PRODUCT_STATUS_ENUM("status").notNull().default("ACTIVE"),
  stockCount: integer("stock_count").notNull().default(0),
  minStock: integer("min_stock").notNull().default(0),
  maxStock: integer("max_stock").notNull().default(0),
  tags: text("tags").array(),
  images: text("images").array(),
  isFeatured: boolean("is_featured").notNull().default(false),
  onSale: boolean("on_sale").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type NewProduct = typeof products.$inferInsert;

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const preferences = pgTable("preferences", {
  id: serial("id").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  preferenceValues: text("preference_values").array().notNull().default([]),
});

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey().notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    total: decimal("total").notNull(),
    status: ORDER_STATUS_ENUM("status").default("PENDING").notNull(),
    shippingAddress: text("shipping_address").notNull(),
    paymentMethod: text("payment_method"),
    paymentId: text("payment_id"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    userIdIdx: index("orders_user_id_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
    paymentIdIdx: index("orders_payment_id_idx").on(table.paymentId),
  }),
);

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey().notNull(),
  orderId: text("order_id")
    .notNull()
    .references(() => orders.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  brandId: text("brand_id")
    .notNull()
    .references(() => merchants.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull(),
  total: decimal("total").notNull(),
  color: text("color"),
  size: text("size"),
});

export const carts = pgTable("carts", {
  id: text("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
});

export const cartItems = pgTable("cart_items", {
  id: text("id").primaryKey().notNull(),
  cartId: text("cart_id")
    .notNull()
    .references(() => carts.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  selectedColor: text("selected_color"),
  selectedSize: text("selected_size"),
});

export const wishlists = pgTable("wishlists", {
  id: text("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
});

export const wishlistItems = pgTable("wishlist_items", {
  id: text("id").primaryKey().notNull(),
  wishlistId: text("wishlist_id")
    .notNull()
    .references(() => wishlists.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey().notNull(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  productId: text("product_id")
    .notNull()
    .references(() => products.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  private: boolean("private").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});
