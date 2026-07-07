// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",      type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const usuario = await prisma.usuario.findUnique({ where: { email: credentials.email } });
        if (!usuario) return null;
        const valido = await bcrypt.compare(credentials.password, usuario.contrasena);
        if (!valido) return null;
        return { id: usuario.id, name: usuario.nombre, email: usuario.email, role: usuario.rol };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.role = (user as any).role; token.id = user.id; }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id   = token.id;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/login", error: "/auth/error" },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
