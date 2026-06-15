import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "./prisma";

// Backend URL removida, autenticação acontece internamente via Prisma

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-credentials",
      name: "Admin Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }
        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email },
        });
        if (!admin || !admin.hashedPassword) {
          throw new Error("Falha na autenticação do admin");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          admin.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Credenciais inválidas");
        }
        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          type: "ADMIN",
          accessToken: null,
        };
      },
    }),
    // Provedor de credenciais para Usuários
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          throw new Error("Credenciais inválidas");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );
        if (!isCorrectPassword) {
          throw new Error("Credenciais inválidas");
        }
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          type: "USER",
          accessToken: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    // Podemos adicionar uma página de erro customizada se quisermos
    // error: '/auth/error',
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.type = user.type;
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.type = token.type;
        session.user.token = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

