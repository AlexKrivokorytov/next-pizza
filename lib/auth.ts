import { AuthOptions, DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/prisma/prisma-client';
import { compareSync } from 'bcrypt';
import { UsersService } from '@/lib/db/users';
import { UserRole } from '@prisma/client';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    role: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

import { rateLimit } from '@/lib/rate-limit';

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Rate limit by email to prevent brute-force attacks
        const isAllowed = await rateLimit(`rate_limit:login:${credentials.email}`, 5, 15 * 60); // 5 attempts per 15 minutes
        if (!isAllowed) {
          throw new Error('Too many login attempts. Please try again later.');
        }

        const user = await UsersService.findByEmail(credentials.email);

        if (!user) {
          return null;
        }

        const isPasswordValid = compareSync(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.fullName,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      } else if (token.id) {
        // Validate user against DB on each token refresh
        const dbUser = await UsersService.findById(Number(token.id));
        if (!dbUser) {
          // If user deleted, invalidate token
          token.id = '';
        } else {
          // Keep role updated
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
