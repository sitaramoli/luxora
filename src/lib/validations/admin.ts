import { z } from "zod";

export const bulkIdsSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
});

export const updateStatusSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  status: z.enum(["ACTIVE", "PENDING", "SUSPENDED", "UNDER_REVIEW"]).or(
    z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]) // for products
  ).or(
    z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"]) // for orders
  ),
});

export const updateUserRoleSchema = z.object({
  ids: z.array(z.string().min(1)).min(1),
  role: z.enum(["CUSTOMER", "ADMIN", "MERCHANT"]),
});
