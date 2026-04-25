import {Outlet, createFileRoute} from '@tanstack/react-router'

import {Card, CardContent} from '#/components/ui/card'
import {requireGuest} from '#/lib/auth-guard'

export const Route = createFileRoute('/auth')({
  beforeLoad: requireGuest,
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <h1 className="mb-12 text-4xl font-bold text-foreground">FrozenRSS</h1>
      <Card className="w-full max-w-md">
        <CardContent>
          <Outlet />
        </CardContent>
      </Card>
    </div>
  )
}
