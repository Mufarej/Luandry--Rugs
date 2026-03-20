import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({ where: { email: credentials.email as string } })
        if (!user) return null
        const isValid = await bcrypt.compare(credentials.password as string, user.password)
        if (!isValid) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        if ("role" in user) token.role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const user = session.user as any
        user.id = token.id as string
        user.role = token.role as string
      }
      return session
    }
  },
  pages: { signIn: "/" },
})

export { handler as GET, handler as POST }
