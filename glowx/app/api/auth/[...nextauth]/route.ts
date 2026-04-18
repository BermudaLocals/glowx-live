import NextAuth, { type NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import EmailProvider from 'next-auth/providers/email'
import { prisma } from '@/lib/prisma'
import { resend } from '@/lib/resend'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/signup',
    error: '/auth/error',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    EmailProvider({
      from: process.env.RESEND_FROM_EMAIL!,
      sendVerificationRequest: async ({ identifier, url }) => {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: identifier,
          subject: 'Sign in to GLOWX',
          html: `
            <div style="background:#050505;padding:48px;font-family:Montserrat,sans-serif;max-width:500px;">
              <div style="font-family:'Georgia',serif;font-size:2rem;color:#C9A84C;letter-spacing:8px;margin-bottom:32px;">GLOWX</div>
              <p style="color:#F5F0E8;font-size:1rem;margin-bottom:8px;">Your magic link is ready.</p>
              <p style="color:#8A8070;font-size:0.85rem;margin-bottom:32px;">Click below to sign in. This link expires in 24 hours.</p>
              <a href="${url}" style="display:inline-block;padding:16px 40px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#050505;text-decoration:none;font-family:monospace;font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;font-weight:600;">
                Sign In to GLOWX
              </a>
              <p style="color:#8A8070;font-size:0.7rem;margin-top:32px;">If you didn't request this, you can safely ignore it.</p>
              <p style="color:#242424;font-size:0.6rem;margin-top:48px;">© 2026 GLOWX</p>
            </div>
          `,
        })
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          include: { creator: { select: { id: true, handle: true } } },
        })
        token.role = dbUser?.role
        token.creator = dbUser?.creator
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.creator = token.creator as any
      }
      return session
    },
  },
  events: {
    async createUser({ user }) {
      // Send welcome email
      if (user.email) {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL!,
          to: user.email,
          subject: 'Welcome to GLOWX',
          html: `<div style="background:#050505;padding:48px;font-family:Montserrat,sans-serif;">
            <div style="font-family:'Georgia',serif;font-size:2rem;color:#C9A84C;letter-spacing:8px;margin-bottom:24px;">GLOWX</div>
            <p style="color:#F5F0E8;font-size:1rem;">Welcome to the platform OnlyFans wishes it was.</p>
            <p style="color:#8A8070;margin-top:16px;font-size:0.85rem;">Start exploring creators or set up your own creator profile in the Studio.</p>
          </div>`,
        }).catch(console.error)
      }
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
