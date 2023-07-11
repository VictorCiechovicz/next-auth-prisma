
import { NextAuthOptions } from 'next-auth'
import CredentialProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter';
import GitHubProvider from "next-auth/providers/github";

import { db as prisma } from '@/lib/db';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any) as any,
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!
    }),
    CredentialProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "jsmith" },
        password: { label: "password", type: "password" },
        name: { label: "name", type: "text", placeholder: "John Smith" },
      },
      async authorize(credentials, req): Promise<any> {

        if (!credentials?.email || !credentials.password) throw new Error("Dados de Signin Necessários!")


        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          }
        })

        if (!user || !user.hashedPassword) {
          throw new Error("E-mail ou Senha inválidos!")
        }


        const matchPassword = await bcrypt.compare(credentials.password, user.hashedPassword)

        if (!matchPassword) {
          throw new Error("E-mail ou Senha inválidos!")
        }



        return user

      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  secret: process.env.SECRET,
  debug: process.env.NODE_ENV === "development",
  pages: {
    signIn: "/signin"
  }
}