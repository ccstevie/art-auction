import NextAuth, { type Session } from 'next-auth'
import GitHub from 'next-auth/providers/github'

export const authConfig = {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: { sub?: string } }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/auth/error',
  },
}

export const { auth, signIn, signOut } = NextAuth(authConfig)