"use server";

import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import {
  merchants,
  users,
  products,
  orders,
} from "@/database/schema";
import { and, eq, inArray, sql } from "drizzle-orm";
import { bulkIdsSchema, updateStatusSchema, updateUserRoleSchema } from "@/lib/validations/admin";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function adminUpdateMerchantStatus(input: { ids: string[]; status: "ACTIVE" | "PENDING" | "SUSPENDED" | "UNDER_REVIEW" }) {
  await ensureAdmin();
  const { ids, status } = updateStatusSchema.parse(input);
  await db.update(merchants).set({ status }).where(inArray(merchants.id, ids));
  revalidatePath("/admin/merchants");
  return { success: true };
}

export async function adminUpdateUserStatus(input: { ids: string[]; status: "ACTIVE" | "PENDING" | "SUSPENDED" | "UNDER_REVIEW" }) {
  await ensureAdmin();
  const { ids, status } = updateStatusSchema.parse(input);
  await db.update(users).set({ status }).where(inArray(users.id, ids));
  revalidatePath("/admin/users");
  return { success: true };
}

export async function adminUpdateUserRole(input: { ids: string[]; role: "CUSTOMER" | "ADMIN" | "MERCHANT" }) {
  await ensureAdmin();
  const { ids, role } = updateUserRoleSchema.parse(input);
  await db.update(users).set({ role }).where(inArray(users.id, ids));
  revalidatePath("/admin/users");
  return { success: true };
}

export async function adminUpdateProductStatus(input: { ids: string[]; status: "ACTIVE" | "DRAFT" | "ARCHIVED" }) {
  await ensureAdmin();
  const { ids, status } = updateStatusSchema.parse(input);
  await db.update(products).set({ status }).where(inArray(products.id, ids.map((id) => Number(id))));
  revalidatePath("/admin/products");
  return { success: true };
}

export async function adminDeleteProducts(input: { ids: string[] }) {
  await ensureAdmin();
  const { ids } = bulkIdsSchema.parse(input);
  await db.delete(products).where(inArray(products.id, ids.map((id) => Number(id))));
  revalidatePath("/admin/products");
  return { success: true };
}

export async function adminUpdateOrdersStatus(input: { ids: string[]; status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED" }) {
  await ensureAdmin();
  const { ids, status } = updateStatusSchema.parse(input);
  await db.update(orders).set({ status }).where(inArray(orders.id, ids));
  revalidatePath("/admin/orders");
  return { success: true };
}
