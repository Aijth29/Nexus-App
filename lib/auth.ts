import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
          const prisma = new PrismaClient({ adapter });

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          await prisma.$disconnect();

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return { id: user.id, name: user.name, email: user.email };
        } catch (err) {
          console.error("Auth error:", err);
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth",
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
