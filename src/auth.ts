import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

const ONE_DAY_IN_SECONDS = 86400;

export const { handlers, signIn, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 30 * ONE_DAY_IN_SECONDS },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }
        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);
        if (user.length === 0) return null;

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password,
        );
        if (!isPasswordValid) return null;
        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].fullName,
          image: user[0].image,
          role: user[0].role,
          rememberMe: credentials.rememberMe,
        } as User & { rememberMe: unknown };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const sessionMaxAge = user.rememberMe
          ? 30 * ONE_DAY_IN_SECONDS
          : ONE_DAY_IN_SECONDS;
        token.exp = Math.floor(Date.now() / 1000) + sessionMaxAge;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
