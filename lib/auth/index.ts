import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { getDb } from '@/lib/db'
import {
  authUsers,
  authSessions,
  authAccounts,
  authVerifications,
} from '@/lib/db/schema'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _auth: any = null

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAuth(): any {
  if (_auth) return _auth

  const secret  = process.env.BETTER_AUTH_SECRET
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  if (!secret) throw new Error('BETTER_AUTH_SECRET não definida.')

  _auth = betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: 'pg',
      schema: {
        user:         authUsers,
        session:      authSessions,
        account:      authAccounts,
        verification: authVerifications,
      },
    }),
    secret,
    baseURL: siteUrl,
    emailAndPassword: {
      enabled:                  true,
      requireEmailVerification: false,
    },
    session: {
      cookieCache: { enabled: true, maxAge: 60 * 60 * 24 * 7 },
    },
  })

  return _auth
}
