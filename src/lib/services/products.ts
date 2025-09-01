"use server";

import { db } from "@/database/drizzle";
import { products } from "@/database/schema";

export const fetchAllProducts = async () => {
  try {
    const allProducts = await db.select().from(products).limit(100);
    return { success: true, data: allProducts };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Failed to fetch products." };
  }
};
