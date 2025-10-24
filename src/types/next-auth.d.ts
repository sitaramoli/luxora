import NextAuth, { type DefaultSession, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'CUSTOMER' | 'ADMIN' | 'MERCHANT';
      merchantId?: string | null;
      rememberMe?: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    role: 'CUSTOMER' | 'ADMIN' | 'MERCHANT';
    merchantId?: string | null;
    rememberMe?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: 'CUSTOMER' | 'ADMIN' | 'MERCHANT';
    merchantId?: string | null;
    rememberMe?: boolean;
  }
}
