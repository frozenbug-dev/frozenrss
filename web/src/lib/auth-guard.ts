import type {QueryClient} from '@tanstack/react-query'
import {redirect, type ParsedLocation} from '@tanstack/react-router'

import {authClient} from './auth-client'

async function getSession() {
  try {
    const {data} = await authClient.getSession()
    return data
  } catch {
    // Network error - treat as unauthenticated and redirect to auth
    return null
  }
}

export const requireAuth = async ({
  location,
}: {
  location: ParsedLocation
  context: {queryClient: QueryClient}
  [key: string]: any
}) => {
  const session = await getSession()

  if (!session) {
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : location.pathname

    throw redirect({
      to: '/auth',
      search: {redirect: currentPath},
    })
  }

  return {user: session.user}
}

export const requireGuest = async () => {
  const session = await getSession()

  if (session) {
    throw redirect({to: '/'})
  }

  return {user: null}
}
