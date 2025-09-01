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
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

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
  lastActivityDate: date("last_activity_date").notNull().defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const preferences = pgTable("preferences", {
  id: serial("id").notNull().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  preferenceValues: text("preference_values").array().notNull().default([]),
});

export const merchants = pgTable("merchants", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description").notNull(),
  about: text("about").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  coverPhoto: text("cover_photo").notNull(),
  logo: text("logo").notNull(),
  address: text("address").notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  founded: date("founded").notNull(),
  status: ACCOUNT_STATUS_ENUM("status").notNull().default("PENDING"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const products = pgTable("products", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  brandId: uuid("brand_id")
    .notNull()
    .references(() => merchants.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  features: text("features").array().notNull(),
  price: decimal("price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 })
    .notNull()
    .default("0.00"),
  colors: jsonb("colors").$type<Array<Record<string, any>>>(),
  images: text("images").array(),
  sizes: text("sizes").array(),
  stockCount: integer("stock_count").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  isSale: boolean("is_sale").notNull().default(false),
  isNew: boolean("is_new").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const orders = pgTable("orders", {
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
});

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

export const usersRelations = relations(users, ({ one, many }) => ({
  brand: one(merchants, {
    fields: [users.id],
    references: [merchants.userId],
  }),
  orders: many(orders),
  carts: many(carts),
  wishlists: many(wishlists),
  reviews: many(reviews),
}));

export const brandsRelations = relations(merchants, ({ one, many }) => ({
  user: one(users, { fields: [merchants.userId], references: [users.id] }),
  products: many(products),
  orders: many(orderItems),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  brand: one(merchants, {
    fields: [products.brandId],
    references: [merchants.id],
  }),
  orderItems: many(orderItems),
  cartItems: many(cartItems),
  wishlistItems: many(wishlistItems),
  reviews: many(reviews),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, { fields: [orders.userId], references: [users.id] }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  brand: one(merchants, {
    fields: [orderItems.brandId],
    references: [merchants.id],
  }),
}));

export const cartsRelations = relations(carts, ({ one, many }) => ({
  user: one(users, { fields: [carts.userId], references: [users.id] }),
  cartItems: many(cartItems),
}));

export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
  product: one(products, {
    fields: [cartItems.productId],
    references: [products.id],
  }),
}));

export const wishlistsRelations = relations(wishlists, ({ one, many }) => ({
  user: one(users, { fields: [wishlists.userId], references: [users.id] }),
  wishlistItems: many(wishlistItems),
}));

export const wishlistItemsRelations = relations(wishlistItems, ({ one }) => ({
  wishlist: one(wishlists, {
    fields: [wishlistItems.wishlistId],
    references: [wishlists.id],
  }),
  product: one(products, {
    fields: [wishlistItems.productId],
    references: [products.id],
  }),
}));

export const reviewsRelations = relations(reviews, ({ one }) => ({
  user: one(users, { fields: [reviews.userId], references: [users.id] }),
  product: one(products, {
    fields: [reviews.productId],
    references: [products.id],
  }),
}));
