"use server";

import { db } from "@/database/drizzle";
import { orders } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

export const getUserRecentOrders = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .limit(5)
    .orderBy(desc(orders.createdAt));
};

export const getUsersAllOrders = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
};
