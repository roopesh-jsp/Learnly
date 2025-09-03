import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth({
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   if (!account || !user.email) return true; // exit early if null
    //   // Allow linking accounts with the same email
    //   if (account.providerAccountId && user.email) {
    //     const existingUser = await db.user.findUnique({
    //       where: { email: user.email },
    //     });
    //     if (existingUser) {
    //       // If email exists but account is different provider → link it
    //       await db.account.upsert({
    //         where: {
    //           provider_providerAccountId: {
    //             provider: account.provider,
    //             providerAccountId: account.providerAccountId,
    //           },
    //         },
    //         update: {},
    //         create: {
    //           userId: existingUser.id,
    //           type: account.type,
    //           provider: account.provider,
    //           providerAccountId: account.providerAccountId,
    //           access_token: account.access_token,
    //           refresh_token: account.refresh_token,
    //           expires_at: account.expires_at,
    //           token_type: account.token_type,
    //           scope: account.scope,
    //           id_token: account.id_token,
    //         },
    //       });
    //     }
    //   }
    //   return true;
    // },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
