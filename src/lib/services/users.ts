"use server";

import { db } from "@/database/drizzle";
import { preferences, users } from "@/database/schema";
import { eq } from "drizzle-orm";

export const getUserData = async (id: string) => {
  const user = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return {
    id: user[0].id,
    fullName: user[0].fullName,
    email: user[0].email,
    image: user[0].image,
    role: user[0].role,
    createdAt: user[0].createdAt,
    gender: user[0].gender,
    isVerified: user[0].status === "ACTIVE",
    phone: user[0].phone,
  };
};

export const getPreferences = async (id: string) => {
  const [preference] = await db
    .select()
    .from(preferences)
    .where(eq(preferences.userId, id))
    .limit(1);

  let result = {};
  if (preference?.preferenceValues?.length > 0) {
    result = Object.fromEntries(
      preference.preferenceValues.map((preference) => [preference, true]),
    );
  }
  return result;
};

export const getUserRole = async (userId: string) => {
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user.role;
};
