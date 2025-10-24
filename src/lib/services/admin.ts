"use server";

import { and, asc, count, desc, ilike, or, sql } from "drizzle-orm";
import { db } from "@/database/drizzle";
import {
  users,
  merchants,
  products,
  orders,
  orderItems,
  ACCOUNT_STATUS_ENUM,
  PRODUCT_STATUS_ENUM,
  ORDER_STATUS_ENUM,
} from "@/database/schema";

export type SortOrder = "asc" | "desc";

export interface Pagination {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface AdminListParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Merchants
export interface FetchAdminMerchantsParams extends AdminListParams {
  status?: (typeof ACCOUNT_STATUS_ENUM.enumValues)[number] | "all";
  category?: string;
  sortBy?: "name" | "createdAt" | "productCount";
  sortOrder?: SortOrder;
}

export async function fetchAdminMerchants({
  page = 1,
  pageSize = 20,
  search = "",
  status = "all",
  category = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: FetchAdminMerchantsParams) {
  const offset = (page - 1) * pageSize;

  // base merchants select
  let baseQuery = db
    .select({
      id: merchants.id,
      name: merchants.name,
      email: merchants.email,
      category: merchants.category,
      status: merchants.status,
      createdAt: merchants.createdAt,
    })
    .from(merchants)
    .$dynamic();

  if (search) {
    baseQuery = baseQuery.where(
      sql`LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.email}) LIKE LOWER(${`%${search}%`})`
    );
  }
  if (status && status !== "all") {
    baseQuery = baseQuery.where(sql`${merchants.status} = ${status}`);
  }
  if (category && category !== "all") {
    baseQuery = baseQuery.where(
      sql`LOWER(${merchants.category}) = LOWER(${category})`
    );
  }

  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(merchants)
    .$dynamic();
  if (search) {
    countQuery.where(
      sql`LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.email}) LIKE LOWER(${`%${search}%`})`
    );
  }
  if (status && status !== "all") {
    countQuery.where(sql`${merchants.status} = ${status}`);
  }
  if (category && category !== "all") {
    countQuery.where(sql`LOWER(${merchants.category}) = LOWER(${category})`);
  }

  const [rows, totalCountRes] = await Promise.all([baseQuery, countQuery]);

  // fetch product counts per merchant
  const withCounts = await Promise.all(
    rows.map(async (m) => {
      const [{ count: prodCount }] = await db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(sql`${products.merchantId} = ${m.id}`);
      return { ...m, productCount: prodCount || 0 };
    })
  );

  // sort
  withCounts.sort((a, b) => {
    switch (sortBy) {
      case "name":
        return sortOrder === "desc"
          ? b.name.localeCompare(a.name)
          : a.name.localeCompare(b.name);
      case "productCount":
        return sortOrder === "desc"
          ? (b.productCount ?? 0) - (a.productCount ?? 0)
          : (a.productCount ?? 0) - (b.productCount ?? 0);
      case "createdAt":
      default:
        return sortOrder === "desc"
          ? new Date(b.createdAt as any).getTime() -
              new Date(a.createdAt as any).getTime()
          : new Date(a.createdAt as any).getTime() -
              new Date(b.createdAt as any).getTime();
    }
  });

  const paginated = withCounts.slice(offset, offset + pageSize);

  const totalItems = totalCountRes[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagination: Pagination = {
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };

  return { items: paginated, pagination };
}

// Users
export interface FetchAdminUsersParams extends AdminListParams {
  role?: "CUSTOMER" | "ADMIN" | "MERCHANT" | "all";
  status?: (typeof ACCOUNT_STATUS_ENUM.enumValues)[number] | "all";
  sortBy?: "fullName" | "createdAt";
  sortOrder?: SortOrder;
}

export async function fetchAdminUsers({
  page = 1,
  pageSize = 20,
  search = "",
  role = "all",
  status = "all",
  sortBy = "createdAt",
  sortOrder = "desc",
}: FetchAdminUsersParams) {
  const offset = (page - 1) * pageSize;

  let usersQuery = db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
      lastActivityDate: users.lastActivityDate,
    })
    .from(users)
    .$dynamic();

  if (search) {
    usersQuery = usersQuery.where(
      sql`LOWER(${users.fullName}) LIKE LOWER(${`%${search}%`}) OR LOWER(${users.email}) LIKE LOWER(${`%${search}%`})`
    );
  }
  if (role && role !== "all") usersQuery = usersQuery.where(sql`${users.role} = ${role}`);
  if (status && status !== "all")
    usersQuery = usersQuery.where(sql`${users.status} = ${status}`);

  const countQuery = db.select({ count: sql<number>`count(*)` }).from(users).$dynamic();
  if (search) {
    countQuery.where(
      sql`LOWER(${users.fullName}) LIKE LOWER(${`%${search}%`}) OR LOWER(${users.email}) LIKE LOWER(${`%${search}%`})`
    );
  }
  if (role && role !== "all") countQuery.where(sql`${users.role} = ${role}`);
  if (status && status !== "all") countQuery.where(sql`${users.status} = ${status}`);

  const [rows, totalCountRes] = await Promise.all([usersQuery, countQuery]);

  rows.sort((a, b) => {
    switch (sortBy) {
      case "fullName":
        return sortOrder === "desc"
          ? b.fullName.localeCompare(a.fullName)
          : a.fullName.localeCompare(b.fullName);
      case "createdAt":
      default:
        return sortOrder === "desc"
          ? new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()
          : new Date(a.createdAt as any).getTime() - new Date(b.createdAt as any).getTime();
    }
  });

  const paginated = rows.slice(offset, offset + pageSize);

  const totalItems = totalCountRes[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagination: Pagination = {
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };

  return { items: paginated, pagination };
}

// Products
export interface FetchAdminProductsParams extends AdminListParams {
  status?: (typeof PRODUCT_STATUS_ENUM.enumValues)[number] | "all";
  category?: string;
  merchantId?: string;
  sortBy?: "name" | "createdAt" | "price" | "stockCount";
  sortOrder?: SortOrder;
}

export async function fetchAdminProducts({
  page = 1,
  pageSize = 20,
  search = "",
  status = "all",
  category = "",
  merchantId = "",
  sortBy = "createdAt",
  sortOrder = "desc",
}: FetchAdminProductsParams) {
  const offset = (page - 1) * pageSize;

  let baseQuery = db
    .select({
      id: products.id,
      name: products.name,
      category: products.category,
      price: products.price,
      originalPrice: products.originalPrice,
      stockCount: products.stockCount,
      status: products.status,
      isFeatured: products.isFeatured,
      onSale: products.onSale,
      createdAt: products.createdAt,
      merchantId: products.merchantId,
      merchantName: merchants.name,
    })
    .from(products)
    .leftJoin(merchants, sql`${products.merchantId} = ${merchants.id}`)
    .$dynamic();

  if (search) {
    baseQuery = baseQuery.where(
      sql`LOWER(${products.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`})`
    );
  }
  if (status && status !== "all") baseQuery = baseQuery.where(sql`${products.status} = ${status}`);
  if (category && category !== "all")
    baseQuery = baseQuery.where(sql`LOWER(${products.category}) = LOWER(${category})`);
  if (merchantId && merchantId !== "all")
    baseQuery = baseQuery.where(sql`${products.merchantId} = ${merchantId}`);

  const countQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(products)
    .leftJoin(merchants, sql`${products.merchantId} = ${merchants.id}`)
    .$dynamic();
  if (search) {
    countQuery.where(
      sql`LOWER(${products.name}) LIKE LOWER(${`%${search}%`}) OR LOWER(${merchants.name}) LIKE LOWER(${`%${search}%`})`
    );
  }
  if (status && status !== "all") countQuery.where(sql`${products.status} = ${status}`);
  if (category && category !== "all")
    countQuery.where(sql`LOWER(${products.category}) = LOWER(${category})`);
  if (merchantId && merchantId !== "all")
    countQuery.where(sql`${products.merchantId} = ${merchantId}`);

  // sorting
  switch (sortBy) {
    case "name":
      baseQuery = sortOrder === "desc" ? baseQuery.orderBy(desc(products.name)) : baseQuery.orderBy(products.name);
      break;
    case "price":
      baseQuery = sortOrder === "desc"
        ? baseQuery.orderBy(desc(sql`CAST(${products.price} AS DECIMAL)`))
        : baseQuery.orderBy(sql`CAST(${products.price} AS DECIMAL)`);
      break;
    case "stockCount":
      baseQuery = sortOrder === "desc" ? baseQuery.orderBy(desc(products.stockCount)) : baseQuery.orderBy(products.stockCount);
      break;
    case "createdAt":
    default:
      baseQuery = sortOrder === "desc" ? baseQuery.orderBy(desc(products.createdAt)) : baseQuery.orderBy(products.createdAt);
      break;
  }

  const [rows, totalCountRes] = await Promise.all([
    baseQuery.limit(pageSize).offset(offset),
    countQuery,
  ]);

  const totalItems = totalCountRes[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagination: Pagination = {
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };

  return { items: rows, pagination };
}

// Orders
export interface FetchAdminOrdersParams extends AdminListParams {
  status?: (typeof ORDER_STATUS_ENUM.enumValues)[number] | "all";
  sortBy?: "createdAt" | "total" | "id";
  sortOrder?: SortOrder;
}

export async function fetchAdminOrders({
  page = 1,
  pageSize = 20,
  search = "",
  status = "all",
  sortBy = "createdAt",
  sortOrder = "desc",
}: FetchAdminOrdersParams) {
  const offset = (page - 1) * pageSize;

  let baseQuery = db
    .select({
      id: orders.id,
      total: orders.total,
      status: orders.status,
      shippingAddress: orders.shippingAddress,
      paymentMethod: orders.paymentMethod,
      paymentId: orders.paymentId,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      customerName: users.fullName,
      customerEmail: users.email,
      merchantName: sql<string>`COALESCE(MAX(${merchants.name}), 'Multiple')`,
      itemCount: sql<number>`COUNT(${orderItems.id})`,
    })
    .from(orders)
    .leftJoin(users, sql`${orders.userId} = ${users.id}`)
    .leftJoin(orderItems, sql`${orders.id} = ${orderItems.orderId}`)
    .leftJoin(merchants, sql`${orderItems.brandId} = ${merchants.id}`)
    .$dynamic();

  const conditions: any[] = [];
  if (status && status !== "all") conditions.push(sql`${orders.status} = ${status}`);
  if (search) {
    conditions.push(
      sql`(${orders.id} ILIKE ${`%${search}%`} OR ${users.fullName} ILIKE ${`%${search}%`} OR ${users.email} ILIKE ${`%${search}%`})`
    );
  }
  if (conditions.length) baseQuery = baseQuery.where(and(...conditions));

  baseQuery = baseQuery.groupBy(
    orders.id,
    orders.total,
    orders.status,
    orders.shippingAddress,
    orders.paymentMethod,
    orders.paymentId,
    orders.createdAt,
    orders.updatedAt,
    users.fullName,
    users.email
  );

  // sorting
  switch (sortBy) {
    case "total":
      baseQuery = sortOrder === "desc"
        ? baseQuery.orderBy(desc(sql`CAST(${orders.total} AS DECIMAL)`))
        : baseQuery.orderBy(sql`CAST(${orders.total} AS DECIMAL)`);
      break;
    case "id":
      baseQuery = sortOrder === "desc" ? baseQuery.orderBy(desc(orders.id)) : baseQuery.orderBy(orders.id);
      break;
    case "createdAt":
    default:
      baseQuery = sortOrder === "desc" ? baseQuery.orderBy(desc(orders.createdAt)) : baseQuery.orderBy(orders.createdAt);
      break;
  }

  const [rows, totalCountRes] = await Promise.all([
    baseQuery.limit(pageSize).offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .$dynamic()
      .where(
        conditions.length
          ? and(...conditions.map((c) => c))
          : undefined as any
      ),
  ]);

  const totalItems = totalCountRes[0]?.count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const pagination: Pagination = {
    currentPage: page,
    pageSize,
    totalItems,
    totalPages,
    hasNext: page < totalPages,
    hasPrevious: page > 1,
  };

  return { items: rows, pagination };
}
