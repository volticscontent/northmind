import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const authOptions: NextAuthOptions = {
  providers: [
    // Provedor de credenciais para Administradores
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
        try {
          const res = await fetch(`${API_URL}/api/auth/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const data = await res.json();
          if (!res.ok || !data.user) {
            throw new Error(data.error || "Falha na autenticação do admin");
          }
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            type: data.user.type,
            accessToken: data.token,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao autenticar admin");
        }
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
        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
          });
          const data = await res.json();
          if (!res.ok || !data.user) {
            throw new Error(data.error || "Credenciais inválidas");
          }
          return {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            type: data.user.type,
            accessToken: data.token,
          };
        } catch (error: any) {
          throw new Error(error.message || "Erro ao autenticar");
        }
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

