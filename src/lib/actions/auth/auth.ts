"use server";

import { AuthCredentials } from "@/types";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hashSync } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";
import { redirect } from "next/navigation";

export const signInWithCredentials = async (
  params: Pick<AuthCredentials, "email" | "password" | "rememberMe">,
) => {
  const { email, password, rememberMe } = params;
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  try {
    const result = await signIn("credentials", {
      email: email.trim(),
      password,
      rememberMe: rememberMe,
      redirect: false,
    });
    if (result?.error) {
      return { success: false, error: result.error };
    }
    return { success: true };
  } catch (error: any) {
    console.log("SignIn failed", error);
    return {
      success: false,
      error: "Please check your credentials and try again.",
    };
  }
};

export const signUp = async (params: AuthCredentials) => {
  const { fullName, email, password } = params;
  const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  if (!success) return redirect("/too-fast");

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email.trim()))
    .limit(1);

  if (existingUser.length > 0) {
    return {
      success: false,
      error: "User already exists",
    };
  }
  const hashedPassword = hashSync(password, 10);
  try {
    await db.insert(users).values({
      fullName,
      email,
      password: hashedPassword,
    });
    await signInWithCredentials({ email, password, rememberMe: false });
    return { success: true };
  } catch (error: any) {
    console.log("SignUp failed", error);
    return { success: false, error: error.message };
  }
};
