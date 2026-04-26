import {Outlet, createFileRoute} from '@tanstack/react-router'
import {motion} from 'motion/react'

import {Card} from '#/components/ui/card'
import {requireGuest} from '#/lib/auth-guard'

export const Route = createFileRoute('/auth')({
  beforeLoad: requireGuest,
  component: AuthLayout,
})

const AnimatedCard = motion(Card)

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <h1 className="mb-12 text-4xl font-bold text-foreground">FrozenRSS</h1>
      <AnimatedCard className="w-full max-w-md">
        <Outlet />
      </AnimatedCard>
    </div>
  )
}
