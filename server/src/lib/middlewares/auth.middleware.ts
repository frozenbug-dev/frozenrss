import type {Context, Next} from 'hono'

import {auth} from '../auth.js'
import {Forbidden} from '../errors/forbidden-error.ts'
import {Unauthorized} from '../errors/unathorized-error.ts'

export interface AuthContext {
  user: {
    id: string
    email: string
    role: 'admin' | 'user'
    name: string
  }
}

/** Extract the auth context set by `withAuthentication()` from any Hono context. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAuth(c: Context<any>): AuthContext {
  return c.get('auth') as AuthContext
}

export function withAuthentication() {
  return async (c: Context<{Variables: {auth: AuthContext}}>, next: Next) => {
    const session = await auth.api.getSession({headers: c.req.raw.headers})

    if (!session) throw new Unauthorized()

    c.set('auth', {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as 'user' | 'admin',
      },
    })

    return next()
  }
}

export function onlyAdmin() {
  return async (c: Context<{Variables: {auth: AuthContext}}>, next: Next) => {
    const {user} = c.get('auth')

    if (user.role !== 'admin') throw new Forbidden()

    return next()
  }
}
