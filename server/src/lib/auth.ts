import {hash, verify} from '@node-rs/argon2'
import {betterAuth} from 'better-auth'
import {drizzleAdapter} from 'better-auth/adapters/drizzle'
import {admin, username} from 'better-auth/plugins'

import {db} from '../db/client.ts'
import {ENV} from '../env.ts'

export const auth = betterAuth({
  baseURL: ENV.BASE_URL,
  secret: ENV.AUTH.SECRET,

  database: drizzleAdapter(db, {
    provider: 'pg',
  }),

  emailAndPassword: {
    enabled: true,

    password: {
      hash(password) {
        return hash(password)
      },
      verify({hash, password}) {
        return verify(hash, password)
      },
    },
  },

  plugins: [admin(), username()],

  session: {
    expiresIn: 60 * 60 * 24 * 31, // 31 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
  },

  advanced: {
    cookiePrefix: 'frozenrss',
    ipAddress: {
      ipv6Subnet: 64,
    },
    database: {
      generateId: false,
    },
  },

  rateLimit: {
    enabled: true,
    window: 60,
    max: 100,
  },

  experimental: {
    joins: true,
  },
})
