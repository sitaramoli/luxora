import { db } from "@/database/drizzle";
import { orders } from "@/database/schema";
import { desc, eq } from "drizzle-orm";

export const getRecentOrders = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .limit(5)
    .orderBy(desc(orders.createdAt));
};

export const getAllOrders = async (userId: string) => {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
};
