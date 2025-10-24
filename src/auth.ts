import { compare } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import NextAuth, { type User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { db } from '@/database/drizzle';
import { users, merchants } from '@/database/schema';

const ONE_DAY_IN_SECONDS = 86400;

export const { handlers, signIn, auth } = NextAuth({
  session: { strategy: 'jwt', maxAge: 30 * ONE_DAY_IN_SECONDS },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials.email || !credentials.password) {
          return null;
        }
        const user = await db
          .select({
            id: users.id,
            email: users.email,
            fullName: users.fullName,
            image: users.image,
            role: users.role,
            password: users.password,
          })
          .from(users)
          .where(eq(users.email, credentials.email.toString()))
          .limit(1);
        if (user.length === 0) return null;

        const isPasswordValid = await compare(
          credentials.password.toString(),
          user[0].password
        );
        if (!isPasswordValid) return null;

        // Get merchant ID if user has merchant role
        let merchantId = null;
        if (user[0].role === 'MERCHANT') {
          const merchant = await db
            .select({ id: merchants.id })
            .from(merchants)
            .where(eq(merchants.userId, user[0].id))
            .limit(1);
          if (merchant.length > 0) {
            merchantId = merchant[0].id;
          }
        }

        return {
          id: user[0].id,
          email: user[0].email,
          name: user[0].fullName,
          image: user[0].image,
          role: user[0].role,
          merchantId,
          rememberMe: credentials.rememberMe,
        } as User & { rememberMe: unknown; merchantId: string | null };
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        const sessionMaxAge = user.rememberMe
          ? 30 * ONE_DAY_IN_SECONDS
          : ONE_DAY_IN_SECONDS;
        token.exp = Math.floor(Date.now() / 1000) + sessionMaxAge;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image || null;
        token.role = user.role;
        token.merchantId = (user as any).merchantId;
      }

      // Refresh user data from database when profile is updated
      if (trigger === 'update' && token.id) {
        try {
          const [freshUser] = await db
            .select({
              id: users.id,
              fullName: users.fullName,
              email: users.email,
              image: users.image,
              role: users.role,
            })
            .from(users)
            .where(eq(users.id, token.id as string))
            .limit(1);

          if (freshUser) {
            token.name = freshUser.fullName;
            token.email = freshUser.email;
            token.picture = freshUser.image || null;
            token.role = freshUser.role;

            // Update merchant ID if role is MERCHANT
            if (freshUser.role === 'MERCHANT') {
              const merchant = await db
                .select({ id: merchants.id })
                .from(merchants)
                .where(eq(merchants.userId, freshUser.id))
                .limit(1);
              if (merchant.length > 0) {
                token.merchantId = merchant[0].id;
              }
            } else {
              token.merchantId = null;
            }
          }
        } catch (error) {
          console.error('Error refreshing user data in JWT callback:', error);
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = (token.picture as string | null) || undefined;
        session.user.role = token.role;
        (session.user as any).merchantId = token.merchantId;
      }
      return session;
    },
  },
});
